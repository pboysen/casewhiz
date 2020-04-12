<script>
import eventbus from "@/main";
import phaseBar from "@/views/phase-bar.vue";
import propertyDrawer from "@/views/property-drawer.vue";
import phaseViewer from "@/views/phase-viewer.vue";
import submitBar from "@/views/submit-bar.vue";
import { mapGetters } from "vuex";
export default {
  name: "case-viewer",
  components: {
    phaseBar,
    phaseViewer,
    propertyDrawer,
    submitBar
  },
  data: function() {
    return {
      url: "",
      pdf: null
    };
  },
  mounted() {
    eventbus.$on("loadDocument", info => this.loadDocument(info));
  },
  methods: {
    loadDocument(info) {
      this.url = info.url;
      this.$store.dispatch("setDefaultState");
      import("pdfjs-dist/webpack").then(pdfjs => {
        let loadingTask = pdfjs.getDocument(info.url);
        loadingTask.promise.then(pdf => {
          this.pdf = pdf;
          info.setState(pdf, this.url);
        });
      });
    }
  },
  computed: {
    ...mapGetters(["currentRole", "currentPhase", "getPhases"]),
    getPDF() {
      return this.pdf;
    },
    hasPhases() {
      return this.getPhases.length > 0 && this.currentPhase > -1;
    }
  }
};
</script>
<template>
  <div id="case-viewer">
    <phase-bar></phase-bar>
    <div id="phase-container">
      <phase-viewer
        v-for="(phase, index) in getPhases"
        :pdf="getPDF"
        :pindex="index"
        :scale="1.0"
        :key="phase.id"
      />
    </div>
    <property-drawer v-if="currentRole == 'designer' && hasPhases">
    </property-drawer>
    <submit-bar></submit-bar>
  </div>
</template>
}
<style lang="scss" scoped>
@import "../../node_modules/pdfjs-dist/web/pdf_viewer.css";
#case-viewer {
  position: relative;
  flex: 1 1 auto;
  height: 100%;
  min-height: 350px;
  min-width: 70%;
  border-right: 1px solid $border-color;
}
#phase-container {
  position: relative;
  height: 100%;
}
</style>
