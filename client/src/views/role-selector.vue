<template>
  <div id="roles">
    <span>Role: </span>
    <select id="role">
      <option>Designer</option>
      <option>Instructor</option>
      <option>Student</option>
    </select>
  </div>
</template>

<style lang="scss">
#roles {
  float: left;
  margin-left: 10px;
  span {
    font-weight: bold;
  }
}
#role {
  margin-top: 2px;
  background-color: #ffffff;
  border-radius: 5px;
  height: 25px;
  cursor: pointer;
}
</style>
