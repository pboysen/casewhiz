<script>
import widgetWrapper from "@/components/widget-wrapper.vue";
import uploadButton from "@/components/upload-button.vue";
import { mapGetters } from "vuex";
export default {
  name: "upload-widget",
  props: {
    wid: Number
  },
  data: function() {
    return {
      title: "Upload your File",
      accept: ["text/csv"],
      multiple: false
    };
  },
  components: {
    widgetWrapper,
    uploadButton
  },
  computed: {
    ...mapGetters(["currentRole", "currentPhase"]),
    isDesigner() {
      return this.currentRole === "designer";
    },
    isStudent() {
      return this.currentRole === "designer";
    }
  }
};
</script>
<template>
  <widget-wrapper widgettype="upload-widget" :wid="wid">
    <upload-button :title="title" :accept="accept" :multiple="multiple">
    </upload-button>
  </widget-wrapper>
</template>
<style lang="scss">
.widget[widgettype="upload-widget"] {
}
.widget.student label {
  cursor: text;
}
</style>
