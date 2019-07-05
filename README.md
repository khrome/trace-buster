trace-buster
------------
- Do you have stacktraces that tell you more about the framework plumbing than what code is executing?
- Are you working with a dynamic build and serve, and are tired of sifting through artifacts?
- Are you sourcemaps nowhere to be found, and garbage collected by the test even if they persisted?
- Do you have a smashed stack trace on an ephemeral node and it's driving you nuts?

Look no further, wrap your stack outputs with this! [This'll bust the trace that's wreckin ya stack(Yo)](https://www.youtube.com/watch?v=Iw3G80bplTg).

Seriously, if you have things like this:

```
at replenish (http://localhost:7357/assets/vendor.js:106220:17)
at http://localhost:7357/assets/vendor.js:106225:9
at eachOfLimit (http://localhost:7357/assets/vendor.js:106250:24)
at Object.<anonymous> (http://localhost:7357/assets/vendor.js:106255:16)
at bustTrace (http://localhost:7357/assets/vendor.js:98492:11)
at Heirarchy.Node.activate (http://localhost:7357/assets/vendor.js:98577:61)
at Class.setHeirarchyNode (http://localhost:7357/assets/dummy.js:471:26)
at Class.mod.<computed> (http://localhost:7357/assets/dummy.js:176:43)
at Class.superWrapper (http://localhost:7357/assets/vendor.js:55285:22)
```

It can turn it into:
```
at replenish (http://localhost:7357/assets/vendor.js:106220:17)
      iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
      ^


at http://localhost:7357/assets/vendor.js:106225:9
at eachOfLimit (http://localhost:7357/assets/vendor.js:106250:24)
  _eachOfLimit(limit)(coll, wrapAsync(iteratee), callback);
                     ^


at Object.<anonymous> (http://localhost:7357/assets/vendor.js:106255:16)
      return fn(iterable, limit, iteratee, callback);
             ^


at bustTrace (http://localhost:7357/assets/vendor.js:98492:11)
  asynk.eachOfSeries(lines, function(line, index, done){
        ^


at Heirarchy.Node.activate (http://localhost:7357/assets/vendor.js:98577:61)
console.log('HN ACTIVATE', this.id, this.children.length, bustTrace((new Error()).stack, request));
                                                          ^


at Class.setHeirarchyNode (http://localhost:7357/assets/dummy.js:471:26)
                  node.activate();
                       ^


at Class.mod.<computed> (http://localhost:7357/assets/dummy.js:176:43)
                  res = hooks[hookName].apply(this, arguments);
                                        ^


at Class.superWrapper (http://localhost:7357/assets/vendor.js:55285:22)
    var ret = func.apply(this, arguments);

```

just change

```js
console.log((new Error()).stack)
```
to

```js
console.log(bustTrace((new Error()).stack, request))
```
