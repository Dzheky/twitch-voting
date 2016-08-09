var auth = require('./auth.js');
var url = require('url');
var drawPoll = require("./drawPoll.js")
var socket = io();
var content = [];
var drawPolls = drawPoll(content);



auth();

var poll;
var id = url.parse(window.location.href).pathname.split('/')[2];
$.getJSON('/get/'+id, function(data) {
    data = JSON.parse(data);
    if(data.err) {
        $('#question').html(data.err);
    } else {
        $('#question').html(data.question);
        console.log('id for socket is: '+id)
        var ol = d3.select("#options").append('ol')
        function update(dat) {
            drawPolls.updatePie(dat);
            d3.select('#question')
                .text(function() {
                    return dat.question
                })
           var x = ol.selectAll('li').data(dat.polls);
           
                x.attr('class', 'update');
                x.text(function(element) {
                    return element.value + "    "+element.peopleVoted;
                })
                x.enter().append('li')
                .text(function(element) {
                    return element.value + "    "+element.peopleVoted;
                })

                // .selectAll('li')
                // .data(data.poll)
                // .enter().append('span').html('hello world');
        }
        update(data.polls);
        socket.on('poll'+id, function(data) {
            update(data);
        })
        
    }
})