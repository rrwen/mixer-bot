#!/usr/bin/env node

const fs = require('fs')
const helpers = require('./helpers')
const lodash = require('lodash');
const mixerbot = require('./index');
const path = require('path');

// (bin_argv) Construct command line interface
var argv = require('yargs')
    .version()
    .usage('Command line tool for running Mixer bots')
    .demandCommand()
    .command('env [token] [env]', 'Create a .env file with the <token>')
    .command('run <name> [options]', 'Run a mixer-bot given the <name>')
    .command('template [file]', 'Create a .js mixer-bot template file')
    .string('name')
    .string('env')
    .string('channel_id')
    .string('greeting')
    .string('token')
    .string('file')
    .default('env', './.env')
    .default('file', './template.js')
    .describe('name', 'name of the mixer-bot module or .js file')
    .describe('env', 'path to the .env file')
    .describe('channel_id', 'channel id to join')
    .describe('greeting', 'greeting when a user joins a channel')
    .describe('token', 'user access token from Mixer')
    .describe('file', '.js template file path')
    .example('$0 env <token>', 'Create .env file with <token> inside')
    .example('$0 run <path>.js', 'Run a bot using the <path>.js file')
    .example('$0 run <name> --channel_id=123456', 'Run a bot in --channel_id')
    .example('$0 run <name> --greeting=Hi', 'Edit welcome message when users join')
    .argv;
var command = argv._[0];

// (bin_template) Create a template mixer-bot js file
if (command == 'template') {
    var template = path.join(__dirname, 'template.js');
    var copy_to = argv.file;
    fs.copyFileSync(template, copy_to);
}

// (bin_env) Creates an .env file with a mixer token
if (command == 'env') {
    var env = argv.env;
    fs.writeFileSync(env, `MIXER_ACCESS_TOKEN=${argv.token}`);
}

// (bin_run) Try to run the command and check for errors if found
if (command == 'run'){
    var name = argv.name;
    try{

        // (bin_run_options) Get the requested mixer-bot options
        var default_options = helpers.assign_default_options()
        var bot_options = require(name)(default_options);
        var options = lodash.merge(bot_options, argv);
    
        // (bin_run_mixer-bot) Run the mixer-bot with the given options
        mixerbot(options).then(data => {
            console.log(`Running mixer-bot "${name}"...`);
            console.log(`Joined channel at id "${data.options.channel_id}"!`);
            console.log(`Bot id is "${data.user_info.id}"`);
            console.log(`Bot name is "${data.user_info.username}"`);
        })
        .catch(err => {
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
