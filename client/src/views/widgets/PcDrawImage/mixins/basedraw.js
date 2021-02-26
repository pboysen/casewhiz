import * as createjs from "createjs-module";

var stage;
var widget;
var back;

function makeStage(drawing, canvasId) {
  widget = drawing;
  stage = new createjs.Stage(canvasId);
  stage.enableMouseOver();
  stage.cursor = "default";
  createjs.Touch.enable(stage);
  drawing.stage = stage;
  back = new createjs.Bitmap(drawing.image);
  back.image.onload = () => resizeCanvas(stage.canvas, back);
  stage.addChild(back);
  run();
}

function addMouse() {
  stage.on("stagemousedown", e => widget.mouseDown(e));
  stage.on("stagemousemove", e => widget.mouseMove(e));
  stage.on("stagemouseup", e => widget.mouseUp(e));
}

function removeMouse() {
  stage.enableMouseOver(0);
  stage.on("stagemousedown", widget.mouseDown);
  stage.on("stagemousemove", widget.mouseMove);
  stage.on("stagemouseup", widget.mouseUp);
}

function getBack() {
  return back;
}

function resizeCanvas(canvas, back) {
  canvas.style = null; // not sure why this is set for shape-canvas
  let bnd = back.getBounds();
  [canvas.width, canvas.height] = [bnd.width, bnd.height];
  [back.x, back.y] = [bnd.width / 2, bnd.height / 2];
  [back.regX, back.regY] = [bnd.width / 2, bnd.height / 2];
}

function run() {
  createjs.Ticker.on("tick", () => {
    stage.update();
  });
}

function dist(sx, sy, ex, ey) {
  const dx = sx - ex;
  const dy = sy - ey;
  return Math.sqrt(dx * dx + dy * dy);
}

function angle(sx, sy, ex, ey) {
  return (Math.atan2(ey - sy, ex - sx) * 180) / Math.PI;
}

function toHex(c) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + this.toHex(r) + this.toHex(g) + this.toHex(b);
}

function getMid(pts) {
  let [start, end] = [pts[0], pts[pts.length - 1]];
  let [midx, midy] = [0, 0];
  if (start.x < end.x) midx = start.x + (end.x - start.x) / 2 - 20;
  else midx = end.x + (start.x - end.x) / 2 - 20;
  if (start.y < end.y) midy = start.y + (end.y - start.y) / 2;
  else midy = end.y + (start.y - end.y) / 2;
  return [midx, midy];
}
export {
  makeStage,
  getBack,
  dist,
  angle,
  toHex,
  rgbToHex,
  getMid,
  addMouse,
  removeMouse
};
