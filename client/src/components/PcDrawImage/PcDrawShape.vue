<script>
import * as createjs from "createjs-module";
import PcDownloadImage from "./PcDownloadImage.vue";
import widgetWrapper from "@/views/widgets/widget-wrapper.vue";
import { makeStage, getBack } from "./mixins/basedraw";
import { mapGetters } from "vuex";
export default {
  props: {
    wid: Number
  },
  data: function() {
    return {
      stage: null,
      id: null
    };
  },
  components: {
    widgetWrapper,
    PcDownloadImage
  },
  mounted() {
    this.$nextTick(() => {
      makeStage(this, "shape-canvas");
      this.showShapes();
    });
  },
  computed: {
    ...mapGetters(["widgetIsLocked", "currentRole", "currentPhase"]),
    value: function() {
      return this.$store.getters["responses/getAnswer"](this.wid);
    },
    image: function() {
      return this.prop("image");
    },
    shape: function() {
      return this.prop("shape");
    },
    width: function() {
      return this.prop("width");
    },
    height: function() {
      return this.prop("height");
    },
    color: function() {
      return this.prop("color");
    },
    opacity: function() {
      return this.prop("opacity");
    }
  },
  watch: {
    currentRole: function() {
      if (this.currentRole === "student")
        getBack().on("click", e => {
          e.stopPropagation();
          const id = this.addShape(e);
          this.showShape(id);
        });
      else this.stage.removeEventListener("click");
    }
  },
  methods: {
    prop(prop) {
      return this.$store.getters.getPropValue({
        wid: this.wid,
        phase: this.currentPhase,
        type: "pc-draw-shape",
        prop: prop
      });
    },
    createShape(s) {
      let shape = new createjs.Shape();
      shape.alpha = s.o;
      shape.graphics.beginFill(s.c);
      switch (s.s) {
        case "rectangle":
          shape.graphics.drawRect(s.x, s.y, s.w, s.h);
          break;
        case "circle":
          shape.graphics.drawEllipse(s.x, s.y, s.w, s.h);
          break;
      }
      shape.graphics.endFill();
      return shape;
    },
    showShapes() {
      for (const id in this.value.shapes) {
        this.label = this.value.shapes[id];
        this.showShape(id);
        this.setCursor();
      }
    },
    showShape(id) {
      this.value.shapes[id];
      let s = this.createShape(this.value.shapes[id]);
      s.cursor = "url(assets/img/remove.png) 8 8, auto";
      if (!this.widgetIsLocked) {
        s.on("click", e => {
          e.stopPropagation();
          this.stage.removeChild(s);
          this.deleteShape(id);
        });
      }
      this.stage.addChild(s);
    },
    deleteShape(id) {
      delete this.value.shapes[id];
      this.$store.commit("responses/saveAnswer", this.value);
    },
    addShape(e) {
      let shape = {
        x: e.stageX,
        y: e.stageY,
        s: this.shape,
        w: this.width,
        h: this.height,
        c: this.color,
        o: this.opacity
      };
      const id = this.value.id;
      this.value.shapes[this.value.id++] = shape;
      this.$store.commit("responses/saveAnswer", this.value);
      return id;
    }
  }
};
</script>
<template>
  <widget-wrapper widgettype="pc-draw-shape" :wid="wid">
    <canvas id="shape-canvas" width="800" height="600"></canvas>
    <pc-download-image title="Download Image" :url="image"></pc-download-image>
  </widget-wrapper>
</template>
<style lang="scss" scoped>
.widget[widgettype="pc-draw-shape"] {
  padding: 5px;
  background: white;
  font-size: 14px;
}
</style>
