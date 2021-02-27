<script>
import { mapGetters } from "vuex";

export default {
  name: "submit-bar",
  computed: {
    ...mapGetters(["submitTitle", "currentPhase", "currentRole"]),
    ...mapGetters(["responses/activePhase"])
  },
  methods: {
    submit: function() {
      this.$store.dispatch("submit");
    },
    disabled: () =>
      this.currentRole === "student" && this.currentPhase < this.activePhase
  }
};
</script>

<template>
  <div id="submit-panel">
    <button
      v-if="currentRole === 'student'"
      @click="submit"
      :disabled="disabled"
    >
      {{ submitTitle }}
    </button>
  </div>
</template>
<style lang="scss" scoped>
#submit-panel {
  position: relative;
  margin-top: 10px;
  height: 30px;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
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
