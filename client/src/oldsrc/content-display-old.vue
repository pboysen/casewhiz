<script>
import WidgetsBar from "@/views/widgets/widgets-bar.vue";
import ListBar from "@/views/widgets/list-bar.vue";
import eventBus from "@/main";
import { mapGetters } from "vuex";

export default {
  name: "ContentDisplay",
  components: {
    WidgetsBar,
    ListBar
  },
  data: function() {
    return {
      barStyle: "",
      menuType: "none"
    };
  },
  methods: {
    handleClick(e) {
      if (this.menuType === "none" && e.ctrlKey) {
        this.menuType = e.target.textContent === "•" ? "list" : "widget";
        eventBus.$emit("widgetBarMoved", e);
        this.barStyle = " left:" + (e.pageX - 50) + "px;";
        this.barStyle += " top:" + (e.pageY - 40) + "px;";
      } else {
        this.menuType = "none";
        this.barStyle = "";
      }
    },
    hide() {
      this.menuType = "none";
    }
  },
  computed: {
    ...mapGetters(["currentRole"])
  }
};
</script>

<template>
  <div id="content-display">
    <div
      id="viewerWrapper"
      @click="handleClick($event)"
      @drop.stop.prevent
      @dragover.stop.prevent
    >
      <div id="viewerContainer">
        <div id="widgetLayer"></div>
      </div>
    </div>
    <div v-if="currentRole === 'designer'">
      <WidgetsBar
        v-if="menuType === 'widget'"
        :barStyle="barStyle"
        @hide="hide"
      >
      </WidgetsBar>
      <ListBar v-if="menuType === 'list'" :barStyle="barStyle" @hide="hide">
      </ListBar>
    </div>
  </div>
</template>
<style lang="scss" scoped>
#content-display {
  position: relative;
  width: 100%;
  min-height: 280px;
  background-color: white;
  overflow: hidden;
}
#widgetLayer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: block;
  overflow: hidden;
}
</style>
