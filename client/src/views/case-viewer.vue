<script>
import eventBus from "@/main";
import PhaseBar from "@/views/phase-bar.vue";
import PropertyDrawer from "@/views/property-drawer.vue";
import PhaseViewer from "@/views/phase-viewer.vue";
import SubmitBar from "@/views/submit-bar.vue";
import { mapGetters } from "vuex";
export default {
  name: "CaseViewer",
  components: {
    PhaseBar,
    PhaseViewer,
    PropertyDrawer,
    SubmitBar
  },
  data: function() {
    return {
      url: "",
      pdf: null
    };
  },
  mounted() {
    eventBus.$on("loadDocument", info => this.loadDocument(info));
  },
  methods: {
    loadDocument(info) {
      this.url = info.url;
      import("pdfjs-dist/webpack").then(pdfjs => {
        this.$store.commit("setDefaultState");
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
    <PhaseBar></PhaseBar>
    <div id="phase-container">
      <PhaseViewer
        v-for="(phase, index) in getPhases"
        :pdf="getPDF"
        :pindex="index"
        :scale="1.0"
        :key="phase.id"
      />
    </div>
    <PropertyDrawer v-if="currentRole == 'designer' && hasPhases">
    </PropertyDrawer>
    <SubmitBar></SubmitBar>
  </div>
</template>
}
<style lang="scss" scoped>
@import "../../node_modules/pdfjs-dist/web/pdf_viewer.css";
#case-viewer {
  position: relative;
  flex: 2 1 auto;
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
