<script>
export default {
  name: "CaseFiler",
  components: {},
  data: function() {
    return {
      showImport: false,
      showExport: false
    };
  },
  methods: {
    dropHandler: function() {
      console.log(this.$root.$data.role);
    },
    dragOverHandler: function() {}
  }
};
</script>

<template>
  <div id="files">
    <button v-on:click="dropHandler">Import</button>
    <button v-on:click="showExport = true">Export</button>
  </div>
</template>

<style lang="scss">
#files {
  float: right;
  margin-right: 20px;
}

#files button {
  background-color: lightblue;
  border: 0;
  margin: 2px;
  cursor: pointer;
}
#files button:hover {
  background-color: #e6bbad;
}
#drop_zone {
  border: 2px dashed lightblue;
  background-color: white;
  width: 295px;
  height: 120px;
}
</style>
