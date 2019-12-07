'use strict';

if (!pdfjsLib.getDocument || !pdfjsViewer.PDFPageView) {
  alert('Please build the pdfjs-dist library using\n' +
        '  `gulp dist-install`');
};

pdfjsLib.GlobalWorkerOptions.workerSrc ='pdfjs/pdf.worker.js';

var CMAP_URL = 'pdfjs/cmaps/';
var CMAP_PACKED = true;

var DEFAULT_URL = 'Designer Help.pdf';
var PAGE_TO_VIEW = 1;
var DEFAULT_SCALE = 1.0;

var pdfLinkService = new pdfjsViewer.PDFLinkService();
const basicWidgetTypes = ["textfield","textarea","list","select","carryforward","media"];
var jsonPrototypes = {};
var phaseViews = [null];
var currentPDF = null;
var currentCase = null;
var currentPhase = 1;
var currentWidget = null;
var alayer = null;
var page = null;

var pdfFindController = new pdfjsViewer.PDFFindController({
  linkService: pdfLinkService,
});

if (typeof(Storage) === "undefined") {
	alert("Browser storage is not supported. Please use another browser.");
};

initJsonPrototypes();

loadDocument(DEFAULT_URL);

/***************************************************************************
 * Cases and Phases functions
*****************************************************************************/

function loadDocument(url) {
	phaseViews = [null];
	var loadingTask = pdfjsLib.getDocument({
	  url: url,
	  cMapUrl: CMAP_URL,
	  cMapPacked: CMAP_PACKED,
	});
	loadingTask.promise.then(function(document) {
		currentPDF = document;
		getCase(url,document.numPages);
    fillPhasePanel();
    fillToolMenu();
    showPhase(1);
	});
}

function getCase(url,nphases) {
	currentCase = JSON.parse(localStorage.getItem(url));
	if (!currentCase) {
		currentCase = getNewCase(url,nphases);
		saveCase();
	};
	for (var i = 1; i < currentCase.phases.length; i++)
		loadPhase(currentCase.phases[i]);
}

function getNewCase(file,nphases) {
	var state = "viewing";
	var phases = [null]
	for (var i = 1; i <= nphases; i++) {
		var phase = {
			"id": i,
			"title": "phase "+i,
			"submit": "Submit",
			"state": state,
			"widgets": {},
			"tools": []
		};
		phases.push(phase);
		state = "locked";
	};
	return {
		"fileName": file.name,
		"wid": 1,
		"widgetbar": basicWidgetTypes,
		"phases": phases
	};
}

function saveCase() {
	localStorage.setItem(currentCase.fileName, JSON.stringify(currentCase));
}

function roleChange(role) {
	console.log(role);
}

function getNewView() {
	var view = document.createElement("div");
	view.id = "viewerContainer";
	view.onmousedown = function(e) {
		if (e.target.tagName === "SELECT") {
			return;
		};
		if (e.target.textContent === "•") {
			bullet = e.target;
			menu = document.getElementById("addList");
			menu.style.left = bullet.style.left;
		    menu.style.top = bullet.style.top;
			toggleMenu("visible");
			return;
		};
	};
	return view;
}

function loadPhase(phase) {
	phaseViews.push(getNewView());
	currentPDF.getPage(phase.id).then(function (pdfPage) {
	    var pdfPageView = new pdfjsViewer.PDFPageView({
		container: phaseViews[phase.id],
		id: phase.id,
		scale: DEFAULT_SCALE,
		defaultViewport: pdfPage.getViewport({scale:DEFAULT_SCALE}),
			linkService: pdfLinkService,
			findController: pdfFindController,
			textLayerFactory: new pdfjsViewer.DefaultTextLayerFactory(),
			annotationLayerFactory: new pdfjsViewer.DefaultAnnotationLayerFactory(),
			renderInteractiveForms: true,
	    });
	    pdfPageView.setPdfPage(pdfPage);
	    pdfPageView.draw();
	    var pageView = phaseViews[phase.id].getElementsByClassName("page").item(0);
	    // if there are no annotations the annotationLayer will not be added by pdf.js so add one.
	    var layer = phaseViews[phase.id].getElementsByClassName("annotationLayer").item[0];
	    if (!layer) {
	    	layer = document.createElement("div");
	    	layer.className = "annotationLayer";
	    	pageView.appendChild(layer);
	    };
		var menuLayer = document.getElementById("menuLayer");
	    pageView.appendChild(menuLayer.cloneNode(true));
	    drawPhaseWidgets(phase);
	});
}

function drawPhaseWidgets(phase) {

}

// swap phase views
function showPhase(pindex) {
	var phaseButton = document.getElementById("ptitle"+currentPhase);
	phaseButton.removeAttribute("selected");
	var wrapper = document.getElementById("viewerWrapper");
	wrapper.replaceChild(phaseViews[pindex],wrapper.firstElementChild);
	currentPhase = pindex;
	phaseButton = document.getElementById("ptitle"+currentPhase);
	phaseButton.setAttribute("selected","true");
	var title = currentCase.phases[pindex].submit;
	document.getElementById("submitButton").firstElementChild.innerHTML = title;
}

function fillPhasePanel() {
	var phasePanel = document.getElementById("phasePanel");
	phasePanel.innerHTML = '';
	var title = document.createElement("span");
	title.innerHTML ="Phases:";
	phasePanel.appendChild(title);
	for (var i = 1; i < currentCase.phases.length; i++) {
		var item = document.createElement("div");
		item.className = "phase";
		var button = document.createElement("button");
		button.id = "ptitle"+i;
		button.innerHTML = currentCase.phases[i].title;
		button.value = i;
		item.onclick = function(e) {
	 	 	var r = this.getBoundingClientRect();
			if (e.pageX  < (r.left+16)) {
				menu = document.getElementById("phaseMenu");
				document.getElementById("phaseTitle").value = this.firstElementChild.innerHTML;
				document.getElementById("submitTitle").value = document.getElementById("submitButton").firstElementChild.innerHTML;
				menu.style.left = e.pageX+"px";
				menu.style.top = e.pageY+"px";
				toggleMenu("visible");
			} else
				showPhase(this.firstChild.value);
		};
		item.appendChild(button);
		phasePanel.appendChild(item);
	};
}

function savePhase() {
	var input = document.getElementById("phaseTitle");
    currentCase.phases[currentPhase].title = input.value;
	var button = document.getElementById("submitTitle");
    currentCase.phases[currentPhase].submitTitle = button.innerHTML;
    document.getElementById("ptitle"+currentPhase).innerHTML = input.value;
    document.getElementById("submitButton").firstElementChild.innerHTML = button.value;
	saveCase();
	toggleMenu("hidden");
}
