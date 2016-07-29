var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(__dirname+'/Public', {index: '_'}));
var channel = '';
app.get('/', function(req,res) {
    res.sendFile(__dirname + '/Public/channel.html');
});
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