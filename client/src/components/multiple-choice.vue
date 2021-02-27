<script>
import widgetWrapper from "@/components/widget-wrapper.vue";
import { mapGetters } from "vuex";
export default {
  name: "multiple-choice",
  props: {
    wid: Number
  },
  components: {
    widgetWrapper
  },
  computed: {
    ...mapGetters(["widgetIsLocked", "currentRole", "currentPhase"]),
    radios() {
      let info = {
        wid: this.wid,
        phase: this.currentPhase,
        type: "multiple-choice",
        prop: "radios"
      };
      return this.$store.getters.getPropValue(info);
    }
  }
};
</script>
<template>
  <widget-wrapper widgettype="multiple-choice" :wid="wid">
    <div class="multiple-choice">
      <div v-for="radio in radios" :key="radio.key">
        <input
          v-if="radio.value > 0"
          type="radio"
          :name="`mc${wid}`"
          :value="radio.value"
        />
      </div>
    </div>
  </widget-wrapper>
</template>
<style lang="scss" scoped>
.multiple-choice {
  display: grid;
  grid-gap: 4px;
  grid-auto-rows: 1em;
  background-color: white;
}
.multiple-choice input[type="radio"] {
  margin: 0;
}
</style>
