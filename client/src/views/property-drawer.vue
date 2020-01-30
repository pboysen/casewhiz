<script>
import PropsMenu from "@/views/props-menu.vue";
import { mapGetters } from "vuex";
import eventBus from "@/main";

export default {
  name: "PropertyDrawer",
  components: {
    PropsMenu
  },
  mounted() {
    eventBus.$on("widgetBarMoved", e => {
      let drawer = document.getElementById("propertyDrawer");
      drawer.style.top = e.pageY - 120 + "px";
    });
    eventBus.$on("typeSelected", type => (this.openType = type));
    eventBus.$on("typeDeselected", () => (this.openType = ""));
  },
  data: function() {
    return {
      isOpen: false,
      openType: ""
    };
  },
  computed: {
    ...mapGetters([
      "selectedWidgetTypes",
      "phaseTitle",
      "submitTitle",
      "currentWidget"
    ]),
    ...mapGetters("things", ["getWidgets", "sizes"]),
    size() {
      if (!this.wid) return 20;
      return this.$store.getters.size(this.wid);
    },
    optional() {
      if (!this.wid) return false;
      return this.$store.getters.optional(this.wid);
    },
    sources() {
      if (!this.wid) return [];
      return this.$store.getters.sources(this.wid);
    },
    url() {
      if (!this.wid) return "";
      return this.$store.getters.url(this.wid);
    },
    options() {
      if (!this.wid) return [];
      return this.$store.getters.options(this.wid);
    },
    wid() {
      return this.$store.getters.currentWidget;
    }
  },
  methods: {
    toggleTab() {
      this.isOpen = !this.isOpen;
    },
    setPhaseTitle(e) {
      this.$store.commit("setPhaseTitle", e.target.value);
    },
    setSubmitTitle(e) {
      this.$store.commit("setSubmitTitle", e.target.value);
    },
    setProp(prop, value) {
      this.$store.commit("setProp", { prop: prop, value: value });
    },
    isSelectedWidget(type) {
      let value = false;
      this.selectedWidgetTypes.forEach(name => {
        if (name === type) {
          value = true;
          return;
        }
      });
      return value;
    },
    selectWidgets(e) {
      let selected = [];
      let collection = e.originalTarget.selectedOptions;
      for (let i = 0; i < collection.length; i++)
        selected.push(collection[i].label);
      this.$store.commit("setSelectedWidgetTypes", selected);
    }
  }
};
</script>

