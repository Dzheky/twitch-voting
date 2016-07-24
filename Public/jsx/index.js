var url = require('url');
var socket = io();
var options = {
        options: {
            debug: true
        },
        connection: {
            reconnect: true
        }, 
        identity: {
            username: 'jackfromrussia',
            password: 'ss'
            
        }, 
        channels: []
    }
var channel = url.parse(window.location.href).pathname.split('/')[1];
options.channels.push(channel);
Twitch.init({clientId: 'cunpu7mzq6sedmgw50ekiw7ga4u8npo', redirect_uri: 'https://voting-app-dzheky.c9users.io/'}, function(error, status) {
    $('.twitch-connect').click(function() {
        Twitch.login({
            scope: ['user_read', 'chat_login']
        });
    })
    console.log(status);
    if(status.authenticated) {
        $('.twitch-connect').hide();
        options.identity.password = 'oauth:'+status.token;
        Twitch.api({method: 'user'}, function(error, user) {
            options.identity.username = user.name;
        });
        var client = tmi.client(options);
        client.connect();
    }
});

socket.on('option', function(data) {
    $('#channel').html(data.channel);
    $('#count').html(data.count);
})
