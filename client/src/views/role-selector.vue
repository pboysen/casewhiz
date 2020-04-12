<script>
import { mapGetters } from "vuex";
export default {
  name: "role-selector",
  computed: {
    ...mapGetters(["currentRole"])
  },
  methods: {
    setRole: function(role) {
      if (role === "newstudent") {
        this.$store.dispatch("restartStudent");
        document.getElementById("role").value = "student";
        return;
      }
      this.$store.commit("setCurrentRole", role);
    }
  }
};
</script>
<template>
  <div id="roles">
    <span>Role: </span>
    <select
      id="role"
      :value="currentRole"
      @change="setRole($event.target.value)"
    >
      <option value="designer">Designer</option>
      <option value="instructor">Instructor</option>
      <option value="student">Student</option>
      <option value="newstudent">New Student</option>
    </select>
  </div>
</template>
<style lang="scss" scoped>
#roles {
  display: inline-block;
  float: left;
  margin-left: 10px;
  span {
    font-size: $small-font;
    font-weight: bold;
  }
}
#role {
  font-size: $txt-font;
  margin-top: 2px;
  background-color: #ffffff;
  border-radius: 5px;
  height: 25px;
  cursor: pointer;
}
#role select {
  border-radius: 4px;
}
</style>
