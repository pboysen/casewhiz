<script>
import WidgetWrapper from "@/views/widgets/widget-wrapper.vue";
import { mapGetters } from "vuex";
export default {
  name: "Carryforward",
  data: function() {
    return {
      wid: this.$options.wdata.wid
    };
  },
  components: {
    WidgetWrapper
  },
  computed: {
    ...mapGetters(["currentRole"]),
    carryforward() {
      var sources = this.$store.getters.sources(this.wid);
      return this.$store.getters["responses/combineAnswers"](sources);
    },
    isStudent() {
      return this.currentRole === "student";
    }
  }
};
</script>
<template>
  <WidgetWrapper widgettype="carryforward">
    <div :class="['carryforward', { student: isStudent }]">
      {{ carryforward }}
    </div>
  </WidgetWrapper>
</template>

<style lang="scss">
.widget[widgettype="carryforward"] {
  background-color: white;
}
.carryforward {
  cursor: grab;
  min-width: 100px;
  min-height: 24px;
  resize: both;
  overflow: auto;
  font-size: $txt-font;
  border: 1px dashed black;
}
.carryforward.student {
  cursor: pointer;
  border: 0;
  resize: none;
}
</style>
