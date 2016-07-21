console.log('hello there');
var socket = io();

$('#count').html(0);
socket.on('option', function(count) {
    $('#count').html(count);
})