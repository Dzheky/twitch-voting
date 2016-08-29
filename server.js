var express = require("express");
var session = require('express-session');
var request = require("request");
var bodyParser = require('body-parser');
var url = require('url');
var mongo = require('mongodb').MongoClient;
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var DBurl = `mongodb://${process.env.DBUser}:${process.env.DBPassword}@ds139715.mlab.com:39715/twitch_users`;
var sessions = [];
var channel = '';

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(session({secret: 'test', path: '*', resave: true, saveUninitialized: false, httpOnly: true})); //create sessionID


//authentication
app.get('/auth/user', function(req, res) { //Authanticate user
    var query = url.parse(req.originalUrl).query.split('&');
    query = query.map(function(element) {
        return element.split('=')[1];
    });
    console.log('response url: '+req.session.url)
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
                                users.count({}, function(err, id) {//getting id for the user
                                    users.insert({ _id: id, name: JSON.parse(body).name, sessionID: req.sessionID, polls: []});
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

//get polls based on name
app.get('/dashboard/:name', function(req, res) {
    if(req.session.name) {
         mongo.connect(DBurl, function(err, db) {
            if(err) throw err;
            var users = db.collection('users');
            var polls = db.collection('polls');
            users.find(req.params.name)
            //////////////////////////////////////////////////////////////////
            
         });
    } else {
        res.end();
    }
})


//is auth then you will get send to your dashboard
app.get('/dashboard', function(req, res) {
    if(req.session.name) {
        req.session.url = req.protocol + 's://' + req.get('host') + req.originalUrl;
        res.sendFile(__dirname + '/Public/dashboard.html');
    } else {
        var fullUrl = req.protocol + '://' + req.get('host').split(':')[0];
        console.log(req.get('host'));
        res.writeHead(301,
          {Location: fullUrl}
        );
        res.end();
    }
})


//check if user is authenticated
app.get('/auth/checklogin', function(req,res) {
    if(req.session.name) {
        res.json(JSON.stringify({auth:true}));
    } else {
        res.json(JSON.stringify({auth:false}));
    }
})

//POST request to save the poll
app.post('/post/:channel', function(req, res) {
    if(req.session.name) {
        mongo.connect(DBurl, function(err, db) {//get poll id number and send it through Socket.io
            var pollID = req.body.id
            if(err) throw err;
            var users = db.collection('users');
            var polls = db.collection('polls');
            req.body.polls.pop();
            polls.findOne({_id: pollID}, function(err, poll) {
                if(poll == null) {
                    polls.insertOne({_id: pollID, user: req.session.name, polls: req.body})
                } else {
                    poll = {_id: pollID, user: req.session.name, polls: req.body}
                    polls.updateOne({_id: pollID}, poll);
                }
                var user = users.findOne({name: req.session.name});
                user.then(function(data) {
                    if(data.polls.indexOf(pollID) === -1) {
                        data.polls.push(pollID)
                        users.updateOne({name: req.session.name}, data)
                    }
                })
                res.json(JSON.stringify({status: "done", id: pollID}));
            })
        })  
    } else {
        res.json(JSON.stringify({error: 'you are not logged in'}));
    }
})

//page to create a new poll on specific channel
app.get('/:channel', function(req, res) {
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
    channel = req.params.channel;
    res.sendFile(__dirname + '/Public/index.html');
});


//get next id for the new poll
app.get('/get/id', function(req,res) {
    var pollID;
    mongo.connect(DBurl, function(err, db) {
        db.collection('polls').count({}, function(err, id) {
                    if(err) throw err;
                    pollID = id;
                    if(req.session.name) {
                        db.collection('polls').insertOne({_id: pollID, data: 'placeholder'});
                        res.json(JSON.stringify({id: pollID}));
                    } else {
                        res.json(JSON.stringify({err: "not logged in"}));
                    }
                        
        });
    })
})

//get poll by id
app.get('/get/:id', function(req,res) {
    mongo.connect(DBurl, function(err, db) {
        if(err) throw err;
        var polls = db.collection('polls');
        polls.findOne({_id: +req.params.id}, function(err, poll) {
            if(err) throw err;
            if(poll === null) {
                res.json(JSON.stringify({err: 'this poll doesn\'t exist'}))
            } else {
                res.json(JSON.stringify(poll));
            }
        })
    })
})


//page to see the poll results
app.get('/id/:id', function(req, res) {
    var hour = 3600000;
    req.session.cookie.expires = new Date(Date.now() + hour);
    req.session.cookie.maxAge = hour;
    req.session.url = req.protocol + 's://' + req.get('host') + req.originalUrl;
    res.sendFile(__dirname+'/Public/poll.html');
})

//main page
app.get('/', function(req,res) {
    req.session.url = req.protocol + 's://' + req.get('host') + req.originalUrl;
    res.sendFile(__dirname + '/Public/channel.html');
});


app.use(express.static(__dirname+'/Public', {index: '_'}));




io.sockets.on('connection', function(socket) {
    console.log('connected');
    socket.on('vote', function(data) {
        socket.broadcast.emit('poll'+data.id, data);
    })
});






var PORT = process.env.PORT || 8080;

http.listen(PORT, function() {
    console.log('app is listening on: ' + PORT);
});