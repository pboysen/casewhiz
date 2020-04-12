<script>
import widgetWrapper from "@/views/widgets/widget-wrapper.vue";
import { mapGetters } from "vuex";
export default {
  name: "textfield-widget",
  props: {
    wid: Number
  },
  components: {
    widgetWrapper
  },
  computed: {
    ...mapGetters(["widgetIsLocked", "currentRole", "currentPhase"]),
    value() {
      return this.$store.getters["responses/getAnswer"](this.wid);
    },
    textSize() {
      let info = {
        wid: this.wid,
        phase: this.currentPhase,
        type: "textfield-widget",
        prop: "textSize"
      };
      return this.$store.getters.getPropValue(info);
    },
    isStudent() {
      return this.currentRole === "student";
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
  <widget-wrapper widgettype="textfield-widget" :wid="wid">
    <input
      type="text"
      :size="textSize"
      :value="value"
      :class="['textfield-widget', { student: isStudent }]"
      :readonly="widgetIsLocked"
      @input="saveAnswer($event)"
    />
  </widget-wrapper>
</template>
<style lang="scss">
.widget input {
  font-size: $small-font;
  cursor: grab;
  border-radius: 0;
}
.widget.student input {
  cursor: text;
}
</style>
