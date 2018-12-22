// CSS class utils

function hasClass(el, className) {
  if (el.classList) {
    return el.classList.contains(className);
  } else {
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
  }
}

function addClass(el, className) {
  if (el.classList) {
    el.classList.add(className);
  } else if (!hasClass(el, className)) {
    el.className += " " + className;
  }
}

function removeClass(el, className) {
  if (el.classList) {
    el.classList.remove(className)
  } else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className = el.className.replace(reg, ' ')
  }
}

// Modal

var pageModal = document.querySelectorAll('.tk-modal')[0];
var modalContent = document.querySelectorAll('.tk-modal-content')[0];
var modalOverlay = document.getElementsByClassName("tk-modal-overlay")[0];
var body = document.getElementsByTagName("body")[0];

var loadPage = function (pageUrl) {
  var request = new XMLHttpRequest();

  request.open('GET', pageUrl, true);

  request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
      // Success!
      addClass(pageModal, "open");
      var resp = request.responseText;
      var parser = new DOMParser();
      var doc = parser.parseFromString(resp, "text/html");
      modalContent.innerHTML = '';
      modalContent.innerHTML = doc.getElementsByTagName("main")[0].innerHTML;
      addClass(body, "tk-modal-open");
    } else {
      // We reached our target server, but it returned an error
      console.log(request);
    }
  };

  request.onerror = function () {
    // There was a connection error of some sort
    console.log(request);
  };

  request.send();
};