<script>
export default {
  name: "PropsMenu",
  props: {
    title: String,
    openType: String
  },
  data: function() {
    return {
      isOpen: false
    };
  },
  computed: {
    show: function() {
      if (this.isOpen) return true;
      return this.openType === this.title.toLowerCase();
    }
  },
  methods: {
    toggle: function() {
      this.isOpen = !this.isOpen;
    },
    beforeEnter: function(el) {
      el.style.height = "0";
    },
    enter: function(el) {
      el.style.height = el.scrollHeight + "px";
    },
    beforeLeave: function(el) {
      el.style.height = el.scrollHeight + "px";
    },
    leave: function(el) {
      el.style.height = "0";
    }
  }
};
</script>
<template>
  <div class="accordion">
    <div class="PropsHeader" v-on:click="toggle">
      <div name="header">{{ title }}</div>
      <span :class="['PropsHeader-icon', { rotate: show }]">
        <img src="@/assets/img/triangle.png" />
      </span>
    </div>
    <transition
      name="accordion"
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:before-leave="beforeLeave"
      v-on:leave="leave"
    >
      <div v-show="show">
        <div class="PropsBody">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
.accordion {
  width: 100%;
  margin-bottom: 2px;
  border-radius: 6px;
  overflow: none;
  font-size: $txt-font;
}

.accordion .PropsHeader {
  background-color: $highlight-color;
  height: 16px;
  line-height: 16px;
  border-radius: 4px;
  padding: 2px;
  position: relative;
  color: black;
  font-size: $small-font;
  cursor: pointer;
}
.PropsHeader-icon {
  position: absolute;
  top: 4px;
  right: 8px;
  font-weight: bold;
  img {
    transform: rotate(0deg);
    transition-duration: 0.3s;
  }
}
.rotate img {
  transform: rotate(180deg);
  transition-duration: 0.3s;
}
.PropsBody {
  font-size: $small-font;
  input[type="text"] {
    font-size: $small-font;
    padding: 2px;
    height: 14px;
    width: 140px;
    border: 1px solid $border-color;
    margin-bottom: 4px;
  }
  label {
    margin: 2px;
    float: left;
  }
  input[type="checkbox"] {
    width: 20px;
    border: 0px;
    margin: 2px 0 2px 2px;
  }
  select {
    margin: 2px;
    width: 100%;
    font-size: 12px;
  }
  label {
    display: block;
  }
}
</style>
