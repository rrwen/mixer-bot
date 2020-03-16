require('log-timestamp');
const helpers = require('./helpers');
const Mixer = require('@mixer/client-node');

/**
 * Creates a mixer bot client and runs it based on a set of options.
 *
 * @module mixer-bot
 * @param {Object} [options={}] options for the mixer-bot.
 * @param {String} options.env path to the .env file.
 * @param {String} options.channel_id channel id to join for the bot, which can be found here for a user: https://mixer.com/api/v1/channels/<username>?fields=id
 * @param {String} options.greeting the greeting message to display when the bot joins a channel (If you use "@me" here it will be replaced with your username)
 * @param {Function} options.on a list of functions that define the mixer bot's response on channel actions (ChatMessage, UserJoin). Data is passed with reference to the mixer client (data.client), ws socket (data.socket), API user information (data.user_info), and these options (data.options).
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
 * // If left unset, this will be the id to your channel
 * // Get your channel id here: https://mixer.com/api/v1/channels/<username>?fields=id
 * // options.channel_id = '<CHANNEL_ID>';
 * 
 * // Assign bot to greet user when they enter
 * options.on.UserJoin = data => {
 *     socket = data.socket;
 *     return response => {
 *         socket.call('msg',[
 *             `Hi ${response.username}! I'm pingbot! Write !ping and I will pong back!`,
 *         ]);
 *     }
 * };
 * 
 * // Assign bot to pong user if they message !ping
 * options.on.ChatMessage = data => {
 * 	socket = data.socket;
 * 	return response => {
 * 		if (response.message.message[0].data.toLowerCase().startsWith('!ping')) {
 * 			socket.call('msg', [`@${response.username} PONG!`]);
 * 			console.log(`Ponged ${response.username}`);
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
	options = helpers.assign_default_options(options);

	// (module_env) Load the environment file
	require('dotenv').config({path: options.env});

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
	return helpers.get_user_info(client).then(async user_info => {

		// (module_return_socket) Create a socket from joining a chat channel
		options.channel_id = options.channel_id || user_info.channel.id;
		const socket = await helpers.join_chat(client, user_info.id, options.channel_id);
	
		// (module_return_greet) Greeting message
		if (options.greeting != null) {
			socket.call('msg', options.greeting.replace('@me', user_info.username).split('\n'));
		}
	
		// (module_return_actions) Assign actions to the socket for the bot
		data = {'client': client, 'options': options, 'socket': socket, 'user_info': user_info, };
		for (const action in options.on) {
			socket.on(action, options.on[action](data))
		}
		return data;
	});
};