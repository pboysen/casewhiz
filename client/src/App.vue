<script>
import mainBar from "@/views/main-bar.vue";
import caseViewer from "@/views/case-viewer.vue";
import toolBox from "@/views/tools/tool-box.vue";
export default {
  name: "App",
  components: {
    mainBar,
    caseViewer,
    toolBox
  }
};
</script>
<template>
  <div id="app">
    <main-bar></main-bar>
    <div id="main-display">
      <case-viewer></case-viewer>
      <tool-box></tool-box>
    </div>
  </div>
</template>
<style lang="scss" scoped>
body {
  display: block;
  margin: 0;
  padding: 0;
  white-space: nowrap;
  tabindex: -1;
}
#spring-buck {
  margin: 0;
  padding: 0;
  display: block;
  overflow-x: hidden;
  overflow-y: auto;
  scroll-behavior: smooth;
  border: 1px solid $border-color;
}
#main-display {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
  min-height: 300px;
}
</style>
