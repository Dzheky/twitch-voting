var express = require("express");
var twitch = require("./lib/client.js");

var app = express();

twitch(60000, 'lirik', function(channel, userstate, message) {
    console.log(message);
})