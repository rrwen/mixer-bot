// Richard Wen
// rrwen.dev@gmail.com

// (packages) Package dependencies
var fs = require('fs');
var moment = require('moment');
var mixerbot = require('../index.js');
var test = require('tape');

// (test_info) Get package metadata
var json = JSON.parse(fs.readFileSync('package.json', 'utf8'));
var testedPackages = [];
for (var k in json.dependencies) {
	testedPackages.push(k + ' (' + json.dependencies[k] + ')');
}
var devPackages = [];
for (var k in json.devDependencies) {
	devPackages.push(k + ' (' + json.devDependencies[k] + ')');
}

// (test_log) Pipe tests to file and output
if (!fs.existsSync('./tests/log')){
	fs.mkdirSync('./tests/log');
}
var testFile = './tests/log/test_' + json.version.split('.').join('_') + '.txt';
test.createStream().pipe(fs.createWriteStream(testFile));
test.createStream().pipe(process.stdout);

// (test) Run tests
test('Tests for ' + json.name + ' (' + json.version + ')', t => {
	t.comment('Node.js (' + process.version + ')');
	t.comment('Description: ' + json.description);
	t.comment('Date: ' + moment().format('YYYY-MM-DD hh:mm:ss'));
	t.comment('Dependencies: ' + testedPackages.join(', '));
	t.comment('Developer: ' + devPackages.join(', '));

	// (test_load) Load package correctly
	t.pass('(MAIN) Package loaded');

	// (test_options) Setup options
	var options = {};
	options.on = {};

	// (test_options_greet) Setup options for greeting message
	options.greeting = 'Greet test!'

	// (test_options_on_join) Setup options for join actions
	options.on.UserJoin = data => {
		socket = data.socket;
		return response => {
			socket.call('msg',[
				`Hi ${data.username}! I'm pingbot! Write !ping and I will pong back!`,
			]);
		}
	};

	// (test_options_on_chat) Setup options for chat actions
	options.on.ChatMessage = function(data) {
		socket = data.socket;
		return response => {
			if (response.message.message[0].data.toLowerCase().startsWith('!ping')) {
				socket.call('msg', [`@${response.user_name} PONG!`]);
				console.log(`Ponged ${response.user_name}`);
			}
		}
	};

	// (test_run) Test package run with above options
	mixerbot(options)
		.then(data => {
			t.pass('(MAIN) Package runs with greeting and on action');
			data.socket.close();
		})
		.catch(err => {
			t.fail(err);
		});
	t.end();
});
