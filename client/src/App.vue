<script>
import mainBar from "@/views/main-bar.vue";
import caseViewer from "@/views/case-viewer.vue";

export default {
  name: "App",
  components: {
    mainBar,
    caseViewer
  }
};
</script>
<template>
  <div id="app">
    <main-bar></main-bar>
    <case-viewer></case-viewer>
  </div>
</template>
<style lang="scss">
html,
body {
  display: block;
  margin: 0;
  padding: 0;
  white-space: nowrap;
}
#app {
  position: relative;
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
