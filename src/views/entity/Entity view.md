# Entity view

Set up `ctx.state` with:
- `entity` such as `components`
- `name` such as `contacts`
- `json`, using `JSON.stringify(obj)`

## Examples

```js
ctx.state = {
    entity: entity,
    name: name,
    json: JSON.stringify(obj)
}
```

Then use `ctx.render`:

```js
router.get('/', async function (ctx, next) {

  const entity = // ... ?
  const name = // ... ?
  const obj = // ... ??

  ctx.state = {
      entity: entity,
      name: name,
      json: JSON.stringify(obj)
  }

  await ctx.render('entity/artefact', {
  });
})
