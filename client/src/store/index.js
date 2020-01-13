import Vue from "vue";
import Vuex from "vuex";
import { setDraggable } from "@/util/pdflib.js";
import things from "./modules/things";
import responses from "./modules/responses";
import { showPhase } from "@/util/pdflib.js";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    things,
    responses
  },
  state: {
    filename: "test.pdf",
    wcnt: 0,
    role: "designer",
    phase: 0,
    tool: 0,
    widget: null,
    phases: [
      {
        id: 0,
        title: "phase 1",
        submit: "Submit",
        widgets: {},
        tools: {}
      },
      {
        id: 1,
        title: "phase 2",
        submit: "Submit",
        widgets: {},
        tools: {}
      },
      {
        id: 2,
        title: "phase 3",
        submit: "Submit",
        widgets: {},
        tools: {}
      }
    ],
    selectedWidgetTypes: [
      "textfield",
      "textarea",
      "select",
      "carryforward",
      "media",
      "list"
    ],
    selectedToolTypes: ["Resources", "Comments", "Observations"]
  },
  getters: {
    currentRole: state => {
      return state.role;
    },
    currentPhase: state => {
      return state.phase;
    },
    currentWidget: state => {
      return state.widget;
    },
    currentTool: state => {
      return state.tool;
    },
    getPhases: state => {
      return state.phases;
    },
    getWidget: state => wid => {
      return state.phases[state.phase].widgets[wid];
    },
    noListWidgets: () => {
      var selected = [];
      store.getters.selectedWidgets.forEach(w => {
        if (w.type != "list") selected.push(w);
      });
      return selected;
    },
    tools: state => {
      return state.tools;
    },
    selectedWidgetTypes: state => {
      return state.selectedWidgetTypes;
    },
    selectedWidgets: state => {
      let widgets = [];
      state.selectedWidgetTypes.forEach(type => {
        widgets.push(store.getters["things/getWidgets"][type]);
      });
      return widgets;
    },
    selectedTools: state => {
      return state.selectedTools;
    },
    phaseTitle: state => {
      return state.phases[state.phase].title;
    },
    submitTitle: state => {
      return state.phases[state.phase].submit;
    },
    textfieldSize: state => wid => {
      return state.phases[state.phase].widgets[wid].props.size;
    },
    optional: state => wid => {
      return state.phases[state.phase].widgets[wid].props.optional;
    }
  },
  mutations: {
    setState(state, newstate) {
      Object.assign(state, newstate);
      store.dispatch("things/resetState");
      store.dispatch("responses/resetState");
      store.setCurrentPhase(0);
    },
    setCurrentPhase(state, n) {
      state.phase = n;
      showPhase(n);
    },
    setCurrentTool(state, n) {
      state.tool = n;
    },
    setCurrentRole(state, aRole) {
      state.role = aRole;
    },
    setCurrentWidget(state, wid) {
      if (state.phases[state.phase].widgets[wid]) state.widget = wid;
      else console.error("Missing widget:", wid, ". Current widget not set.");
    },
    setPhaseTitle(state, title) {
      state.phases[state.phase].title = title;
    },
    setSubmitTitle(state, title) {
      state.phases[state.phase].submit = title;
    },
    setTextfieldSize(state, size) {
      state.phases[state.phase].widgets[state.widget].props.size = size;
    },
    setOptional(state, optional) {
      state.phases[state.phase].widgets[state.widget].props.optional = optional;
    },
    setCurrentPhaseTools(state, tools) {
      state.phases[state.phase].tools = tools;
    },
    setSelectedWidgetTypes(state, selected) {
      state.selectedWidgetTypes = selected;
    },
    setSelectedToolTypes(state, selected) {
      state.selectedToolTypes = selected;
    },
    setWidgetRect(state, rect) {
      state.phases[state.phase].widgets[state.widget].rect = rect;
    },
    addWidget(state, info) {
      info.wid = state.wcnt++;
      var settings = things.getters.getWidgetSettings(things.state, info);
      var rec = JSON.parse(JSON.stringify(settings.prototype));
      rec.id = info.wid;
      Vue.set(state.phases[state.phase].widgets, rec.id, rec);
      makeWidget(state, info);
    },
    copyWidget(state, info) {
      var widgetRec = store.getters.getWidget(info.wid);
      if (widgetRec) {
        var rec = JSON.parse(JSON.stringify(widgetRec));
        info.wid = rec.id = state.wcnt++;
        info.type = widgetRec.type;
        Vue.set(state.phases[state.phase].widgets, info.wid, rec);
        makeWidget(state, info);
      } else {
        console.error("no wid:" + info.wid);
      }
    },
    deleteWidget(state, wid) {
      delete state.phases[state.phase].widgets[wid];
    },
    setFileName(state, filename) {
      state.filename = filename;
    }
  }
});

const makeWidget = function(state, info) {
  var settings = things.getters.getWidgetSettings(things.state, info);
  var wdata = { wid: info.wid };
  var widget = new settings.constructor({ wdata, store });
  widget.$mount();
  var el = widget.$el;
  document.getElementById("widgetLayer").appendChild(el);
  el.setAttribute("wid", info.wid);
  el.style.left = info.event.pageX + 30 + "px";
  el.style.top = info.event.pageY - 50 + "px";
  if (settings.isDraggable) setDraggable(el);
  store.commit("setCurrentWidget", info.wid);
};

/*
let initialState = {
  store: store,
  things: things,
  responses: responses
};
console.log(initialState);
*/
export default store;
