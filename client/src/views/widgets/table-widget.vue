<script>
import widgetWrapper from "@/views/widgets/widget-wrapper.vue";
import selectWidget from "@/views/widgets/select-widget.vue";
import textfieldWidget from "@/views/widgets/textfield-widget.vue";
import propsMixin from "@/mixins/props-mixin.js";
import * as csv from "csvtojson";
import { mapGetters } from "vuex";
const startChar = "~";

export default {
  name: "table-widget",
  mixins: [propsMixin],
  props: {
    wid: Number
  },
  data: function() {
    return {
      table: null,
      colspans: null
    };
  },
  components: {
    widgetWrapper,
    textfieldWidget,
    selectWidget
  },
  created() {
    this.table = this.$store.getters.getPropValue({
      id: this.wid,
      phase: this.currentPhase,
      type: "table-widget",
      value: "table"
    });
  },
  computed: {
    ...mapGetters(["currentRole", "currentPhase"])
  },
  methods: {
    isWidget(value) {
      return String(value).startsWith(startChar);
    },
    subType(value) {
      return value.split(startChar)[1];
    },
    subId(value) {
      return Number(value.split(startChar)[2]);
    },
    col(row, col) {
      return this.colspans[`${row},${col}`];
    },
    registerColspans(table) {
      this.colspans = {};
      for (let r = 0; r < table.length; r++) {
        let c = 0;
        let cspan = 0;
        while (c < table[r].length) {
          let blank = c + 1;
          while (table[r][blank] === "" && blank < table[r].length) blank++;
          cspan = blank - c;
          if (cspan > 1) table[r].splice(c + 1, cspan - 1);
          this.colspans[`${r},${c}`] = cspan;
          c++;
        }
      }
    },
    registerWidgets(table) {
      for (let r = 0; r < table.length; r++) {
        for (let c = 0; c < table[r].length; c++)
          if (String(table[r][c]).startsWith(startChar)) {
            let props = this.parse(table[r][c]);
            let type = props["type"];
            let info = { wid: null, type: type, wrec: null, props: props };
            // build widget record and register widget
            this.$store.commit("registerSubWidget", info);
            table[r][c] = `${startChar}${type}${startChar}${info.wid}`;
          }
      }
    },
    dropHandler(e) {
      if (this.currentRole != "designer") return;
      var files = [];
      if (e.dataTransfer.items) {
        for (var i = 0; i < e.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (e.dataTransfer.items[i].kind === "file") {
            files.push(e.dataTransfer.items[i].getAsFile());
          }
        }
      }
      if (files.length == 1) {
        var file = files[0];
        if (/^text\/csv/.test(file.type)) this.processCSV(file);
        else return "Only CSV files are permitted.";
      } else return "Please drop only one file.";
      return "";
    },
    processCSV(file) {
      let reader = new FileReader();
      let that = this;
      reader.onload = function() {
        csv({
          noheader: true,
          output: "csv"
        })
          .fromString(reader.result)
          .then(table => {
            that.registerColspans(table);
            that.registerWidgets(table);
            let info = { wid: that.wid, prop: "table", value: table };
            that.table = table;
            that.$store.commit("setProp", info);
          });
      };
      reader.readAsText(file);
    }
  }
};
/* csvtojson output
[["1","2","3"], ["4","5","6"], ["7","8","9"]]
*/
</script>
<template>
  <widget-wrapper widgettype="table-widget" :wid="wid">
    <table v-if="table != null">
      <thead>
        <tr>
          <th v-for="(head, hidx) in table[0]" :key="hidx">
            {{ head }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, ridx) in table.slice(1)" :key="ridx">
          <td
            v-for="(value, cidx) in row"
            :key="cidx"
            :colspan="col(ridx, cidx)"
          >
            <component
              v-if="isWidget(value)"
              :is="subType(value)"
              :wid="subId(value)"
            >
            </component>
            <span v-else>{{ value }}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="table == null"
      id="tablewidgetdrop"
      @drop.stop.prevent="dropHandler($event)"
      @dragover.prevent
    >
      <p>Drop your CSV file here</p>
    </div>
  </widget-wrapper>
</template>
<style lang="scss" scoped>
.widget[widgettype="table-widget"] {
}
.widget[widgettype="table-widget"] table {
  table-layout: fixed;
  font-size: $small-font;
  border-collapse: collapse;
  background-color: white;
  user-select: none;
  border: 1px solid $border-color;
  tr:nth-child(odd) {
    background-color: $highlight-color;
  }
  tr:nth-child(even) {
    background-color: $bg-menu-color;
  }
  th {
    word-wrap: break-word;
    padding: 10px;
    background-color: $bg-menu-color;
    width: 15%;
  }
  td {
    border: 1px solid black;
    padding: 2px;
  }
}
.widget[widgettype="table-widget"].student {
  resize: none;
  overflow: none;
  user-select: text;
}
#tablewidgetdrop {
  background-color: white;
  min-width: 200px;
  min-height: 200px;
  color: black;
  font-size: $txt-font;
  padding: 4px;
  margin: 0;
  border: 1px dashed $border-color;
  overflow: auto;
  resize: both;
}
</style>
