# mixer-bot

Richard Wen  
rrwen.dev@gmail.com  

* [Documentation](https://rrwen.github.io/mixer-bot)

Simplified chat for the mixer live streaming platform

[![npm version](https://badge.fury.io/js/mixer-bot.svg)](https://badge.fury.io/js/mixer-bot)
[![Build Status](https://travis-ci.org/rrwen/mixer-bot.svg?branch=master)](https://travis-ci.org/rrwen/mixer-bot)
[![Coverage Status](https://coveralls.io/repos/github/rrwen/mixer-bot/badge.svg?branch=master)](https://coveralls.io/github/rrwen/mixer-bot?branch=master)
[![npm](https://img.shields.io/npm/dt/mixer-bot.svg)](https://www.npmjs.com/package/mixer-bot)
[![GitHub license](https://img.shields.io/github/license/rrwen/mixer-bot.svg)](https://github.com/rrwen/mixer-bot/blob/master/LICENSE)
[![Donate](https://img.shields.io/badge/donate-Donarbox-yellow.svg)](https://donorbox.org/rrwen)
[![Twitter](https://img.shields.io/twitter/url/https/github.com/rrwen/mixer-bot.svg?style=social)](https://twitter.com/intent/tweet?text=Simplified%20chat%20for%20the%20mixer%20live%20streaming%20platform:%20https%3A%2F%2Fgithub.com%2Frrwen%2Fmixer-bot%20%23nodejs%20%23npm)

## Install

1. Install [Node.js](https://nodejs.org/en/)
2. Install [mixer-bot](https://www.npmjs.com/package/mixer-bot) via `npm`

```
npm install --save mixer-bot
```

For the latest developer version, see [Developer Install](#developer-install).

## Usage

An example usage of mixer-bot:

```javascript
var mixerbot = require('mixer-bot');
```

See [Documentation](https://rrwen.github.io/mixer-bot) for more details.


## Contributions

1. Reports for issues and suggestions can be made using the [issue submission](https://github.com/rrwen/mixer-bot/issues) interface.
2. Code contributions are submitted via [pull requests](https://github.com/rrwen/mixer-bot/pulls)

See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## Developer Notes

### Developer Install

Install the latest developer version with `npm` from github:

```
npm install git+https://github.com/rrwen/mixer-bot
```
  
Install from `git` cloned source:

1. Ensure [git](https://git-scm.com/) is installed
2. Clone into current path
3. Install via `npm`

```
git clone https://github.com/rrwen/mixer-bot
cd mixer-bot
npm install
```

### Tests

1. Clone into current path `git clone https://github.com/rrwen/mixer-bot`
2. Enter into folder `cd mixer-bot`
3. Ensure [devDependencies](https://docs.npmjs.com/files/package.json#devdependencies) are installed and available
4. Run tests
5. Results are saved to [tests/log](tests/log) with each file corresponding to a version tested

```
npm install
npm test
```

### Documentation

Use [documentationjs](https://www.npmjs.com/package/documentation) to generate html documentation in the `docs` folder:

```
npm run docs
```

See [JSDoc style](http://usejsdoc.org/) for formatting syntax.

### Upload to Github

1. Ensure [git](https://git-scm.com/) is installed
2. Inside the `mixer-bot` folder, add all files and commit changes
3. Push to github

```
git add .
git commit -a -m "Generic update"
git push
```

### Upload to npm

1. Update the version in `package.json`
2. Run tests and check for OK status
3. Generate documentation
4. Login to npm
5. Publish to npm

```
npm test
npm run docs
npm login
npm publish
```

### Implementation

The module [mixer-bot](https://www.npmjs.com/package/mixer-bot) uses the following npm packages for its implementation:

npm | Purpose
--- | ---
component | description
component | description
component | description
component | description

```
component   <-- detail
    |
component   <-- detail
    |
component   <-- detail
    |
component   <-- detail
```
