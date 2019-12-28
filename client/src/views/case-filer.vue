<script>
import { dropHandler, publish } from "@/util/pdflib.js";

export default {
  name: "CaseFiler",
  data: function() {
    return {
      showImport: false,
      showPublish: false
    };
  },
  methods: {
    dropHandler: function(e) {
      e.stopPropagation();
      e.preventDefault();
      var msg = dropHandler(e, function(newstate) {
        console.log(newstate);
        //this.$store.mutations.setState(newstate);
      });
      var err = document.getElementById("droperror");
      if (msg.length == 0) {
        this.showImport = false;
        err.style.display = "none";
      } else {
        err.innerHTML = msg;
        err.style.display = "block";
      }
    },
    publish() {
      var input = document.getElementById("publishFile");
      var msg = publish(input.value);
      var err = document.getElementById("puberror");
      if (msg.length == 0) {
        this.showPublish = false;
        err.style.display = "none";
      } else {
        err.innerHTML = msg;
        err.style.display = "block";
      }
    }
  }
};
</script>

<template>
  <div id="files">
    <button @click="showImport = !showImport">Import</button>
    <button @click="showPublish = !showPublish">Publish</button>
    <div id="import" v-if="showImport">
      <div id="drop_zone" @drop.stop.prevent="dropHandler" @dragover.prevent>
        Drop your PDF or CASE file here.<br />
        Click Import again to cancel.
      </div>
      <div class="error" id="droperror"></div>
    </div>
    <div id="export" v-if="showPublish">
      <br />
      <p>
        Enter the name of the file to save. It will be saved as a .case file.
        Click Publish again to cancel.
      </p>
      <p>
        <input
          type="text"
          id="publishFile"
          size="10"
          placeholder="Filename to publish"
        />
        <b>.case</b>
      </p>
      <div class="error" id="puberror"></div>
      <div class="buttonBar">
        <button @click="publish()">Publish</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
#files {
  float: right;
  margin-right: 20px;
}
#import {
  font-size: 14px;
  position: absolute;
  width: 300px;
  height: 300px;
  color: black;
  background-color: lightblue;
  top: 120px;
  left: 250px;
  padding: 10px;
  z-index: 5;
}
#export {
  font-size: 14px;
  position: absolute;
  width: 300px;
  height: 200px;
  color: black;
  background-color: lightblue;
  top: 120px;
  left: 250px;
  padding: 10px;
  z-index: 5;
  text-align: left;
}
#drop_zone {
  font-size: 12px;
  border: 2px dashed lightblue;
  color: gray;
  background-color: white;
  width: 100%;
  height: 80%;
}
.error {
  font-size: 12px;
  margin: 4px;
  border: 1px solid gray;
  padding: 2px;
  margin: 4px;
  display: none;
  background: yellow;
  color: black;
  text-align: left;
}
.buttonBar {
  padding: 4px;
  margin: 15px;
  white-space: nowrap;
  box-sizing: border-box;
  text-align: center;
}
</style>
