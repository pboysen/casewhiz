<script>
import WidgetWrapper from "@/views/widgets/widget-wrapper.vue";
import { mapGetters } from "vuex";
export default {
  name: "Carryforward",
  data: function() {
    return {
      wid: this.$options.wdata.wid
    };
  },
  components: {
    WidgetWrapper
  },
  computed: {
    ...mapGetters(["currentRole"]),
    htmlAnswers() {
      let htmlAnswers = [];
      let sources = this.$store.getters["sources"](this.wid);
      Object.values(sources).forEach(wid => {
        let answer = this.$store.getters["responses/getAnswer"](wid);
        let w = this.$store.getters.getWidgetRecord(wid);
        answer =
          w.type === "imageanswer"
            ? `<img src="${answer}" />`
            : `<p>${answer}</p>`;
        htmlAnswers.push({ id: wid, answer: answer });
      });
      return htmlAnswers;
    }
  }
};
</script>
<template>
  <WidgetWrapper widgettype="carryforward">
    <div :class="['carryforward', { student: currentRole == 'student' }]">
      <div
        v-for="html in htmlAnswers"
        :key="html.id"
        v-html="html.answer"
      ></div>
    </div>
  </WidgetWrapper>
</template>

<style lang="scss">
.widget[widgettype="carryforward"] {
  background-color: white;
}
.carryforward {
  cursor: grab;
  min-width: 100px;
  min-height: 50px;
  resize: both;
  overflow: auto;
  font-size: $txt-font;
  border: 1px dashed $border-color;
}
.carryforward.student {
  cursor: pointer;
  border: 0;
  resize: none;
  overflow: visible;
}
</style>
