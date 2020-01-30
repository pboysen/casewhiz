<script>
import eventBus from "@/main";
import Observation from "@views/tools/observation";
export default {
  name: "Observations",
  mounted() {
    eventBus.$on("textSelected", selection => console.log(text));
  },
  components: {
    Observation
  },
  computed: {
    observations() {
      return this$store.getters.observations();
    }
  }
};
</script>

<template>
  <div id="observations">
    <Observation
      vfor="observation in observations"
      :key="observation.id"
    >
    </Observation>
  </div>
</template>

<style lang="scss">
#observations {
  width: 95%;
  min-height: 300px;
  border: 1px solid $border-color;
}
</style>
