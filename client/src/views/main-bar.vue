<script>
import roleSelector from "@/views/role-selector.vue";
import caseFiler from "@/views/case-filer.vue";
export default {
  name: "main-bar",
  components: {
    roleSelector,
    caseFiler
  },
  computed: {
    isDesigner() {
      return this.$store.getters.currentRole === "designer";
    }
  }
};
</script>

<template>
  <div id="casebar">
    <role-selector></role-selector>
    <div id="main-title">Allele Designer</div>
    <case-filer></case-filer>
  </div>
</template>

<style lang="scss" scoped>
#casebar {
  text-align: center;
  display: inline-block;
  padding: 4px;
  white-space: nowrap;
  width: 100%;
  height: 20px;
  color: $fancy-color;
  border-bottom: 1px solid $border-color;
  background-color: $bg-color;
}
#main-title {
  display: inline-block;
  font-family: $script-font;
  font-weight: bold;
  font-size: 14px;
}
</style>
