"use strict";

import pdfjsLib from "pdfjs-dist/webpack";
import store from "../store/index";
import {
  PDFPageView,
  PDFLinkService,
  PDFFindController,
  pdfjsViewer
} from "pdfjs-dist/web/pdf_viewer";

pdfjsLib.GlobalWorkerOptions.workerSrc = "pdfjs/pdf.worker.js";

var currentFile = null;
var currentPDF = null;

var CMAP_URL = "pdfjs-dist/cmaps/";
var CMAP_PACKED = true;
var DEFAULT_SCALE = 0.8;

var phaseViews = [];

export default {};

export function dropHandler(e) {
  e.preventDefault();
  e.stopPropagation();
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
    if (file.type === "application/pdf") {
      currentFile = file;
      loadDocument(file.name);
    } else if (
      file.type === "application/case" ||
      file.name.endsWith(".case")
    ) {
      currentFile = file;
      getFileBlob(file, function(blob) {
        var view = new DataView(blob);
        var len = view.getUint32(0);
        var reader = new FileReader();
        var fileName = file.name.split(".")[0];
        reader.onload = function() {
          localStorage.setItem(fileName + ".pdf", reader.result);
          reader.onload = function() {
            loadDocument(reader.result);
          };
          var pdfData = new Blob([blob.slice(len + 4)]);
          reader.readAsDataURL(pdfData);
        };
        reader.readAsText(new Blob([blob.slice(4, len + 4)]));
      });
    } else return "Only PDF and CASE files can be read.";
  } else return "Please drop only one file.";
  return "";
}

const getFileBlob = function(file, cb) {
  var reader = new FileReader();
  reader.onload = function() {
    cb(reader.result);
  };
  reader.readAsArrayBuffer(file);
};

export function setDraggable(widgetWrapper) {
  widgetWrapper.onmousedown = function(e) {
    var left = widgetWrapper.offsetLeft;
    var top = widgetWrapper.offsetTop;
    var width = widgetWrapper.offsetWidth;
    var height = widgetWrapper.offsetHeight;
    var offsetX = e.pageX - left;
    var offsetY = e.pageY - top;

    moveAt(e.pageX, e.pageY);

    function moveAt(pageX, pageY) {
      widgetWrapper.style.left = pageX - offsetX + "px";
      widgetWrapper.style.top = pageY - offsetY + "px";
    }

    window.onmousemove = function(e) {
      // move if not resizing
      if (
        widgetWrapper.offsetWidth == width &&
        widgetWrapper.offsetHeight == height
      )
        moveAt(e.pageX, e.pageY);
    };
  };
}

export function saveCase() {
  localStorage.setItem(store.state.filename, JSON.stringify(store.state));
}

export function publish(fileName) {
  if (!currentFile) return "No current file to publish.";
  if (fileName.length == 0) "The filename is missing.";
  getFileBlob(currentFile, function(blob) {
    var json = {}; //copy phase layout from vuex
    var lenBuffer = new ArrayBuffer(4);
    var view = new DataView(lenBuffer);
    view.setUint32(0, json.length);
    var url = URL.createObjectURL(
      new Blob([lenBuffer, json, blob], { type: "application/case" })
    );
    var a = document.createElement("a");
    a.href = url;
    a.download = fileName + ".case";
    a.click();
    URL.revokeObjectURL(a.href);
  });
}

export function showPhase(pindex) {
  if (currentPDF) {
    loadPhase(pindex);
    var wrapper = document.getElementById("viewerWrapper");
    wrapper.replaceChild(phaseViews[pindex], wrapper.firstElementChild);
  }
}

function loadDocument(url) {
  var loadingTask = pdfjsLib.getDocument({
    url: url,
    cMapUrl: CMAP_URL,
    cMapPacked: CMAP_PACKED
  });
  loadingTask.promise.then(function(doc) {
    currentPDF = doc;
    let theCase = JSON.parse(localStorage.getItem(url));
    if (!theCase) theCase = getNewCase(url, doc.numPages);
    store.commit("setState", theCase);
  });
}

function loadPhase(pindex) {
  if (phaseViews[pindex] || !currentPDF) return;
  let view = document.createElement("div");
  view.id = "viewerContainer";
  phaseViews[pindex] = view;
  currentPDF.getPage(pindex + 1).then(function(pdfPage) {
    var viewport = new PDFPageView({
      container: phaseViews[pindex],
      id: pindex + 1,
      scale: DEFAULT_SCALE,
      defaultViewport: pdfPage.getViewport({ scale: 1.0 }),
      linkService: PDFLinkService,
      findController: PDFFindController,
      textLayerFactory: new pdfjsViewer.DefaultTextLayerFactory(),
      annotationLayerFactory: new pdfjsViewer.DefaultAnnotationLayerFactory(),
      renderInteractiveForms: false
    });
    viewport.setPdfPage(pdfPage);
    viewport.draw();
    var container = document.getElementById("viewerContainer");
    container.style.width = viewport.canvas.width + "px";
    container.style.height = viewport.canvas.height + "px";
    let pageView = phaseViews[pindex].getElementsByClassName("page").item(0);
    let layer = document.createElement("div");
    layer.id = "widgetLayer";
    pageView.appendChild(layer);
    drawPhaseWidgets(pindex);
  });
}

function drawPhaseWidgets(pindex) {
  console.log(pindex);
}

function getNewCase(file, nphases) {
  var phases = [];
  for (var i = 0; i < nphases; i++) {
    var phase = {
      id: i,
      title: "phase " + (i + 1),
      submit: "Submit",
      widgets: {},
      tools: []
    };
    phases.push(phase);
  }
  return {
    filename: "test.pdf",
    wcnt: 1,
    role: "designer",
    phase: 0,
    tool: 0,
    widget: null,
    selectedWidgetTypes: [
      "textfield",
      "textarea",
      "select",
      "carryforward",
      "media"
    ],
    selectedToolTypes: ["Resources", "Comments", "Observations"],
    phases: phases
  };
}
