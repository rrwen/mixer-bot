#!/usr/bin/env node

var argv = require('yargs')
    .usage('\nCommand line tool for running mixer bots.\n\nUsage: \n\  $0 <command>\n\  $0 [options]')
    .describe('channel_id', 'Channel id to join')
    .describe('greeting', 'Greeting when a user joins a channel');