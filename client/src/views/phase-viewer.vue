<script>
import PropertyDrawer from "@/views/property-drawer.vue";
export default {
  name: "PhaseViewer",
  components: {
    PropertyDrawer
  },
  data: function() {
    return {
      selected: null,
      start: 1,
      end: 3,
      inc: 3,
      phases: [
        {
          id: "1",
          title: "phase1",
          submit: "Submit"
        },
        {
          id: "2",
          title: "phase2",
          submit: "Submit"
        },
        {
          id: "3",
          title: "phase3",
          submit: "Submit"
        }
      ]
    };
  },
  methods: {
    scrollLeft: function() {
      this.start = this.start - this.inc < 1 ? 1 : this.start - this.inc;
    },
    scrollRight: function() {
      this.start =
        this.start + this.inc > this.end
          ? this.end - this.inc
          : this.start + this.inc;
    }
  }
};
</script>

<template>
  <div id="phase-content">
    <div id="phase-bar">
      <a id="left-phase"><img src="@/assets/img/triangle.png"/></a>
      <button
        v-for="phase in phases"
        :key="phase.id"
        @click="selected = phase"
        :class="['phase-button', { active: selected === phase }]"
      >
        {{ phase.title }}
      </button>
      <a id="right-phase"><img src="@/assets/img/triangle.png"/></a>
    </div>
    <PropertyDrawer></PropertyDrawer>
  </div>
</template>

<style lang="scss" scoped>
#phase-content {
  display: inline-block;
  float: left;
  width: 70%;
  height: 100%;
  padding: 0px;
}
#phase-bar {
  display: block;
  width: 100%;
  height: 24px;
  vertical-align: middle;
  background-color: lightblue;
  padding: 2px 0 2px 0;
  overflow: none;
  border-bottom: 1px solid gray;
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
#left-phase {
  cursor: pointer;
  margin: 0 5px 5px 5px;
  background-color: lightblue;
  float: left;
  transform: rotate(-90deg);
}
#right-phase {
  cursor: pointer;
  margin: 0 5px 5px 5px;
  background-color: lightblue;
  float: right;
  transform: rotate(90deg);
}
</style>
