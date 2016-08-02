var express = require("express");
var session = require('express-session');
var request = require("request");
var url = require('url');
var mongo = require('mongodb').MongoClient;
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var DBurl = `mongodb://${process.env.DBUser}:${process.env.DBPassword}@ds139715.mlab.com:39715/twitch_users`;

var sessions = [];
mongo.connect(DBurl, function(err, db) {
    var users = db.collection('users');
});

var channel = '';
app.use(session({secret: 'test', path: '*', resave: true, saveUninitialized: false, httpOnly: true})); //create sessionID

app.get('/auth/user', function(req, res) { //Authanticate user
    var query = url.parse(req.originalUrl).query.split('&');
    query = query.map(function(element) {
        return element.split('=')[1];
    });
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
            if(JSON.parse(body).access_token) {//Authorisation got through
                mongo.connect(DBurl, function(err, db) {
                    var users = db.collection('users');
                    request({
                        url: 'https://api.twitch.tv/kraken/user',
                        method: 'GET',
                        headers: {
                            Accept: 'application/vnd.twitchtv.v3+json',
                            Authorization: 'OAuth '+JSON.parse(body).access_token
                        }
                    }, function(err, response, body) {
                        if(err) throw err;
                        users.findOne({name: JSON.parse(body).name}, function(err, user) {
                            if (user === null) {
                                users.count({}, function(err, id) {//getting next id
                                    users.insert({ _id: id, name: JSON.parse(body).name, sessionID: req.sessionID, polls: {}});
                                });
                            } else {
                                users.updateOne({name: JSON.parse(body).name}, { $set: {sessionID: req.sessionID}});
                            }
                        });
                        req.session.name = JSON.parse(body).name;
                        res.writeHead(302, {'Location': req.session.url});
                        res.end();
                    });
                });   
            } else {
                res.writeHead(302, {'Location': req.session.url});
                res.end();
            }
        });
    }
    
});


app.get('/:channel', function(req, res) {
    if(req.session.name) {
        req.params.name = req.session.name;
        console.log(req.params.name);
    }
    if (req.params.channel === 'favicon.ico') {
        res.writeHead(200, {'Content-Type': 'image/x-icon'} );
        res.end();
        console.log('favicon requested');
        return;
    }
    var hour = 3600000;
    req.session.cookie.expires = new Date(Date.now() + hour);
    req.session.cookie.maxAge = hour;
    req.session.url = req.protocol + 's://' + req.get('host') + req.originalUrl;
    console.log(req.session.url);
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
    console.log('user connected');
});






var PORT = process.env.PORT || 8080;

http.listen(PORT, function() {
    console.log('app is listening on: ' + PORT);
});