<script>
import InplaceEditor from "@/views/inplace-editor.vue";
export default {
  name: "Observation",
  components: {
    InplaceEditor
  },
  props: {
    obs: Object
  },
  data: function() {
    return {
      edit: false
    };
  }
};
</script>

<template>
  <div class="observation">
    <InplaceEditor></InplaceEditor>
  </div>
</template>

<style lang="scss">
.observation {
  border-radius: 4px;
  width: 98%;
  padding: 2px;
  min-height: 20px;
  margin: 1px;
  font-size: $small-font;
  border: 1px solid $border-color;
}
.message {
}
.controls {
}
</style>
