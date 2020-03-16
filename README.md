# mixer-bot

Richard Wen  
rrwen.dev@gmail.com  

* [Documentation](https://rrwen.github.io/mixer-bot)

Simplified chat bot for the mixer live streaming platform

[![npm version](https://badge.fury.io/js/mixer-bot.svg)](https://badge.fury.io/js/mixer-bot)
[![Build Status](https://travis-ci.org/rrwen/mixer-bot.svg?branch=master)](https://travis-ci.org/rrwen/mixer-bot)
[![npm](https://img.shields.io/npm/dt/mixer-bot.svg)](https://www.npmjs.com/package/mixer-bot)
[![GitHub license](https://img.shields.io/github/license/rrwen/mixer-bot.svg)](https://github.com/rrwen/mixer-bot/blob/master/LICENSE)
[![Donate](https://img.shields.io/badge/donate-Donarbox-yellow.svg)](https://donorbox.org/rrwen)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/rrwen/mixer-bot.svg?style=social)](https://twitter.com/intent/tweet?text=Simplified%20chat%20for%20the%20mixer%20live%20streaming%20platform:%20https%3A%2F%2Fgithub.com%2Frrwen%2Fmixer-bot%20%23nodejs%20%23npm)  
  
**Note**: This is based on a [Mixer chat bot tutorial](https://dev.mixer.com/guides/chat/chatbot) on the developer's page

## Install

1. Install [Node.js](https://nodejs.org/en/)
2. Install [mixer-bot](https://www.npmjs.com/package/mixer-bot) via `npm`

```
npm install -g mixer-bot
```

For the latest developer version, see [Developer Notes](DEVELOPER.md).

## Usage

The `mixerbot` package can be used as a command line tool or programatically in Node.js.

### In the Command Line

First, create a `.env` file in the current directory if it does not exist:

* Replace `<token>` with your access token
* A file `.env` will be created (**do not share this file**)

```
mixer-bot env <token>
```

To run a mixer-bot:

* `<name>` is the name of the mixer-bot npm package or .js file 

```
mixer-bot run <name>
```

### In Node.js

An example usage of mixer-bot in `node`:

```javascript
const mixerbot = require('mixer-bot');

// Create a .env file in the same location and set
// MIXER_ACCESS_TOKEN=***
// MIXER_CHANNEL_ID=***

// Setup options
var options = {};
options.on = {};
options.greeting = 'Hello!';

// Setup channel ID
// If left unset, this will be the id to your channel
// Get your channel id here: https://mixer.com/api/v1/channels/<username>?fields=id
// options.channel_id = '<CHANNEL_ID>';

// Welcome a user when they join
options.on.UserJoin = data => {
    socket = data.socket;
    return response => {
        socket.call('msg',[
            `Hi ${data.username}! I'm pingbot! Write !ping and I will pong back!`,
        ]);
    }
};

// Assign bot to pong user if they message !ping
options.on.ChatMessage = data => {
    socket = data.socket;
    return response => {
        if (response.message.message[0].data.toLowerCase().startsWith('!ping')) {
            socket.call('msg', [`@${response.user_name} PONG!`]);
            console.log(`Ponged ${response.user_name}`);
        }
    }
};

// Handle errors
options.on.error = data => {
    return error => {
        console.error('Socket error');
        console.error(error);
    }
};

// Run mixer bot
mixerbot(options);
```

See [Documentation](https://rrwen.github.io/mixer-bot) for more details.

## Contributions

1. Reports for issues and suggestions can be made using the [issue submission](https://github.com/rrwen/mixer-bot/issues) interface.
2. Code contributions are submitted via [pull requests](https://github.com/rrwen/mixer-bot/pulls)

See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## See Also

* [Developer Notes](DEVELOPER.md)