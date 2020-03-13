# mixer-bot

Richard Wen  
rrwen.dev@gmail.com  
  
Developer notes for the `mixer-bot` npm package.

## Install

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
[@mixer/client-node](https://www.npmjs.com/package/@mixer/client-node) | official mixer client library for node
[ws](https://www.npmjs.com/package/ws) | web sockets used by the mixer client

```
    ws               <-- detail
    |
@mixer/client-node   <-- detail
    |
mixer-bot            <-- this package
```