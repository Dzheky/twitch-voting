var auth = require('./auth.js');
var url = require('url');
var socket = io();



auth();

var poll;
var id = url.parse(window.location.href).pathname.split('/')[2];

$.getJSON('/get/'+id, function(data) {
    data = JSON.parse(data);
    if(data.err) {
        $('#question').html(data.err);
    } else {
        $('#question').html(data.question);
        console.log('id for socket is: '+id)
        socket.on('poll'+id, function(data) {
            $('#question').html(data.question)
            $('#options').html(data.poll[0].value+' ' +data.poll[0].peopleVoted);
        })
        
    }
})