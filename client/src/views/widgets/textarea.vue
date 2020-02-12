<script>
import WidgetWrapper from "@/views/widgets/widget-wrapper.vue";
import { mapGetters } from "vuex";
export default {
  name: "TextArea",
  data: function() {
    return {
      wid: this.$options.wdata.wid
    };
  },
  components: {
    WidgetWrapper
  },
  computed: {
    ...mapGetters(["widgetIsLocked", "currentRole"]),
    value() {
      var ans = this.$store.getters["responses/getAnswer"](this.wid);
      if (ans != "") return ans;
      else {
        var sources = this.$store.getters.sources(this.wid);
        return this.$store.getters["responses/combineAnswers"](sources);
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
  <WidgetWrapper widgettype="textarea">
    <textarea
      :class="['textarea', { student: isStudent }]"
      @input="saveAnswer($event)"
      :value="value"
      :readonly="widgetIsLocked"
    ></textarea>
  </WidgetWrapper>
</template>

<style lang="scss">
.widget textarea {
  font-size: $small-font;
  cursor: grab;
  rows: 4;
  cols: 50;
}
.widget.student textarea {
  cursor: text;
}
</style>
