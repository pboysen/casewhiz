import Vue from "vue";
import Vuex from "vuex";
import factory from "./modules/factory";
import responses from "./modules/responses";
import md5 from "md5";
import { OPS, Util } from "pdfjs-dist/webpack";

Vue.use(Vuex);

const getDefaultState = () => {
  return {
    url: null,
    wcnt: 1,
    tcnt: 1,
    role: "designer",
    phase: -1,
    widget: null,
    drawerEvent: { type: "", top: 50 },
    tool: "",
    incomplete: [],
    phases: [],
    widgets: {},
    tools: {},
    fileTypes: ["image/*", "application/pdf", "application/case", "text/csv"],
    selectedWidgetTypes: [
      "textfield-widget",
      "textarea-widget",
      "select-widget",
      "carry-forward",
      "media-widget",
      "image-widget",
      "table-widget",
      "upload-widget"
      //"zoom-widget"
    ],
    selectedToolTypes: ["observations-tool", "comments-tool"]
  };
};

const store = new Vuex.Store({
  modules: {
    factory,
    responses
  },
  state: getDefaultState(),
  getters: {
    currentCase: state => state,
    currentRole: state => state.role,
    currentPhase: state => state.phase,
    currentWidget: state => state.widget,
    currentTool: state => state.tool,
    fileTypes: state => state.fileTypes,
    getPhases: state => state.phases,
    getWidgets: state => state.phases[state.phase].widgets,
    getCurrentPhase: state => state.phases[state.phase],
    tools: state => state.tools,
    selectedWidgetTypes: state => state.selectedWidgetTypes,
    selectedTools: state => state.selectedTools,
    phaseTitle: state => state.phases[state.phase].title,
    submitTitle: state => state.phases[state.phase].submit,
    observations: state => state.tools["observations-tool"],
    comments: state => state.tools["comments-tool"],
    resources: state => state.tools["resources-tool"],
    getPhaseWidget: state => info => state.phases[info.phase].widgets[info.wid],
    widgetType: state => wid => {
      let type = null;
      state.phases.forEach(phase => {
        if (wid in phase.widgets) type = phase.widgets[wid].type;
      });
      return type;
    },
    phaseTitleById: state => pid => state.phases[pid].title,
    phaseIsLocked: state => pid =>
      state.role === "student" && pid > store.getters["responses/activePhase"],
    incomplete: state => wid => state.incomplete.includes(wid),
    getDrawerEvent: state => state.drawerEvent,
    getPropValue: state => info => {
      let widgets = state.phases[info.phase].widgets;
      if (info.wid in widgets && info.type === widgets[info.wid].type)
        return widgets[info.wid].props[info.prop];
      else {
        let widget = store.getters["factory/getWidgets"][info.type];
        return widget.prototype.props[info.prop];
      }
    },
    noListWidgets: () => {
      var selected = [];
      store.getters.selectedWidgets.forEach(w => {
        if (w.type != "multiple-choice" && w.type != "check-list")
          selected.push(w);
      });
      return selected;
    },
    possibleSources: state => {
      var sources = [];
      for (let p = 0; p < state.phase; p++)
        Object.values(state.phases[p].widgets).forEach(w => {
          if (store.getters["factory/getWidgets"][w.type].isSource)
            sources.push({
              wid: w.id,
              phase: p,
              type: w.type
            });
        });
      return sources;
    },
    selectedWidgets: state => {
      let widgets = [];
      state.selectedWidgetTypes.forEach(type => {
        widgets.push(store.getters["factory/getWidgets"][type]);
      });
      return widgets;
    },
    widgetIsLocked: state =>
      state.role === "student" &&
      state.phase < store.getters["responses/activePhase"],
    copyState: state => {
      store.dispatch("responses/setDefaultState");
      return JSON.stringify(state);
    }
  },
  mutations: {
    setState(state, newState) {
      Object.assign(state, newState);
      store.commit("setCurrentPhase", -1);
    },
    setDrawerEvent(state, event) {
      state.drawerEvent = event;
    },
    addPhases(state, nphases) {
      var phases = [];
      for (var i = 0; i < nphases; i++)
        phases.push({
          id: i,
          title: "phase " + (i + 1),
          widgets: {},
          submit: "Submit"
        });
      Vue.set(state, "phases", phases);
    },
    setCurrentPhase(state, n) {
      state.phase = n;
      state.widget = null;
    },
    setCurrentTool(state, aTool) {
      state.tool = aTool;
    },
    setCurrentRole(state, aRole) {
      state.role = aRole;
    },
    setCurrentWidget(state, wid) {
      state.widget = wid;
    },
    setPhaseTitle(state, title) {
      state.phases[state.phase].title = title;
    },
    setSubmitTitle(state, title) {
      state.phases[state.phase].submit = title;
    },
    setURL(state, url) {
      state.url = url;
    },
    setProp(state, info) {
      state.phases[state.phase].widgets[info.wid].props[info.prop] = info.value;
    },
    setSelectedWidgetTypes(state, selected) {
      state.selectedWidgetTypes = selected;
    },
    setSelectedToolTypes(state, selected) {
      state.selectedToolTypes = selected;
    },
    setWidgetRect(state, rect) {
      store.getters.getWidgets[state.widget].rect = rect;
    },
    validateResponses(state) {
      state.incomplete = [];
      Object.values(store.getters.getWidgets).forEach(w => {
        if (
          w.phase == state.phase &&
          !w.optional &&
          !store.getters["responses/hasAnswer"](w.id)
        )
          state.incomplete.push(w.id);
      });
      return state.incomplete.length == 0;
    },
    addNewWidget(state, info) {
      let wid = state.wcnt++;
      let prototype =
        store.getters["factory/getWidgets"][info.preset.type].prototype;
      info.wrec = JSON.parse(JSON.stringify(prototype));
      info.wrec.props = { ...info.wrec.props, ...info.preset.props };
      info.wrec.rect = info.rect;
      info.wrec.id = wid;
      Vue.set(store.getters.getWidgets, wid, info.wrec);
      info.store = store;
    },
    copyWidget(state, info) {
      info.wrec = jsonCopy(store.getters.getWidgets[info.wid]);
      store.commit("addNewWidget", info);
    },
    deleteWidget(state, wid) {
      store.commit("setCurrentWidget", null);
      delete store.getters.getWidgets[wid];
    },
    registerSubWidget(state, info) {
      let wid = state.wcnt++;
      let prototype = store.getters["factory/getWidgets"][info.type].prototype;
      info.wrec = JSON.parse(JSON.stringify(prototype));
      info.wrec.props = { ...info.wrec.props, ...info.props };
      info.wid = wid;
      info.wrec.id = wid;
      info.wrec.subWidget = true;
      Vue.set(store.getters.getWidgets, wid, info.wrec);
    },
    addObservation(state, text) {
      store.dispatch("factory/getToolRecord", "observations-tool").then(obs => {
        obs.id = state.tcnt++;
        obs.text = text;
        obs.phase = state.phase;
        state.tools["observations-tool"].push(obs);
      });
    },
    updateObservation(state, info) {
      let index = state.tools["observations-tool"].findIndex(
        p => p.id == info.id
      );
      if (index > -1) state.tools["observations-tool"][index].text = info.text;
    },
    removeObservation(state, info) {
      let index = state.tools["observations-tool"].findIndex(
        p => p.id == info.id
      );
      if (index > -1) state.tools["observations-tool"].splice(index, 1);
    },
    installTool(state, info) {
      if (!state.tools[info.tool])
        Vue.set(state.tools, info.tool, JSON.parse(JSON.stringify(info.value)));
    }
  },
  actions: {
    setDefaultState(state) {
      store.dispatch("responses/setDefaultState");
      store.dispatch("factory/setDefaultState");
      Object.assign(state, getDefaultState());
    },
    restartStudent() {
      store.dispatch("responses/setDefaultState");
      store.commit("setCurrentPhase", 0);
      store.commit("setCurrentWidget", null);
    },
    submit() {
      store.state.incomplete = [];
      Object.values(store.getters.getWidgets).forEach(w => {
        if (
          w.phase == store.state.phase &&
          !w.optional &&
          !store.getters["responses/hasAnswer"](w.id)
        )
          store.state.incomplete.push(w.id);
      });
      if (store.state.incomplete.length == 0) {
        store.commit("responses/unlockNextPhase");
        store.commit("setCurrentPhase", ++store.state.phase);
      }
    },
    displayWidgets(state, info) {
      info.store = store;
      store.dispatch("configureWidgets", info).then(() => {
        Object.values(store.getters.getWidgets).forEach(w => {
          info.wrec = w;
          info.type = w.type;
          store.commit("factory/makeWidget", info);
        });
      });
    },
    configureWidgets(state, info) {
      return new Promise(resolve => {
        if (Object.keys(store.getters.getWidgets).length != 0) {
          resolve();
          return;
        }
        info.page.getOperatorList().then(ops => {
          let images = [];
          let tr = null;
          for (var i = 0; i < ops.fnArray.length; i++) {
            if (ops.fnArray[i] == OPS.transform) tr = ops.argsArray[i];
            else if (ops.fnArray[i] == OPS.paintImageXObject) {
              images.push([ops.argsArray[i], tr]);
            }
          }
          images.forEach(imgData => {
            info.page.objs.get(imgData[0][0], img => {
              let preset = store.getters["factory/getPreset"](md5(img.data));
              if (preset) {
                let tr = Util.transform(info.transform, imgData[1]);
                let data = {
                  page: info.page,
                  phase: info.phase,
                  layer: info.layer,
                  preset: preset,
                  rect: {
                    left: Math.round(tr[4]),
                    top: Math.round(tr[5] - img.height),
                    width: img.width,
                    height: img.height
                  }
                };
                store.commit("addNewWidget", data);
              }
            });
          });
          //setTimeout(store.dispatch("configureLists", info), 2000);
          resolve();
        });
      });
    },
    /*
    configureLists(state, info) {
      function findBullets(node) {
        let bullet = node;
        let list = [];
        let index = 1;
        let value = 1;
        let top = node.offsetTop;
        while (node.offsetLeft >= bullet.offsetLeft) {
          if (node.offsetLeft == bullet.offsetLeft) {
            if (bullet.textContent != node.textContent) break;
            list.push({ key: index++, value: value++ });
            top = node.offsetTop;
          } else if (node.offsetTop > top) {
            top = node.offsetTop;
            list.push({ key: index++, value: 0 });
          }
          node = node.nextSibling;
        }
        return [node, list];
      }
      let left, top, list, data;
      let node = info.textLayer.firstChild;
      while (node != null) {
        switch (node.textContent) {
          case "o":
            left = node.offsetLeft;
            top = node.offsetTop;
            [node, list] = findBullets(node);
            data = {
              page: info.page,
              phase: info.phase,
              layer: info.layer,
              preset: {
                type: "multiple-choice",
                props: {
                  radios: list
                }
              },
              rect: {
                left: left,
                top: top - 2,
                width: 20,
                height: node.offsetTop - top
              }
            };
            store.commit("addNewWidget", data);
            break;
          case "":
            left = node.offsetLeft;
            top = node.offsetTop;
            [node, list] = findBullets(node);
            data = {
              page: info.page,
              phase: info.phase,
              layer: info.layer,
              preset: {
                type: "check-list",
                props: {
                  checks: list
                }
              },
              rect: {
                left: left,
                top: top - 2,
                width: 20,
                height: node.offsetTop - top
              }
            };
            store.commit("addNewWidget", data);
        }
        node = node.nextSibling;
      }
    },
    */
    displaySubWidget(state, info) {
      info.store = store;
      store.commit("factory/makeSubWidget", info);
    }
    /*
    displayWidgets(state, info) {
      info.store = store;
      Object.values(store.getters.getWidgets).forEach(w => {
        info.wrec = w;
        info.type = w.type;
        info.left = w.rect.left - 10;
        info.top = w.rect.top - 85;
        store.commit("factory/makeWidget", info);
      });
    },
    displaySubWidget(state, info) {
      info.store = store;
      console.log(info);
      store.commit("factory/makeSubWidget", info);
    }
  */
  }
});
/*
      for (let i = 0; i < state.phases.length; i++)
        Vue.set(
          state.phases[i].tools,
          info.tool,
          JSON.parse(JSON.stringify(info.value))
        );
    /*
  },
  /*
  addComment(state, text) {
    state.phases[state.phase].tool.comments;case content isprepared
  },
  addResource(state, url) {
    state.phases[state.phase].tool.resource;
  },
*/

function jsonCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
export default store;
