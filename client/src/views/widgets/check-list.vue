<script>
import widgetWrapper from "@/views/widgets/widget-wrapper.vue";
export default {
  name: "check-list",
  props: {
    wid: Number
  },
  components: {
    widgetWrapper
  },
  computed: {
    checks() {
      let radios = [];
      let bullet = event.target;
      let node = bullet;
      let index = 1;
      while (node.offsetLeft >= bullet.offsetLeft) {
        if (node.offsetLeft == bullet.offsetLeft) {
          if (bullet.textContent != node.textContent) break;
          let top = node.offsetTop - bullet.offsetTop + 5;
          radios.push({
            value: `cl${this.wid}-${index}`,
            style: `left: 15px; top: ${top}px;`,
            key: index++
          });
        }
        node = node.nextElementSibling;
      }
      return radios;
    },
    pixelRatio() {
      return window.devicePixelRatio;
    }
  }
};
</script>
<template>
  <widget-wrapper widgettype="check-list">
    <div class="check-list">
      <input
        v-for="check in checks"
        type="checkbox"
        :key="check.key"
        :value="check.value"
        :style="check.style + 'transform: scale(' + pixelRatio + ');'"
      />
    </div>
  </widget-wrapper>
</template>
<style lang="scss">
.check-list {
  position: absolute;
}
.widget .check-list {
  input[type="checkbox"] {
    position: absolute;
  }
}
</style>
