<script>
import widgetWrapper from "@/components/widget-wrapper.vue";
import { mapGetters } from "vuex";
export default {
  name: "carry-forward",
  props: {
    wid: Number
  },
  components: {
    widgetWrapper
  },
  computed: {
    ...mapGetters(["currentRole", "currentPhase"]),
    htmlAnswers() {
      let htmlAnswers = [];
      let info = {
        wid: this.wid,
        phase: this.currentPhase,
        type: "carry-forward",
        prop: "sources"
      };
      let sources = this.$store.getters.getPropValue(info);
      Object.values(sources).forEach(src => {
        let answer = this.$store.getters["responses/getAnswer"](src.wid);
        let w = this.$store.getters.getPhaseWidget(src);
        answer =
          w.type === "image-answer"
            ? `<img src="${answer}" />`
            : `<p>${answer}</p>`;
        htmlAnswers.push({ id: src.wid, answer: answer });
      });
      return htmlAnswers;
    }
  }
};
</script>
<template>
  <widget-wrapper widgettype="carry-forward" :wid="wid">
    <div :class="['carry-forward', { student: currentRole == 'student' }]">
      <div
        v-for="html in htmlAnswers"
        :key="html.id"
        v-html="html.answer"
      ></div>
    </div>
  </widget-wrapper>
</template>

<style lang="scss">
.widget[widgettype="carry-forward"] {
  background-color: white;
}
.carry-forward {
  cursor: grab;
  min-width: 100px;
  min-height: 50px;
  resize: both;
  overflow: auto;
  font-size: $txt-font;
  border: 1px dashed $border-color;
}
.carry-forward.student {
  cursor: pointer;
  border: 0;
  resize: none;
  overflow: visible;
}
</style>
