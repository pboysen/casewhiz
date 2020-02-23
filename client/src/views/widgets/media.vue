<script>
import WidgetWrapper from "@/views/widgets/widget-wrapper.vue";
export default {
  name: "Media",
  data: function() {
    return {
      wid: this.$options.wdata.wid
    };
  },
  components: {
    WidgetWrapper
  },
  computed: {
    src() {
      return this.$store.getters.src(this.wid);
    }
  }
};
</script>
<template>
  <WidgetWrapper widgettype="media">
    <div>
      <iframe class="iframe" :src="src" />
    </div>
  </WidgetWrapper>
</template>
<style lang="scss">
.media {
}
.widget[widgettype="media"] div {
  background-color: white;
  resize: both;
  overflow: hidden;
  padding: 2px;
  cursor: grab;
}
.widget[widgettype="media"] iframe {
  border: 1px solid gray;
  pointer-events: none;
  width: 100%;
  height: 100%;
}
.widget[widgettype="media"].student div {
  cursor: pointer;
  resize: none;
}
.widget[widgettype="media"].student iframe {
  cursor: pointer;
  resize: none;
  pointer-events: auto;
}
</style>
