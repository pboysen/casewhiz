<script>
import PropertyDrawer from "@/views/property-drawer.vue";
import WidgetsBar from "@/views/widgets-bar.vue";
import ListBar from "@/views/list-bar.vue";
import { mapGetters } from "vuex";
import eventBus from "@/main";

export default {
  name: "PhaseViewer",
  components: {
    PropertyDrawer,
    WidgetsBar,
    ListBar
  },
  data: function() {
    return {
      left: 0,
      barStyle: "",
      menuType: "none"
    };
  },
  methods: {
    submit: function() {},
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
    },
    slide(dx) {
      const panel = document.getElementById("phase-panel");
      this.left += dx;
      panel.style.left = this.left + "px";
    }
  },
  computed: {
    ...mapGetters(["getPhases", "submitTitle", "currentPhase", "currentRole"])
  }
};
</script>

<template>
  <div id="phase-content">
    <div id="phase-bar">
      <div class="left-phase">
        <img
          src="@/assets/img/triangle.png"
          @click="slide(150)"
          :class="['left-img', { show: this.left < 0 }]"
        />
      </div>
      <div id="phase-panel">
        <button
          v-for="(phase, index) in getPhases"
          :key="phase.id"
          @click="currentPhase = index"
          :class="['phase-button', { active: currentPhase == index }]"
        >
          {{ phase.title }}
        </button>
      </div>
      <div class="right-phase">
        <img
          src="@/assets/img/triangle.png"
          @click="slide(-150)"
          :class="['right-img', { show: this.left > -800 }]"
        />
      </div>
    </div>
    <PropertyDrawer></PropertyDrawer>
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
    <div id="submit-panel">
      <button @click="submit">{{ submitTitle }}</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#phase-content {
  display: inline-block;
  float: left;
  width: 70%;
  height: 100%;
  padding: 0px;
  background-color: #eeeefe;
}
#phase-bar {
  display: block;
  width: 100%;
  height: 24px;
  vertical-align: middle;
  background-color: lightblue;
  padding: 2px 10px 2px 0;
  overflow: none;
  border-bottom: 1px solid gray;
}
#phase-panel {
  height: 24px;
  position: absolute;
  transition: left 0.3s ease;
  overflow: hidden;
}
.phase-button {
  min-width: 20px;
  font-size: 14px;
  padding: 4px 0px 0 4px;
  color: black;
  background-color: lightblue;
  border: 0;
  margin: 0px 0px 0 20px;
  cursor: pointer;
}
.phase-button:hover {
  background-color: #e6bbad;
}
.active {
  color: #fff;
}
.left-phase {
  position: relative;
  float: left;
  background-color: lightblue;
  width: 24px;
  height: 100%;
  display: flex;
  align-items: center; /* horizontal */
  justify-content: center; /* vertical */
  z-index: 2;
}
.left-img {
  visibility: hidden;
  transform: rotate(-90deg);
}
.right-phase {
  position: relative;
  float: right;
  background-color: lightblue;
  width: 24px;
  height: 100%;
  display: flex;
  align-items: center; /* horizontal */
  justify-content: center; /* vertical */
  z-index: 2;
}
.right-img {
  visibility: hidden;
  transform: rotate(90deg);
}
.hide {
  visibility: hidden;
}
.show {
  cursor: pointer;
  visibility: visible;
}
#viewerWrapper {
  height: 600px;
  background: white;
}
#viewerContainer {
  position: absolute;
  width: 100%;
  height: 100%;
  display: block;
  overflow: auto;
  background-color: white;
}
#widgetLayer {
  position: absolute;
  width: 100%;
  height: 100%;
  display: block;
  overflow: auto;
  z-index: 1;
}

#submit-panel {
  position: relative;
  width: 100%;
  height: 30px;
  top: 630px;
  display: block;
  text-align: center;
  background-color: lightblue;
  border: 1px solid gray;
}
#submit-panel button {
  border-radius: 5px;
  margin: 4px;
  background-color: white;
  cursor: pointer;
}
#submit-panel button:hover {
  background-color: #e6bbad;
}
</style>
