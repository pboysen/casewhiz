<script>
import * as createjs from "createjs-module";
import PcDownloadImage from "./PcDownloadImage.vue";
import widgetWrapper from "@/views/widgets/widget-wrapper.vue";
import { makeStage, angle, addMouse, removeMouse } from "./mixins/basedraw";
import { mapGetters } from "vuex";
export default {
  props: {
    wid: Number
  },
  data: function() {
    return {
      stage: null,
      shape: null,
      arrow: null,
      color: "blue",
      down: false
    };
  },
  components: {
    widgetWrapper,
    PcDownloadImage
  },
  mounted() {
    this.$nextTick(() => {
      makeStage(this, "arrow-canvas");
      this.showArrows();
    });
  },
  computed: {
    ...mapGetters(["widgetIsLocked", "currentRole", "currentPhase"]),
    getColor: () => this.color,
    image: function() {
      return this.prop("image");
    },
    lineWidth: function() {
      return this.prop("lineWidth");
    },
    value: function() {
      return this.$store.getters["responses/getAnswer"](this.wid);
    },
    colors: function() {
      const colors = this.prop("colors");
      const colorIds = [];
      let id = 1;
      colors.split(",").forEach(color => {
        colorIds.push({ id: "c" + id++, name: color });
      });
      return colorIds;
    }
  },
  watch: {
    currentRole: role => {
      if (role === "student") addMouse();
      else removeMouse();
    }
  },
  methods: {
    prop(prop) {
      return this.$store.getters.getPropValue({
        wid: this.wid,
        phase: this.currentPhase,
        type: "pc-draw-arrow",
        prop: prop
      });
    },
    showArrows() {
      for (const id in this.value.arrows) {
        this.arrow = this.value.arrows[id];
        this.showArrow(id);
        this.setCursor();
      }
    },
    setColor(color) {
      this.color = color;
    },
    setCursor() {
      if (!this.widgetIsLocked)
        this.shape.cursor = "url(assets/img/remove.png) 8 8, auto";
    },
    showArrow(id) {
      const a = this.arrow;
      const s = new createjs.Shape();
      s.color = a.color;
      const w = Math.min(this.lineWidth, 5);
      const d = Math.hypot(a.sx - a.ex, a.sy - a.ey);
      const c = a.color;
      console.log(w, d, c);
      s.graphics
        .ss(1)
        .s(c)
        .f(c)
        .mt(0, 0)
        .lt(0, w)
        .lt(d, w)
        .lt(d, 2 * w)
        .lt(d + 2 * w, 0)
        .lt(d, -2 * w)
        .lt(d, -w)
        .lt(0, -w)
        .lt(0, 0);
      [s.x, s.y, s.rotation] = [a.sx, a.sy, angle(a.sx, a.sy, a.ex, a.ey)];
      this.shape = s;
      this.stage.addChild(s);
      if (!this.widgetIsLocked) {
        s.on("click", e => {
          e.stopPropagation();
          this.stage.removeChild(s);
          this.deleteArrow(id);
        });
      }
    },
    saveArrow() {
      this.value.arrows[this.value.id++] = this.arrow;
      this.$store.commit("responses/saveAnswer", this.value);
    },
    deleteArrow(id) {
      delete this.value.arrows[id];
      this.$store.commit("responses/saveAnswer", this.value);
    },
    mouseDown(e) {
      let shape = this.stage.getObjectUnderPoint(e.stageX, e.stageY);
      if (!shape || (shape && shape.image)) {
        this.arrow = {
          sx: e.stageX,
          sy: e.stageY,
          ex: e.stageX,
          ey: e.stageY,
          color: this.color
        };
        this.showArrow(this.value.id);
        this.down = true;
      }
    },
    mouseMove(e) {
      if (this.down) {
        this.stage.removeChild(this.shape);
        [this.arrow.ex, this.arrow.ey] = [e.stageX, e.stageY];
        this.showArrow(this.value.id);
      }
    },
    mouseUp() {
      if (this.down) {
        this.saveArrow();
        this.setCursor();
        this.down = false;
      }
    },
    testData: function() {
      return {
        id: 3,
        arrows: {
          1: { sx: 0, sy: 50, ex: 100, ey: 50, color: "red" },
          2: { sx: 0, sy: 100, ex: 100, ey: 100, color: "blue" }
        }
      };
    }
  }
};
</script>
<template>
  <widget-wrapper widgettype="pc-draw-arrow" :wid="wid">
    <div id="colors">
      <span>Arrow Color:</span>
      <span v-for="color in colors" :key="color.id">
        <input
          :id="color.id"
          :value="color.name"
          type="radio"
          name="color"
          checked="checked"
          @click="setColor(color.name)"
        />
        <label :for="color.id" :style="{ color: color.name }">
          {{ color.name }}
        </label>
      </span>
    </div>
    <canvas id="arrow-canvas" width="800" height="600"></canvas>
    <pc-download-image title="Download Image" :url="image"></pc-download-image>
  </widget-wrapper>
</template>
<style lang="scss" scoped>
.widget[widgettype="pc-draw-arrow"] {
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
