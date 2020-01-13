import Vue from "vue";
import Vuex from "vuex";
import textfield from "@/views/widgets/text-field.vue";

Vue.use(Vuex);

const getDefaultState = () => {
  return things.state;
};

const things = {
  namespaced: true,
  state: {
    widgets: {
      textfield: {
        type: "textfield",
        src: "textfield.png",
        constructor: Vue.extend(textfield),
        isSource: true,
        isTarget: true,
        isDraggable: true,
        sizes: ["5", "10", "20", "40", "60"],
        prototype: {
          type: "textfield",
          id: null,
          rect: null,
          sources: [],
          props: {
            size: 20,
            optional: false
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
          rect: null,
          sources: [],
          props: {
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
          rect: null,
          props: {
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
          rect: null,
          sources: [],
          props: {}
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
          rect: null,
          props: {
            url: null
          }
        }
      },
      list: {
        type: "list",
        src: "multiplechoice.png",
        isSource: true,
        isTarget: false,
        isDraggable: false,
        childType: "radiobutton",
        prototype: {
          type: "list",
          id: null,
          rect: null,
          props: {
            childIds: [],
            optional: false
          }
        }
      }
    },
    tools: {
      comments: {
        userRole: "student"
      },
      resources: {
        userRole: "student"
      },
      scores: {
        useRole: "instructor"
      }
    }
  },
  getters: {
    getWidgets(state) {
      return state.widgets;
    },
    getTools(state) {
      return state.tools;
    },
    getWidgetSettings(state, info) {
      return state.widgets[info.type];
    },
    textSizes(state) {
      return state.widgets["textfield"].sizes;
    }
  },
  mutations: {
    resetState(state) {
      Object.assign(state, getDefaultState());
    }
  },
  actions: {
    resetState({ commit }) {
      commit("resetState");
    }
  }
};

export default things;
