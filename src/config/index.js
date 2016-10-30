const router = require('koa-router')();
const convert = require('koa-convert');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const path = require('path')

// routes
const routes = require('artifactor-routes');

const views = require('koa-views');

module.exports = function(app, options) {
  const createRouters = routes.api.rest.router.createAll;

  const restRouters = createRouters(options);

  // middlewares
  app.use(convert(bodyparser));
  app.use(convert(json()));
  app.use(convert(logger()));

  console.log('koa static')
  const serve = require('koa-static')
  const staticPath = path.join(__dirname, '../public')

  app.use(serve(staticPath));

  console.log('koa views')
  app.use(views(__dirname + '/../views', {
    extension: 'jade'
  }));

  // logger
  app.use(async (ctx, next) => {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  });;

  // TODO: strong-params
  // Rails-style implementation of strong parameters for Koa. 
  // The middleware adds the this.params object to the Koa context which returns an object, 
  // built from query string and request body data. 
  // The returned object has some useful methods allows for data requiring and filtering.

  // See: https://www.npmjs.com/package/koa-strong-params
  var qs = convert(require('koa-qs'))
  qs(app); // required for nested query string objects 

  // console.log('strong params')
  // const params = convert(require('koa-strong-params'));
  // app.use(params());

  // TODO: GraphQL?? or use Apollo stack :)
  // const graphqlRouter = api.graphql;
  // app.use(graphqlRouter.routes()).use(graphqlRouter.allowedMethods());

  router.use('/', routes.views.routes(), routes.views.allowedMethods());

  for (let router of restRouters) {
    if (router)
      app.use(router.routes(), router.allowedMethods());
  }

  app.on('error', function(err, ctx){
    console.log(err)
    logger.error('server error', err, ctx);
  });

  return app;
} 


