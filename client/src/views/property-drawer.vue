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
  },
  data: function() {
    return {
      isOpen: false
    };
  },
  computed: {
    ...mapGetters([
      "selectedWidgetTypes",
      "phaseTitle",
      "submitTitle",
      "currentWidget"
    ]),
    ...mapGetters("things", ["getWidgets", "textSizes"]),
    wid() {
      return this.$store.getters.currentWidget;
    },
    size() {
      return this.$store.getters.size(this.wid);
    },
    optional() {
      return this.$store.getters.optional(this.wid);
    },
    options() {
      return this.$store.getters.options(this.wid);
    },
    multiple() {
      return this.$store.getters.multiple(this.wid);
    },
    sources() {
      return this.$store.getters.sources(this.wid);
    },
    url() {
      return this.$store.getters.url(this.wid);
    }
  },
  methods: {
    toggleTab() {
      this.isOpen = !this.isOpen;
    },
    updatePhaseTitle(e) {
      this.$store.commit("setPhaseTitle", e.target.value);
    },
    updateSubmitTitle(e) {
      this.$store.commit("setSubmitTitle", e.target.value);
    },
    updateSize(e) {
      this.$store.commit("setSize", e.target.value);
    },
    updateOptional(e) {
      this.$store.commit("setOptional", e.target.checked);
    },
    updateOptions(e) {
      this.$store.commit("setOptions", e.target.value);
    },
    updateMultiple(e) {
      this.$store.commit("setMultiple", e.target.value);
    },
    updateSources(e) {
      this.$store.commit("setSources", e.target.value);
    },
    updateURL(e) {
      this.$store.commit("setURL", e.target.value);
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
  <div class="propertyWrapper">
    <div id="propertyDrawer" :class="['propertyDrawer', { opened: isOpen }]">
      <div class="propertyPanel" id="propertyPanel">
        <PropsMenu title="Phase">
          <label for="Phase_PhaseTitle">
            Phase Title:
            <br />
            <input
              id="Phase_PhaseTitle"
              type="text"
              :value="phaseTitle"
              @input="updatePhaseTitle"
            />
          </label>
          <label for="Phase_SubmitTitle">
            Submit Title:
            <br />
            <input
              id="Phase_SubmitTitle"
              type="text"
              :value="submitTitle"
              @input="updateSubmitTitle"
            />
          </label>
        </PropsMenu>
        <PropsMenu title="Textfield">
          <label for="Props_Textfield">
            Size (in characters):
            <br />
            <select id="Props_Textfield" :value="size" @change="updateSize">
              <option
                v-for="(size, index) in textSizes"
                :value="size"
                :key="index"
              >
                {{ size }}
              </option>
            </select>
          </label>
          <label for="textfieldopt">
            <input
              id="textfieldopt"
              type="checkbox"
              :checked="optional"
              @change="updateOptional"
            />
            Optional
          </label>
        </PropsMenu>
        <PropsMenu title="Textarea">
          <label for="CFTextarea">
            Carryforward Sources:
            <br />
            <select id="CFTextarea" multiple="multiple" size="4">
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
              @change="updateOptional"
            />
            Optional
          </label>
        </PropsMenu>
        <PropsMenu title="Select">
          <label for="Props_Select">
            Options:
            <br />
            <input
              id="Props_Select"
              type="text"
              :value="options"
              @input="updateOptions"
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
              @input="updateSize"
            />
          </label>
          <label for="selectopt">
            <input
              id="selectopt"
              type="checkbox"
              :checked="optional"
              @change="updateOptional"
            />
            Optional
          </label>
        </PropsMenu>
        <PropsMenu title="CarryForward">
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
        <PropsMenu title="Media">
          <label for="Media_URL">
            URL:
            <br />
            <input id="Media_URL" type="text" value="url" @input="updateURL" />
          </label>
        </PropsMenu>
        <PropsMenu title="Widgets">
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
      <div v-on:click="toggleTab" class="tab" id="drawerTab">
        <span :class="{ rotate: isOpen }">
          <img src="@/assets/img/triangle.png" />
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.propertyWrapper {
  position: relative;
  z-index: 2;
}
.propertyDrawer {
  position: absolute;
  width: 170px;
  top: 50px;
  left: -170px;
  padding: 0;
  transition: all 0.5s ease;
}
.tab {
  position: relative;
  left: 170px;
  border: 1px solid grey;
  border-radius: 0 4px 4px 0;
  width: 20px;
  height: 20px;
  cursor: pointer;
  top: 50px;
  background-color: $bg-color;
  img {
    padding: 4px;
    transform: rotate(90deg);
    transition-duration: 0.5s;
  }
}
.opened {
  left: -16px;
}
.rotate img {
  transform: rotate(-90deg);
  transition-duration: 0.5s;
}
.propertyPanel {
  position: absolute;
  width: 85%;
  border-radius: 0 8px 8px 0;
  left: 16px;
  top: 0px;
  overflow: auto;
  border: 1px solid black;
  padding: 4px;
  font-size: 12px;
}
.propertyPanel input[type="text"] {
  width: 100px;
}
.propertyPanel select {
  border: 1px solid gray;
  width: 100px;
  border-radius: 0;
  overflow: none;
}
</style>
