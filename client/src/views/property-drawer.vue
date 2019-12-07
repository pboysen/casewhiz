<script>
import PropsMenu from "@/views/props-menu.vue";
export default {
  name: "PropertyDrawer",
  components: {
    PropsMenu
  },
  data: function() {
    return {
      isOpen: false,
      menus: [
        {
          title: "Phase",
          inputs: [
            { title: "Phase-Title", type: "textfield" },
            { title: "Submit-Title", type: "textfield" }
          ]
        },
        {
          title: "Widgets",
          inputs: [
            {
              title: "Selected",
              type: "select",
              options: [
                "Textfield",
                "Textarea",
                "Select",
                "Carryforward",
                "Media"
              ],
              multiple: true
            }
          ]
        },
        {
          title: "Textfield",
          inputs: [
            { title: "Columns", type: "textfield" },
            { title: "Optional", type: "checkbox" }
          ]
        },
        {
          title: "Textarea",
          inputs: [
            { title: "Optional", type: "checkbox" },
            {
              title: "Source Widgets",
              type: "select",
              options: [],
              multiple: true
            }
          ]
        },
        {
          title: "Select",
          inputs: [
            { title: "Optional", type: "checkbox" },
            { title: "Options (';' delimited)", type: "textfield" }
          ]
        },
        {
          title: "Carryforward",
          inputs: [
            {
              title: "Source Widgets",
              type: "select",
              options: [],
              multiple: true
            },
            { title: "Order", type: "textfield" }
          ]
        },
        {
          title: "Media",
          inputs: [{ title: "URL", type: "textfield" }]
        }
      ]
    };
  },
  methods: {
    toggleTab: function() {
      this.isOpen = !this.isOpen;
    }
  }
};
</script>

<template>
  <div class="propertyWrapper">
    <div :class="['propertyDrawer', { opened: isOpen }]">
      <div v-on:click="toggleTab" class="tab">
        <span :class="{ rotate: isOpen }">
          <img src="@/assets/img/triangle.png" />
        </span>
      </div>
      <div class="propertyPanel">
        <PropsMenu v-for="menu in menus" :key="menu.title" :menu="menu">
        </PropsMenu>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.propertyWrapper {
  position: relative;
}
.propertyDrawer {
  position: absolute;
  height: 400px;
  width: 170px;
  top: 0px;
  right: -154px;
  padding: 0;
  transition: all 0.5s ease;
}
.tab {
  border-radius: 4px;
  border: 1px solid black;
  width: 24px;
  height: 20px;
  cursor: pointer;
  position: relative;
  left: -4px;
  font-size: 14px;
  top: 50%;
  background-color: lightblue;
  img {
    padding: 1px;
    transform: rotate(-90deg);
    transition-duration: 0.5s;
  }
}
.opened {
  right: 0px;
}
.rotate img {
  transform: rotate(90deg);
  transition-duration: 0.5s;
}
.propertyPanel {
  position: absolute;
  height: 85%;
  width: 85%;
  border-radius: 8px 0px 0 8px;
  left: 16px;
  top: 0px;
  overflow: auto;
  border: 1px solid black;
  background-color: #eeeefe;
  padding: 4px;
}
</style>
