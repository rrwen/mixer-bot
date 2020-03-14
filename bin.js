#!/usr/bin/env node

var argv = require('yargs')
    .usage('\nCommand line tool for running mixer bots.\n\nUsage: \n\  $0 <name> [options]')
    .describe('channel_id', 'Channel id to join')
    .describe('greeting', 'Greeting when a user joins a channel')
    .example('$0 path/to/bot.js', 'Run a bot using the js file')
    .example('$0 channel_id=123456', 'Run a bot joining on channel_id')
    .example('$0 greeting="Welcome!"', 'Change welcome message when a user joins');