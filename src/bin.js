#!/usr/bin/env node

const helpers = require('./helpers')
const lodash = require('lodash');
const mixerbot = require('./index');

// (bin_argv) Construct command line interface
var argv = require('yargs')
    .version()
    .demandCommand()
    .command('list', 'lists available mixer-bots by <name> on npm')
    .command('run <name> [options]', 'runs a mixer-bot given the <name>')
    .string('name')
    .string('env')
    .string('channel_id')
    .string('greeting')
    .describe('name', 'name of the mixer-bot module or .js file')
    .describe('env', 'path to the .env file')
    .describe('channel_id', 'Channel id to join')
    .describe('greeting', 'Greeting when a user joins a channel')
    .example('$0 path/to/bot.js', 'Run a bot using the js file')
    .example('$0 <name> --channel_id=123456', 'Run a bot joining on channel_id')
    .example('$0 <name> --greeting="Welcome!"', 'Change welcome message when a user joins')
    .argv;
var command = argv._[0];

// (bin_list) Lists the available mixer-bots


// (bin_run) Try to run the command and check for errors if found
if (command == 'run'){
    var name = argv.name;
    try{

        // (bin_run_options) Get the requested mixer-bot options
        var default_options = helpers.assign_default_options()
        var bot_options = require(name)(default_options);
        var options = lodash.merge(bot_options, argv);
    
        // (bin_run_mixer-bot) Run the mixer-bot with the given options
        mixerbot(argv).catch(err => {
            console.error(err);
        });
    
    } catch (e) {
    
        // (bin_run_error_module) Module not found
        try {
            var found = require.resolve(name);
        } catch(e) {
            console.error(`Error: The mixer-bot "${name}" was not found.`);
            process.exit(e.code);
        }
    
        // (bin_run_error_invalid_module) Module is not a mixer-bot module
        try {
            var mixerbot_module = require(name);
            var is_mixerbot = mixerbot_module.is_mixerbot;
            var has_options = mixerbot_module.has_options;
        } catch(e) {
            console.error(`Error: The mixer-bot "${name}" is not a mixer-bot module.`);
            process.exit(e.code);
        }
    
        // (bin_run_error) Generic error
        console.error(`Error: The mixer-bot "${name}" could not be run.\n${e.msg}`);
        process.exit(e.code);
    }
}
