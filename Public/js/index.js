var socket = io();

$('#count').html(0);
$('#form').submit(function() {
    $('#count').html(0);
})
socket.on('option', function(data) {
    console.log('hello');
    $('#channel').html(data.channel);
    $('#count').html(data.count);
})