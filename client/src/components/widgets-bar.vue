<script>
import { mapGetters } from "vuex";
export default {
  name: "widgets-bar",
  props: ["layer", "barStyle", "event"],
  methods: {
    addWidget: function(type) {
      this.$emit("hide");
      let info = {
        type: type,
        layer: this.layer,
        left: this.event.pageX,
        top: this.event.pageY - 80,
        props: {}
      };
      this.$store.commit("addNewWidget", info);
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
      @click="addWidget(widget.type)"
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
  max-width: 400px;
  white-space: nowrap;
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
