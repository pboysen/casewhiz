<script>
import WidgetWrapper from "@/views/widgets/widget-wrapper.vue";
export default {
  name: "Select",
  data: function() {
    return {
      wid: this.$options.wdata.wid
    };
  },
  components: {
    WidgetWrapper
  },
  computed: {
    options() {
      return this.$store.getters.options(this.wid).split(";");
    },
    size() {
      return this.$store.getters.size(this.wid);
    }
  }
};
</script>
<template>
  <WidgetWrapper widgettype="select">
    <select class="select" :size="size">
      <option v-for="option in options" :key="option" :value="option">
        {{ option }}
      </option>
    </select>
  </WidgetWrapper>
</template>

<style lang="scss">
.widget[widgettype="select"] select {
  min-width: 50px;
  border-radius: 0;
  cursor: default;
}
</style>
