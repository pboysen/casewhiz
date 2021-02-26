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
      id: null,
      editor: null,
      labels: {}
    };
  },
  components: {
    widgetWrapper,
    PcDownloadImage
  },
  mounted() {
    this.$nextTick(() => {
      makeStage(this, "label-canvas");
      this.showLabels();
      this.editor = document.getElementById("labeltext");
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
  watch: {
    currentRole: function() {
      let that = this;
      if (this.currentRole === "student")
        getBack().on("click", function(e) {
          const id = that.addLabel({ text: "", x: e.stageX, y: e.stageY });
          that.showLabel(id);
          that.edit(id);
        });
      else this.stage.removeEventListener("click");
    }
  },
  methods: {
    prop(prop) {
      return this.$store.getters.getPropValue({
        wid: this.wid,
        phase: this.currentPhase,
        type: "pc-draw-label",
        prop: prop
      });
    },
    showLabels() {
      for (const id in this.value.labels) {
        this.label = this.value.labels[id];
        this.showLabel(id);
        this.setCursor();
      }
    },
    showLabel(id) {
      let pad = 2;
      let label = this.value.labels[id];
      let desc = new createjs.Text(label.text, "14px Arial", "#000");
      desc.x = label.x + pad;
      desc.y = label.y + pad;
      let width = Math.max(desc.getMeasuredWidth() + 2 * pad, 20);
      var rect = new createjs.Shape();
      rect.graphics.beginFill("white");
      rect.graphics.drawRoundRect(
        label.x,
        label.y,
        width,
        desc.getMeasuredHeight() + 2 * pad,
        5
      );
      rect.graphics.endFill();
      let remove = new createjs.Bitmap("assets/img/remove.png");
      remove.x = label.x + width - 8;
      remove.y = label.y - 10;
      remove.visible = false;
      let c = new createjs.Container();
      c.on("mouseover", () => {
        remove.visible = true;
      });
      c.on("mouseout", () => {
        remove.visible = false;
      });
      remove.on("click", () => {
        this.stage.removeChild(c);
        delete this.labels[id];
        this.deleteLabel(id);
        this.editor.value = "";
        this.editor.blur();
      });
      c.addChild(rect);
      c.addChild(desc);
      c.addChild(remove);
      this.stage.addChild(c);
      this.labels[id] = c;
      c.on("click", e => {
        e.stopPropagation();
        this.edit(id);
      });
    },
    edit(id) {
      this.id = id;
      this.label = this.value.labels[id];
      this.editor.value = this.label.text;
      this.editor.focus();
    },
    input(e) {
      e.stopPropagation();
      this.label.text = this.editor.value;
      this.stage.removeChild(this.labels[this.id]);
      this.showLabel(this.id);
      this.updateLabel();
    },
    deleteLabel(id) {
      delete this.value.labels[id];
      this.$store.commit("responses/saveAnswer", this.value);
    },
    updateLabel() {
      this.value.labels[this.id] = this.label;
      this.$store.commit("responses/saveAnswer", this.value);
    },
    addLabel(label) {
      const id = this.value.id;
      this.value.labels[this.value.id++] = label;
      this.$store.commit("responses/saveAnswer", this.value);
      return id;
    }
  }
};
</script>
<template>
  <widget-wrapper widgettype="pc-draw-label" :wid="wid">
    <label for="labeltext">Label:<br/></label>
    <textarea
      id="labeltext"
      @input="input($event)"
      placeholder="Label Text"
      :onblur="updateLabel"
      cols="20"
      rows="1"
    >
    </textarea>
    <br />
    <canvas id="label-canvas" width="800" height="600"></canvas>
    <pc-download-image title="Download Image" :stage="stage">
    </pc-download-image>
  </widget-wrapper>
</template>
<style lang="scss" scoped>
.widget[widgettype="pc-draw-label"] {
  padding: 5px;
  background: white;
  font-size: 14px;
}

#labeltext {
  width: 200px;
  height: 20px;
}
#labeltext:focus {
  border-color: blue;
}
</style>
