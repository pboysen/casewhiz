<script>
import { Scrolly, ScrollyViewport, ScrollyBar } from "vue-scrolly";
import { mapGetters } from "vuex";

export default {
  name: "PhaseBar",
  components: {
    Scrolly,
    ScrollyViewport,
    ScrollyBar
  },
  data: function() {
    return {
      panel: null,
      left: 0,
      barStyle: "",
      menuType: "none"
    };
  },
  methods: {
    setCurrentPhase(phase) {
      this.$store.commit("setCurrentPhase", phase);
    },
    phaseIsLocked(pid) {
      return this.$store.getters.phaseIsLocked(pid);
    }
  },
  computed: {
    ...mapGetters(["getPhases", "currentPhase"])
  }
};
</script>

<template>
  <scrolly id="phase-bar" :style="{ width: '100%', height: '35px' }">
    <scrolly-viewport>
      <button
        v-for="(phase, index) in getPhases"
        :key="phase.id"
        :id="phase.id"
        @click="setCurrentPhase(index)"
        :class="['phase-button', { active: currentPhase == index }]"
        :disabled="phaseIsLocked(phase.id)"
      >
        {{ phase.title }}
      </button>
    </scrolly-viewport>
    <scrolly-bar axis="x"></scrolly-bar>
  </scrolly>
</template>

<style lang="scss" scoped>
#phase-bar {
  display: block;
  white-space: nowrap;
  background-color: $bg-color;
  padding: 2px 10px 2px 0;
  overflow: none;
  box-sizing: border-box;
  width: 100%;
  border-bottom: 1px solid $border-color;
}
.phase-button {
  display: inline-block;
  min-width: 20px;
  font-size: 14px;
  padding: 4px 0px 0 4px;
  color: $txt-color;
  border: 0;
  background-color: $bg-color;
  margin-left: 20px;
  cursor: pointer;
}
.phase-button:hover {
  color: $select-color;
}
.phase-button:disabled:hover {
  color: gray;
}
.phase-button:disabled {
  color: gray;
}
.active {
  color: $select-color;
}
.scrolly#phase-bar .scrolly-bar:before {
  background-color: $fancy-color;
  height: 10px;
  opacity: 0.5;
}
.scrolly-viewport {
}
.scrolly-bar.axis-x {
  left: 0;
  bottom: -6px;
  height: 10px;
  min-width: 20%;
  max-width: 100%;
}
</style>