<template>
  <div id="propertyWrapper">
    <div id="propertyDrawer" :class="['propertyDrawer', { opened: isOpen }]">
      <div id="propertyPanel">
        <PropsMenu title="Phase" :openType="openType">
          <label for="Phase_PhaseTitle">
            Phase Title:
            <br />
            <input
              id="Phase_PhaseTitle"
              type="text"
              :value="phaseTitle"
              @input="setPhaseTitle"
            />
          </label>
          <label for="Phase_SubmitTitle">
            Submit Title:
            <br />
            <input
              id="Phase_SubmitTitle"
              type="text"
              :value="submitTitle"
              @input="setSubmitTitle"
            />
          </label>
        </PropsMenu>
        <PropsMenu title="Textfield" :openType="openType">
          <label for="Props_Textfield">
            Size (in characters):
            <br />
            <select
              id="Props_Textfield"
              :value="size"
              @change="setProp('size', $event.target.value)"
            >
              <option v-for="(size, index) in sizes" :value="size" :key="index">
                {{ size }}
              </option>
            </select>
          </label>
          <label for="textfieldopt">
            <input
              id="textfieldopt"
              type="checkbox"
              :checked="optional"
              @change="setProp('optional', $event.target.checked)"
            />
            Optional
          </label>
        </PropsMenu>
        <PropsMenu title="Textarea" :openType="openType">
          <label for="CFTextarea">
            Carryforward Sources:
            <br />
            <select id="CFTextarea" multiple size="4">
              <option
                v-for="(source, index) in sources"
                :value="source"
                :key="index"
              >
                {{ source }}
              </option>
            </select>
          </label>
          <label for="CF_TextareaOrder">
            Order:
            <br />
            <input
              type="text"
              :value="sources"
              id="CF_TextareaOrder"
              cols="30"
              readonly="readonly"
            />
          </label>
          <label for="textareaopt">
            <input
              id="textareaopt"
              type="checkbox"
              :checked="optional"
              @change="setProp('optional', $event.target.checked)"
            />
            Optional
          </label>
        </PropsMenu>
        <PropsMenu title="Select" :openType="openType">
          <label for="Props_Select">
            Options:
            <br />
            <input
              id="Props_Select"
              type="text"
              :value="options"
              @input="setProp('options', $event.target.value)"
              placeholder="Names separated by ';'."
            />
          </label>
          <label for="selectsize">
            Size(visible rows):
            <br />
            <input
              id="selectsize"
              type="text"
              :value="size"
              @input="setProp('size', $event.target.value)"
            />
          </label>
          <label for="selectopt">
            <input
              id="selectopt"
              type="checkbox"
              :checked="optional"
              @change="setProp('optional', e.target.checked)"
            />
            Optional
          </label>
        </PropsMenu>
        <PropsMenu title="CarryForward" :openType="openType">
          <label for="CF_Src">
            Carryforward Sources:
            <br />
            <select id="CF_Src" multiple="multiple" size="4">
              <option
                v-for="(source, index) in sources"
                :value="source"
                :key="index"
              >
                {{ source }}
              </option>
            </select>
          </label>
          <label for="CF_Order">
            Order:
            <br />
            <input
              type="text"
              :value="sources"
              id="cfOrder"
              cols="30"
              readonly="readonly"
            />
          </label>
        </PropsMenu>
        <PropsMenu title="Media" :openType="openType">
          <label for="Media_URL">
            URL:
            <br />
            <input
              id="Media_URL"
              type="text"
              value="url"
              @input="setProp('url', $event.target.value)"
            />
          </label>
        </PropsMenu>
        <PropsMenu title="Widgets" :openType="openType">
          <label for="Props_Select">
            Select:
            <br />
            <select
              id="Props_Select"
              multiple="multiple"
              size="4"
              @change="selectWidgets"
            >
              <option
                v-for="w in getWidgets"
                :value="w.type"
                :key="w.type"
                :selected="isSelectedWidget(w.type)"
              >
                {{ w.type }}
              </option>
            </select>
          </label>
        </PropsMenu>
      </div>
      <div v-on:click="toggleTab" id="drawerTab">
        <span :class="{ rotate: isOpen }">
          <img src="@/assets/img/triangle.png" />
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#propertyWrapper {
  position: relative;
  z-index: 1;
}
.propertyDrawer {
  position: absolute;
  width: 170px;
  top: 50px;
  left: -172px;
  padding: 0;
  transition: all 1.0s ease;
}
#propertyPanel {
  background-color: $bg-color;
}
#drawerTab {
  position: absolute;
  left: 170px;
  border-top: 1px solid $border-color;
  border-right: 1px solid $border-color;
  border-bottom: 1px solid $border-color;
  border-radius: 0 4px 4px 0;
  width: 20px;
  height: 20px;
  cursor: pointer;
  top: 50px;
  background-color: $highlight-color;
}
#drawerTab img {
  left: 170px;
  padding: 4px;
  transform: rotate(90deg);
  transition-duration: 1.0s;
}
.opened {
  left: 0px;
}
#drawerTab .rotate img {
  transform: rotate(-90deg);
  transition-duration: 1.0s;
}
.propertyPanel {
  position: absolute;
  width: 85%;
  border-radius: 0 8px 8px 0;
  left: 16px;
  top: 0px;
  overflow: auto;
  border: 1px solid $border-color;
  padding: 4px;
  font-size: 12px;
}
.propertyPanel input[type="text"] {
  width: 100px;
}
.propertyPanel select {
  border: 1px solid $border-color;
  width: 100px;
  border-radius: 0;
  overflow: none;
}
</style>
