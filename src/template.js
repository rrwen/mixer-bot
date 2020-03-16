module.exports = options => {

    // Set greeting
    options.greeting = 'Hello!';

    // Setup channel ID
    // If left unset, this will be the id to your channel
    // Get your channel id here: https://mixer.com/api/v1/channels/<username>?fields=id
    // options.channel_id = '<CHANNEL_ID>';

    // Welcome a user when they join
    options.on.UserJoin = data => {
        socket = data.socket;
        return response => {
            socket.call('msg', [
                `Hi ${response.username}! I'm pingbot! Write !ping and I will pong back!`,
            ]);
        };
    };

    // Assign bot to pong user if they message !ping
    options.on.ChatMessage = data => {
        socket = data.socket;
        return response => {
            if (response.message.message[0].data.toLowerCase().startsWith('!ping')) {
                socket.call('msg', [`@${response.user_name} PONG!`]);
                console.log(`Ponged ${response.user_name}`);
            }
        };
    };

    // Handle errors
    options.on.error = data => {
        return error => {
            console.error('Socket error');
            console.error(error);
        };
    };

    // Return the chat bot options
    return options;
};