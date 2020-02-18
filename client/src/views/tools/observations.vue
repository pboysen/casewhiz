<script>
import InplaceEditor from "@/views/inplace-editor.vue";
import { mapGetters } from "vuex";
export default {
  name: "Observations",
  components: {
    InplaceEditor
  },
  created() {
    this.$store.commit("installTool", { tool: "observations", value: [] });
  },
  mounted() {
    this.$root.$on("textSelected", selection => {
      var text = selection.toString();
      if (
        this.$store.getters.currentTool === "Observations" &&
        text.length > 0
      ) {
        this.$store.commit("addObservation", text);
      }
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
      <InplaceEditor :obs="obs"></InplaceEditor>
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
  border-radius: 4px;
  width: 98%;
  opacity: 70%;
  padding: 2px;
  min-height: 20px;
  margin: 1px;
  font-size: $small-font;
  border: 1px solid $border-color;
}
.observationHelp {
  width: 100%;
  font-size: $small-font;
  margin-left: 10px;
  padding: 2px;
  z-index: 1;
}
</style>
