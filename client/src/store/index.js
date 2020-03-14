import Vue from "vue";
import Vuex from "vuex";
import factory from "./modules/factory";
import responses from "./modules/responses";
import eventBus from "@/main";

Vue.use(Vuex);

const getDefaultState = () => {
  return {
    filename: "",
    wcnt: 1,
    tcnt: 1,
    role: "designer",
    phase: -1,
    widget: null,
    tool: "",
    incomplete: [],
    phases: [],
    widgets: {},
    tools: {},
    selectedWidgetTypes: [
      "textfield",
      "textarea",
      "select",
      "carryforward",
      "media",
      "imageanswer"
    ],
    selectedToolTypes: ["Observations", "Comments"]
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
    noListWidgets: () => {
      var selected = [];
      store.getters.selectedWidgets.forEach(w => {
        if (w.type != "multiplechoice" && w.type != "checklist")
          selected.push(w);
      });
      return selected;
    },
    tools: state => state.tools,
    selectedWidgetTypes: state => state.selectedWidgetTypes,
    selectedWidgets: state => {
      let widgets = [];
      state.selectedWidgetTypes.forEach(type => {
        widgets.push(store.getters["factory/getWidgets"][type]);
      });
      return widgets;
    },
    getWidgetRecord: state => wid => state.widgets[wid],
    selectedTools: state => state.selectedTools,
    phaseTitle: state => state.phases[state.phase].title,
    submitTitle: state => state.phases[state.phase].submit,
    phaseTitleById: state => pid => state.phases[pid].title,
    // widget props
    size: state => wid =>
      isOk(state, wid) ? state.widgets[wid].props["size"] : 20,
    answers: state => wid =>
      isOk(state, wid) ? state.widgets[wid].props["answers"] : "",
    optional: state => wid =>
      isOk(state, wid) ? state.widgets[wid].props["optional"] : false,
    url: state => wid =>
      isOk(state, wid) ? state.widgets[wid].props["url"] : "",
    options: state => wid =>
      isOk(state, wid) ? state.widgets[wid].props["options"] : "",
    src: state => wid =>
      isOk(state, wid) ? state.widgets[wid].props["src"] : "",
    sources: state => wid =>
      isOk(state, wid) ? state.widgets[wid].props["sources"] : "",
    possibleSources: state => {
      var sources = [];
      Object.values(state.widgets).forEach(w => {
        if (
          w.phase < state.phase &&
          store.getters["factory/getWidgets"][w.type].isSource
        ) {
          sources.push({
            wid: w.id,
            phase: state.phases[w.phase].title,
            type: w.type
          });
        }
      });
      return sources;
    },
    observations: state => state.tools.observations,
    comments: state => state.tools.comments,
    resources: state => state.tools.resources,
    incomplete: state => wid => state.incomplete.includes(wid),
    widgetIsLocked: state =>
      state.role != "student" ||
      !store.getters["responses/isActivePhase"](state.phase),
    phaseIsLocked: state => pid =>
      state.role === "student" && store.getters["responses/isFuturePhase"](pid),
    copyState: state => {
      store.commit("responses/setDefaultState");
      return JSON.stringify(state);
    },
    displayWidgets: state => info => {
      info.store = store;
      Object.values(state.widgets).forEach(w => {
        if (w.phase == info.phase) {
          info.wrec = w;
          info.type = w.type;
          info.left = w.rect.left - 10;
          info.top = w.rect.top - 85;
          store.getters["factory/makeNewWidget"](info);
        }
      });
    }
  },
  mutations: {
    setState(state, newState) {
      Object.assign(state, newState);
      store.commit("setCurrentPhase", -1);
    },
    setDefaultState(state) {
      Object.assign(state, getDefaultState());
      store.commit("factory/setDefaultState");
      store.commit("responses/setDefaultState");
    },
    addPhases(state, nphases) {
      var phases = [];
      for (var i = 0; i < nphases; i++)
        phases.push({
          id: i,
          title: "phase " + (i + 1),
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
    setProp(state, data) {
      state.widgets[state.widget].props[data.prop] = data.value;
    },
    setSelectedWidgetTypes(state, selected) {
      state.selectedWidgetTypes = selected;
    },
    setSelectedToolTypes(state, selected) {
      state.selectedToolTypes = selected;
    },
    setWidgetRect(state, rect) {
      state.widgets[state.widget].rect = rect;
    },
    validateResponses(state) {
      state.incomplete = [];
      Object.values(state.widgets).forEach(w => {
        if (
          w.phase == state.phase &&
          !w.optional &&
          !store.getters["responses/hasAnswer"](w.id)
        )
          state.incomplete.push(w.id);
      });
      if (state.incomplete.length == 0) {
        store.commit("responses/unlockNextPhase");
        state.phase++;
        state.widget = null;
      }
    },
    addNewWidget(state, info) {
      if (!info.wrec)
        info.wrec = store.getters["factory/getNewWidgetRecord"](info.type);
      info.wrec.id = state.wcnt++;
      info.wrec.phase = state.phase;
      configureWidget(state, info);
      eventBus.$emit("typeSelected", info.wrec.type);
      store.commit("setCurrentWidget", info.wrec.id);
    },
    copyWidget(state, info) {
      info.wrec = jsonCopy(state.widgets[info.wid]);
      store.commit("addNewWidget", info);
    },
    rebuildWidget(state, info) {
      info.wrec = store.getters.getWidgetRecord(info.wid);
      configureWidget(state, info);
    },
    deleteWidget(state, wid) {
      store.commit("setCurrentWidget", null);
      delete state.widgets[wid];
    },
    addObservation(state, text) {
      var obs = store.getters["factory/getNewToolRecord"]("observations");
      obs.id = state.tcnt++;
      obs.text = text;
      obs.phase = state.phase;
      state.tools.observations.push(obs);
    },
    updateObservation(state, info) {
      var index = state.tools.observations.findIndex(p => p.id == info.id);
      if (index > -1) state.tools.observations[index].text = info.text;
    },
    removeObservation(state, info) {
      var index = state.tools.observations.findIndex(p => p.id == info.id);
      if (index > -1) state.tools.observations.splice(index, 1);
    },
    installTool(state, info) {
      if (!state.tools[info.tool])
        Vue.set(state.tools, info.tool, JSON.parse(JSON.stringify(info.value)));
    },
    setFileName(state, filename) {
      state.filename = filename;
    }
  },
  actions: {
    restartStudent() {
      store.commit("responses/setDefaultState");
      store.commit("setCurrentPhase", 0);
      store.commit("setCurrentWidget", null);
    }
  }
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
});
function jsonCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}
function configureWidget(state, info) {
  Vue.set(state.widgets, info.wrec.id, info.wrec);
  info.store = store;
  store.getters["factory/makeNewWidget"](info);
}
function isOk(state, wid) {
  return wid && wid in state.widgets;
}
export default store;
