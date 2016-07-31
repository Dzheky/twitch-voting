var express = require("express");
var request = require("request");
var url = require('url');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);



var channel = '';
app.get('/auth/user', function(req, res) {
    var query = url.parse(req.originalUrl).query.split('&');
    query = query.map(function(element) {
        return element.split('=')[1];
    })
    if(query[2] == 'test') {
        request({
            url: 'https://api.twitch.tv/kraken/oauth2/token',
            method: 'POST',
            body:   'client_id=cunpu7mzq6sedmgw50ekiw7ga4u8npo'+
                    '&client_secret='+process.env.CLIENT_SECRET+
                    '&grant_type=authorization_code'+
                    '&redirect_uri=https://voting-app-dzheky.c9users.io/auth/user'+
                    '&code='+query[0]+
                    '&state=test',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
        }, function(err, response, body) {
            if(err) throw err;
            if(JSON.parse(body).access_token) {
                res.send(response)
            }
        })
    }
    
})
app.get('/:channel', function(req, res) {
    console.log(req.params.channel)
    if (req.params.channel === 'favicon.ico') {
        res.writeHead(200, {'Content-Type': 'image/x-icon'} );
        res.end();
        console.log('favicon requested');
        return;
    }
    channel = req.params.channel;
    res.sendFile(__dirname + '/Public/index.html');
     
});
app.get('/', function(req,res) {
    res.sendFile(__dirname + '/Public/channel.html');
});
app.use(express.static(__dirname+'/Public', {index: '_'}));


io.on('connection', function(socket) {
    var data = {channel: channel, count: 0};
    var running = false;
    socket.emit('option', data);
    console.log('user connected')
});

var PORT = process.env.PORT || 8080;

http.listen(PORT, function() {
    console.log('app is listening on: ' + PORT);
});