<script>
import MainBar from "@/views/main-bar.vue";
import PhaseViewer from "@/views/phase-viewer.vue";
import ToolBox from "@/views/tools/tool-box.vue";
export default {
  name: "CaseWiz",
  components: {
    MainBar,
    PhaseViewer,
    ToolBox
  }
};
</script>
<template>
  <div id="app">
    <MainBar></MainBar>
    <div id="main-display">
      <PhaseViewer></PhaseViewer>
      <ToolBox></ToolBox>
    </div>
  </div>
</template>
<style lang="scss">
body {
  padding: 0;
  margin: 0;
  tabindex: -1;
}
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: $bg-color;
}
#main-display {
  width: 100%;
  height: 100%;
  white-space: nowrap;
  background-color: $bg-color;
}
</style>
