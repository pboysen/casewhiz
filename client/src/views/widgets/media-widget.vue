<script>
import widgetWrapper from "@/views/widgets/widget-wrapper.vue";
import { mapGetters } from "vuex";
export default {
  name: "media-widget",
  props: {
    wid: Number
  },
  components: {
    widgetWrapper
  },
  computed: {
    ...mapGetters(["currentRole", "currentPhase"]),
    src() {
      return this.$store.getters.getPropValue({
        wid: this.wid,
        phase: this.currentPhase,
        type: "media-widget",
        prop: "mediaSrc"
      });
    }
  }
};
</script>
<template>
  <widget-wrapper widgettype="media-widget" :wid="wid">
    <div>
      <iframe class="iframe" :src="src" />
    </div>
  </widget-wrapper>
</template>
<style lang="scss">
.widget[widgettype="media-widget"] div {
  resize: both;
  overflow: hidden;
  cursor: grab;
  pointer-events: auto;
  border: 1px solid gray;
  width: 300px;
  height: 150px;
}
.widget[widgettype="media-widget"] iframe {
  display: none;
}
.widget[widgettype="media-widget"].student div {
  cursor: pointer;
  resize: none;
  pointer-events: auto;
}
.widget[widgettype="media-widget"].student iframe {
  background-color: white;
  display: block;
  cursor: pointer;
  resize: none;
  width: 100%;
  height: 100%;
}
</style>
