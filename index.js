var express = require("express");
var twitch = require("./lib/client.js"); //twitch(60000, 'lirik', function(channel, userstate, message) 
var routing = require('./lib/route.js');
var bodyParser = require("body-parser");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(process.cwd()+'/Public'));

app.get('/', function(req, res) {
    res.writeHead(200, {"Content-Type": "text/html"});
    res.sendFile('index.html');
});
io.on('connection', function(socket) {
    console.log('user connected')
    app.post('/', function(req, res) {
        var count = 0;
            twitch(req.body.time*1000, req.body.channel, function(channel, userstate, message) {
                var messageArr = message.split(' ');
                if(messageArr.indexOf(req.body.option) !== -1) {
                    count++;
                    socket.emit('option', count);
                }
        })
    });
});

var PORT = process.env.PORT || 8080;

http.listen(PORT, function() {
    console.log('app is listening on: ' + PORT);
});