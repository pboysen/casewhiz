<script>
import PcDownloadImage from "./PcDownloadImage.vue";
import widgetWrapper from "@/components/widget-wrapper.vue";
import { makeStage, getBack } from "./mixins/basedraw";
import { mapGetters } from "vuex";
export default {
  props: {
    wid: Number
  },
  data: function() {
    return {
      stage: null
    };
  },
  components: {
    widgetWrapper,
    PcDownloadImage
  },
  mounted() {
    this.$nextTick(() => {
      makeStage(this, "rotate-canvas");
      this.showImage();
    });
  },
  computed: {
    ...mapGetters(["widgetIsLocked", "currentRole", "currentPhase"]),
    value: function() {
      return this.$store.getters["responses/getAnswer"](this.wid);
    },
    image: function() {
      return this.prop("image");
    }
  },
  methods: {
    prop(prop) {
      return this.$store.getters.getPropValue({
        wid: this.wid,
        phase: this.currentPhase,
        type: "pc-draw-rotate",
        prop: prop
      });
    },
    showImage() {
      const back = getBack();
      back.rotation = this.value.rotation;
      back.scaleX = this.value.flipH;
      back.scaleY = this.value.flipV;
    },
    saveValue(value) {
      this.$store.commit("responses/saveAnswer", value);
      this.showImage();
    },
    saveRotate() {
      let rot = this.value.rotation;
      this.value.rotation = rot < 360 ? rot + 90 : 0;
      this.saveValue(this.value);
    },
    saveHorizontal() {
      this.value.flipH = -this.value.flipH;
      this.saveValue(this.value);
    },
    saveVertical() {
      this.value.flipV = -this.value.flipV;
      this.saveValue(this.value);
    }
  }
};
</script>
<template>
  <widget-wrapper widgettype="pc-draw-rotate" :wid="wid">
    <div id="ratators">
      <button @click="saveRotate">Rotate</button>
      <button @click="saveHorizontal">Flip Horizontally</button>
      <button @click="saveVertical">Flip Vertically</button>
    </div>
    <canvas id="rotate-canvas" width="800" height="600"></canvas>
    <pc-download-image title="Download Image" :url="image"></pc-download-image>
  </widget-wrapper>
</template>
<style lang="scss" scoped>
.widget[widgettype="pc-draw-rotate"] {
  padding: 5px;
  background: white;
  font-size: 14px;
}
#colors {
}
#arrow-canvas {
  display: block;
  border: 1px solid lightgray;
}
</style>
