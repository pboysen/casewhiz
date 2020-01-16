<script>
import { mapGetters } from "vuex";

export default {
  name: "WidgetsBar",
  props: ["barStyle"],
  methods: {
    makeWidget: function(type, event) {
      this.$emit("hide");
      this.$store.commit("addWidget", { wid: null, type: type, event: event });
    }
  },
  computed: {
    ...mapGetters(["noListWidgets"])
  }
};
</script>

<template>
  <div id="widgetBar" :style="barStyle">
    <img
      class="widgetOption"
      v-for="widget in noListWidgets"
      :src="require(`@/assets/img/${widget.src}`)"
      :key="widget.type"
      :title="widget.type"
      @click="makeWidget(widget.type, $event)"
    />
  </div>
</template>

<style lang="scss" scoped>
#widgetBar {
  display: inline-block;
  position: absolute;
  padding: 0 2px 4px 2px;
  height: 22px;
  min-width: 100px;
  white-space: nowrap;
  overflow-x: visible;
  border-radius: 5px;
  border: 1px solid gray;
  background-color: $bg-color;
  z-index: 10;
}
.widgetOption {
  font-size: 14px;
  vertical-align: middle;
  padding: 2px;
  cursor: pointer;
}
</style>
