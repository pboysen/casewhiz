<script>
import MainBar from "@/views/main-bar.vue";
import CaseViewer from "@/views/case-viewer.vue";
import ToolBox from "@/views/tools/tool-box.vue";
export default {
  name: "CaseWiz",
  components: {
    MainBar,
    CaseViewer,
    ToolBox
  }
};
</script>
<template>
  <div id="app">
    <MainBar></MainBar>
    <div id="main-display">
      <CaseViewer></CaseViewer>
      <ToolBox></ToolBox>
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
#app {
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
