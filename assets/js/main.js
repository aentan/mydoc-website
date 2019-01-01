$(function() {

  // Header animation based on scroll
  jQuery.event.special.scrolldelta = {
    // from http://learn.jquery.com/events/event-extensions/
    delegateType: "scroll",
    bindType: "scroll",
    handle: function (event) {
      var handleObj = event.handleObj;
      var targetData = jQuery.data(event.target);
      var ret = null;
      var elem = event.target;
      var isDoc = elem === document;
      var oldTop = targetData.top || 0;
      var oldLeft = targetData.left || 0;
      targetData.top = isDoc ? elem.documentElement.scrollTop + elem.body.scrollTop : elem.scrollTop;
      targetData.left = isDoc ? elem.documentElement.scrollLeft + elem.body.scrollLeft : elem.scrollLeft;
      event.scrollTopDelta = targetData.top - oldTop;
      event.scrollTop = targetData.top;
      event.scrollLeftDelta = targetData.left - oldLeft;
      event.scrollLeft = targetData.left;
      event.type = handleObj.origType;
      ret = handleObj.handler.apply(this, arguments);
      event.type = handleObj.type;
      return ret;
    }
  };

  var $nav = $('.mydoc-navbar-menu .mydoc-navbar-nav');
  var navTopLimit = 48;
  var scrollSensitivity = 5;

  $(window).on('scrolldelta', function (e) {
    var top = e.scrollTop;
    var topDelta = e.scrollTopDelta;
    var left = e.scrollLeft;
    var leftDelta = e.scrollLeftDelta;

    var navTop = parseInt($nav.css("margin-top"));
    var navTopTarget = navTop -= (Math.abs(topDelta) > scrollSensitivity ? topDelta / scrollSensitivity : 0);

    var opacityTarget = (navTop + navTopLimit) / navTopLimit;

    if (navTopTarget < -navTopLimit) {
      navTopTarget = -navTopLimit;
    } else if (navTopTarget > 0) {
      navTopTarget = 0;
    }
    
    $nav.css({
      "margin-top": navTopTarget + "px",
      "opacity": opacityTarget
    });
  });

  // Contact form
  $('#contact-form').submit(function(e) {
    e.preventDefault();

    var form = $(this);
    var url = form.attr('action');
    var name = $('#name').val();
    var email = $('#email').val();
    var message = $('#message').val();
    var email_regex = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
    var validate = false;
    var error_msg = "";

    if (name.length < 1 || email.length < 1 || message.length < 1) {
      error_msg = "All fields should be filled.";
    } else if (!email_regex.test(email)) {
      error_msg = "Email address is not valid.";
    } else if (message.length < 10) {
      error_msg = "Message should be longer than 10 characters.";
    } else {
      validate = true;
      
      // show spinner
      $('.mydoc-form-validation').html("Please wait&hellip;");
    }

    if (validate == true) {
      $.ajax({
        method: 'POST',
        url: url,
        dataType: 'json',
        accepts: 'application/json',
        data: form.serialize(),
        success: (data) => {
          if (data.status = 200) {
            $('.mydoc-form-validation').html("Your message has been sent.");
          }
        },
        error: (err) => {
          console.log(err);
          $('.mydoc-form-validation').html(err.data);
        }
      });
    } else {
      // show validation error
      $('.mydoc-form-validation').html(error_msg);
    }

  });

  // SME Health+ form

});