<script>
import WidgetWrapper from "@/views/widgets/widget-wrapper.vue";
export default {
  name: "Checklist",
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
  <WidgetWrapper widgettype="checklist">
    <div class="checklist"></div>
  </WidgetWrapper>
</template>
<style lang="scss">
.media {
}
.widget[widgettype="checklist"] div {
  padding: 4px;
}
.widget .checklist {
  input[type="checkbox"] {
    display: block;
  }
}
</style>
