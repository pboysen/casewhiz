<script>
import { Scrolly, ScrollyViewport, ScrollyBar } from "vue-scrolly";
import resourcesTool from "@/components/tools/resources-tool.vue";
import commentsTool from "@/components/tools/comments-tool.vue";
import observationsTool from "@/components/tools/observations-tool.vue";
import { mapGetters } from "vuex";
export default {
  name: "tool-box",
  components: {
    Scrolly,
    ScrollyViewport,
    ScrollyBar,
    resourcesTool,
    commentsTool,
    observationsTool
  },
  data: function() {
    return {
      selected: "",
      tools: [
        {
          id: "observations-tool",
          title: "Observations"
        },
        {
          id: "resources-tool",
          title: "Resources"
        },
        {
          id: "comments-tool",
          title: "Comments"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["currentTool"])
  },
  methods: {
    selectTool(tool) {
      this.selected = tool;
      this.$store.commit("setCurrentTool", tool);
    }
  }
};
</script>

<template>
  <div id="tool-box">
    <scrolly id="tool-bar" :style="{ width: '100%', height: '35px' }">
      <scrolly-viewport>
        <button
          v-for="tool in tools"
          :key="tool.id"
          @click="selectTool(tool.id)"
          :class="['tool-button', { active: selected === tool.id }]"
        >
          {{ tool.title }}
        </button>
      </scrolly-viewport>
      <scrolly-bar axis="x"></scrolly-bar>
    </scrolly>
    <div class="tool">
      <component :is="selected" keep-alive></component>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#tool-box {
  flex: 0 1 auto;
  width: 50%;
  height: 100%;
  padding: 0;
  box-sizing: border-box;
}
#tool-bar {
  display: block;
  white-space: nowrap;
  background-color: $bg-color;
  padding: 2px 0px 2px 0;
  box-sizing: border-box;
  border-bottom: 1px solid $border-color;
  overflow: none;
}
.tool-button {
  display: inline-block;
  min-width: 20px;
  font-size: $txt-font;
  padding: 4px 0px 0 4px;
  color: $txt-color;
  border: 0;
  background-color: $bg-color;
  margin-left: 20px;
  cursor: pointer;
}
.tool-button:hover {
  color: $select-color;
}
.active {
  color: $select-color;
}
.scrolly#tool-bar .scrolly-bar:before {
  background-color: $fancy-color;
  height: 10px;
  opacity: 0.5;
}
.scrolly-viewport {
}

.scrolly-bar.axis-x {
  bottom: -6px;
  width: 100%;
  height: 10px;
  min-width: 20%;
  max-width: 100%;
}
.tool {
  font-size: $txt-font;
  width: 100%;
  min-height: 300px;
  padding: 4px;
  background-color: white;
}
</style>
