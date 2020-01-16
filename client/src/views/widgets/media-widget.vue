<script>
import WidgetWrapper from "@/views/widgets/widget-wrapper.vue";
export default {
  name: "MediaWidget",
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
  },
  methods: {
    setSrc(src) {
      this.$store.commit("setSrc", src);
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
}
.widget iframe {
  border: 1px solid gray;
  width: 100%;
  height: 100%;
}
</style>
