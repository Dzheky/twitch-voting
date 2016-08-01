var express = require("express");
var session = require('express-session');
var request = require("request");
var url = require('url');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var sessions = [];

var channel = '';
app.use(session({secret: 'test', path: '*', resave: true, saveUninitialized: false, httpOnly: true})); //create sessionID
app.get('/auth/user', function(req, res) { //Authanticate user
    console.log(req.sessionID);
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
                var hour = 3600000
                req.session.value = req.sessionID;
                req.session.cookie.expires = new Date(Date.now() + hour)
                req.session.cookie.maxAge = hour
                console.log(req.session.cookie.maxAge);
                request({
                    url: 'https://api.twitch.tv/kraken/user',
                    method: 'GET',
                    headers: {
                        Accept: 'application/vnd.twitchtv.v3+json',
                        Authorization: 'OAuth '+JSON.parse(body).access_token
                    }
                }, function(err, response, body) {
                    if(err) throw err;
                    var indexOfUser = sessions.findIndex(function(element) {
                        if(element.name == JSON.parse(body).name) {
                            return true;
                        } else return false;
                    })
                    if(indexOfUser === -1) {
                        sessions.push({name: JSON.parse(body).name, sessionID: req.sessionID, polls: {}});
                    } else {
                        if(sessions[indexOfUser].sessionID !== req.sessionID) {
                            sessions[indexOfUser].sessionID = req.sessionID;
                        }
                    }
                
                    res.send(sessions)
                })
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
    socket.emit('option', data);
    console.log('user connected')
});

var PORT = process.env.PORT || 8080;

http.listen(PORT, function() {
    console.log('app is listening on: ' + PORT);
});