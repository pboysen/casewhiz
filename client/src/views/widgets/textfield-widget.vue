<script>
import WidgetWrapper from "@/views/widgets/widget-wrapper.vue";
export default {
  name: "TextfieldWidget",
  data: function() {
    return {
      wid: this.$options.wdata.wid
    };
  },
  components: {
    WidgetWrapper
  },
  computed: {
    size() {
      return this.$store.getters.size(this.wid);
    }
  }
};
</script>
<template>
  <WidgetWrapper widgettype="textfield">
    <input type="text" :size="size" class="textfield" />
  </WidgetWrapper>
</template>
<style lang="scss">
.textfield {
  cursor: default;
  pointer-events: none;
  border-radius: 0;
}
</style>
