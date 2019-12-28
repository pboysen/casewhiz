import Vue from "vue";
import Vuex from "vuex";
import { loadPhase } from "@/util/pdflib.js";
import things from "./modules/things";
import responses from "./modules/responses";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    things,
    responses
  },
  state: {
    filename: "test.pdf",
    wid: 1,
    current: {
      role: "designer",
      phase: 0,
      widget: 0,
      tool: 0
    },
    phases: [
      {
        id: 0,
        title: "phase 1",
        submit: "Submit",
        widgets: [],
        tools: []
      },
      {
        id: 1,
        title: "phase 2",
        submit: "Submit",
        widgets: [],
        tools: []
      },
      {
        id: 2,
        title: "phase 3",
        submit: "Submit",
        widgets: [],
        tools: []
      }
    ],
    selectedWidgetTypes: [
      "textfield",
      "textarea",
      "select",
      "carryforward",
      "media"
    ],
    selectedToolTypes: ["Resources", "Comments", "Observations"]
  },
  getters: {
    getPhases(state) {
      return state.phases;
    },
    currentPhaseTitle(state) {
      return state.phases[state.current.phase].title;
    },
    currentSubmitTitle(state) {
      return state.phases[state.current.phase].submit;
    },
    tools(state) {
      return state.tools;
    },
    currentPhase(state) {
      return state.current.phase;
    },
    currentWidget(state) {
      return state.current.widget;
    },
    currentRole(state) {
      return state.current.role;
    },
    selectedWidgetTypes(state) {
      return state.selectedWidgetTypes;
    },
    selectedWidgets(state) {
      var widgets = [];
      state.selectedWidgetTypes.forEach(type => {
        widgets.push(store.getters["things/getWidget"](type));
      });
      return widgets;
    },
    selectedTools(state) {
      return state.selectedTools;
    },
    currentTextfieldSize(state) {
      if (state.current.widget == 0) return 20;
      var widget =
        state.phases[state.current.phase].widgets[state.current.widget];
      return widget.type === "textfield" ? widget.size : 20;
    },
    newWidgetId(state) {
      return state.wid++;
    }
  },
  mutations: {
    setState(state, newstate) {
      console.log(state, newstate);
      store.modules = {
        things: initialState.things,
        responses: initialState.responses
      };
      console.log(store);
      /*
      console.log(newstate);
      Object.keys(initialState).forEach(key => {
        console.log(key, initialState[key]);
        Object.assign(state[key], initialState[key]);
      });
      */
    },
    setCurrentPhase(state, n) {
      loadPhase(state.phases[n]);
      state.current.phase = n;
    },
    setCurrentWidget(state, n) {
      state.current.widget = n;
    },
    setCurrentTool(state, tool) {
      state.current.tool = tool;
    },
    setRole(state, role) {
      state.current.role = role;
    },
    setPhaseTitle(state, title) {
      state.phases[state.current.phase].title = title;
    },
    setSubmitTitle(state, title) {
      state.phases[state.current.phase].submit = title;
    },
    setCurrentPhaseTools(state, tools) {
      state.phases[state.current.phase].tools = tools;
    },
    setSelectedWidgetTypes(state, selected) {
      state.selectedWidgetTypes = selected;
    },
    setSelectedToolTypes(state, selected) {
      state.selectedToolTypes = selected;
    },
    addWidget(state, widget) {
      state.phases[state.current.phase].widgets.push(widget);
    },
    deleteWidget(state, id) {
      var newwidgets = [];
      state.phases[state.current.phase].widgets.forEach(w => {
        if (id != w.id) newwidgets = newwidgets.push(w);
      });
      state.phases[state.current.phase].widgets = newwidgets;
    },
    setFileName(state, filename) {
      state.filename = filename;
    }
  },
  actions: {}
});

let initialState = {
  store: store,
  things: things,
  responses: responses
};

console.log(initialState);

export default store;
