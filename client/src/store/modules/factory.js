import Vue from "vue";
import Vuex from "vuex";
import textfield from "@/views/widgets/textfield.vue";
import textarea from "@/views/widgets/textarea.vue";
import select from "@/views/widgets/select.vue";
import carryforward from "@/views/widgets/carryforward.vue";
import media from "@/views/widgets/media.vue";
import checklist from "@/views/widgets/checklist.vue";
import multiplechoice from "@/views/widgets/multiplechoice.vue";
import imageanswer from "@/views/widgets/image-answer.vue";
Vue.use(Vuex);

const getDefaultState = () => {
  return {
    widgets: {
      textfield: {
        type: "textfield",
        src: "textfield.png",
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
      },
      imageanswer: {
        type: "imageanswer",
        src: "front-camera.png",
        isSource: true,
        isTarget: false,
        isDraggable: true,
        prototype: {
          type: "imageanswer",
          id: null,
          phase: null,
          rect: null,
          props: {
            sources: [],
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
      let wdata = { wid: info.wrec.id, event: info.event };
      let store = info.store;
      let widget = new imports[info.type]({ wdata, store });
      widget.$mount();
      info.el = widget.$el;
      info.el.style = `left: ${info.left}px; top: ${info.top}px;`;
      let r = info.wrec.rect;
      if (r)
        info.el.firstChild.style = `width: ${r.width}px; height: ${r.height}px;`;
      info.el.setAttribute("wid", info.wrec.id);
      info.layer.appendChild(info.el);
      info.store.commit("setCurrentWidget", info.wrec.id);
      info.store.commit("setWidgetRect", info.el.getBoundingClientRect());
      if (state.widgets[info.type].isDraggable) setDraggable(widget);
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

let imports = {
  textfield: Vue.extend(textfield),
  textarea: Vue.extend(textarea),
  select: Vue.extend(select),
  carryforward: Vue.extend(carryforward),
  media: Vue.extend(media),
  checklist: Vue.extend(checklist),
  multiplechoice: Vue.extend(multiplechoice),
  imageanswer: Vue.extend(imageanswer)
};

const setDraggable = function(widget) {
  let wrapper = widget.$el;
  wrapper.onmousedown = function(e) {
    if (!widget.$children[0].dragging) return;
    var left = wrapper.offsetLeft;
    var top = wrapper.offsetTop;
    var width = wrapper.offsetWidth;
    var height = wrapper.offsetHeight;
    var offsetX = e.pageX - left;
    var offsetY = e.pageY - top;

    moveAt(e.pageX, e.pageY);

    function moveAt(pageX, pageY) {
      wrapper.style = `left: ${pageX - offsetX}px; top: ${pageY - offsetY}px;`;
    }

    window.onmousemove = function(e) {
      // move if not resizing
      if (wrapper.offsetWidth == width && wrapper.offsetHeight == height)
        moveAt(e.pageX, e.pageY);
    };
  };
};

export default factory;
