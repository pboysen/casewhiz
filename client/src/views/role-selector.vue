<script>
export default {
  name: "RoleSelector",
  methods: {
    setRole: function(role) {
      this.$store.commit("setRole", role);
    }
  }
};
</script>
<template>
  <div id="roles">
    <span>Role: </span>
    <select id="role" @change="setRole($event.target.value)">
      <option value="designer">Designer</option>
      <option value="instructor">Instructor</option>
      <option value="student">Student</option>
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
