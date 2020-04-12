<script>
import widgetWrapper from "@/views/widgets/widget-wrapper.vue";
import { mapGetters } from "vuex";
export default {
  name: "image-widget",
  props: {
    wid: Number
  },
  data: function() {
    return {
      dropped: false
    };
  },
  components: {
    widgetWrapper
  },
  computed: {
    ...mapGetters(["widgetIsLocked", "currentRole", "currentPhase"])
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
      reader.readAsArrayBuffer(file);
    },
    handleMenu(e) {
      let r = this.$el.getBoundingClientRect();
      let right = r.left + window.scrollX + this.$el.offsetWidth;
      let top = r.top + window.scrollY;
      if (e.pageY > top && e.pageY < top + 16) {
        if (e.pageX > right - 32 && e.pageX < right - 16) this.rotateImage();
        else if (e.pageX > right - 16 && e.pageX < right) this.removeImage();
      }
    },
    rotateImage() {
      let img = document.getElementById("answerImage");
      let answer = this.$store.getters["responses/getAnswer"](this.wid);
      let canvas = document.createElement("canvas");
      let [w, h] = [this.$el.offsetWidth, this.$el.offsetHeight];
      canvas.width = w;
      canvas.height = h;
      let context = canvas.getContext("2d");
      context.save();
      context.translate(w / 2, h / 2);
      context.rotate((90 * Math.PI) / 180);
      context.drawImage(img, -w / 2, -h / 2);
      img.src = canvas.toDataURL(answer.type);
      context.restore();
      this.$store.commit("responses/saveAnswer", {
        wid: this.wid,
        value: img.src,
        type: answer.type
      });
    },
    removeImage() {
      let img = document.getElementById("answerImage");
      img.src = "";
      this.$store.commit("responses/saveAnswer", {
        wid: this.wid,
        value: "",
        type: ""
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
        context.drawImage(newImg, 0, 0, zoneWidth, newHeight);
        let img = document.getElementById("answerImage");
        img.src = canvas.toDataURL(fileType);
        that.dropped = true;
        that.$store.commit("responses/saveAnswer", {
          wid: that.wid,
          value: img.src,
          type: fileType
        });
      };
    }
  }
};
</script>
<template>
  <widget-wrapper widgettype="image-widget" :wid="wid">
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
      @click="handleMenu($event)"
    >
      <img id="answerImage" src="" />
    </div>
  </widget-wrapper>
</template>
<style lang="scss" scoped>
.widget {
}
.drop_zone {
  width: 100px;
  height: 100px;
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
  content: url(../../assets/img/image-menu.png);
}
</style>
