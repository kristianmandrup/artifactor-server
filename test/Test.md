# Test

[mocha](https://mochajs.org/) with [should](http://chaijs.com/api/bdd/) are used as the testing framework.

- See [How To Use Mocha With Node.js For Test-Driven Development to Avoid Pain and Ship Products Faster](http://webapplog.com/tdd/)
- For async testing, see [Testing Asynchronous Code with MochaJS and ES7 async/await](http://staxmanade.com/2015/11/testing-asyncronous-code-with-mochajs-and-es7-async-await/)

## Superagent REST API testing

We use superagent for doing Ajax requests on the Koa app server API.

```js
describe('homepage', function(){
  it('should respond to GET',function(){
    superagent
      .get('http://localhost:'+port)
      .end(function(res){
        expect(res.status).to.equal(200);
    })
  })
```

Use [Superagent](https://visionmedia.github.io/superagent/) for Ajax.
we will use the [Superagent promise](https://www.npmjs.com/package/superagent-promise) variant.  

```js
var Promise = this.Promise || require('promise');
var agent = require('superagent-promise')(require('superagent'), Promise);
 
// method, url form with `end` 
agent('GET', 'http://google.com')
  .end()
  .then(function onResult(res) {
    // do stuff 
  }, function onError(err) {
    //err.response has the response from the server 
  });
```  

## Mocking Ajax

We can also use [Super Agent mocker](https://www.npmjs.com/package/superagent-mocker) to mock the REST API.

```js
Timeout
You can provide custom timeout, that can be a function or a number. Just set timeout property to the mock:

var mock = require('superagent-mocker');
 
// set just number 
mock.timeout = 100;
 
// Or function to get random 
mock.timeout = function () {
  return Math.random() * 1e4 |0;
}
```

Mock a GET route response

```js
mock.get('/topics/:id', function(req) {
  return {
    id: req.params.id,
    content: 'Hello World!',
    headers: req.headers
  };
});
```

## Mocking file system

Use [mock-fs](https://github.com/tschaub/mock-fs) to mock files as follows:

```js
mock({
  'installer.json': configs.project,
  'src/component/contact': {
    'install.json': configs.components.contact 
  }
});
```



