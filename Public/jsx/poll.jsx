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
            var total = [];
            dat.polls.map(function(element) {
                total.push(element.peopleVoted);
            })
            total = total.reduce(function(pre, curr) {
                return pre+curr;
            })
            console.log(total);
            d3.select('#question')
                .text(function() {
                    return dat.question
                })
           var x = ol.selectAll('li').data(dat.polls);
                x.attr('class', 'update');
                x.html(function(element) {
                    var percent = (element.peopleVoted/total*100).toFixed(1);
                    if(element.peopleVoted == 0) percent= '0.00';
                    return element.value + "    <span id='percent'>"+percent+"%</span>";
                })
                x.enter().append('li')
                .html(function(element) {
                    var percent = (element.peopleVoted/total*100).toFixed(1);
                    if(element.peopleVoted == 0) percent= '0.00';
                    return element.value + "    <span id='percent'>"+percent+"%</span>";
                })
                
                x.exit().remove();

        }
        update(data.polls);
        socket.on('poll'+id, function(data) {
            update(data);
        })
        
    }
})