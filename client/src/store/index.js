import Vue from "vue";
import Vuex from "vuex";
import factory from "./modules/factory";
import responses from "./modules/responses";

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
    selectedWidgetTypes: [
      "textfield-widget",
      "textarea-widget",
      "select-widget",
      "carry-forward",
      "media-widget",
      "image-widget",
      "table-widget"
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
    phaseTitleById: (state, pid) => state.phases[pid].title,
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
      state.widget = null;
      state.phase = n;
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
      store.commit("setCurrentWidget", wid);
      store.commit("setDrawerEvent", {
        wid: wid,
        type: info.type,
        top: info.top
      });
      if (!info.wrec) {
        let prototype =
          store.getters["factory/getWidgets"][info.type].prototype;
        info.wrec = JSON.parse(JSON.stringify(prototype));
      }
      info.wrec.id = wid;
      Vue.set(store.getters.getWidgets, wid, info.wrec);
      info.store = store;
      store.commit("factory/makeWidget", info);
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
