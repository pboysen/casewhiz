<script>
import DesignerBar from "@/views/designer-bar.vue";
import PhaseViewer from "@/views/phase-viewer.vue";
import ToolBox from "@/views/tool-box.vue";
export default {
  name: "CaseWiz",
  components: {
    DesignerBar,
    PhaseViewer,
    ToolBox
  }
};
</script>

<template>
  <div id="app">
    <DesignerBar></DesignerBar>
    <div id="main-display>">
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
  background-color: lightblue;
}
#main-display {
  width: 100%;
  height: 100%;
  white-space: nowrap;
  background-color: lightblue;
  border: 1px solid black;
}
</style>
