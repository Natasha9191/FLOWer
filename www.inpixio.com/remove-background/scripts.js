'use strict';
(function () {

    var LANG_URL = document.getElementById("lang_url").value;
    var strGET = window.location.search.replace( '?', '');
    var CUTTER_UI_URL = LANG_URL;
    var API_STORAGE_URL = "https://api-online.inpixio.com/api/storage/file/upload";

    document.addEventListener('DOMContentLoaded', function () {        
        var fileDropElems = document.getElementsByClassName("file-drop");
        for (var i = 0; i < fileDropElems.length; i++) {
            fileDropElems[i].addEventListener('drop', handleDropFiles, false);
            fileDropElems[i].addEventListener('dragenter', dragEnter, false);
            fileDropElems[i].addEventListener('dragleave', dragLeave, false);
            fileDropElems[i].addEventListener('dragover', dragOver, false);
        }

        var fileChooseElems = document.getElementsByClassName("file-choose");
        for (var i = 0; i < fileChooseElems.length; i++) {
            fileChooseElems[i].addEventListener('click', function(e) {  e.target.value = '';}, false);
            fileChooseElems[i].addEventListener('change', function(e) { handleFiles(this.files);}, false);
            fileChooseElems[i].setAttribute("accept", ".jpg,.jpeg,.gif,.png");

        }

        var fileUrlElems = document.getElementsByClassName("file-url");
        for (var i = 0; i < fileUrlElems.length; i++) {
            fileUrlElems[i].addEventListener('keyup', function(e){ onUrlEnter(this, e);}, false);
        }

        var fileExampleElems = document.getElementsByClassName("file-example");
        for (var i = 0; i < fileExampleElems.length; i++) {
            fileExampleElems[i].addEventListener('click', handleExample, false);
        }
        
        var exampleImageElems = document.getElementsByClassName("example-image");
        for (var i = 0; i < exampleImageElems.length; i++) {
            exampleImageElems[i].addEventListener('click', handleExampleImage, false);
        }

        var toggleParentClassElems = document.getElementsByClassName("toggle-parent-class");
        for (var i = 0; i < toggleParentClassElems.length; i++) {
            toggleParentClassElems[i].addEventListener('click', function(e) { toggleParentClass(this); }, false);
        }

        var closeErrorPopupElems = document.getElementsByClassName("close-error");
        for (var i = 0; i < closeErrorPopupElems.length; i++) {
            closeErrorPopupElems[i].addEventListener('click', function(e) { showHideErrorPopup(false); }, false);
        }
    });

    function toggleParentClass(element) {
        element.parentElement.classList.toggle('active');
    }

    function handleFiles(files) {
        if (!files || files.length == 0)
            return;
        var formData = new FormData();
        formData.append("file", files[0]);
        postFormData(formData);
    }

    function onUrlEnter(element, event) {
        if (event.keyCode !== 13) {
            return;
        }
        var url = element.value;
        handleUrl(url);
    }

    function handleExample() {
        handleUrl(window.location.protocol + '//' + window.location.host + "/images/cactus.jpg");
    }
    
    let handleExampleImage = function(e) {
        let imageUrl = this.getAttribute('href');
        handleUrl(imageUrl);
        e.preventDefault();
    };

    function handleUrl(url) {
        if (!url || !/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g.test(url)) {
            setErrorMessage("Invalid URL");
            return;
        }
        setErrorMessage("");

        var formData = new FormData();
        formData.append("url", url);
        postFormData(formData);
    }

    function handleDropFiles(event) {
        event.preventDefault();

        var files = [];
        if (event.dataTransfer.items) {
            for (var i = 0; i < event.dataTransfer.items.length; i++) {
                if (event.dataTransfer.items[i].kind === 'file') {
                    files.push(event.dataTransfer.items[i].getAsFile());
                }
            }
        } else {
            for (var i = 0; i < event.dataTransfer.files.length; i++) {
                files.push(event.dataTransfer.files[i]);
            }
        }
        handleFiles(files);
    }

    function dragOver(event) {
        event.preventDefault();
    }

    function dragEnter(event) {
        event.target.classList.add("dragover");
    }

    function dragLeave(event) {
        event.target.classList.remove("dragover");
    }

    function postFormData(formData) {
        var xhr = new XMLHttpRequest();
        xhr.onerror = function () {
            setProcessing(false);
            showHideErrorPopup(true);
        };
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                setProcessing(false);
                if (xhr.status == 200) {
                    var fileId = xhr.response;
                    if (fileId.indexOf('"') == 0) {
                        fileId = fileId.slice(1);
                    }
                    if (fileId.lastIndexOf('"') == fileId.length - 1) {
                        fileId = fileId.slice(0, -1);
                    }
                    if (fileId.length > 0) {
                        window.top.location.href = CUTTER_UI_URL + fileId + '?r=background&' + strGET;
                    }
                } else {
                    showHideErrorPopup(true);
                }
            }
        };
        setProcessing(true);
        xhr.open("POST.html", API_STORAGE_URL);
        xhr.send(formData);
    }

    function setProcessing(val) {
        var fileProcessingElems = document.getElementsByClassName("loading");
        for (var i = 0; i < fileProcessingElems.length; i++) {
            fileProcessingElems[i].classList[val ? "add" : "remove"]("active");
        }
    }

    function showHideErrorPopup(show) {
        var errorPopup = document.getElementById("error-popup");
        if (!errorPopup)
            return;
        errorPopup.classList[show ? "add" : "remove"]("active");
    }

    function setErrorMessage(text){
        var errorMessage = document.getElementById("error-message");
        if (!errorMessage)
            return;
        errorMessage.innerText = text;
    }
})();

// Lazy load images
function init() {
  var imgDefer = document.getElementsByTagName('img');
  for (var i = 0; i < imgDefer.length; i++) {
    if (imgDefer[i].getAttribute('data-src')) {
      imgDefer[i].setAttribute('src',imgDefer[i].getAttribute('data-src'));
    }
  }
}

window.onload = init;

function toggleMenu() {
  var element = document.getElementById('body');
  element.classList.toggle('menu-active');
}

