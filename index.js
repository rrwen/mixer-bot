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
 * @returns {Object} returns a mixerbot client.
 *
 * @example
 * var mixerbot = require('mixer-bot');
 */
module.exports = options => {
	
	// (module_options) Options for the module
	options = options || {};
	options.channel_id = options.channel_id || null;
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
