const Mixer = require('@mixer/client-node');
const ws = require('ws');

/** 
 * Assigns the default options for mixerbot.
 * 
 * @param {Object} options an options object to assign defaults.
 * 
 * @returns {Object} the default options.
 */
var assign_default_options = (options) => {
	options = options || {};
	options.env = options.env || './.env';
	options.channel_id = options.channel_id || process.env.MIXER_CHANNEL_ID || null;
	options.greeting = options.greeting || null;
	options.on = options.on || {};
	return options;
};

/**
 * Gets connection information from Mixer's chat servers
 * 
 * @param {Number} channel_id the channel_id of the channel you'd like to get connection information for.
 * 
 * @returns {Promise.<>}
 */
var get_connection_info = async (client, channel_id) => {
	return new Mixer.ChatService(client)
		.join(channel_id)
		.then(response => response.body);
};

/** 
 * Gets our Currently Authenticated Mixer user's information.
 * This returns an object full of useful information about the user whose OAuth Token we provided above.
 * 
 * @param {Object} client the mixer client to use for requesting information.
 * 
 * @returns {Promise.<>}
 */
var get_user_info = async (client) => {
	return client.request('GET', 'users/current').then(response => response.body);
};

/**
 * Creates a Mixer chat socket and authenticates
 * 
 * @param {number} user_id The user to authenticate as
 * @param {number} channel_id The channel id of the channel you want to join
 * 
 * @returns {Promise.<>}
 */
var join_chat = async (client, user_id, channel_id) => {
    const join_info = await get_connection_info(client, channel_id);
    const socket = new Mixer.Socket(ws, join_info.endpoints).boot();
	return socket.auth(channel_id, user_id, join_info.authkey)
		.then(() => socket);
};

module.exports = {assign_default_options, get_connection_info, get_user_info, join_chat};