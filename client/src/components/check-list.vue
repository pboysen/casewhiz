<script>
import widgetWrapper from "@/components/widget-wrapper.vue";
import { mapGetters } from "vuex";
export default {
  name: "check-list",
  props: {
    wid: Number
  },
  components: {
    widgetWrapper
  },
  computed: {
    ...mapGetters(["widgetIsLocked", "currentRole", "currentPhase"]),
    checks() {
      let info = {
        wid: this.wid,
        phase: this.currentPhase,
        type: "check-list",
        prop: "checks"
      };
      return this.$store.getters.getPropValue(info);
    },
    pixelRatio() {
      return window.devicePixelRatio;
    }
  }
};
</script>
<template>
  <widget-wrapper widgettype="check-list">
    <div class="check-list">
      <div v-for="check in checks" :key="check.key">
        <input
          v-if="check.value > 0"
          :name="`cl${wid}.${check.value}`"
          type="checkbox"
          :value="check.value"
        />
      </div>
    </div>
  </widget-wrapper>
</template>
<style lang="scss">
.check-list {
  display: grid;
  grid-gap: 4px;
  grid-auto-rows: 1em;
  background-color: white;
}
.check-list input[type="check"] {
  margin: 0;
}
</style>
