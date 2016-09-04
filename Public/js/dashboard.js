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

        getInitialState: function getInitialState() {
            return { visible: 'block' };
        },
        render: function render() {
            var self = this;
            function deleted() {
                $.getJSON('/delete/' + self.props.id, function (result) {
                    if (!result.msg) {
                        alert(result.error);
                    } else {
                        self.setState({ visible: 'none' });
                    }
                });
            }
            var options = [];
            this.props.options.forEach(function (element) {
                options.push(React.createElement(
                    'li',
                    { className: 'list-group-item option' },
                    React.createElement(
                        'span',
                        { className: 'badge' },
                        element.peopleVoted
                    ),
                    element.value
                ));
            });
            return React.createElement(
                'div',
                { className: 'col-sm-8 col-sm-offset-2 poll', style: { display: this.state.visible } },
                React.createElement(
                    'div',
                    { id: 'delete', onClick: deleted },
                    'x'
                ),
                React.createElement(
                    'a',
                    { href: this.props.href, id: this.props.id },
                    React.createElement(
                        'div',
                        { className: 'question' },
                        this.props.question
                    )
                ),
                React.createElement(
                    'ul',
                    { className: 'list-group options' },
                    options
                )
            );
        }
    });

    var Polls = React.createClass({
        displayName: 'Polls',

        render: function render() {
            var options = [];
            console.log(this.props.polls);
            this.props.polls.forEach(function (element) {
                if (!element.deleted) {
                    options.push(React.createElement(Poll, { id: element._id, href: '/id/' + element._id, question: element.polls.question,
                        options: element.polls.polls }));
                }
            });

            return React.createElement(
                'div',
                { className: 'container polls' },
                options.reverse()
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
