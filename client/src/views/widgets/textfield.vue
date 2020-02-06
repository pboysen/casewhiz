<script>
import WidgetWrapper from "@/views/widgets/widget-wrapper.vue";
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
    size() {
      return this.$store.getters.size(this.wid);
    },
    isDesigner() {
      return this.$store.getters.currentRole === "designer";
    }
  }
};
</script>
<template>
  <WidgetWrapper widgettype="textfield">
    <input
      type="text"
      :size="size"
      :class="['textfield', { user: !isDesigner }]"
    />
  </WidgetWrapper>
</template>
<style lang="scss">
.textfield {
  cursor: default;
  pointer-events: none;
  border-radius: 0;
}
.textfield.user {
  cursor: text;
  pointer-events: auto;
}
</style>
