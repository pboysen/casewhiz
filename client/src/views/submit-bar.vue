<script>
import { mapGetters } from "vuex";

export default {
  name: "SubmitBar",
  methods: {
    submit: function() {
      this.$store.commit("validateResponses");
    }
  },
  computed: {
    ...mapGetters(["submitTitle", "currentPhase", "currentRole"]),
    disabled() {
      return (
        this.currentRole === "student" &&
        this.$store.getters["responses/isCompletedPhase"](this.currentPhase)
      );
    }
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
