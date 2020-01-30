<script>
import eventBus from "@/main";
import PhaseBar from "@/views/phase-bar.vue";
import PropertyDrawer from "@/views/property-drawer.vue";
import PhaseViewer from "@/views/phase-viewer.vue";
export default {
  name: "CaseViewer",
  components: {
    PhaseBar,
    PhaseViewer,
    PropertyDrawer
  },
  data: function() {
    return {
      url: "",
      pdf: null,
      case: this.$store.state
    };
  },
  mounted() {
    eventBus.$on("loadDocument", url => this.getCase(url));
    //eventBus.$on("textSelected", url => console.log(url));
  },
  methods: {
    getCase(url) {
      this.url = url;
      this.$store.commit("setCurrentPhase", 0);
      import("pdfjs-dist/webpack").then(pdfjs => {
        var loadingTask = pdfjs.getDocument(url);
        loadingTask.promise.then(pdf => {
          this.pdf = pdf;
          this.case = JSON.parse(localStorage.getItem(url));
          if (!this.case) this.case = this.getNewCase(url, pdf.numPages);
          this.$store.commit("setState", this.case);
        });
      });
    },
    getNewCase(url, nphases) {
      var phases = [];
      for (var i = 0; i < nphases; i++)
        phases.push({
          id: i,
          title: "phase " + (i + 1),
          submit: "Submit",
          widgets: {},
          tools: {}
        });
      return {
        filename: url,
        wcnt: 1,
        role: "designer",
        phase: 0,
        tool: 0,
        widget: null,
        selectedWidgetTypes: [
          "textfield",
          "textarea",
          "select",
          "carryforward",
          "media"
        ],
        selectedToolTypes: ["Resources", "Comments", "Observations"],
        phases: phases
      };
    }
  },
  computed: {
    getPDF() {
      return this.pdf;
    }
  }
};
</script>
<template>
  <div id="case-viewer">
    <PhaseBar></PhaseBar>
    <div id="phase-container">
      <PhaseViewer
        v-for="(phase, index) in this.case.phases"
        :pdf="getPDF"
        :pindex="index"
        :scale="1.0"
        :key="phase.id"
      />
    </div>
    <PropertyDrawer></PropertyDrawer>
  </div>
</template>
}
<style lang="scss" scoped>
@import "../../node_modules/pdfjs-dist/web/pdf_viewer.css";
#case-viewer {
  flex: 2 1 auto;
  height: 100%;
  min-width: 80%;
  border-right: 1px solid $border-color;
}
#phase-container {
  position: relative;
}
</style>
