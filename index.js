// Richard Wen
// rrwen.dev@gmail.com

require('dotenv').config()

const Mixer = require('@mixer/client-node');
const ws = require('ws');

/**
 * Creates a mixer bot client.
 *
 * @module mixer-bot
 * @param {Object} [options={}] options for the mixer-bot.
 * @param {String} options.channel_id channel id to join for the bot, which can be found here for a user: https://mixer.com/api/v1/channels/<username>?fields=id
 * @param {String} options.greeting the greeting message to display when the bot joins a channel
 * @param {Function} options.on a list of functions that define the mixer bot's response on channel actions (ChatMessage, UserJoin). Data is passed with reference to the mixer client (data.client) and ws socket (data.socket).
 * @returns {Object} returns a mixerbot client.
 *
 * @example
 * const mixerbot = require('mixer-bot');
 * 
 * // Create a .env file in the same location and set
 * // MIXER_ACCESS_TOKEN=***
 * // MIXER_CHANNEL_ID=***
 * 
 * // Setup options
 * var options = {};
 * options.on = {};
 * options.greeting = 'Hello!';
 * 
 * // Setup channel ID
 * // Get your channel id here: https://mixer.com/api/v1/channels/<username>?fields=id
 * options.channel_id = '<CHANNEL_ID>';
 * 
 * // Assign bot to greet user when they enter
 * options.on.UserJoin = data => {
 *     socket = data.socket;
 *     return response => {
 *         socket.call('msg',[
 *             `Hi ${data.username}! I'm pingbot! Write !ping and I will pong back!`,
 *         ]);
 *     }
 * };
 * 
 * // Assign bot to pong user if they message !ping
 * options.on.ChatMessage = data => {
 * 	socket = data.socket;
 * 	return response => {
 * 		if (response.message.message[0].data.toLowerCase().startsWith('!ping')) {
 * 			socket.call('msg', [`@${response.user_name} PONG!`]);
 * 			console.log(`Ponged ${response.user_name}`);
 * 		}
 * 	}
 * };
 * 
 * // Handle errors
 * options.on.error = data => {
 * 	return error => {
 * 		console.error('Socket error');
 * 		console.error(error);
 * 	}
 * };
 * 
 * // Run mixer bot
 * mixerbot(options);
 */
module.exports = options => {
	
	// (module_options) Options for the module
	options = options || {};
	options.channel_id = options.channel_id || process.env.MIXER_CHANNEL_ID || null;
	options.greeting = options.greeting || null;
	options.on = options.on || {};

	// (module_client) Create a mixer client
	const client = new Mixer.Client(new Mixer.DefaultRequestRunner());

	// (module_authenticate) Authenticate the client
	client.use(new Mixer.OAuthProvider(client, {
		tokens: {
			access: process.env.MIXER_ACCESS_TOKEN,
			expires: Date.now() + (365 * 24 * 60 * 60 * 1000) // 1 year
		}
	}));

	// (module_return) Return a promise object created from the options
	return get_user_info(client).then(async user_info => {

		// (module_return_socket) Create a socket from joining a chat channel
		const socket = await join_chat(client, user_info.id, options.channel_id || user_info.channel.id);
	
		// (module_return_greet) Greeting message
		if (options.greeting != null) {
			socket.call('msg', [options.greeting]);
		}
	
		// (module_return_actions) Assign actions to the socket for the bot
		data = {'client': client, 'socket': socket};
		for (const action in options.on) {
			socket.on(action, options.on[action](data))
		}
		return data;
	});
};

/** 
 * Gets our Currently Authenticated Mixer user's information.
 * This returns an object full of useful information about the user whose OAuth Token we provided above.
 * 
 * @param {Object} client the mixer client to use for requesting information.
 * 
 * @returns {Promise.<>}
 */
async function get_user_info(client) {
	return client.request('GET', 'users/current').then(response => response.body);
}

/**
 * Gets connection information from Mixer's chat servers
 * 
 * @param {Number} channel_id the channel_id of the channel you'd like to get connection information for.
 * 
 * @returns {Promise.<>}
 */
async function get_connection_info(client, channel_id) {
	return new Mixer.ChatService(client)
		.join(channel_id)
		.then(response => response.body);
}

/**
 * Creates a Mixer chat socket and authenticates
 * 
 * @param {number} user_id The user to authenticate as
 * @param {number} channel_id The channel id of the channel you want to join
 * 
 * @returns {Promise.<>}
 */
async function join_chat(client, user_id, channel_id) {
    const join_info = await get_connection_info(client, channel_id);
    const socket = new Mixer.Socket(ws, join_info.endpoints).boot();
	return socket.auth(channel_id, user_id, join_info.authkey)
		.then(() => socket);
}
