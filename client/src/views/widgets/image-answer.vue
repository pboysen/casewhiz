<script>
import WidgetWrapper from "@/views/widgets/widget-wrapper.vue";
import { mapGetters } from "vuex";
export default {
  name: "ImageAnswer",
  data: function() {
    return {
      wid: this.$options.wdata.wid,
      dropped: false
    };
  },
  components: {
    WidgetWrapper
  },
  computed: {
    ...mapGetters(["widgetIsLocked", "currentRole"])
  },
  methods: {
    dropHandler(e) {
      if (this.currentRole != "student") return;
      var files = [];
      if (e.dataTransfer.items) {
        for (var i = 0; i < e.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (e.dataTransfer.items[i].kind === "file") {
            files.push(e.dataTransfer.items[i].getAsFile());
          }
        }
      }
      if (files.length == 1) {
        var file = files[0];
        if (/^image\//i.test(file.type)) this.saveImage(file);
        else return "Only Images or Photos are permitted.";
      } else return "Please drop only one file.";
      return "";
    },
    saveImage(file) {
      const reader = new FileReader();
      reader.onload = () => this.processFile(reader.result, file.type);
      reader.readAsDataURL(file);
    },
    removeImage() {
      let img = document.getElementById("answerImage");
      img.src = "";
      this.$store.commit("responses/saveAnswer", {
        wid: this.wid,
        value: ""
      });
      this.dropped = false;
    },
    processFile(result, fileType) {
      let newImg = new Image();
      newImg.src = result;
      let that = this;
      newImg.onload = function() {
        let [width, height] = [newImg.width, newImg.height];
        let canvas = document.createElement("canvas");
        let zoneWidth = that.$el.offsetWidth;
        let newHeight = height * (zoneWidth / width);
        canvas.width = zoneWidth;
        canvas.height = newHeight;
        let context = canvas.getContext("2d");
        context.drawImage(this, 0, 0, zoneWidth, newHeight);
        let img = document.getElementById("answerImage");
        img.src = canvas.toDataURL(fileType);
        that.dropped = true;
        that.$store.commit("responses/saveAnswer", {
          wid: that.wid,
          value: img.src
        });
      };
    }
  }
};
</script>
<template>
  <WidgetWrapper widgettype="image-answer">
    <div
      v-show="!dropped || currentRole === 'designer'"
      id="drop_zone"
      @drop.stop.prevent="dropHandler($event)"
      @dragover.prevent
      :class="['drop_zone', { student: currentRole === 'student' }]"
    >
      <p>Drop your Photo or Image answer here.</p>
    </div>
    <div
      id="showImg"
      v-show="dropped && currentRole === 'student'"
      @click="removeImage($event)"
    >
      <img id="answerImage" src="" />
    </div>
  </WidgetWrapper>
</template>
<style lang="scss" scoped>
.widget {
}
.drop_zone {
  width: 400px;
  height: 300px;
  color: black;
  font-size: $txt-font;
  padding: 4px;
  margin: 0;
  border: 1px dashed $border-color;
  overflow: auto;
  resize: both;
}
.drop_zone.student {
  resize: none;
}
#showImg:hover::after {
  position: absolute;
  top: 0px;
  right: 0px;
  content: "X";
}
</style>
