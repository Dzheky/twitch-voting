var url = require('url');
var auth = require('./auth.js');
var drawPoll = require("./drawPoll.js")
var pollID;
var socket = io();
var options = {
        options: {
            debug: true
        },
        connection: {
            reconnect: true,
            secure: true
        }, 
        channels: []
    }
var channel = url.parse(window.location.href).pathname.split('/')[1];
options.channels.push(channel);
var client = tmi.client(options);


auth();

const Option = (props) => <div>{props.options.map(function(option) {
    return <div key={option.id}><span className={option.elementID} name={option.id} style={{cursor: 'pointer'}} id='delete'>X  </span><input type="text" className='option' name={option.id} placeholder={'option #'+option.id} id={option.elementID}/><strong className='peopleVoted' style={{display:'none'}}>{option.peopleVoted}</strong></div>})}</div>;


$(document).ready(function() {
    var content = [];
    var question;
    var listeners = [];
    var namesOfVoted = [];
    var running = false;
    var firstTimeRun = true;
    var id = 0;
    var drawPolls = drawPoll(content);
    function updatePoll(poll) {
        $.ajax({        url: '/post/'+channel,
                            headers: {
                              'Content-Type': 'application/JSON'  
                            },
                            method: 'POST',
                            data: JSON.stringify({id: pollID, question: question, polls: poll.map(function(element) {//for database
                                    return {id: element.id, value: element.value, peopleVoted: element.peopleVoted}
                                })}),
                            success: function(data) {
                                data = JSON.parse(data);
                                var socketData = {id: pollID, question: question, polls: poll.map(function(element) {//for broadcast
                                    return {id: element.id, value: element.value, peopleVoted: element.peopleVoted}
                                })}
                                drawPolls.updatePie(socketData);
                                socket.emit('vote', socketData);
                            }
            })
    }
    
    
    content.push({id: id, content: "option #"+id, elementID: 'lastOption', peopleVoted: 0});
    ReactDOM.render(<Option options={content}/>, document.getElementById('poll'), function() {
        $('.lastOption').parent().find('span').hide();
    });
    //adding new option on focus
    $("#poll").on('focus','#lastOption', function() {
        id++;
        content.push({id: id, content: "option #"+id, elementID: 'option', peopleVoted: 0});
        content = content.map(function(element) {
            element.elementID = 'option'
            if(content.indexOf(element) == content.length-1) {
                element.elementID = 'lastOption';
            }
            return element;
        })
        ReactDOM.render(<Option options={content}/>, document.getElementById('poll'), function() {
            $('.option').parent().find('span').show();
            $('.lastOption').parent().find('span').hide();
        });
    })
    //save typed question
    $('#question').on('keyup', function() {
        question = $(this).val();
    });
    //poll option deleting
    $("#poll").on('click','#delete', function() {
        var self = this;
        var indexToDelete = content.findIndex(function(e) {
            if(e.id == +$(self).attr('name')) {
                return true;
            } else {
                return false;
            }
        })
        content.splice(indexToDelete, 1);

        ReactDOM.render(<Option options={content}/>, document.getElementById('poll'));
    })
    
    $("#poll").on('keyup','.option', function() {
        var name = +$(this).attr('name');
        content[name].value = $(this).val();
    }); 
    $('#startPoll').click(function() {
        if(!running) {
            running = true;
            $('.peopleVoted').show();
            $('.option').prop('disabled', true);
            $('#question').prop('disabled', true);
            $('#question').off();
            $('#lastOption').parent().hide();
            for(var i = 0, length = content.length; i < length; i++) {
                listeners.push({value: content[i].value, id: content[i].id});
            }
            if(firstTimeRun) {
                $.getJSON('/get/id', function(data) {
                    data = JSON.parse(data);
                    if(data.id) {
                        pollID = data.id;
                        console.log('id of the poll is ' +pollID);
                        updatePoll(content);
                        client.connect();
                        firstTimeRun = false;
                    }
                })
            } else {
                updatePoll(content);
                client.connect();
            }
        }
    })
    $('#stopPoll').click(function() {
        if(running) {
            running = false;
            client.disconnect();
            listeners = [];
            $('#lastOption').parent().show();
            $('#lastOption').parent().find('strong[class=peopleVoted]').hide();
            $('#lastOption').prop('disabled', false);
            $('[id=delete]').prop('disabled', false);
        }
    });
    client.on('chat', function(channel, userstate, message, self){
        var messageArr = message.split(' ');
        for(var i = 0, length = listeners.length; i < length; i++) {
            if(messageArr.indexOf(listeners[i].value) !== -1) {//if message contains the option
                if(namesOfVoted.indexOf(userstate.username) == -1) {//if person already voted
                    namesOfVoted.push(userstate.username);//push person to voted list
                    var indexOfOption = content.findIndex(function(e) {//find index of voted option
                        if(e.value == listeners[i].value) {
                            return true;
                        } else {
                            return false;
                        }
                    })
                    content[indexOfOption].peopleVoted++;
                    updatePoll(content);
                    ReactDOM.render(<Option options={content}/>, document.getElementById('poll'));
                }
            }
        }
    })
    
})