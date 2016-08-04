var auth = require('./auth.js');
var url = require('url');



auth();

var poll;
var id = url.parse(window.location.href).pathname.split('/')[2];

console.log(id);
$.getJSON('/get/'+id, function(data) {
    data = JSON.parse(data);
    if(data.err) {
        $('#question').html(data.err);
    } else {
        console.log(data);
    }
})