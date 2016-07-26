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
    return <div><input key={option.id} type="text" name={'option'+option.id} placeholder={'option #'+option.id} id={option.elementID}/></div>
    
})}</div>;
$(document).ready(function() {
    var content = [];
    var id = 1;
    content.push({id: id, content: "option #"+id, elementID: 'lastOption'});
    ReactDOM.render(<Option options={content}/>, document.getElementById('poll'));
    $("#poll").on('focus','#lastOption', function() {
        id++;
        content.push({id: id, content: "option #"+id, elementID: 'option'});
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
})