<script>
import PropertyDrawer from "@/views/property-drawer.vue";
import Resources from "@/views/tools/resources.vue";
import Comments from "@/views/tools/comments.vue";
import Observations from "@/views/tools/observations.vue";
export default {
  name: "ToolBox",
  components: {
    Resources,
    Comments,
    Observations,
    PropertyDrawer
  },
  data: function() {
    return {
      selected: "",
      tools: ["Resources", "Comments", "Observations"]
    };
  }
};
</script>

<template>
  <div id="tool-box">
    <div id="tool-bar">
      <button
        v-for="tool in tools"
        :key="tool"
        @click="selected = tool"
        :class="['tool-button', { active: selected === tool }]"
      >
        {{ tool }}
      </button>
    </div>
    <PropertyDrawer></PropertyDrawer>
    <keep-alive>
      <component :is="selected" class="tooldiv"></component>
    </keep-alive>
  </div>
</template>

<style lang="scss" scoped>
#tool-box {
  position: absolute;
  display: inline-block;
  float: right;
  min-height: 400px;
  width: 30%;
  height: 100%;
  padding: 0px;
  border-left: 2px solid gray;
  background-color: white;
}
#tool-bar {
  width: 100%;
  height: 22px;
  padding: 4px 5px 2px 10px;
  background-color: lightblue;
  display: block;
  border-bottom: 1px solid gray;
}
.tool-button {
  font-size: 14px;
  border: 0px;
  padding: 2px;
  margin: 0px 5px 0 5px;
  display: inline-block;
  height: 24px;
  background-color: lightblue;
  cursor: pointer;
}
.tool-button:hover {
  background-color: #e6bbad;
}

.active {
  color: white;
  border-bottom: 1px solid white;
}
.tooldiv {
  padding: 4px;
}
</style>
