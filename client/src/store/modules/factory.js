import Vue from "vue";
import Vuex from "vuex";
import textfieldWidget from "@/views/widgets/textfield-widget.vue";
import textareaWidget from "@/views/widgets/textarea-widget.vue";
import selectWidget from "@/views/widgets/select-widget.vue";
import carryForward from "@/views/widgets/carry-forward.vue";
import mediaWidget from "@/views/widgets/media-widget.vue";
import checkList from "@/views/widgets/check-list.vue";
import multipleChoice from "@/views/widgets/multiple-choice.vue";
import imageWidget from "@/views/widgets/image-widget.vue";
import tableWidget from "@/views/widgets/table-widget.vue";
//import zoomWidget from "@/views/widgets/zoom-widget.vue";
Vue.use(Vuex);

const getDefaultState = () => {
  return {
    widgets: {
      "textfield-widget": {
        type: "textfield-widget",
        src: "textfield-widget.png",
        isSource: true,
        isTarget: true,
        isDraggable: true,
        textSizes: ["5", "10", "20", "40"],
        prototype: {
          type: "textfield-widget",
          id: null,
          rect: null,
          subWidget: false,
          props: {
            sources: [],
            textSize: 20,
            optional: false,
            textOptions: "",
            textAnswer: ""
          }
        }
      },
      "textarea-widget": {
        type: "textarea-widget",
        src: "textarea-widget.png",
        isSource: true,
        isTarget: true,
        isDraggable: true,
        prototype: {
          type: "textarea-widget",
          id: null,
          rect: null,
          subWidget: false,
          props: {
            sources: [],
            optional: false
          }
        }
      },
      "select-widget": {
        type: "select-widget",
        src: "select-widget.png",
        isSource: true,
        isTarget: false,
        isDraggable: true,
        prototype: {
          type: "select-widget",
          id: null,
          rect: null,
          subWidget: false,
          props: {
            selectOptions: "",
            correct: "",
            selectSize: "1",
            multiple: false,
            optional: false
          }
        }
      },
      "carry-forward": {
        type: "carry-forward",
        src: "cforward.png",
        isSource: false,
        isTarget: true,
        isDraggable: true,
        prototype: {
          type: "carry-forward",
          id: null,
          rect: null,
          subWidget: false,
          props: {
            sources: [],
            optional: false
          }
        }
      },
      "media-widget": {
        type: "media-widget",
        src: "media-widget.png",
        isSource: false,
        isTarget: false,
        isDraggable: true,
        prototype: {
          type: "media-widget",
          id: null,
          rect: null,
          subWidget: false,
          props: {
            mediaSrc: "",
            optional: false
          }
        }
      },
      "multiple-choice": {
        type: "multiple-choice",
        src: "multiple-choice.png",
        isSource: true,
        isTarget: false,
        isDraggable: false,
        prototype: {
          type: "multiple-choice",
          id: null,
          rect: null,
          subWidget: false,
          props: {
            optional: false
          }
        }
      },
      "check-list": {
        type: "check-list",
        src: "check-list.png",
        isSource: true,
        isTarget: false,
        isDraggable: false,
        prototype: {
          type: "check-list",
          id: null,
          rect: null,
          subWidget: false,
          props: {
            optional: false
          }
        }
      },
      "image-widget": {
        type: "image-widget",
        src: "image-widget.png",
        isSource: true,
        isTarget: false,
        isDraggable: true,
        prototype: {
          type: "image-widget",
          id: null,
          rect: null,
          subWidget: false,
          props: {
            optional: false
          }
        }
      },
      "table-widget": {
        type: "table-widget",
        src: "table-widget.png",
        isSource: false,
        isTarget: false,
        isDraggable: true,
        prototype: {
          type: "table-widget",
          id: null,
          rect: null,
          subWidget: false,
          props: {
            table: null,
            idMap: {},
            optional: false
          }
        }
      },
      "zoom-widget": {
        type: "zoom-widget",
        src: "zoom-widget.png",
        isSource: false,
        isTarget: false,
        isDraggable: true,
        prototype: {
          type: "zoom-widget",
          id: null,
          rect: null,
          subWidget: false,
          props: {
            optional: false
          }
        }
      }
    },
    tools: {
      "observations-tool": {
        title: "Observations",
        userRole: "student",
        prototype: {
          id: null,
          phase: null,
          text: ""
        }
      },
      "comments-tool": {
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
      "resources-tool": {
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
    textSizes: state => state.widgets["textfield-widget"].textSizes
  },
  mutations: {
    setState(state, newState) {
      Object.assign(state, newState);
    },
    makeWidget(state, info) {
      let store = info.store;
      let widget = new imports[info.type]({
        propsData: { wid: info.wrec.id },
        store: store
      });
      widget.$mount();
      let el = widget.$el;
      el.style = `left: ${info.left}px; top: ${info.top}px;`;
      let r = info.wrec.rect;
      if (r)
        el.firstChild.style = `width: ${r.width}px; height: ${r.height}px;`;
      info.layer.appendChild(el);
      if (state.widgets[info.type].isDraggable) setDraggable(widget);
    },
    makeSubWidget(state, info) {
      let store = info.store;
      console.log(info);
      let widget = new imports[info.type]({
        propsData: { wid: info.wid },
        store
      });
      widget.$mount();
      info.layer.appendChild(widget.$el);
    }
  },
  actions: {
    setDefaultState(state) {
      Object.assign(state, getDefaultState());
    },
    getToolRecord(context, type) {
      var prototype = context.state.tools[type].prototype;
      return JSON.parse(JSON.stringify(prototype));
    }
  }
};

let imports = {
  "textfield-widget": Vue.extend(textfieldWidget),
  "textarea-widget": Vue.extend(textareaWidget),
  "select-widget": Vue.extend(selectWidget),
  "carry-forward": Vue.extend(carryForward),
  "media-widget": Vue.extend(mediaWidget),
  "check-list": Vue.extend(checkList),
  "multiple-choice": Vue.extend(multipleChoice),
  "image-widget": Vue.extend(imageWidget),
  "table-widget": Vue.extend(tableWidget)
  // "zoom-widget": Vue.extend(zoomWidget)
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
