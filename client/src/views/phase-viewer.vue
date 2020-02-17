<script>
import { PDFLinkService, PDFFindController } from "pdfjs-dist/webpack";
import {
  PDFPageView,
  DefaultTextLayerFactory,
  DefaultAnnotationLayerFactory
} from "pdfjs-dist/web/pdf_viewer";
import WidgetsBar from "@/views/widgets/widgets-bar.vue";
import eventBus from "@/main";
import { mapGetters } from "vuex";

export default {
  name: "PhaseViewer",
  components: { WidgetsBar },
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
      showMenu: false
    };
  },
  mounted() {
    if (this.pindex == 0) {
      this.$store.commit("setCurrentPhase", 0);
      this.getPhase();
    }
  },
  methods: {
    getPhase() {
      if (this.pdf) {
        var container = this.$el.firstChild;
        while (container.lastChild) container.removeChild(container.lastChild);
        var that = this;
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
          that.widgetLayer.className = "widgetLayer";
          viewport.div.appendChild(that.widgetLayer);
          that.isLoaded = true;
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
        switch (e.target.textContent) {
          case "•": {
            this.$store.commit("addNewWidget", {
              wid: null,
              type: "multiplechoice",
              layer: this.widgetLayer,
              event: event,
              left: event.pageX - 30,
              top: event.pageY - 100
            });
            break;
          }
          case "▪": {
            this.$store.commit("addNewWidget", {
              wid: null,
              type: "checklist",
              layer: this.widgetLayer,
              event: event,
              left: event.pageX - 30,
              top: event.pageY - 100
            });
            break;
          }
          default: {
            this.showMenu = true;
            eventBus.$emit("widgetBarMoved", e);
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
        <div class="widgetLayer"></div>
      </div>
    </div>
    <div v-if="currentRole === 'designer'">
      <WidgetsBar
        v-if="showMenu"
        :layer="widgetLayer"
        :barStyle="barStyle"
        @hide="hide"
      >
      </WidgetsBar>
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
.widgetLayer {
  position: relative;
  left: 0;
  top: 0;
  line-height: 16px;
  width: 100%;
  height: 100%;
  display: block;
}
</style>
