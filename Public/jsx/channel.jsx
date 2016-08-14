require('./auth.js')();
$(document).ready(function() {
    function redirect() {
       window.location.href = window.location.href+$('#channelName').val();
    }
    $('#submit').click(redirect);
    $('#channelName').keypress(function (e) {
      if (e.which == 13) {
        redirect();
      }
    });
})