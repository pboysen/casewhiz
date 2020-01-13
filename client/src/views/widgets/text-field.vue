<script>
import WidgetWrapper from "@/views/widgets/widget-wrapper.vue";
export default {
  name: "textfield",
  data: function() {
    return {
      wid: this.$options.wdata.wid
    };
  },
  components: {
    WidgetWrapper
  },
  computed: {
    getSize() {
      return this.$store.getters.textfieldSize(this.wid);
    }
  }
};
</script>
<template>
  <WidgetWrapper widgettype="textfield">
    <input type="text" :size="getSize" class="textfield" />
  </WidgetWrapper>
</template>
<style lang="scss">
.textfield {
  cursor: default;
  pointer-events: none;
  border-radius: 0;
}
</style>
