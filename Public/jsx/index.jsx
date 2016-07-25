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
console.log(channel);
var client = tmi.client(options);
//client.connect();
socket.on('option', function(data) {
    $('#channel').html(data.channel);
    $('#count').html(data.count);
})


var Option = React.createClass({
    render: function() {
        return (
            <div>
                {this.props.options.map(function(option) {
                    return <div key={option.id}>{option.content}</div>
                })}
            </div>
        )
    }
});
$(document).ready(function() {
    var content = [];
    var id = 0;
    var counter = 0;
    $("#createPollBtn").on('click', function() {
        id++;
        content.push({id: id, content: "option #"+id});
        ReactDOM.render(<Option options={content}/>, document.getElementById('poll'));
    })
})