# Artifact Registry

This *Artifact Registry* app/API web server is being built using Koa 2 using ES7 async/await syntax.

The initial project was generated using [koa-generator](https://www.npmjs.com/package/koa-generator)
using `koa2` binary: `$ koa2 artifactor` 

## Usage
- install/configure
- run

### Install

- clone this repo
- `npm install` - install dependencies 

### Build

`npm run build` - builds `/src` folder and puts resulting ES5 `.js` files in `/dist`

### Auto build

`npm run watch` - builds `/src` and watches for changes to `/src` files for auto-build!

### Run

- `$ npm start` or `$ npm koa` - start the server

_NOTICE_: Please be aware that the server doesn't respond to the root route.
So to test it, try a route like:

`http://localhost:3000/components/contacts`

### Troubleshooting

If you still get an error, try removing the `dist` folder:

`rm -r dist`

Then recompile via `build` or `watch` task and start server again.

To disable to DB adapter, uncomment it from `src/adapters/index.js` 

```js
module.exports = {
  // db: require('./db-adapter'),
  file: require('./file-adapter')
}
```

### Run Test or Test suite

To run the tests, the Koa server app must be running...

`npm test` (runs test command in `Makefile`)

You can configure `tests/utils/server.js` to start the http server with the Koa app and set the `adapter`

```js
const adapter = 'db';
```

Bonus if you configure the `Makefile` for different kinds of test runs or find another/better way to run the tests
for various scenarios and configurations, f.ex using a config file of some sort?

### Use new testing DSL

See [mocha-test-dsl](https://www.npmjs.com/package/mocha-test-dsl)

This DSL lets you drastically improve how you write readable, reusable composable tests and avoid duplication, keeping it
concise and to the point and very decoupled!!  

### Faker adapter

To simulate a database full of artefacts we are introducing the Faker adapter. 
It is based on the [json schema faker](json-schema-faker.js.org) which uses [faker.js](https://github.com/marak/Faker.js/) 
to generate fake data based on the schema definitions. This is a similar approach to Mongoose schemas, 
but those are used for validation. It would be cool if we could use the fake data to also populate the Database via the 
DB models!

See `faker/schemas` for the faker schemas:

```js
const schema = {
  type: 'object',
  required: [
    'name',
    'author',
    'version',
    'location',
    'status',
    'type',
    'keywords'
  ],
  properties: {
    name: {
      type: 'string',
      faker: 'random.word'
    },
    description: {
      type: 'string',
      faker: 'lorem.paragraph'
    },
    // more ....
  }
}
```

### DB adapter testing

To test the Mongo and Couch DB adapters, we need to first populate the DBs.
This should ideally be done via `beforeEach` and cleaned up in `afterEach` for each test suite:

To populate the DBs, add functions in `/src/data` for `/mongo/populate` and `/couch/populate` respectively!   

Currently we have a validation error when trying to use the components item reponse to create a DB model using the
Mongoose `Component` schema. 

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

### configure.js

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

In `configure.js` the app is configured with artefact routes, by calling the `artefacts` router generator function with the app options. 

`const artefactRouters = artefacts(options);`

The app configure function then adds each router returned as a middleware:

```js
for (let router of artefactRouters) {
  app.use(router.routes(), router.allowedMethods());
}
```

All the REST routes can be found in the `/routes/api/rest` folder. 
Artefact routes are generated in `/routes/api/rest/index.js`. 

It maps over the list of entities and calls `factory.createRouter(entity)` to 
create a new Router the `Artefact` domain model. 

`entities.list.map(entity => routerFactory.create(entity, adapter));`

The list of `Router` instances are returned and are added to the Koa app as middlewares.

The router factory can be found in: `routes/api/rest/router-factory.js` and uses 
the `route-factory.js` in the same folder to create each route, linked to an action in the `/actions` sub-folder.

```js
createRouter() {
  const router = new Router({
    prefix: `/${entity}`
  });

  router
    .get('list', '/', this.list.bind(this))
    // ...

  return router;
}
```

Note: We should avoid using `.bind(this)` so perhaps we should instead use a higher level function?

The router is based on [koa-router 7.x](https://www.npmjs.com/package/koa-router) for Koa 2.
See `dependencies` entry in `package.json`: `"koa-router": "^7.0.0",`

The `createRouter` creates a generic REST based Router using a Rails like REST convention.
- `:id` is the identifier, ie. the unique name of the registered artefact (NOT a number!).
- `prefix` is the prefix for each of the routes generated, ie the type of entity such as `component`

In the end for a `contacts` component, the REST routes would be:
- GET `/components/contacts` (GET to read/retrieve the single item `contacts`)
- POST `/components/contacts` (POST to create the single item `contacts`)  
- ...

For each supported action there is a class, such as `GetRoute` for the `get` action, which extends `BaseRoute`
TODO: clean up naming to make consistent! 

```js
module.exports = class GetRoute extends BaseRoute {
  constructor(ctx, next, options) {    
    super(ctx, next, options);
  }

  // ...
}
```

## adapters

Currently we are developing these adapters
- fake
- file
- db  
  - mongo
  - couch

Use the `adapters/config.js` file to configure which adapters are active. 

### Fake adapter

Uses `faker` to generate fake responses. Useful for "quick and dirty" testing or generate fake realistic 
looking responses for any purpose ;) 

### File adapter

The `/responses` folder contains canned API responses in `.json` files for each artefact type.

The `io.js` can be used to access these files, f.ex via:
- `jsonItem(id)` - return specific artefact item
- `jsonList(id)` - return list of artefact items
- `files()` - return all artefact items (with full `versions` list for each item)

You can start playing with the API using these files, building up the test suite and then 
gradually switch to using Mongo DB schemas/models for the API. 

## Couch DB for Pouch DB (sync)

See `adapters/db/couch`

### Setup

See [setup couchdb](https://pouchdb.com/guides/setup-couchdb.html)

OSX: `$ brew install couchdb`

Once CouchDB is installed, it should be running at `localhost:5984`

`sudo couchdb`

### Add CORS

```bash
npm install -g add-cors-to-couchdb
add-cors-to-couchdb
```

## Mongo DB via Mongoose

See `adapters/db/mongo`

### Mac OSX - Mongo DB
Configuring Mongo DB. First install [homebrew](https://github.com/Homebrew/brew)

`$ brew install mongodb` 

Then run mongo deamon process

`$ mongod`

If it terminates with error `Data directory /data/db not found., terminating`: 
- create missing storage folder which holds databases
- set permissions

```
$ sudo mkdir -p /data/db/`
$ sudo chown -R `id -u` /data/db
```

Also see this gist: [ install-mongodb](https://gist.github.com/adamgibbons/cc7b263ab3d52924d83b)

### Models/Schemas

Mongoose DB Models and Schemas are configured in the `/db` folder. 
The `models.js` exports an object with entity models, each linked to a schema.
See [Mongoose models](http://mongoosejs.com/docs/models.html)

We can thus create instances of models as follows:

```js
const models = require('./db/models');
let components = {};
components.contacts = new models.Component({
  name: 'contacts', 
  // ...
})
```

## Promises

Just use bluebird if no native Promise ;)

`mongoose.Promise = global.Promise || require('bluebird');`

## Queries

[Mongoose Queries](http://mongoosejs.com/docs/queries.html)

"In mongoose 4, a Query has a `.then()` function, and thus can be used as a promise."

Mongoose queries are not promises. However, they do have a `.then()` function for yield and async/await. 
If you need a fully-fledged promise, use the `.exec()` function.

Mongoose async operations, like `.save()` and queries, return Promises/A+ conformant promises. 
This means that you can do things like `MyModel.findOne({}).then()` and `yield MyModel.findOne({}).exec()` 
(if you're using [co](https://github.com/tj/co) or async/await etc. via Babel).

Promises are returned from executed queries. Example:

```js
var query = Candy.find({ bar: true });
var promise = query.exec();
```

See [Switching out callbacks with promises in Mongoose](http://eddywashere.com/blog/switching-out-callbacks-with-promises-in-mongoose/)

### Save

```js
fluffy.save().then(fluffy => {
  fluffy.speak();
}).catch(err => {
  
});
```

Say time goes by and we want to display all the kittens we've seen. We can access all of the kitten documents through our Kitten model.

```js
Kitten.find().exec().then(kittens => {
  console.log(kittens);
}).catch(err => {

})
```

### Removing models

Models have a static `remove` method available for removing all documents matching conditions.

`Tank.remove({ size: 'large' }).exec().then(onSuccess).catch(onError)`

### Find by conditions

We just logged all of the kittens in our db to the console. If we want to filter our kittens by name, Mongoose supports MongoDBs rich querying syntax.

```js
Kitten.find({ name: /^fluff/ }).exec().then(onSuccess).catch(onErr);
```

### Find one and update

To update an artefact, use `findOneAndUpdate` as follows: 

`Component.findOneAndUpdate(query, update, {'upsert': true}).exec().then(onSuccess, onError);`

## File IO adapter

Currently the File IO adapter is designed to use `/adapters/file` to respond with canned responses from `.json` files 
which can all found in the `/responses` folder.

The next step is to use a JSON database (Mongo DB via [Mongoose](http://mongoosejs.com/docs/)) or Couch DB. 
Each of these DBs are simple, easy to use and scalable.

Later on we might perhaps use [KeystoneJS](http://keystonejs.com/) - which uses Mongoose under the covers...

Note that one of the benefits of using Couch DB, is that we can then automatically sync with the client via Pouch DB 
and PouchDB/CouchDB combination also supports offline mode.

### Canned API responses

The following is the current structure for canned API responses. 
Use the same file structure (pattern) for each entity.

```
/responses
  /addons
  /apps
    ...
  /components
    /contacts
      item.json
      version.json
    list.json
  /libs
  /plugins
```

## Test

To test CUD (Create, Update, Delete) API functionality, you can use the canned requests in `/requests`:

```
/requests
  /components
    /contacts
      create.json
      rate.json
      remove.json
  /apps
    /contact-app
      create.json
      ...
```

TODO: rename `create` to `upsert` (update or insert).
Note: any "production ready" storage should NOT update but only *create new versions*.

## License

MIT