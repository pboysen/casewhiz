<script>
import RoleSelector from "@/views/role-selector.vue";
import CaseFiler from "@/views/case-filer.vue";
export default {
  name: "MainBar",
  components: {
    RoleSelector,
    CaseFiler
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
    <RoleSelector></RoleSelector>
    <div id="main-title">Springbuck Designer</div>
    <CaseFiler v-if="isDesigner"></CaseFiler>
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
  font-family: $script-font, cursive;
  font-weight: bold;
  font-size: 24px;
}
</style>
