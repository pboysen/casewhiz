<script>
import widgetWrapper from "@/views/widgets/widget-wrapper.vue";
import { mapGetters } from "vuex";
export default {
  name: "select-widget",
  props: {
    wid: Number
  },
  components: {
    widgetWrapper
  },
  computed: {
    ...mapGetters(["currentRole", "currentPhase"]),
    options() {
      let info = {
        wid: this.wid,
        phase: this.currentPhase,
        type: "select-widget",
        prop: "selectOptions"
      };
      let options = this.$store.getters.getPropValue(info);
      return options ? options.split(",") : "";
    },
    selectSize() {
      let info = {
        wid: this.wid,
        phase: this.currentPhase,
        type: "select-widget",
        prop: "selectSize"
      };
      return this.$store.getters.getPropValue(info);
    }
  },
  methods: {
    saveAnswer(e) {
      this.$store.commit("responses/saveAnswer", {
        wid: this.wid,
        value: e.target.value
      });
    }
  }
};
</script>
<template>
  <widget-wrapper widgettype="select-widget" :wid="wid">
    <select class="select" :size="selectSize" @change="saveAnswer($event)">
      <option v-for="option in options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
  </widget-wrapper>
</template>

<style lang="scss">
.widget[widgettype="select-widget"] select {
  min-width: 50px;
  border-radius: 0;
  cursor: default;
}
</style>
