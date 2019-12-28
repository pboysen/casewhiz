<script> 
export default {
  name: "ListBar",
  props: ["barStyle"],
  methods: {
    makeList: function(type, event) {
      console.log(type, event);
      this.$emit("hide");
    }
  },
  computed: {
    listWidgets() {
      var selected = [];
      this.$store.getters.selectedWidgets.forEach(w => {
        if (w.childType) selected.push(w);
      });
      return selected;
    }
  }
};
</script>

<template>
  <div id="listBar" :style="barStyle">
    <img
      class="widgetOption"
      v-for="widget in listWidgets"
      :src="require(`@/assets/img/${widget.src}`)"
      :key="widget.type"
      :title="widget.type"
      @click="makeList(widget.type, $event)"
    />
  </div>
</template>

<style lang="scss" scoped>
#listBar {
  display: inline-block;
  position: absolute;
  padding: 0 2px 4px 2px;
  height: 22px;
  min-width: 50px;
  white-space: nowrap;
  overflow-x: visible;
  border-radius: 5px;
  border: 1px solid gray;
  background-color: lightblue;
  z-index: 10;
}
.widgetOption {
  font-size: 14px;
  vertical-align: middle;
  padding: 2px;
  cursor: pointer;
}
</style>
