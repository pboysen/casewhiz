<script>
export default {
  name: "WidgetWrapper",
  data: function() {
    return {
      active: true
    };
  },
  methods: {
    startDrag() {
      if (!this.active) return;
      this.$store.commit("setCurrentWidget", this.$parent.wid);
    },
    stopDrag() {
      window.onmousemove = null;
      if (!this.active) return;
      var rect = this.$el.getBoundingClientRect();
      this.$store.commit("setWidgetRect", rect);
    },
    copyDelete(e) {
      var r = this.$el.getBoundingClientRect();
      if (e.pageY < r.top && e.pageY > r.top - 16) {
        if (e.pageX > r.right - 32 && e.pageX < r.right - 16)
          this.$store.commit("copyWidget", {
            wid: this.$parent.wid,
            type: "",
            event: e
          });
        else {
          this.$store.commit("deleteWidget", this.$parent.wid, e);
          this.active = false;
        }
      } else {
        this.$store.commit("setCurrentWidget", this.$parent.wid);
      }
    }
  },
  computed: {
    isActive() {
      return this.active;
    },
    isSelected() {
      return this.$store.getters.currentWidget == this.$parent.wid;
    },
    isOptional() {
      return this.$store.getters.optional(this.$parent.wid);
    }
  }
};
</script>
<template>
  <div
    v-if="isActive"
    :class="['widget', { selected: isSelected }]"
    wid=""
    @mousedown="startDrag"
    @mouseup="stopDrag"
    @click="copyDelete"
  >
    <slot></slot>
    <span class="optional" v-show="isOptional">*optional</span>
  </div>
</template>
<style lang="scss">
.widget {
  position: absolute;
  cursor: pointer;
  padding: 0;
  margin: 0;
}
.widget.selected {
  border-top: 1px solid red;
}
.widget::before {
  font-size: 10px;
  content: attr(wid);
  position: relative;
  top: -6px;
  left: 12px;
}
.widget:hover::after {
  position: absolute;
  top: -16px;
  right: 0px;
  content: url(../../assets/img/widget.png);
}
.optional {
  display: block;
  color: red;
  font-size: 12px;
  position: relative;
  left: 10px;
  top: 0px;
}

.widget[widgettype="radio"],
.widget[widgettype="checkbox"] {
  position: absolute;
}
.widget[widgettype="radio"]:hover,
.widget[widgettype="checkbox"]:hover {
  background-image: none;
}

.widget[widgettype="textfield"] {
}
.widget[widgettype="textarea"] {
  rows: 4;
  cols: 50;
  overflow: auto;
}
.widget[widgettype="select"] select {
  pointer-events: none;
}
.widget[widgettype="carryforward"] {
  background-color: white;
}
.carryforward {
  width: 100px;
  height: 24px;
  resize: both;
  overflow: auto;
  border: 1px dashed black;
}
.media {
  border: 1px solid black;
}
.widget[widgettype="media"] div {
  background-color: white;
  resize: both;
  overflow: auto;
}
.widget iframe {
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.widget[widgettype="list"] {
  width: 75px;
  height: 100px;
  overflow: visible;
}
.widget[widgettype="list"]:hover {
  background-image: url("/@/assets/img/widget-nocopy.png");
}
.widget[widgettype="checklist"]:hover {
  background-image: url("/@/assets/img/widget-nocopy.png");
}
.widget .list input {
  position: absolute;
}
</style>
