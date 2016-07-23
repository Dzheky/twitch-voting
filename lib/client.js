var tmi = require("tmi.js");
var objClient = {
        getClient: '',
}
function getClient(time, channel, username, password, callback) {
    var options = {
        options: {
            debug: true
        },
        connection: {
            reconnect: true
        }, 
        identity: {
            username: username,
            password: password
            
        }, 
        channels: ['#'+channel]
    }
    
    var client = tmi.client(options);
    objClient.client = client;
    client.connect();
    
    client.on('chat', callback)
    setTimeout(function() {
        client.disconnect();
    }, time+2000);
}
objClient.getClient = getClient;

module.exports = objClient;