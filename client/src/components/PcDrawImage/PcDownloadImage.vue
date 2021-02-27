<script>
export default {
  props: {
    title: String,
    stage: Object
  },
  methods: {
    download() {
      let a = document.getElementById("download");
      let dt = this.stage.canvas.toDataURL("image/png");
      /* Change MIME type to trick the browser to download the file
      instead of displaying it */
      dt = dt.replace(/^data:image\/[^;]*/, "data:application/octet-stream");
      /* In addition to <a>'s "download" attribute,
      you can define HTTP-style headers */
      dt = dt.replace(
        /^data:application\/octet-stream/,
        "data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename=image.png"
      );
      a.href = dt;
    }
  }
};
</script>
<template>
  <div id="dnldiv">
    <a
      id="download"
      href="assets/remove.png"
      download="image.png"
      @click="download"
    >
      <button type="button">{{ title }}</button>
    </a>
  </div>
</template>
<style lang="scss" scoped>
#dnldiv {
  text-align: center;
  margin-top: 10px;
}
</style>
