'use strict';



;define('dummy/app', ['exports', 'dummy/resolver', 'ember-load-initializers', 'dummy/config/environment'], function (exports, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  const App = Ember.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
;define('dummy/ember-route-input/tests/addon.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | addon');

  QUnit.test('addon/routes/user-input/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'addon/routes/user-input/index.js should pass ESLint\n\n');
  });

  QUnit.test('addon/routes/user-input/keyboard.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'addon/routes/user-input/keyboard.js should pass ESLint\n\n');
  });
});
;define('dummy/ember-route-input/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('app/initializers/route-input.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'app/initializers/route-input.js should pass ESLint\n\n176:1 - Unexpected console statement. (no-console)\n254:3 - Unexpected console statement. (no-console)');
  });

  QUnit.test('app/routes/user-input/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app/routes/user-input/index.js should pass ESLint\n\n');
  });

  QUnit.test('app/routes/user-input/keyboard.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app/routes/user-input/keyboard.js should pass ESLint\n\n');
  });

  QUnit.test('app/templates/user-input/index.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app/templates/user-input/index.js should pass ESLint\n\n');
  });

  QUnit.test('app/templates/user-input/keyboard.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app/templates/user-input/keyboard.js should pass ESLint\n\n');
  });
});
;define('dummy/helpers/route-action', ['exports', 'ember-route-action-helper/helpers/route-action'], function (exports, _routeAction) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _routeAction.default;
    }
  });
});
;define('dummy/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize() {
      let app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
;define('dummy/initializers/export-application-global', ['exports', 'dummy/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function () {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
;define('dummy/initializers/route-input', ['exports', 'npm:stream-responder-heirarchy', 'npm:extended-emitter'], function (exports, _npmStreamResponderHeirarchy, _npmExtendedEmitter) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.initialize = initialize;


    var fnHooks = {};
    var monitor;
    fnHooks.mutate = function (classDefinition, hooks) {
        var originalFns = {};
        var mod = {};
        Object.keys(hooks).forEach(function (hookName) {
            var proto = classDefinition.prototype;
            originalFns[hookName] = proto[hookName];
            mod[hookName] = function () {
                var res;
                if (!this._super) {
                    if (originalFns[hookName]) {
                        res = originalFns[hookName].apply(this, arguments);
                        hooks[hookName].apply(this, arguments);
                    } else {
                        res = hooks[hookName].apply(this, arguments);
                    }
                } else {
                    this._super.apply(this, arguments);
                    res = hooks[hookName].apply(this, arguments);
                }
                if (monitor) {
                    if (!monitor[hookName]) monitor[hookName] = 1;else monitor[hookName]++;
                }
                return res;
            };
        });
        if (classDefinition.reopen) {
            //ember class
            classDefinition.reopen(mod);
        } else {
            //js class prototype
            Object.keys(mod).forEach(function (key) {
                classDefinition.prototype[key] = mod[key];
            });
        }
    };

    function routeModification(hooks) {
        return fnHooks.mutate(Ember.Route, hooks);
    }

    function eventSimplify(e) {
        var res = {};
        res.cased = e.key;
        res.key = e.key.toLowerCase();
        res.keyCode = e.keyCode;
        res.which = e.which;
        res.altKey = e.altKey;
        res.ctrlKey = e.ctrlKey;
        res.shiftKey = e.shiftKey;
        res.metaKey = e.metaKey;
        res.bubbles = true;
        return res;
    }

    function filterFlag(word) {
        var words = Array.isArray(word) ? word : [word];
        return function (i) {
            var lower = i.toLowerCase();
            return words.reduce(function (agg, value) {
                return agg || lower === value.toLowerCase();
            }, false);
        };
    }

    function handleFlag(word, optList, criterion) {
        var flag = (Array.isArray(word) ? word : [word])[0];
        var filtered = optList.filter(filterFlag(word));
        if (filtered.length) {
            var pos = optList.indexOf(filtered[0]);
            optList.splice(pos, 1);
            var criteria = {};
            criteria[flag] = { "$eq": true };
            criterion.push(criteria);
        }
    }

    function compareDates(a, b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return isFinite(a = convertDate(a).valueOf()) && isFinite(b = convertDate(b).valueOf()) ? (a > b) - (a < b) : NaN;
    }

    function convertDate(d) {
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
        //   a number     : Interpreted as number of milliseconds
        //                  since 1 Jan 1970 (a timestamp)
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
        //  an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month is 0-11.
        return d.constructor === Date ? d : d.constructor === Array ? new Date(d[0], d[1], d[2]) : d.constructor === Number ? new Date(d) : d.constructor === String ? new Date(d) : typeof d === "object" ? new Date(d.year, d.month, d.date) : NaN;
    }

    function parseControls(str, mode) {
        var res = str.split('|').map(function (word) {
            return word.split('+');
        });
        res = res.map(function (arr) {
            var ob = { '$and': [] };
            var criteria;
            switch (mode) {
                case 'keyboard':
                    handleFlag(['ctrlKey', 'ctrl', 'control'], arr, ob['$and']);
                    handleFlag(['shiftKey', 'shift'], arr, ob['$and']);
                    handleFlag(['altKey', 'alt', 'alternate', 'option'], arr, ob['$and']);
                    handleFlag(['metaKey', 'meta', 'command'], arr, ob['$and']);
                    if (arr.length !== 1) throw new Error('ambiguous definition: ' + arr.toString());
                    var key = { key: { "$eq": arr[0] } };
                    if (ob['$and'].length == 0) return key;
                    ob['$and'].push(key);
                    break;
                case 'controller':
                    while (arr.length > 1) {
                        criteria = {};
                        criteria[arr.shift()] = { "$eq": true };
                        ob['$and'].push(criteria);
                    }
                    ob['$and'].push({ button: { "$eq": arr[0] } });
                    break;
                case 'cardswipe':
                    ob['$and'].push({ track_one: { "$exists": true } });
                    ob['$and'].push({ track_two: { "$exists": true } });
                    arr.pop();
                    while (arr.length > 0) {
                        criteria = {};
                        criteria[arr.shift()] = { "$eq": true };
                        ob['$and'].push(criteria);
                    }
                    break;
                case 'barcodescanner':
                    while (arr.length > 1) {
                        criteria = {};
                        criteria[arr.shift()] = { "$exists": true };
                        ob['$and'].push(criteria);
                    }
                    ob['$and'].push({ scan: { "$exists": true } });
                    break;
            }
            return ob;
        });
        return res;
    }

    var Context = {};

    function enableRouteInput() {
        Context.inputHeirarchy = new _npmStreamResponderHeirarchy.default({ eventType: 'input' });
        var stream = new _npmExtendedEmitter.default();
        console.log('##################', Ember.Route.setInputSource);
        Ember.Route.reopenClass({
            addInputSource: function (source, opts) {
                var options = opts || {};
                Context.inputHeirarchy.tap(options.eventType || options, stream);
                if (source.setHandler) {
                    //gamepad
                    source.setHandler(function (buttons, axes, buttonUp, axesUp) {
                        Object.keys(buttonUp).forEach(function (releasedButtonName) {
                            var ret = JSON.parse(JSON.stringify(buttons));
                            Object.keys(axes).forEach(function (axisName) {
                                ret[axisName] = axes[axisName];
                            });
                            ret.button = releasedButtonName;
                            stream.emit(options.eventType || options, ret);
                        });
                        if (options.handler) {
                            options.handler(buttons, axes, buttonUp, axesUp);
                        }
                    });
                } else {
                    if (source.Scanner && source.stdIn && source.fake) {
                        //card-swipe
                        var Swipe = source;
                        var el = options.el || document.body;
                        var scanner = new Swipe.Scanner();
                        new Swipe({
                            scanner: scanner,
                            onScan: function (swipeData) {
                                if (!(swipeData && swipeData.track_one && swipeData.track_two)) return;
                                stream.emit(options.eventType || options, swipeData);
                                swipeData.expired = compareDates(swipeData.expiration, new Date()) < 0;
                                swipeData.valid = !swipeData.expired;
                                swipeData[swipeData.type.toLowerCase()] = true;
                                stream.emit(options.eventType || options, swipeData);
                            }
                        });
                        el.addEventListener(options.keyboardEventType || 'keypress', function (e) {
                            scanner.input(e.key);
                        });
                    } else {
                        if (source.prototype && source.prototype.deviceList && source.prototype.listen) {
                            var scannerInstance = new source({
                                name: 'barcode',
                                emitter: source.electronBridge()
                            });
                            source.default(scannerInstance);
                            var scannerId = localStorage.getItem('last-used-barcode-scanner');
                            if (scannerId) {
                                scannerInstance.listen(scannerId, function (scan) {
                                    var event = { scan: scan };
                                    event.upc = (parseInt(scan) + '').length == 12;
                                    event.ean13 = (parseInt(scan) + '').length == 13;
                                    event.upcA = event.ean13;
                                    event.ean8 = (parseInt(scan) + '').length == 8;
                                    event.ean = event.ean8 || event.ean13;
                                    event.code128 = scan.length == 13 && (parseInt(scan) + '').length !== 13;
                                    event.codabar = (parseInt(scan) + '').length == 14;
                                    stream.emit(options.eventType || options, event);
                                });
                            }
                        } else {
                            source.addEventListener(options.eventType || options, function (e) {
                                e.stopPropagation();
                                e.preventDefault();
                                var clone = eventSimplify(e);
                                stream.emit(options.eventType || options, clone);
                            });
                        }
                    }
                }
            },
            bodyInput: function (eventType) {
                setTimeout(function () {
                    Ember.Route.addInputSource(document.body, eventType || 'keypress');
                }, 100);
            }
        });
        var lastRoute;
        console.log('###########t#######', Ember.Route.prototype.getHeirarchyNode);
        routeModification({
            getHeirarchyNode: function () {
                if (this.inputHeirarchyNode) return this.inputHeirarchyNode;
                var input = this.input ? this.input() : {};
                var node = new _npmStreamResponderHeirarchy.default.Node({ eventType: 'input' });
                var route = this;
                if (input.keyboard) Object.keys(input.keyboard).forEach(function (key) {
                    var conditions = parseControls(key, 'keyboard');
                    conditions.forEach(function (condition) {
                        node.on('input', condition, function (e) {
                            if (!e.key) return;
                            if (!node.active) return; //WTF??
                            if (!route.actions[input.keyboard[key]]) {
                                throw new Error('no action: ' + input.keyboard[key]);
                            }
                            route.actions[input.keyboard[key]].apply(route, [e]);
                        });
                    });
                });
                if (input.controller) Object.keys(input.controller).forEach(function (key) {
                    var conditions = parseControls(key, 'controller');
                    conditions.forEach(function (condition) {
                        node.on('input', condition, function (e) {
                            if (!e.button) return;
                            var type = input.controller;
                            if (!node.active) return; //WTF??
                            if (!route.actions[type[key]]) {
                                throw new Error('no action: ' + type[key]);
                            }
                            route.actions[type[key]].apply(route, [e]);
                        });
                    });
                });
                if (input.cardswipe) Object.keys(input.cardswipe).forEach(function (key) {
                    var conditions = parseControls(key, 'cardswipe');
                    conditions.forEach(function (condition) {
                        node.on('input', condition, function (e) {
                            if (!e.account) return;
                            var type = input.cardswipe;
                            if (!node.active) return; //WTF??
                            if (!route.actions[type[key]]) {
                                throw new Error('no action: ' + type[key]);
                            }
                            route.actions[type[key]].apply(route, [e]);
                        });
                    });
                });
                if (input.barcodescanner) Object.keys(input.barcodescanner).forEach(function (key) {
                    var conditions = parseControls(key, 'barcodescanner');
                    conditions.forEach(function (condition) {
                        node.on('input', condition, function (e) {
                            if (!e.scan) return;
                            var type = input.barcodescanner;
                            if (!node.active) return; //WTF??
                            if (!route.actions[type[key]]) {
                                throw new Error('no action: ' + type[key]);
                            }
                            route.actions[type[key]].apply(route, [e]);
                        });
                    });
                });
                this.inputHeirarchyNode = node;
                Context.inputHeirarchy.add(node);
                return node;
            },
            renderTemplate: function () {
                if (lastRoute === this) return;
                if (lastRoute) {
                    lastRoute.setHeirarchyNode(false);
                }
                this.setHeirarchyNode(true);
                lastRoute = this;
            },
            setHeirarchyNode: function (on) {
                var node = this.getHeirarchyNode();
                if (!node) return;
                if (on) {
                    node.activate();
                } else {
                    node.deactivate();
                }
            }
        });
    }

    function initialize() {
        enableRouteInput();
    }

    exports.default = {
        initialize,
        setMonitor: function (ob) {
            monitor = ob;
        }
    };


    window.setRouteModMonitor = function (ob) {
        monitor = ob;
    };
});
;define('dummy/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
;define('dummy/router', ['exports', 'dummy/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  const Router = Ember.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Ember.Route.bodyInput();

  Router.map(function () {
    this.route('test-controller');
    this.route('test-input');
    this.route('user-input/index', { path: '/user-input/' });
  });

  exports.default = Router;
});
;define('dummy/routes/test-controller', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Route.extend({
    model: function () {
      return new Promise(function (resolve) {
        resolve({});
      });
    }
  });
});
;define("dummy/routes/test-input", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var controls = {
    keyboard: {
      "arrowleft": "reactLeft"
    }
  };

  exports.default = Ember.Route.extend({
    model: function () {
      return new Promise(function (resolve) {
        resolve({});
      });
    },
    input: function () {
      return controls;
    },
    actions: {
      reactLeft: function () {
        window.pushLeftSeen++;
        console.log('4!!');
      }
    }
  });
});
;define('dummy/routes/user-input/index', ['exports', 'ember-route-input/routes/user-input/index'], function (exports, _index) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _index.default;
    }
  });
});
;define('dummy/routes/user-input/keyboard', ['exports', 'ember-route-input/routes/user-input/keyboard'], function (exports, _keyboard) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _keyboard.default;
    }
  });
});
;define('dummy/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
;define("dummy/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "+pl+QIk/", "block": "{\"symbols\":[],\"statements\":[[6,\"h2\"],[10,\"id\",\"title\"],[8],[0,\"Welcome to Ember\"],[9],[0,\"\\n\\n\"],[1,[20,\"outlet\"],false]],\"hasEval\":false}", "meta": { "moduleName": "dummy/templates/application.hbs" } });
});
;define("dummy/templates/test-controller", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "JEziSqjN", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[8],[0,\"\\n  \"],[6,\"span\"],[8],[0,\"blah\"],[9],[0,\"\\n\"],[9],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "dummy/templates/test-controller.hbs" } });
});
;define("dummy/templates/test-input", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "j9ikn4MO", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[10,\"id\",\"input_div\"],[8],[0,\"\\n  \"],[6,\"span\"],[8],[0,\"blah\"],[9],[0,\"\\n\"],[9],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "dummy/templates/test-input.hbs" } });
});
;define('dummy/templates/user-input/index', ['exports', 'ember-route-input/templates/user-input/index'], function (exports, _index) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _index.default;
    }
  });
});
;define('dummy/templates/user-input/keyboard', ['exports', 'ember-route-input/templates/user-input/keyboard'], function (exports, _keyboard) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _keyboard.default;
    }
  });
});
;

;define('dummy/config/environment', [], function() {
  var prefix = 'dummy';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(decodeURIComponent(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

;
          if (!runningTests) {
            require("dummy/app")["default"].create({"LOG_ACTIVE_GENERATION":false,"LOG_VIEW_LOOKUPS":false,"rootElement":"#ember-testing","autoboot":false});
          }
        
//# sourceMappingURL=dummy.map
