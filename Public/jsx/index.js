var url = require('url');
var socket = io();
var options = {
        options: {
            debug: true
        },
        connection: {
            reconnect: true,
            secure: true
        }, 
        channels: []
    }
var channel = url.parse(window.location.href).pathname.split('/')[1];
options.channels.push(channel);
console.log(channel);
var client = tmi.client(options);
client.connect();
socket.on('option', function(data) {
    $('#channel').html(data.channel);
    $('#count').html(data.count);
})
