mixerbot = require('./index')

options = {};
options.on = {};

options.on.ChatMessage = function(options) {
    socket = options.socket;
    return data => {
        if (data.message.message[0].data.toLowerCase().startsWith('!ping')) {
            socket.call('msg', [`@${data.user_name} PONG!`]);
            console.log(`Ponged ${data.user_name}`);
        }
    }
};
mixerbot(options);