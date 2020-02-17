import Vue from "vue";
import Vuex from "vuex";
import textfield from "@/views/widgets/textfield.vue";
import textarea from "@/views/widgets/textarea.vue";
import select from "@/views/widgets/select.vue";
import carryforward from "@/views/widgets/carryforward.vue";
import media from "@/views/widgets/media.vue";
import checklist from "@/views/widgets/checklist.vue";
import multiplechoice from "@/views/widgets/multiplechoice.vue";
Vue.use(Vuex);

const getDefaultState = () => {
  return {
    widgets: {
      textfield: {
        type: "textfield",
        src: "textfield.png",
        constructor: Vue.extend(textfield),
        isSource: true,
        isTarget: true,
        isDraggable: true,
        sizes: ["5", "10", "20", "40"],
        prototype: {
          type: "textfield",
          id: null,
          phase: null,
          rect: null,
          props: {
            sources: [],
            size: 20,
            optional: false,
            answers: ""
          }
        }
      },
      textarea: {
        type: "textarea",
        src: "textarea.png",
        constructor: Vue.extend(textarea),
        isSource: true,
        isTarget: true,
        isDraggable: true,
        prototype: {
          type: "textarea",
          id: null,
          phase: null,
          rect: null,
          props: {
            sources: [],
            optional: false
          }
        }
      },
      select: {
        type: "select",
        src: "select.png",
        constructor: Vue.extend(select),
        isSource: true,
        isTarget: false,
        isDraggable: true,
        prototype: {
          type: "select",
          id: null,
          phase: null,
          rect: null,
          props: {
            options: "",
            size: "1",
            multiple: false,
            optional: false
          }
        }
      },
      carryforward: {
        type: "carryforward",
        src: "cforward.png",
        constructor: Vue.extend(carryforward),
        isSource: false,
        isTarget: true,
        isDraggable: true,
        prototype: {
          type: "carryforward",
          id: null,
          phase: null,
          rect: null,
          props: {
            sources: []
          }
        }
      },
      media: {
        type: "media",
        src: "media.png",
        constructor: Vue.extend(media),
        isSource: false,
        isTarget: false,
        isDraggable: true,
        prototype: {
          type: "media",
          id: null,
          phase: null,
          rect: null,
          props: {
            src: ""
          }
        }
      },
      multiplechoice: {
        type: "multiplechoice",
        src: "multiplechoice.png",
        constructor: Vue.extend(multiplechoice),
        isSource: true,
        isTarget: false,
        isDraggable: false,
        prototype: {
          type: "multiplechoice",
          id: null,
          phase: null,
          rect: null,
          props: {
            optional: false
          }
        }
      },
      checklist: {
        type: "checklist",
        src: "checklist.png",
        constructor: Vue.extend(checklist),
        isSource: true,
        isTarget: false,
        isDraggable: false,
        prototype: {
          type: "checklist",
          id: null,
          phase: null,
          rect: null,
          props: {
            optional: false
          }
        }
      }
    },
    tools: {
      observations: {
        title: "Observations",
        userRole: "student",
        prototype: {
          id: null,
          phase: null,
          text: ""
        }
      },
      comments: {
        title: "Comments",
        userRole: "student",
        prototype: {
          id: null,
          phase: null,
          text: "",
          date: null,
          sel: null
        }
      },
      resources: {
        title: "Resources",
        userRole: "student",
        prototype: {
          id: null,
          phase: null,
          url: "",
          title: ""
        }
      },
      scores: {
        useRole: "instructor"
      }
    }
  };
};

const factory = {
  namespaced: true,
  state: getDefaultState(),
  getters: {
    getWidgets: state => state.widgets,
    getTools: state => state.tools,
    makeNewWidget: state => info => {
      var wdata = { wid: info.wrec.id, event: info.event };
      var store = info.store;
      var widget = new state.widgets[info.type].constructor({ wdata, store });
      widget.$mount();
      info.el = widget.$el;
      info.layer.appendChild(info.el);
      info.el.style = `left: ${info.left}px; top: ${info.top}px;`;
      if (info.rect)
        info.el.style += `width: ${info.rect.width}px; height: ${info.rect.height}px;`;
      info.el.setAttribute("wid", info.wrec.id);
      if (state.widgets[info.type].isDraggable) setDraggable(info.el, store);
    },
    getNewWidgetRecord: state => type => {
      var prototype = state.widgets[type].prototype;
      var obs = JSON.parse(JSON.stringify(prototype));
      return obs;
    },
    getNewToolRecord: state => type => {
      var prototype = state.tools[type].prototype;
      var obs = JSON.parse(JSON.stringify(prototype));
      obs.id = state.tcnt++;
      return obs;
    },
    textSizes: state => {
      return state.widgets["textfield"].sizes;
    }
  },
  mutations: {
    setState(state, newState) {
      Object.assign(state, newState);
    },
    setDefaultState(state) {
      Object.assign(state, getDefaultState());
    }
  }
};

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

export default factory;
