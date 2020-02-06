<script>
import WidgetWrapper from "@/views/widgets/widget-wrapper.vue";
export default {
  name: "MultipleChoice",
  data: function() {
    return {
      wid: this.$options.wdata.wid
    };
  },
  components: {
    WidgetWrapper
  }
};
</script>
<template>
  <WidgetWrapper widgettype="multiplechoice">
    <div class="multiplechoice"></div>
  </WidgetWrapper>
</template>
<style lang="scss" scoped>
.widget[widgettype="multiplechoice"] div {
  padding-left: 10px;
  line-height: 16px;
  position: absolute;
}
.multiplechoice {
}
.multiplechoice input[type="radio"] {
  display: block;
}
</style>
