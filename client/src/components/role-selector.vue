<script>
export default {
  name: "role-selector",
  computed: {
    isDesigner() {
      return this.$store.getters.currentRole === "designer";
    }
  },
  methods: {
    setRole: function(role) {
      if (role === "newstudent") {
        this.$store.dispatch("restartStudent");
        document.getElementById("role").value = "student";
      } else this.$store.commit("setCurrentRole", role);
    }
  }
};
</script>
<template>
  <div id="roles">
    <input
      id="designer"
      type="radio"
      @change="setRole('designer')"
      :checked="isDesigner"
    />
    <label for="designer">Designer</label>
    <input
      id="student"
      type="radio"
      @change="setRole('student')"
      :checked="!isDesigner"
    />
    <label for="student">Student</label>
  </div>
</template>
<style lang="scss" scoped>
#roles {
  display: inline-block;
  float: left;
  padding-left: 10px;
  padding-bottom: 4px;
  label {
    font-size: $small-font;
    font-weight: bold;
  }
}
</style>
