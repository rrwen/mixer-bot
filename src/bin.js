#!/usr/bin/env node
// Richard Wen
// rrwen.dev@gmail.com

const lodash = require('lodash');
const mixerbot = require('../index');

// (bin_argv) Construct command line interface
var argv = require('yargs')
    .usage('\nCommand line tool for running mixer bots.\n\nUsage: \n\  $0 <name> [options]')
    .describe('name', 'name of the mixerbot or path to a mixerbot js file')
    .describe('env', 'path to the .env file')
    .describe('channel_id', 'Channel id to join')
    .describe('greeting', 'Greeting when a user joins a channel')
    .example('$0 path/to/bot.js', 'Run a bot using the js file')
    .example('$0 channel_id=123456', 'Run a bot joining on channel_id')
    .example('$0 greeting="Welcome!"', 'Change welcome message when a user joins');

// (bin_run) Run if arguments supplied
if (argv._.length > 0) {

    // (bin_run_name) Get the name of the mixerbot or path to mixerbot js file
    var name = argv._[1];

    // (bin_run_mixerbot) Run the requested mixerbot options
    var bot_options = require(name);
    var options = lodash.merge(bot_options, argv)
    mixerbot(argv);
}
