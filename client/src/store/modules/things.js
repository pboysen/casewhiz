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
        sizes: ["5", "10", "20", "40"],
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
        constructor: Vue.extend(textarea),
        isSource: true,
        isTarget: true,
        isDraggable: true,
        prototype: {
          type: "textarea",
          id: null,
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
          rect: null,
          props: {
            optional: false
          }
        }
      }
    },
    tools: {
      observations: {
        userRole: "student",
        prototype: {
          id: 0,
          observation: {}
        }
      },
      comments: {
        userRole: "student",
        prototype: {
          id: 0,
          comment: {}
        }
      },
      resources: {
        userRole: "student",
        prototype: {
          id: 0,
          resource: {}
        }
      },
      scores: {
        useRole: "instructor"
      }
    }
  },
  getters: {
    getWidgets: state => {
      return state.widgets;
    },
    getTools: state => {
      return state.tools;
    },
    sizes: state => {
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
