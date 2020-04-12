<script>
import { PDFLinkService, PDFFindController } from "pdfjs-dist/webpack";
import {
  PDFPageView,
  DefaultTextLayerFactory,
  DefaultAnnotationLayerFactory
} from "pdfjs-dist/web/pdf_viewer";
import widgetsBar from "@/views/widgets/widgets-bar.vue";
import { mapGetters } from "vuex";

export default {
  name: "phase-viewer",
  components: { widgetsBar },
  props: {
    pdf: Object,
    pindex: Number,
    scale: Number
  },
  data: function() {
    return {
      viewport: null,
      page: null,
      isLoaded: false,
      widgetLayer: null,
      barStyle: "",
      event: event,
      showMenu: false
    };
  },
  methods: {
    getPhase() {
      if (this.pdf) {
        var container = this.$el.firstChild;
        while (container.lastChild) container.removeChild(container.lastChild);
        var that = this;
        that.isLoaded = true;
        this.pdf.getPage(this.pindex + 1).then(function(pdfPage) {
          that.page = pdfPage;
          const viewport = new PDFPageView({
            container: container,
            id: that.pindex + 1,
            scale: that.scale,
            defaultViewport: pdfPage.getViewport({ scale: that.scale }),
            linkService: PDFLinkService,
            findController: PDFFindController,
            textLayerFactory: new DefaultTextLayerFactory(),
            annotationLayerFactory: new DefaultAnnotationLayerFactory(),
            renderInteractiveForms: false
          });
          viewport.setPdfPage(pdfPage);
          viewport.draw();
          viewport.div.lastChild.onmouseup = that.textSelect;
          that.widgetLayer = document.createElement("div");
          that.widgetLayer.id = "widgetLayer";
          viewport.div.appendChild(that.widgetLayer);
          that.$store.dispatch("displayWidgets", {
            phase: that.pindex,
            layer: that.widgetLayer
          });
        });
      }
    },
    textSelect() {
      var selection = window.getSelection();
      this.$root.$emit("textSelected", selection);
    },
    highlight() {
      //var selection = window.getSelection();
      //var range = selection.getRange(0);
      //var range = document.createRange();
      //range.selectNodeContents(element);
      //selection.removeAllRanges();
      //selection.addRange(range);
    },
    // o
    // ▪
    handleClick(e) {
      if (!this.showMenu && e.ctrlKey) {
        if (!this.widgetLayer) this.widgetLayer = e.target;
        this.event = e;
        switch (e.target.textContent) {
          case "•": {
            this.$store.commit("addNewWidget", {
              type: "multiple-choice",
              layer: this.widgetLayer,
              left: e.target.offsetLeft - 15,
              top: e.target.offsetTop
            });
            break;
          }
          case "▪": {
            this.$store.commit("addNewWidget", {
              type: "check-list",
              layer: this.widgetLayer,
              left: e.target.offsetLeft - 22,
              top: e.target.offsetTop - 8
            });
            break;
          }
          default: {
            this.showMenu = true;
            this.barStyle = `left: ${e.pageX - 50}px; top: ${e.pageY - 120}px;`;
            break;
          }
        }
      } else {
        this.showMenu = false;
        this.barStyle = "";
      }
    },
    hide() {
      this.showMenu = false;
    }
  },
  computed: {
    ...mapGetters(["currentRole", "currentPhase"]),
    isCurrentPhase() {
      if (this.currentPhase == this.pindex) {
        if (!this.isLoaded) this.getPhase();
        return true;
      } else return false;
    }
  }
};
</script>
<template>
  <div class="phase-wrapper" v-show="isCurrentPhase">
    <div
      class="viewer-container"
      @click="handleClick($event)"
      @drop.stop.prevent
      @dragover.stop.prevent
    >
      <div class="page">
        <div id="widgetLayer"></div>
      </div>
    </div>
    <div v-if="currentRole === 'designer'">
      <widgets-bar
        v-if="showMenu"
        :layer="widgetLayer"
        :barStyle="barStyle"
        :event="event"
        @hide="hide"
      >
      </widgets-bar>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.phase-wrapper {
  position: relative;
  width: 100%;
}
.viewer-container {
  min-height: 270px;
}
#widgetLayer {
  position: relative;
  left: 0;
  top: 0;
  line-height: 16px;
  width: 100%;
  height: 100%;
  display: block;
}
</style>
