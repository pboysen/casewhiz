<script>
import eventBus from "@/main";
import { mapGetters } from "vuex";
export default {
  name: "WidgetWrapper",
  data: function() {
    return {
      active: true,
      dragging: false,
      widgetLayer: null
    };
  },
  mounted() {
    eventBus.$on("widgetBarMoved", e => {
      this.widgetLayer = e.target;
      let drawer = document.getElementById("propertyDrawer");
      if (drawer) drawer.style.top = e.pageY - 120 + "px;";
    });
  },
  computed: {
    ...mapGetters(["widgetIsLocked", "currentRole", "currentWidget"]),
    isActive() {
      return this.active;
    },
    isSelected() {
      return this.currentWidget == this.$parent.wid;
    },
    optional() {
      return this.$store.getters.optional(this.$parent.wid);
    },
    incomplete() {
      return this.$store.getters.incomplete(this.$parent.wid);
    }
  },
  methods: {
    isRole(role) {
      return this.currentRole === role;
    },
    startDrag() {
      if (this.active && this.isRole("designer")) {
        this.dragging = true;
        this.$store.commit("setCurrentWidget", this.$parent.wid);
        eventBus.$emit(
          "typeSelected",
          this.$parent.$el.getAttribute("widgettype")
        );
      }
    },
    stopDrag() {
      this.dragging = false;
      window.onmousemove = null;
      if (!this.active || !this.isRole("designer")) return;
      var rect = this.$el.getBoundingClientRect();
      this.$store.commit("setWidgetRect", rect);
    },
    copyDelete(e) {
      if (!(this.active && this.isRole("designer"))) return;
      this.widgetLayer = e.target.parentElement;
      let r = this.$el.getBoundingClientRect();
      let right = r.left + window.scrollX + this.$el.offsetWidth;
      let top = r.top + window.scrollY;
      if (e.pageY < top + 16 && e.pageY > top) {
        if (e.pageX > right - 32 && e.pageX < right - 16) {
          this.$store.commit("copyWidget", {
            wid: this.$parent.wid,
            phase: this.$store.getters.currentPhase,
            layer: this.widgetLayer,
            type: this.$store.getters.getWidgetRecord(this.$parent.wid).type,
            left: e.pageX + 10,
            top: e.pageY - 70
          });
        } else if (e.pageX > right - 16 && e.pageX < right) {
          eventBus.$emit(
            "typeDeselected",
            this.$parent.$el.getAttribute("widgettype")
          );
          this.$store.commit("deleteWidget", this.$parent.wid);
          this.active = false;
        }
      } else {
        this.$store.commit("setCurrentWidget", this.$parent.wid);
      }
    }
  }
};
</script>
<template>
  <div
    v-if="isActive"
    :class="[
      'widget',
      { student: isRole('student') },
      { incomplete: incomplete }
    ]"
    wid=""
    @mousedown="startDrag"
    @mouseup="stopDrag"
    @click="copyDelete"
  >
    <slot></slot>
    <span class="optional" v-show="optional">*optional</span>
  </div>
</template>
<style lang="scss" scoped>
.widget {
  box-sizing: border-box;
  position: absolute;
  padding: 0;
  margin: 0;
  min-width: 30px;
}
.widget::before {
  font-size: 10px;
  content: attr(wid);
  position: absolute;
  top: 2px;
  left: 2px;
}
.widget.student::before {
  display: none;
}
.widget:hover::after {
  position: absolute;
  top: 0px;
  right: 0px;
  content: url(../../assets/img/widget.png);
}
.widget.student:hover::after {
  display: none;
}
.widget.incomplete {
  border: 1px dotted $invalid-color;
}
.optional {
  display: block;
  color: red;
  font-size: 12px;
  position: relative;
  left: 0;
  top: 0;
  margin: 0;
}
.selectimg {
  position: relative;
  left: 8px;
  top: 0px;
  float: left;
  transform: rotate(-90deg);
}
</style>
