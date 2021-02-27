<script>
import inplaceEditor from "@/components/inplace-editor.vue";
import { mapGetters } from "vuex";
export default {
  name: "observations-tool",
  components: {
    inplaceEditor
  },
  created() {
    this.$store.commit("installTool", { tool: "observations-tool", value: [] });
  },
  mounted() {
    this.$root.$on("textSelected", selection => {
      let text = selection.toString();
      if (
        this.$store.getters.currentTool === "observations-tool" &&
        text.length > 0
      )
        this.$store.commit("addObservation", text);
    });
  },
  computed: {
    ...mapGetters(["phaseObservations", "observations"])
  }
};
</script>

<template>
  <div class="observations">
    <div class="observation" v-for="obs in observations" :key="obs.id">
      <inplace-editor :obs="obs"></inplace-editor>
    </div>
    <ul class="observationHelp">
      <li>Swipe text at left to make an observation</li>
      <li>Click on triangle to toggle full display of text</li>
      <li>Edit, Save and Delete as needed</li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.observations {
  width: 95%;
  min-height: 300px;
  overflow: visible;
}
.observation {
  width: 98%;
  padding: 4px;
  min-height: 20px;
  margin: 4px;
  font-size: $small-font;
  border: 1px solid $border-color;
  border-radius: 4px;
}
.observationHelp {
  width: 100%;
  opacity: 70%;
  font-size: $small-font;
  margin-left: 10px;
  padding: 2px;
  z-index: 1;
}
</style>
