(function() {
  var focusMethods, globals, jasmine, jasmineNode, jasmineNodePath, methodBody, methodName, object, path, reporterPath, setGlobalFocusPriority, _i, _len;

  if (global.jasmine != null) {
    jasmine = global.jasmine;
    if (jasmine.TerminalReporter == null) {
      path = require('path');
      jasmineNodePath = require.resolve('jasmine-node');
      reporterPath = path.join(path.dirname(jasmineNodePath), 'reporter');
      jasmineNode = require(reporterPath).jasmineNode;
      jasmine.TerminalReporter = jasmineNode.TerminalReporter;
    }
  } else {
    jasmine = require('jasmine-node');
  }

  setGlobalFocusPriority = function(priority) {
    var env;
    env = jasmine.getEnv();
    if (!env.focusPriority) {
      env.focusPriority = 1;
    }
    if (priority > env.focusPriority) {
      return env.focusPriority = priority;
    }
  };

  focusMethods = {
    fdescribe: function(description, specDefinitions, priority) {
      var suite;
      if (priority == null) {
        priority = 1;
      }
      setGlobalFocusPriority(priority);
      suite = describe(description, specDefinitions);
      suite.focusPriority = priority;
      return suite;
    },
    ffdescribe: function(description, specDefinitions) {
      return this.fdescribe(description, specDefinitions, 2);
    },
    fffdescribe: function(description, specDefinitions) {
      return this.fdescribe(description, specDefinitions, 3);
    },
    fit: function(description, definition, priority) {
      var spec;
      if (priority == null) {
        priority = 1;
      }
      setGlobalFocusPriority(priority);
      spec = it(description, definition);
      spec.focusPriority = priority;
      return spec;
    },
    ffit: function(description, specDefinitions) {
      return this.fit(description, specDefinitions, 2);
    },
    fffit: function(description, specDefinitions) {
      return this.fit(description, specDefinitions, 3);
    }
  };

  globals = [];

  if (typeof global !== "undefined" && global !== null) {
    globals.push(global);
  }

  if (typeof window !== "undefined" && window !== null) {
    globals.push(window);
  }

  for (methodName in focusMethods) {
    methodBody = focusMethods[methodName];
    for (_i = 0, _len = globals.length; _i < _len; _i++) {
      object = globals[_i];
      object[methodName] = methodBody;
    }
  }

  jasmine.getEnv().specFilter = function(spec) {
    var env, globalFocusPriority, parent, _ref;
    env = jasmine.getEnv();
    globalFocusPriority = env.focusPriority;
    parent = (_ref = spec.parentSuite) != null ? _ref : spec.suite;
    if (!globalFocusPriority) {
      return true;
    } else if (spec.focusPriority >= globalFocusPriority) {
      return true;
    } else if (!parent) {
      return false;
    } else {
      return env.specFilter(parent);
    }
  };

  module.exports = jasmine;

}).call(this);
