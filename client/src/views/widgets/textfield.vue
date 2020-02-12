<script>
import WidgetWrapper from "@/views/widgets/widget-wrapper.vue";
import { mapGetters } from "vuex";
export default {
  name: "Textfield",
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
      return this.$store.getters["responses/getAnswer"](this.wid);
    },
    size() {
      return this.$store.getters.size(this.wid);
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
  <WidgetWrapper widgettype="textfield">
    <input
      type="text"
      :size="size"
      :value="value"
      :class="['textfield', { student: isStudent }]"
      :readonly="widgetIsLocked"
      @input="saveAnswer($event)"
    />
  </WidgetWrapper>
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
