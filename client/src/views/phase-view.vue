<script>
export default {
  name: "PhaseView",
  props: {
    phase: Object
  },
  methods: {
    submit: function() {
      console.log("submit");
    }
  }
};
</script>

<template>
  <div id="phase">
    <div id="viewerContainer">content goes here</div>
    <div class="submit-panel">
      <button @click="submit">{{ phase.submit }}</button>
    </div>
  </div>
</template>

<style lang="scss">
#phase {
  white-space: nowrap;
  height: 100%;
}
#viewerContainer {
  display: block;
  background-color: white;
  width: 100%;
  position: absolute;
  overflow: auto;
}
.submit-panel {
  display: block;
  text-align: center;
  background-color: lightblue;
  width: 100%;
  height: 30px;
}
.submit-panel button {
  border-radius: 5px;
  margin: 4px;
  background-color: white;
  cursor: pointer;
}
.submit-panel button:hover {
  background-color: #e6bbad;
}
</style>
