# Artifact Server

[Koa 2](koajs.com) server with sockets routes:

- sockets via [Feathers.js](feathersjs.com/)
- REST routes
- GraphQL via [Apollo](http://dev.apollodata.com/)

All Artifactor projects are based on Node.js 7 and ES2018 with decorators and async/await.

### Install

`npm i artifactor-server --save`

## Development environment

Please see the `docs` folder, in particular `docs/env-setup/library-dev.md` 
which describes the full development environment, how it was configured etc.

### Run Test or Test suite

`npm test`

Write tests using either:
- [ava](https://github.com/ava/ava)
- or [mocha-test-dsl](https://www.npmjs.com/package/mocha-test-dsl) if you prefer using [mocha]

Note that Ava can use `spec` syntax via [ava-spec]()

- Ava testing framework: [ava](https://github.com/ava/ava)
- BDD: [ava-spec](https://www.npmjs.com/package/ava-spec)
- test doubles: [testdouble.js]()


### Run
First build using webpack

- `$ npm start` or `$ npm koa` start the server 

Note: You need to reconfigure the `/bin` scripts to call the Webpack bundled file instead!

Please be aware that the REST server routes don't respond to the root route.
So to test it, try a specific route like:

`http://localhost:3000/components/contacts`

Even better: Make the root route respond with a list of links to the routes you with to test.
Would be perfect if you could dynamically write the `<a>` tags using the routes defined in the router!!

## Architecture  

### app.js

Uses the following middleware:
- [bodyparser](https://www.npmjs.com/package/koa-bodyparser)
- [json](https://www.npmjs.com/package/koa-json)
- [logger](https://www.npmjs.com/package/koa-logger)
- [static](https://www.npmjs.com/package/koa-static)
- [router](https://www.npmjs.com/package/koa-router)
- [views](https://github.com/queckezz/koa-views) - supports pug
- [Pug views](https://www.npmjs.com/package/pug) formerly Jade templating via [koa-pug](https://github.com/chrisyip/koa-pug)

See `bin/www` binary, which demonstrated how to create/configure the koa server app:

```js
var createApp = require('../dist/app');

// you can configure the adapter and other settings via options object
// createApp({adapter: 'db'});  

var app = createApp();
```

### configure

Used to configure the koa app, exports this function:

```js
function(app, options) {
  // configuration
}
```

`app.js` uses configure function as follows:

```js
module.exports = function(options = {adapter: 'file'}) {
  return configure(app, options);
}
```

## Switching adapter

Simply pass the `adapter` option either from `app.js` or in `bin/www` (or similar) as shown above:

 `var app = createApp({adapter: 'db'});`

## Routes

Routes are added by including [artifactor-routes](https://github.com/kristianmandrup/artifactor-routes)

In `configure.js` the app is configured with routes, by calling the `routes` router generator function with the app options. 

`const routers = artifactor.createRouters(options);`

The app configure function adds each router as middleware.

```js
for (let router of routers) {
  app.use(router.routes(), router.allowedMethods());
}
```

## License

MIT