import Vue from "vue";
import Vuex from "vuex";
import things from "./modules/things";
import responses from "./modules/responses";
import eventBus from "@/main";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    things,
    responses
  },
  state: {
    filename: "test.pdf",
    wcnt: 1,
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
      "multiplechoice",
      "checklist"
    ],
    selectedToolTypes: ["Observations", "Comments" ]
  },
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
        widgets.push(store.getters["things/getWidgets"][type]);
      });
      return widgets;
    },
    getWidgetRecord: state => wid => state.phases[state.phase].widgets[wid],
    selectedTools: state => state.selectedTools,
    phaseTitle: state => state.phases[state.phase].title,
    submitTitle: state => state.phases[state.phase].submit,
    // widget props
    size: state => wid => {
      return state.phases[state.phase].widgets[wid].props["size"];
    },
    optional: state => wid => {
      return state.phases[state.phase].widgets[wid].props["optional"];
    },
    sources: state => wid => {
      return state.phases[state.phase].widgets[wid].props["sources"];
    },
    url: state => wid => {
      return state.phases[state.phase].widgets[wid].props["url"];
    },
    options: state => wid => {
      return state.phases[state.phase].widgets[wid].props["options"];
    },
    carryforward: state => wid => {
      if (state.role === "student") {
        var result = "";
        var sources = state.phases[state.phase].widgets[wid].props["sources"];
        sources.forEach(source => (result += source));
        return result;
      } else return "";
    },
    observations: state => {
      return state.phases[state.phase].tools.observations;
    },
    comments: state => {
      return state.phases[state.phase].tools.comments;
    },
    resources: state => {
      return state.phases[state.phase].tools.resources;
    }
  },
  mutations: {
    setState(state, newstate) {
      Object.assign(state, newstate);
      store.dispatch("things/resetState");
      store.dispatch("responses/resetState");
      store.commit("setCurrentPhase", 0);
    },
    setCurrentPhase(state, n) {
      state.phase = n;
    },
    setCurrentTool(state, n) {
      state.tool = n;
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
      state.phases[state.phase].widgets[state.widget].props[data.prop] =
        data.value;
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
      var settings = things.getters.getWidgets(things.state)[info.type];
      if (!info.wid) info.widgetRecord = settings.prototype;
      var wrec = JSON.parse(JSON.stringify(info.widgetRecord));
      wrec.id = info.wid = state.wcnt++;
      var wdata = { wid: info.wid };
      info.widget = new settings.constructor({ wdata, store });
      Vue.set(state.phases[state.phase].widgets, wrec.id, wrec);
      info.widget.$mount();
      var el = info.widget.$el;
      info.layer.appendChild(el);
      el.setAttribute("wid", info.wid);
      el.style = info.event.target.style;
      if (settings.isDraggable) setDraggable(el);
      eventBus.$emit("typeSelected", info.type);
      store.commit("setCurrentWidget", info.wid);
    },
    copyWidget(state, info) {
      info.widgetRecord = store.getters.getWidgetRecord(info.wid);
      info.type = info.widgetRecord.type;
      store.commit("addWidget", info);
    },
    deleteWidget(state) {
      delete state.phases[state.phase].widgets[state.widget];
      store.commit("setCurrentWidget", null);
    },
    makeList(state, info) {
      store.commit("addWidget", info);
      populateList(state, info);
    },
    addObservation(state, text) {
      state.phases[state.phase].tool.observations;
    },
    addComment(state, text) {
      state.phases[state.phase].tool.comments;
    },
    addResource(state, url) {
      state.phases[state.phase].tool.resource;
    },
    setFileName(state, filename) {
      state.filename = filename;
    }
  }
});

function populateList(state, info) {
  var bullet = info.event.target;
  var firstLeft = bullet.offsetLeft;
  //var list = makeWidget(info.type, firstLeft - 6, firstTop - 15);
  var list = info.widget.$el.firstChild;
  info.widget.$el.style.left = parseInt(bullet.style.left, 10) - 10 + "px";
  info.widget.$el.style.top = parseInt(bullet.style.top, 10) - 2 + "px";
  console.log(info.widget);
  var subtype = info.type === "multiplechoice" ? "radio" : "checkbox";
  var nextLeft = firstLeft;
  var value = 1;
  var node = bullet;
  var wid = info.widget.wid;
  while (nextLeft >= firstLeft) {
    if (nextLeft == firstLeft) {
      if (bullet.textContent != node.textContent) break;
      var input = document.createElement("input");
      input.name = subtype === "radio" ? `mc${wid}` : `cl${wid}-${value}`;
      input.type = subtype;
      input.value = value++;
      input.style = node.style;
      console.log(node);
      list.appendChild(input);
    }
    node = node.nextElementSibling;
    nextLeft = node.offsetLeft;
  }
}

const setDraggable = function(widgetWrapper) {
  widgetWrapper.onmousedown = function(e) {
    var left = widgetWrapper.offsetLeft;
    var top = widgetWrapper.offsetTop;
    var width = widgetWrapper.offsetWidth;
    var height = widgetWrapper.offsetHeight;
    var offsetX = e.pageX - left;
    var offsetY = e.pageY - top;

    moveAt(e.pageX, e.pageY);

    function moveAt(pageX, pageY) {
      widgetWrapper.style = `left: ${pageX - offsetX}px; top: ${pageY -
        offsetY}px;`;
    }

    window.onmousemove = function(e) {
      // move if not resizing
      if (
        widgetWrapper.offsetWidth == width &&
        widgetWrapper.offsetHeight == height
      )
        moveAt(e.pageX, e.pageY);
    };
  };
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
