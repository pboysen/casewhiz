<script>
export default {
  name: "PropsMenu",
  props: {
    menu: Object
  },
  data: function() {
    return {
      show: false
    };
  },
  methods: {
    toggle: function() {
      this.show = !this.show;
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
    <div class="header" v-on:click="toggle">
      <div name="header">{{ menu.title }}</div>
      <span :class="['header-icon', { rotate: show }]">
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
      <div class="body" v-if="show">
        <div v-show="show" v-for="input in menu.inputs" :key="input.title">
          <label
            v-if="input.type === 'textfield'"
            :for="menu.title + '.' + input.title"
          >
            {{ input.title }}:
            <input type="text" :id="menu.title + '.' + input.title" />
          </label>
          <label
            v-if="input.type === 'checkbox'"
            :for="menu.title + '.' + input.title"
          >
            <input type="checkbox" :id="menu.title + '.' + input.title" />
            {{ input.title }}
          </label>
          <label
            v-if="input.type === 'textarea'"
            :for="menu.title + '.' + input.title"
          >
            {{ input.title }}:
            <textarea :id="menu.title + '.' + input.title"></textarea>
          </label>
          <label
            v-if="input.type === 'select'"
            :for="menu.title + '.' + input.title"
          >
            {{ input.title }}: <br />
            <select
              :id="menu.title + '.' + input.title"
              :multiple="input.multiple"
            >
              <option
                v-for="option in input.options"
                :key="option"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </label>
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
}

.accordion .header {
  height: 16px;
  line-height: 16px;
  border-radius: 4px;
  padding: 2px;
  position: relative;
  color: black;
  font-size: 12px;
  background-color: lightblue;
  cursor: pointer;
}
.header-icon {
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
.accordion .body {
  font-size: 12px;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid lightgray;
  padding: 2px;
  overflow-wrap: break-word;
  transition: 150ms ease-out;
  input[type="text"] {
    height: 12px;
    width: 130px;
    border: 1px solid black;
  }
  input[type="checkbox"] {
    top: -2px;
  }
  select {
    margin: 2px;
    width: 100%;
    height: 100%;
    font-size: 12px;
  }
}
</style>
