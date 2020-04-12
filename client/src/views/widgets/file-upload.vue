<script>
import widgetWrapper from "@/views/widgets/widget-wrapper.vue";
import { mapGetters } from "vuex";
export default {
  name: "file-upload",
  props: {
    wid: Number,
    title: String,
    fileTypes: Array,
    multiple: Boolean
  
  },
  components: {
    widgetWrapper
  },
  computed: {
    ...mapGetters(["currentRole", "currentPhase"]),
    isDesigner() {
      return this.currentRole === "designer";
    },
    uploadFile() {

    },
    fileTypesString() {
      return ""
    }
  },
  methods: {
  }
};
</script>
<template>
  <widget-wrapper widgettype="file-upload" :wid="wid">
    <label for="file_upload">{{ label }}</label>
    <input
      id="file_upload"
      type="file"
      :class="['file-upload', { student: isStudent }]"
      :accept="filetypes"
      @change="uploadFile"
    />
  </widget-wrapper>
</template>
<style lang="scss">
input {
  opacity: 0;
}
label {
  cursor: pointer;
  font-size: $small-font;
  margin: 4px;
  border-radius: 4px;
  background-color: $bg-menu-color;
}
label:hover {
  color: $select-color;
}
.widget.student label {
  cursor: text;
}
</style>
