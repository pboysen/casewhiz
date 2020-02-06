<script>
export default {
  name: "InplaceEditor",
  props: {
    obs: Object
  },
  data: function() {
    return {
      edit: false,
      rotate: false
    };
  },
  computed: {
    title() {
      return this.$store.getters.phaseTitleById(this.obs.phase);
    }
  },
  methods: {
    toggle() {
      this.edit = !this.edit;
    },
    rotateIt() {
      this.rotate = !this.rotate;
    },
    remove() {
      this.$store.commit("removeObservation", this.obs);
    },
    save() {
      let editor = document.getElementById("inplace-textarea");
      this.obs.text = editor.value;
      this.$store.commit("updateObservation", this.obs);
      this.toggle();
    }
  }
};
</script>
<template>
  <div class="inplace-editor">
    <div v-show="!edit">
      <div class="control-bar">
        <div class="title">{{ title }}</div>
        <div :class="['actions', { rotate: this.rotate }]">
          <img src="@/assets/img/triangle.png" alt="expand" @click="rotateIt" />
          <a @click="remove">Delete</a>&nbsp;<a @click="toggle">Edit</a>
        </div>
      </div>
      <div :class="['content', { rotate: this.rotate }]">
        {{ obs.text }}
      </div>
    </div>
    <div v-show="edit">
      <div>
        <div class="title">{{ title }}</div>
        <div class="actions">
          <a @click="toggle">Cancel</a>&nbsp;&nbsp;<a @click="save">Save</a>
        </div>
      </div>
      <textarea id="inplace-textarea" :value="obs.text"></textarea>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.inplace-editor {
  position: relative;
  width: 100%;
  height: 100%;
  textarea {
    width: 100%;
  }
}
.content {
  font-size: $small-font;
  width: 100%;
  height: 1em;
  display: block;
  overflow: hidden;
  padding: 2px;
}
.content.rotate {
  height: 100%;
  overflow: visible;
}
.title {
  font-size: 12px;
  color: $fancy-color;
}
.control-bar {
  border-bottom: 1px solid $border-color;
  height: 16px;
  display: block;
  white-space: nowrap;
  font-size: 12px;
  div:first-child {
    display: inline-block;
    float: left;
    margin: 2px 2px 0 2px;
  }
  div:last-child {
    display: inline-block;
    cursor: pointer;
    float: right;
    margin: 2px 2px 0 2px;
  }
}
.actions {
  transition: transform 0.5 ease;
}
.actions img {
  margin-right: 10px;
  transform: rotate(0deg);
}
.actions.rotate img {
  transform: rotate(-90deg);
  transition: transform 0.5 ease;
}
</style>
