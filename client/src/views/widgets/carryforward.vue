<script>
import WidgetWrapper from "@/views/widgets/widget-wrapper.vue";
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
    carryforward() {
      return this.$store.getters.carryforward(this.wid);
    }
  }
};
</script>
<template>
  <WidgetWrapper widgettype="select">
    <div class="carryforward">
      {{ carryforward }}
    </div>
  </WidgetWrapper>
</template>

<style lang="scss">
.widget[widgettype="carryforward"] {
  background-color: white;
}
.carryforward {
  width: 100px;
  height: 24px;
  resize: both;
  overflow: auto;
  border: 1px dashed black;
}
</style>
