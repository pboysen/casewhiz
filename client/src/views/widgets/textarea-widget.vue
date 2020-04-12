<script>
import widgetWrapper from "@/views/widgets/widget-wrapper.vue";
import { mapGetters } from "vuex";
export default {
  name: "textarea-widget",
  props: {
    wid: Number
  },
  components: {
    widgetWrapper
  },
  computed: {
    ...mapGetters(["widgetIsLocked", "currentRole", "currentPhase"]),
    textAreaValue() {
      let ans = this.$store.getters["responses/getAnswer"](this.wid);
      if (ans != "") return ans;
      else {
        let info = {
          wid: this.wid,
          phase: this.currentPhase,
          type: "textarea-widget",
          prop: "sources"
        };
        let value = this.$store.getters.getPropValue(info);
        if (value.length > 0)
          return this.$store.getters["responses/textAnswers"](value);
        else {
          return "";
        }
      }
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
  <widget-wrapper widgettype="textarea-widget" :wid="wid">
    <textarea
      :class="['textarea-widget', { student: isStudent }]"
      @input="saveAnswer($event)"
      :value="textAreaValue"
      :readonly="widgetIsLocked"
    ></textarea>
  </widget-wrapper>
</template>

<style lang="scss">
.widget textarea-widget {
  font-size: $small-font;
  cursor: grab;
  rows: 4;
  cols: 50;
}
.widget.student textarea-widget {
  cursor: text;
}
</style>
