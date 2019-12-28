const things = {
  namespaced: true,
  state: {
    widgets: {
      textfield: {
        type: "textfield",
        src: "textfield.png",
        isSource: true,
        isTarget: true,
        isDraggable: true
      },
      textarea: {
        type: "textarea",
        src: "textarea.png",
        isSource: true,
        isTarget: true,
        isDraggable: true
      },
      select: { 
        type: "select",
        src: "select.png",
        isSource: true,
        isTarget: false,
        isDraggable: true
      },
      carryforward: {
        type: "carryforward",
        src: "cforward.png",
        isSource: false,
        isTarget: true,
        isDraggable: true
      },
      media: {
        type: "media",
        src: "media.png",
        isSource: false,
        isTarget: false,
        isDraggable: true
      },
      multiplechoice: {
        type: "multiplechoice",
        src: "choice.png",
        isSource: true,
        isTarget: false,
        isDraggable: false,
        childType: "radiobutton"
      },
      checklist: {
        type: "checklist",
        src: "checklist.png",
        isSource: true,
        isTarget: false,
        isDraggable: false,
        childType: "checkbox"
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
    widgets(state) {
      return state.widgets;
    },
    tools(state) {
      return state.tools;
    },
    getWidget(state, type) {
      return state.widgets[type];
    }
  },
  mutations: {},
  actions: {}
};
export default things;
