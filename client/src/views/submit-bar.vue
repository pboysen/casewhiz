<script>
import { mapGetters } from "vuex";

export default {
  name: "SubmitBar",
  methods: {
    submit: function() {}
  },
  computed: {
    ...mapGetters(["submitTitle"])
  }
};
</script>
<template>
  <div id="submit-panel">
    <button @click="submit">{{ submitTitle }}</button>
  </div>
</template>
<style lang="scss" scoped>
#submit-panel {
  position: absolute;
  margin-top: 10px;
  bottom: 0;
  left: 0;
  margin: 0;
  height: 30px;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  background-color: $bg-color;
  border: 1px solid $border-color;
}
#submit-panel button {
  font-size: $small-font;
  margin: 2px;
  cursor: pointer;
}
#submit-panel button:hover {
  color: $select-color;
}
</style>
