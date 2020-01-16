<script>
import WidgetWrapper from "@/views/widgets/widget-wrapper.vue";
export default {
  name: "CarryforwardWidget",
  data: function() {
    return {
      wid: this.$options.wdata.wid
    };
  },
  components: {
    WidgetWrapper
  },
  computed: {
    sources() {
      return this.$store.getters.sources(this.wid);
    },
    target() {
      return this.$store.getters.target(this.wid);
    }
  },
  methods: {
    updateSources(sources) {
      this.$store.commit("updatSources", sources);
    }
  }
};
</script>
<template>
  <WidgetWrapper widgettype="select">
    <div class="carryforward">
      {{ target }}
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
