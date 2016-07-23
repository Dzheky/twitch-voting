(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

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
};
var client = tmi.client(options);
client.connect();

Twitch.init({ clientId: 'cunpu7mzq6sedmgw50ekiw7ga4u8npo',
    redirect_uri: 'https://voting-app-dzheky.c9users.io/'
}, function (error, status) {
    if (status.authenticated) {
        console.log('hello there');
        $('.twitch-connect').hide();
    }
    console.log(status);
    $('.twitch-connect').click(function () {
        Twitch.login({
            scope: ['user_read', 'channel_read']
        });
    });
});
Twitch.api({ method: 'channel' }, function (error, channel) {
    console.log(channel);
});
Twitch.api({ method: 'user' }, function (error, user) {
    console.log(user);
});

socket.on('option', function (data) {
    $('#channel').html(data.channel);
    $('#count').html(data.count);
});

},{}]},{},[1]);
