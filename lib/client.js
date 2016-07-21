var tmi = require("tmi.js");
function getClient(time, channel, callback) {
    var options = {
        options: {
            debug: true
        },
        connection: {
            reconnect: true
        }, 
        identity: {
            username: "JackFromRussia",
            password: process.env.PASSWORD
            
        }, 
        channels: ['#'+channel]
    }
    
    var client = tmi.client(options);
    client.connect();
    
    client.on('chat', callback)
    setTimeout(function() {
        client.disconnect();
    }, time+2000);
}


module.exports = getClient;