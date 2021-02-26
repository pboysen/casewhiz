<script>
export default {
  name: "upload-button",
  props: {
    title: String,
    accept: Array,
    multiple: Boolean
  },
  computed: {
    acceptTypes() {
      let alist = "";
      this.accept.forEach(type => (alist += type + ","));
      return alist;
    }
  },
  methods: {
    uploadFile(e) {
      let files = e.target.files;
      let validFiles = [];
      for (let i = 0; i < files.length; i++)
        if (this.validFileType(files[i])) validFiles.push(files[i]);
      if (validFiles.length > 0) this.$emit("upload-files", validFiles);
    },
    validFileType(file) {
      return this.accept.includes(file.type);
    }
  }
};
</script>

<template>
  <div>
    <label for="file_upload">{{ title }}</label>
    <input
      id="file_upload"
      type="file"
      :accept="acceptTypes"
      @change="uploadFile($event)"
    />
  </div>
</template>

<style lang="scss" scoped>
input {
  opacity: 0;
}
label {
  cursor: pointer;
  font-size: $small-font;
  margin: 4px;
  border-radius: 4px;
  padding: 4px;
  border: 1px solid $border-color;
  background-color: $bg-color;
  white-space: nowrap;
}
label:hover {
  color: $select-color;
}
</style>
