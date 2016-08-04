var url = require('url');
var auth = require('./auth.js');
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

socket.on('id', function(data) {
    pollID = data;
    console.log('poll ID: ' + data);
})

auth();

const Option = (props) => <div>{props.options.map(function(option) {
    return <div key={option.id}><span className={option.elementID} name={option.id} style={{cursor: 'pointer'}} id='delete'>X  </span><input type="text" className='option' name={option.id} placeholder={'option #'+option.id} id={option.elementID}/><strong className='peopleVoted' style={{display:'none'}}>{option.peopleVoted}</strong></div>
    
})}</div>;
$(document).ready(function() {
    console.log(document.cookie);
    var content = [];
    var question;
    var listeners = [];
    var namesOfVoted = [];
    var running = false;
    var id = 0;
    var typingTimer;
    
    function updatePoll(poll) {
        $.ajax({        url: '/post/'+channel,
                            headers: {
                              'Content-Type': 'application/JSON'  
                            },
                            method: 'POST',
                            data: JSON.stringify({question: question, poll: poll.map(function(element) {//for database
                                    return {id: element.id, value: element.value, peopleVoted: element.peopleVoted}
                                })}),
                            success: function(data) {
                                var socketData = {id: pollID, question: question, poll: poll.map(function(element) {//for broadcast
                                    return {id: element.id, value: element.value, peopleVoted: element.peoplevoted}
                                })}
                                socket.emit('vote', socketData);
                            }
            })
    }
    
    
    content.push({id: id, content: "option #"+id, elementID: 'lastOption', peopleVoted: 0});
    ReactDOM.render(<Option options={content}/>, document.getElementById('poll'), function() {
        $('.lastOption').parent().find('span').hide();
    });
    
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
        console.log(content);
        ReactDOM.render(<Option options={content}/>, document.getElementById('poll'), function() {
            $('.option').parent().find('span').show();
            $('.lastOption').parent().find('span').hide();
        });
    })
    
    $('#question').on('keyup', function() {
        question = $(this).val();
    });
    
    $("#poll").on('click','#delete', function() {
        var self = this;
        var indexToDelete = content.findIndex(function(e) {
            if(e.id == +$(self).attr('name')) {
                return true;
            } else {
                return false;
            }
        })
        console.log(indexToDelete);
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
            updatePoll(content);
              
            client.connect();
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