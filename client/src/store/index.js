import Vue from "vue";
import Vuex from "vuex";
import factory from "./modules/factory";
import responses from "./modules/responses";
import eventBus from "@/main";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    factory,
    responses
  },
  state: {
    filename: "test.pdf",
    wcnt: 1,
    tcnt: 1,
    role: "designer",
    phase: 0,
    widget: null,
    tool: "",
    phases: [
      {
        id: 0,
        title: "phase 1",
        submit: "Submit"
      },
      {
        id: 1,
        title: "phase 2",
        submit: "Submit"
      },
      {
        id: 2,
        title: "phase 3",
        submit: "Submit"
      }
    ],
    widgets: {},
    tools: {},
    selectedWidgetTypes: [
      "textfield",
      "textarea",
      "select",
      "carryforward",
      "media",
      "multiplechoice",
      "checklist"
    ],
    selectedToolTypes: ["Observations", "Comments"]
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
        widgets.push(store.getters["factory/getWidgets"][type]);
      });
      return widgets;
    },
    getWidgetRecord: state => wid => state.widgets[wid],
    selectedTools: state => state.selectedTools,
    phaseTitle: state => state.phases[state.phase].title,
    phaseTitleById: state => pid => state.phases[pid].title,
    submitTitle: state => state.phases[state.phase].submit,
    // widget props
    size: state => wid => state.widgets[wid].props["size"],
    optional: state => wid => state.widgets[wid].props["optional"],
    sources: state => wid => state.widgets[wid].props["sources"],
    url: state => wid => state.widgets[wid].props["url"],
    options: state => wid => state.widgets[wid].props["options"],
    src: state => wid => state.widgets[wid].props["src"],
    carryforward: state => wid => {
      if (state.role === "student") {
        var result = "";
        state.widgets[wid].props["sources"].forEach(
          source => (result += source)
        );
        return result;
      } else return "";
    },
    possibleSources: state => {
      var sources = [];
      Object.keys(state.widgets).forEach(id => {
        let w = state.widgets[id];
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
    resources: state => state.tools.resources
  },
  mutations: {
    setState(state, newstate) {
      Object.assign(state, newstate);
      store.dispatch("factory/resetState");
      store.dispatch("responses/resetState");
      store.commit("setCurrentPhase", 0);
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
    addWidget(state, info) {
      info.wid = state.wcnt++;
      var wrec = info.widgetRecord
        ? info.widgetRecord
        : factory.getters.getNewWidgetRecord(factory.state)(info.type);
      wrec.id = info.wid;
      wrec.phase = info.phase;
      info.store = store;
      Vue.set(state.widgets, wrec.id, wrec);
      factory.getters.makeNewWidget(factory.state)(info);
      info.widget.$mount();
      var el = info.widget.$el;
      info.layer.appendChild(el);
      var left = info.event.pageX + 10;
      var top = info.event.pageY - 70;
      el.style = `left: ${left}px; top: ${top}px;`;
      el.setAttribute("wid", info.wid);
      if (factory.state.widgets[info.type].isDraggable) setDraggable(el, store);
      eventBus.$emit("typeSelected", info.type);
      store.commit("setCurrentWidget", info.wid);
    },
    copyWidget(state, info) {
      info.widgetRecord = store.getters.getWidgetRecord(info.wid);
      info.type = info.widgetRecord.type;
      store.commit("addWidget", info);
    },
    deleteWidget(state, key) {
      delete state.widgets[key.wid];
      store.commit("setCurrentWidget", null);
    },
    makeList(state, info) {
      store.commit("addWidget", info);
      populateList(state, info);
    },
    addObservation(state, text) {
      var obs = factory.getters.getNewToolRecord(factory.state)("observations");
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
      state.phases[state.phase].tool.comments;
    },
    addResource(state, url) {
      state.phases[state.phase].tool.resource;
    },
    */
    setFileName(state, filename) {
      state.filename = filename;
    }
  }
});

const setDraggable = function(widgetWrapper, store) {
  widgetWrapper.onmousedown = function(e) {
    var left = widgetWrapper.offsetLeft;
    var top = widgetWrapper.offsetTop;
    var width = widgetWrapper.offsetWidth;
    var height = widgetWrapper.offsetHeight;
    var offsetX = e.pageX - left;
    var offsetY = e.pageY - top;

    moveAt(e.pageX, e.pageY);

    function moveAt(pageX, pageY) {
      if (store.getters.currentRole === "designer")
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

function populateList(state, info) {
  var bullet = info.event.target;
  var firstLeft = bullet.offsetLeft;
  //var list = makeWidget(info.type, firstLeft - 6, firstTop - 15);
  var list = info.widget.$el.firstChild;
  info.widget.$el.style.left = parseInt(bullet.style.left, 10) - 16 + "px";
  info.widget.$el.style.top = parseInt(bullet.style.top, 10) + "px";
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
      list.appendChild(input);
    }
    node = node.nextElementSibling;
    nextLeft = node.offsetLeft;
  }
}

/*
let initialState = {
  store: store,
  factory: factory,
  responses: responses
};
console.log(initialState);
*/
export default store;
