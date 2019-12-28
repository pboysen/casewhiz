<script> 
import Resources from "@/views/tools/resources.vue";
import Comments from "@/views/tools/comments.vue";
import Observations from "@/views/tools/observations.vue";
export default {
  name: "ToolBox",
  components: {
    Resources,
    Comments,
    Observations
  },
  data: function() {
    return {
      selected: "",
      tools: ["Resources", "Comments", "Observations"],
      left: 24
    };
  },
  methods: {
    slide(dx) {
      const panel = document.getElementById("tool-panel");
      this.left += dx;
      panel.style.left = this.left + "px";
    }
  }
};
</script>

<template>
  <div id="tool-box">
    <div id="tool-bar">
      <div id="left-tool">
        <img
          src="@/assets/img/triangle.png"
          @click="slide(100)"
          :class="['left-img', { show: this.left < 24 }]"
        />
      </div>
      <div id="tool-panel">
        <button
          v-for="tool in tools"
          :key="tool"
          @click="selected = tool"
          :class="['tool-button', { active: selected === tool }]"
        >
          {{ tool }}
        </button>
      </div>
      <div id="right-tool">
        <img
          src="@/assets/img/triangle.png"
          @click="slide(-100)"
          :class="['right-img', { show: this.left > -400 }]"
        />
      </div>
    </div>
    <div class="tooldiv">
      <component :is="selected" keep-alive></component>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#tool-box {
  position: absolute;
  display: inline-block;
  float: right;
  width: 30%;
  height: 685px;
  padding-bottom: 6px;
  border-color: lightgray;
  border-left: 1px solid gray;
  border-bottom: 1px solid gray;
  background-color: lightblue;
}
#toolbar {
  display: block;
  padding: 4px;
}
#tool-panel {
  position: absolute;
  display: inline-block;
  height: 24px;
  left: 24px;
  vertical-align: middle;
  padding: 2px 2px 2px 0;
  transition: left 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
}
.tool-button {
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  border: 0px;
  padding: 2px;
  margin: 0px 5px 0 5px;
  display: inline-block;
  height: 24px;
  background-color: lightblue;
}
.tool-button:hover {
  background-color: #e6bbad;
}
.active {
  color: white;
}
#left-tool {
  position: relative;
  display: inline-block;
  float: left;
  width: 24px;
  height: 28px;
  display: flex;
  align-items: center; /* horizontal */
  justify-content: center; /* vertical */
  z-index: 2;
}
.left-img {
  visibility: hidden;
  transform: rotate(-90deg);
}
#right-tool {
  position: relative;
  display: inline-block;
  float: right;
  width: 24px;
  height: 28px;
  display: flex;
  align-items: center; /* horizontal */
  justify-content: center; /* vertical */
  z-index: 2;
}
.right-img {
  visibility: hidden;
  transform: rotate(90deg);
}
.show {
  cursor: pointer;
  visibility: visible;
}
.tooldiv {
  position: relative;
  top: 28px;
  display: block;
  width: 100%;
  height: 640px;
  background-color: white;
  padding: 4px;
  border-top: 1px solid gray;
}
</style>
