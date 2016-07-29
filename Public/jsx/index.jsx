var url = require('url');
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
//client.connect();
socket.on('option', function(data) {
    console.log(data);
})


const Option = (props) => <div>{props.options.map(function(option) {
    return <div key={option.id} ><input type="text" className='option' name={option.id} placeholder={'option #'+option.id} id={option.elementID}/><strong className='peopleVoted' style={{display:'none'}}>{option.peopleVoted}</strong></div>
    
})}</div>;
$(document).ready(function() {
    var content = [];
    var listeners = [];
    var namesOfVoted = [];
    var id = 0;
    var typingTimer;
    var doneTypeingInterval = 100;
    
    content.push({id: id, content: "option #"+id, elementID: 'lastOption', peopleVoted: 0});
    ReactDOM.render(<Option options={content}/>, document.getElementById('poll'));
    
    $('#channel-search').on('submit', function(e) {
        e.preventDefault();
        console.log('hello there');
    })
    
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
        ReactDOM.render(<Option options={content}/>, document.getElementById('poll'));
    })
    
    $("#poll").on('keyup','.option', function() {
        clearTimeout(typingTimer);
        var self = this;
        typingTimer = setTimeout(function() {
           var name = +$(self).attr('name');
           content[name].value = $(self).val();
           console.log(content[name]);
        }, doneTypeingInterval);
    }); 
    $('#poll').on('keydown', '.option', function() {
        clearTimeout(typingTimer);
    })
    $('#startPoll').click(function() {
      $('.peopleVoted').show();
      $('.option').prop('disabled', true);
      $('#lastOption').parent().hide();
      console.log(content);
      for(var i = 0, length = content.length; i < length; i++) {
          listeners.push(content[i].value);
      }
      
      client.connect();
    })
    $('#stopPoll').click(function() {
        client.disconnect();
        listeners = [];
        $('.option').prop('disabled', false);
        $('#lastOption').parent().show();
    });
    client.on('chat', function(channel, userstate, message, self){
        var messageArr = message.split(' ');
        console.log(userstate);
        for(var i = 0, length = listeners.length; i < length; i++) {
            console.log(messageArr.indexOf(listeners[i]))
            if(messageArr.indexOf(listeners[i]) !== -1) {
                console.log(namesOfVoted, userstate.username);
                if(namesOfVoted.indexOf(userstate.username) == -1) {
                    console.log('here');
                    namesOfVoted.push(userstate.username);
                    content[i].peopleVoted++;
                    ReactDOM.render(<Option options={content}/>, document.getElementById('poll'));
                }
            }
        }
    })
    
})