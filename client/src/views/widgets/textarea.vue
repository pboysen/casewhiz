<script>
import WidgetWrapper from "@/views/widgets/widget-wrapper.vue";
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
    carryforward() {
      return this.$store.getters.carryforward(this.wid);
    }
  }
};
</script>
<template>
  <WidgetWrapper widgettype="textarea">
    <textarea class="textarea">carryforward</textarea>
  </WidgetWrapper>
</template>

<style lang="scss">
.widget[widgettype="textarea"] {
  cursor: default;
  rows: 4;
  cols: 50;
}
</style>
