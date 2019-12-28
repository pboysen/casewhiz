<script> 
import RoleSelector from "@/views/role-selector.vue";
import CaseFiler from "@/views/case-filer.vue";
import { mapGetters } from "vuex";
export default {
  name: "DesignerBar",
  components: {
    RoleSelector,
    CaseFiler
  },
  computed: {
    ...mapGetters(["currentRole"])
  }
};
</script>

<template>
  <div id="casebar">
    <RoleSelector></RoleSelector>
    <span id="maintitle">CaseWhiz Designer</span>
    <CaseFiler v-if="currentRole === 'designer'"></CaseFiler>
  </div>
</template>

<style lang="scss" scoped>
#casebar {
  width: 100%;
  height: 32px;
  text-align: center;
  padding: 5px;
  color: white;
  display: block;
  border-bottom: 1px solid gray;
}
#maintitle {
  font-family: cursive;
  font-weight: bold;
  font-size: 24px;
}
</style>
