<script>
import widgetWrapper from "@/views/widgets/widget-wrapper.vue";
import { ZoomMtg } from "@zoomus/websdk";

ZoomMtg.setZoomJSLib("https://dmogdx0jrul3u.cloudfront.net/1.7.2/lib", "/av");
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

const API_KEY = "27C8EnMI79iybBCIPNFwc3YfNULic0cqUANo";
const API_SECRET = "Yivtcv3MqshAGSHJtwm0Wa8hBTr57TDka9oK";

export default {
  name: "zoom-widget",
  props: {
    nickname: String,
    meetingId: String,
    wid: Number
  },
  components: {
    widgetWrapper
  },
  beforeDestroy() {
    document.getElementById("zmmtg-root").style.display = "none";
  },
  mounted() {
    this.$el.children[0].style.display = "";
    const MeetingCfg = meetingId => ({
      apiKey: API_KEY,
      apiSecret: API_SECRET,
      meetingNumber: meetingId,
      userName: "peteboysen@gmail.com",
      passWord: 111111,
      leaveUrl: "https://zoom.us",
      role: 0
    });
    const meetConfig = MeetingCfg(489053717);
    // Generate Signature function
    const signature = ZoomMtg.generateSignature({
      meetingNumber: meetConfig.meetingNumber,
      apiKey: meetConfig.apiKey,
      apiSecret: meetConfig.apiSecret,
      role: meetConfig.role,
      success: res => {
        // eslint-disable-next-line
        console.log("success signature: " + res.result);
      }
    });
    // join function
    console.log("start initialization");
    ZoomMtg.init({
      leaveUrl: "http://www.zoom.us",
      isSupportAV: true,
      success: suc => {
        console.log("trying to join " + JSON.stringify(suc));
        ZoomMtg.join({
          signature: signature,
          meetingNumber: meetConfig.meetingNumber,
          userName: meetConfig.userName,
          apiKey: meetConfig.apiKey,
          userEmail: "peteboysen@gmail.com",
          passWord: meetConfig.passWord,
          success: res => {
            // eslint-disable-next-line
            console.log("join meeting success", res.result);
          },
          error: res => {
            // eslint-disable-next-line
            console.log(res);
          }
        });
      },
      error: res => {
        // eslint-disable-next-line
        console.log(res);
      }
    });
  }
};
</script>
<template>
  <widget-wrapper widgettype="zoom-widget" :wid="wid">
    <div id="zmmtg-root"></div>
    <div id="aria-notify-area"></div>
  </widget-wrapper>
</template>
<style lang="scss" scoped>
body {
  all: unset;
}
.widget[widgettype="zoom-widget"] {
  width: 400px;
  height: 400px;
  overflow: auto;
  resize: both;
}
#zoomApp {
  width: 100%;
  height: 100%;
}
</style>
