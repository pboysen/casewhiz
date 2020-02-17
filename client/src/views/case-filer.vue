<script>
import eventBus from "@/main";

export default {
  name: "CaseFiler",
  data: function() {
    return {
      currentFile: "",
      menu: ""
    };
  },
  mounted() {
    eventBus.$on("loadDefault", url => this.getCaseFile(url));
  },
  methods: {
    importIt(e) {
      e.stopPropagation();
      e.preventDefault();
      var msg = this.dropHandler(e, function(newstate) {
        this.$store.commit("setState", newstate);
      });
      var err = document.getElementById("droperror");
      if (msg.length == 0) {
        this.menu = "";
        err.style.display = "none";
      } else {
        err.innerHTML = msg;
        err.style.display = "block";
      }
    },
    dropHandler(e) {
      var files = [];
      if (e.dataTransfer.items) {
        for (var i = 0; i < e.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (e.dataTransfer.items[i].kind === "file") {
            files.push(e.dataTransfer.items[i].getAsFile());
          }
        }
      }
      if (files.length == 1) {
        var file = files[0];
        if (file.type === "application/pdf") this.getPDFFile(file);
        else if (
          file.type === "application/case" ||
          file.name.endsWith(".case")
        )
          this.getCaseFile(file);
        else return "Only PDF and CASE files can be read.";
      } else return "Please drop only one file.";
      return "";
    },
    getPDFFile(file) {
      this.currentFile = file;
      eventBus.$emit("loadDocument", {
        url: file.name,
        cb: function setCaseState() {
          this.$store.commit("setCurrentPhase", 0);
        }
      });
    },
    getCaseFile(file) {
      this.currentFile = file;
      this.getFileBlob(file, function(blob) {
        var view = new DataView(blob);
        var len = view.getUint32(0);
        var reader = new FileReader();
        var that = this;
        reader.onload = function() {
          var caseState = JSON.parse(reader.result);
          reader.onload = function() {
            eventBus.$emit("loadDocument", {
              url: reader.result,
              cb: function setCaseState() {
                that.$store.commit("resetState", caseState);
              }
            });
          };
          var pdfData = new Blob([blob.slice(len + 4)]);
          reader.readAsDataURL(pdfData);
        };
        reader.readAsText(new Blob([blob.slice(4, len + 4)]));
      });
    },
    getFileBlob(file, cb) {
      var reader = new FileReader();
      reader.onload = function() {
        cb(reader.result);
      };
      reader.readAsArrayBuffer(file);
    },
    publishIt() {
      var input = document.getElementById("publishFile");
      var msg = this.publish(input.value);
      var err = document.getElementById("puberror");
      if (msg === "") {
        this.menu = "";
        err.style.display = "none";
      } else {
        err.innerHTML = msg;
        err.style.display = "block";
      }
    },
    publish(fileName) {
      if (!this.currentFile) return "Import a file first.";
      if (fileName === "") return "Enter a file name.";
      var that = this;
      this.getFileBlob(this.currentFile, function(blob) {
        var json = that.$store.getters.copyState;
        var lenBuffer = new ArrayBuffer(4);
        var view = new DataView(lenBuffer);
        view.setUint32(0, json.length);
        var url = URL.createObjectURL(
          new Blob([lenBuffer, json, blob], { type: "application/case" })
        );
        var a = document.createElement("a");
        a.href = url;
        a.download = fileName + ".case";
        a.click();
        URL.revokeObjectURL(a.href);
        return "";
      });
    }
  }
};
</script>

<template>
  <div id="files">
    <button @click="menu = 'import'">Import</button>
    <button @click="menu = 'publish'">Publish</button>
    <div id="import" v-if="this.menu === 'import'">
      <div id="drop_zone" @drop.stop.prevent="importIt" @dragover.prevent>
        <p>Drop your PDF or CASE file here.</p>
      </div>
      <div class="error" id="droperror"></div>
      <button class="cancel" @click="menu = ''">Cancel</button>
    </div>
    <div id="publish" v-if="this.menu === 'publish'">
      Enter the name of the file to save.
      <br />
      <br />
      <input
        type="text"
        id="publishFile"
        size="10"
        placeholder="Filename to publish"
      />.case
      <div class="error" id="puberror"></div>
      <button class="publish" @click="publishIt">Publish</button>
      <button class="cancel" @click="menu = ''">Cancel</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#files {
  float: right;
  display: inline-block;
  margin-right: 20px;
  z-index: 10;
}
#files button {
  cursor: pointer;
  font-size: $small-font;
  margin: 4px;
}
#files button:hover {
  color: $select-color;
}
#import {
  position: absolute;
  top: 100px;
  left: 200px;
  width: 400px;
  height: 50%;
  color: black;
  font-size: $txt-font;
  background-color: $bg-menu-color;
  padding: 4px;
  margin: 0;
  border: 1px solid $border-color;
  z-index: 5;
  p {
    text-align: center;
  }
}
#publish {
  position: absolute;
  top: 150px;
  left: 150px;
  width: 300px;
  height: 120px;
  color: black;
  border: 1px solid $border-color;
  font-size: $txt-font;
  background-color: $bg-color;
  padding: 10px;
  z-index: 5;
  text-align: left;
}
#publish input[type="text"] {
  font-size: $txt-font;
  border-radius: 0;
}
#drop_zone {
  display: block;
  font-size: 12px;
  border: 1px solid $border-color;
  color: black;
  font-size: $txt-font;
  margin: 0;
  background-color: white;
  width: 100%;
  height: 70%;
}
.error {
  display: none;
  height: 20px;
  font-size: 12px;
  margin: 4px;
  border: 1px solid $bg-color;
  padding: 2px;
  margin: 4px;
  font-size: $txt-font;
  background: yellow;
  color: $txt-color;
}
.cancel {
  position: absolute;
  bottom: 5px;
  right: 5px;
}
.publish {
  position: absolute;
  bottom: 5px;
  left: 5px;
}
</style>
