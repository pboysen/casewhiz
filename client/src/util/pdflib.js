"use strict";

import pdfjs from "pdfjs-dist/webpack";
import PDFViewer from "pdfjs-dist/web/pdf_viewer";
import store from "../store/index";
import { 
  PDFLinkService,
  PDFPageView,
  PDFFindController,
  DefaultAnnotationLayerFactory,
  DefaultTextLayerFactory
} from "pdfjs-dist/web/pdf_viewer.js";

var currentFile = null;
var currentPDF = null;

var CMAP_URL = "pdfjs-dist/cmaps/";
var CMAP_PACKED = true;
var DEFAULT_SCALE = 1.0;

var phaseViews = [];

function loadDocument(url) {
  var loadingTask = pdfjs.getDocument({
    url: url,
    cMapUrl: CMAP_URL,
    cMapPacked: CMAP_PACKED
  });
  loadingTask.promise.then(function(doc) {
    currentPDF = doc;
    var theCase = JSON.parse(localStorage.getItem(url));
    if (!theCase) theCase = getNewCase(url, doc.numPages);
    store.commit("setState", theCase);
  });
}

export function loadPhase(phase) {
  if (phaseViews[phase.id]) return;
  var view = document.createElement("div");
  view.id = "viewerContainer";
  phaseViews[phase.id] = view;
  currentPDF.getPage(phase.id).then(function(pdfPage) {
    var pdfPageView = new PDFViewer.PDFPageView({
      container: phaseViews[phase.id],
      id: phase.id,
      scale: DEFAULT_SCALE,
      defaultViewport: PDFPageView.getViewport({ scale: DEFAULT_SCALE }),
      linkService: PDFLinkService,
      findController: PDFFindController,
      textLayerFactory: DefaultTextLayerFactory(),
      annotationLayerFactory: DefaultAnnotationLayerFactory(),
      renderInteractiveForms: true
    });
    pdfPageView.setPdfPage(pdfPage);
    pdfPageView.draw();
    var pageView = phaseViews[phase.id].getElementsByClassName("page").item(0);
    // if there are no annotations the annotationLayer will not be added by
    // pdf.js so add one.
    var layer = phaseViews[phase.id].getElementsByClassName("annotationLayer")
      .item[0];
    if (!layer) {
      layer = document.createElement("div");
      layer.className = "annotationLayer";
      pageView.appendChild(layer);
    }
    drawPhaseWidgets(phase);
  });
}
function drawPhaseWidgets(phase) {
  console.log(phase);
}
function getNewCase(file, nphases) {
  var phases = [];
  for (var i = 0; i < nphases; i++) {
    var phase = {
      id: i,
      title: "phase " + i,
      submit: "Submit",
      widgets: {},
      tools: []
    };
    phases.push(phase);
  }
  return {
    fileName: file,
    wid: 1,
    current: {
      role: "designer",
      phase: 0,
      widget: 0,
      tool: 0
    },
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

export function saveCase() {
  localStorage.setItem(store.state.filename, JSON.stringify(store.state));
}

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
