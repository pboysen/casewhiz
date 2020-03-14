<script>
import WidgetWrapper from "@/views/widgets/widget-wrapper.vue";
import { mapGetters } from "vuex";
export default {
  name: "ImageAnswer",
  data: function() {
    return {
      wid: this.$options.wdata.wid
    };
  },
  components: {
    WidgetWrapper
  },
  computed: {
    ...mapGetters(["widgetIsLocked", "currentRole"]),
    value() {
      return this.$store.getters["responses/getAnswer"](this.wid);
    },
    isStudent() {
      return this.currentRole === "student";
    }
  },
  methods: {
    click(e) {
      if (!this.isStudent) e.preventDefault();
    },
    saveImage() {
      let input = document.getElementById("image_input");
      let img = document.getElementById("image_preview");
      if (input.files && input.files[0]) {
        const reader = new FileReader();
        let that = this;
        reader.onload = function(e) {
          img.src = e.target.result;
          that.$store.commit("responses/saveAnswer", {
            wid: this.wid,
            value: e.target.result
          });
        };
        reader.readAsDataURL(input.files[0]);
      }
    }
  }
};
</script>
<template>
  <WidgetWrapper widgettype="image-answer">
    <div>
      <label for="image_input" @click="click($event)"
        >Upload photo answer
        <input
          id="image_input"
          type="file"
          accept="image/*"
          :readonly="widgetIsLocked"
          @change="saveImage"
        />
      </label>
      <div>
        <img id="image_preview" :src="value" />
      </div>
    </div>
  </WidgetWrapper>
</template>
<style lang="scss" scoped>
.widget {
  padding: 4px;
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  label {
    cursor: grab;
    font-size: $txt-font;
  }
  img {
    pointer-events: none;
    margin: 4px;
  }
}
.widget.student {
  label {
    cursor: pointer;
    font-size: $txt-font;
  }
  label:hover {
    color: $select-color;
  }
}
</style>
