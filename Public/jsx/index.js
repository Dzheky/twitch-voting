
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
            password: 'oauth:5nyeejp686yfwirfvledivvnmho1ev'
            
        }, 
        channels: ['#lirik']
    }
var client = tmi.client(options);
client.connect();

Twitch.init({clientId: 'cunpu7mzq6sedmgw50ekiw7ga4u8npo',
    redirect_uri: 'https://voting-app-dzheky.c9users.io/'
}, function(error, status) {
    if(status.authenticated) {
        console.log('hello there')
        $('.twitch-connect').hide();
    }
    console.log(status);
    $('.twitch-connect').click(function() {
        Twitch.login({
            scope: ['user_read', 'channel_read']
        });
    })
});
Twitch.api({method: 'channel'}, function(error, channel) {
  console.log(channel);
});
Twitch.api({method: 'user'}, function(error, user) {
  console.log(user);
});

socket.on('option', function(data) {
    $('#channel').html(data.channel);
    $('#count').html(data.count);
})
