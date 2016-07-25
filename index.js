var express = require("express");
var twitch = require("./lib/client.js"); //twitch(60000, 'lirik', function(channel, userstate, message) 
var routing = require('./lib/route.js');
var bodyParser = require("body-parser");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(process.cwd()+'/Public'));
var channel = '';
app.get('/', function(req, res) {
    if (req.params.channel === 'favicon.ico') {
        res.writeHead(200, {'Content-Type': 'image/x-icon'} );
        res.end();
        console.log('favicon requested');
        return;
    }
    channel = req.params.channel
    ////res.writeHead(200, {"Content-Type": "text/html"});
    res.sendFile(__dirname + '/Public/index.html');
})
app.get('/:channel', function(req, res) {
    if (req.params.channel === 'favicon.ico') {
        res.writeHead(200, {'Content-Type': 'image/x-icon'} );
        res.end();
        console.log('favicon requested');
        return;
    }
    channel = req.params.channel
    ////res.writeHead(200, {"Content-Type": "text/html"});
    res.sendFile(__dirname + '/Public/setPoll.html');
     
});
io.on('connection', function(socket) {
    var data = {channel: channel, count: 0};
    var running = false;
    socket.emit('option', data);
    console.log('user connected')
    app.post('/', function(req, res) {
        if(running) {
            twitch.client.disconnect();
        }
        data.count = 0;
        running = true;
        twitch.getClient(req.body.time*1000, channel, 'jackfromrussia', process.env.PASSWORD, function(channel, userstate, message) {
 
            
            var messageArr = message.split(' ');
            if(messageArr.indexOf(req.body.option) !== -1) {
                data.count += 1;
                console.log(data.count);
                socket.emit('option', data);
            }
        })
    });
});

var PORT = process.env.PORT || 8080;

http.listen(PORT, function() {
    console.log('app is listening on: ' + PORT);
});