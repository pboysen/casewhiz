<script>
import widgetWrapper from "@/views/widgets/widget-wrapper.vue";
export default {
  name: "multiple-choice",
  props: {
    wid: Number
  },
  components: {
    widgetWrapper
  },
  computed: {
    radios() {
      let radios = [];
      let bullet = event.target;
      let node = bullet;
      let index = 1;
      while (node.offsetLeft >= bullet.offsetLeft) {
        if (node.offsetLeft == bullet.offsetLeft) {
          if (bullet.textContent != node.textContent) break;
          let top = node.offsetTop - bullet.offsetTop + 5;
          radios.push({
            value: `mc${this.wid}`,
            style: `left: 12px; top: ${top}px;`,
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
  <widget-wrapper widgettype="multiple-choice">
    <div class="multiple-choice">
      <input
        v-for="radio in radios"
        type="radio"
        :key="radio.key"
        :value="radio.value"
        :style="radio.style + 'transform: scale(' + pixelRatio + ');'"
      />
    </div>
  </widget-wrapper>
</template>
<style lang="scss" scoped>
.multiple-choice {
  padding: 0;
  position: absolute;
}
.multiple-choice input[type="radio"] {
  margin: 0;
  position: absolute;
}
</style>
