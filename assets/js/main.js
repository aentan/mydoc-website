$(function() {

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

});