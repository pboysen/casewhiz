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
    <div id="main-title">Springbuck Designer</div>
    <case-filer v-if="isDesigner"></case-filer>
  </div>
</template>

<style lang="scss" scoped>
#casebar {
  text-align: center;
  display: inline-block;
  padding: 6px;
  white-space: nowrap;
  width: 100%;
  height: 30px;
  color: $fancy-color;
  border-bottom: 1px solid $border-color;
}
#main-title {
  display: inline-block;
  font-family: $script-font;
  font-weight: bold;
  font-size: 24px;
}
</style>
