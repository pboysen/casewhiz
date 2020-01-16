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
    <span id="maintitle">CaseWhiz Designer</span>
    <CaseFiler v-if="isDesigner"></CaseFiler>
  </div>
</template>

<style lang="scss">
#casebar {
  width: 100%;
  height: 24px;
  text-align: center;
  padding: 6px;
  color: $fancy-color;
  display: block;
}
#maintitle {
  font-family: "Parisienne", arial, helvetica;
  font-weight: bold;
  font-size: 24px;
}
</style>
