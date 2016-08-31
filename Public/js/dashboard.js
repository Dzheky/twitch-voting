(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

function auth() {
    $.getJSON('/auth/checklogin', function (data) {
        data = JSON.parse(data);
        if (!data.auth) {
            $('#twitchLogin').show();
            $('#twitchLogin').click(function () {
                window.location.href = 'https://api.twitch.tv/kraken/oauth2/authorize' + '?response_type=code' + '&client_id=cunpu7mzq6sedmgw50ekiw7ga4u8npo' + '&redirect_uri=https://voting-app-dzheky.c9users.io/auth/user' + '&scope=user_read' + '&state=test';
            });
        } else {
            $('#dashboard').show();
            $('#dashboard').click(function () {
                window.location.href = '/dashboard';
            });
        }
    });
}

module.exports = auth;

},{}],2:[function(require,module,exports){
'use strict';

require('./auth.js')();

$(document).ready(function () {
    var Poll = React.createClass({
        displayName: 'Poll',

        render: function render() {
            var options = [];
            this.props.options.forEach(function (element) {
                options.push(React.createElement(
                    'div',
                    { className: 'option' },
                    element.value + ' ' + element.peopleVoted
                ));
            });
            console.log(this.props.question);
            console.log(this.props.options);
            return React.createElement(
                'div',
                { className: 'col-xs-12 poll' },
                React.createElement(
                    'div',
                    { className: 'question' },
                    this.props.question
                ),
                React.createElement(
                    'div',
                    { className: 'options' },
                    options
                )
            );
        }
    });

    var Polls = React.createClass({
        displayName: 'Polls',

        render: function render() {
            var options = [];
            this.props.polls.forEach(function (element) {
                options.push(React.createElement(Poll, { question: element.polls.question,
                    options: element.polls.polls }));
            });

            return React.createElement(
                'div',
                { className: 'container polls' },
                options
            );
        }
    });

    $.getJSON('/dashboard/get', function (data) {
        ReactDOM.render(React.createElement(Polls, { polls: data.polls }), document.getElementById('insertPolls'), function () {
            console.log('done');
        });
    });
});

},{"./auth.js":1}]},{},[2]);
