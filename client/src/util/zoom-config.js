import { ZoomMtg } from "@zoomus/websdk";
ZoomMtg.setZoomJSLib("https://dmogdx0jrul3u.cloudfront.net/1.7.2/lib", "/av");
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();

const API_KEY = "api key";
const API_SECRET = "api secret";

const MeetingCfg = meetingId => ({
  apiKey: API_KEY,
  apiSecret: API_SECRET,
  meetingNumber: meetingId,
  userName: "peteboysen@gmail.com",
  passWord: 111111,
  leaveUrl: "https://zoom.us",
  role: 0
});

export default { MeetingCfg, ZoomMtg };
