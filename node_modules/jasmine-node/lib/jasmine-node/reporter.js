(function() {
  //
  // Imports
  //
  var util;
  try {
    util = require('util')
  } catch(e) {
    util = require('sys')
  }

  var CoffeeScript = require('coffee-script');
  if (typeof CoffeeScript.register === 'function')
    CoffeeScript.register();

  var FailureTree = require('./failure-tree');

  var jasmineNode = {};
  //
  // Helpers
  //
  function noop() {}


  jasmineNode.TerminalReporter = function(config) {
    this.print_ = config.print || function (str) { process.stdout.write(util.format(str)); };
    this.color_ = config.color ? this.ANSIColors : this.NoColors;

    this.started_ = false;
    this.finished_ = false;

    this.callback_ = config.onComplete || false

    this.suites_ = [];
    this.specResults_ = {};
    this.failureTree_ = new FailureTree();
    this.includeStackTrace_ = config.includeStackTrace === false ? false : true;
  }


  jasmineNode.TerminalReporter.prototype = {
    reportRunnerStarting: function(runner) {
      this.started_ = true;
      this.startedAt = new Date();
      var suites = runner.topLevelSuites();
      for (var i = 0; i < suites.length; i++) {
        var suite = suites[i];
        this.suites_.push(this.summarize_(suite));
      }
    },

    ANSIColors: {
        pass:    function() { return '\033[32m'; }, // Green
        fail:    function() { return '\033[31m'; }, // Red
        ignore:  function() { return '\033[37m'; }, // Light Gray
        neutral: function() { return '\033[0m';  }  // Normal
    },

    NoColors: {
        pass:    function() { return ''; },
        fail:    function() { return ''; },
        ignore:  function() { return ''; },
        neutral: function() { return ''; }
    },

    summarize_: function(suiteOrSpec) {
      var isSuite = suiteOrSpec instanceof jasmine.Suite;

      // We could use a separate object for suite and spec
      var summary = {
        id: suiteOrSpec.id,
        name: suiteOrSpec.description,
        type: isSuite? 'suite' : 'spec',
        suiteNestingLevel: 0,
        children: []
      };

      if (isSuite) {
        var calculateNestingLevel = function(examinedSuite) {
          var nestingLevel = 0;
          while (examinedSuite.parentSuite !== null) {
            nestingLevel += 1;
            examinedSuite = examinedSuite.parentSuite;
          }
          return nestingLevel;
        };

        summary.suiteNestingLevel = calculateNestingLevel(suiteOrSpec);

        var children = suiteOrSpec.children();
        for (var i = 0; i < children.length; i++) {
          summary.children.push(this.summarize_(children[i]));
        }
      }

      return summary;
    },

    // This is heavily influenced by Jasmine's Html/Trivial Reporter
    reportRunnerResults: function(runner) {
      var now = new Date().getTime();
      this.reportFailures_();

      var results = runner.results();
      var resultColor = (results.failedCount > 0) ? this.color_.fail() : this.color_.pass();

      var specs = runner.specs();
      var specCount = specs.length;

      var message = "\n\nFinished in " + ((now - this.startedAt.getTime()) / 1000) + " seconds";
      this.printLine_(message);

      // This is what jasmine-html.js has
      //message = "" + specCount + " spec" + ( specCount === 1 ? "" : "s" ) + ", " + results.failedCount + " failure" + ((results.failedCount === 1) ? "" : "s");

      this.printLine_(this.stringWithColor_(this.printRunnerResults_(runner), resultColor));

      this.finished_ = true;
      if(this.callback_) { this.callback_(runner); }
    },

    reportFailures_: function() {
      if (this.failureTree_.isEmpty())
        return;

      this.printLine_('\n');

      this.failureTree_.forEach(function(spec, failure, depth) {
        var indentLevel = 1 + (depth * 2);
        if (failure) {
          var failureIndentation = new Array(indentLevel + 2).join(' ');
          var stackIndentation = new Array(indentLevel + 4).join(' ');
          this.print_(failureIndentation);
          this.print_(this.stringWithColor_(failure.message, this.color_.fail()));
          if (failure.messageLine)
            this.print_(this.stringWithColor_(' (' + failure.messageLine + ')', this.color_.ignore()));
          this.print_('\n');
          if (this.includeStackTrace_) {
              if (failure.filteredStackTrace) {
                var stackTraceLines = failure.filteredStackTrace.split('\n');
                for (var j = 0; j < stackTraceLines.length; j++)
                  this.printLine_(stackIndentation + stackTraceLines[j].trim());
              }
          }
        } else {
          var description = spec.description || '';
          if (spec.suite && description.indexOf('it ') != 0)
            description = 'it ' + description;
          this.printLine_(new Array(indentLevel).join(' ') + description);
        }
      }.bind(this));
    },

    reportSuiteResults: function(suite) {
      // Not used in this context
    },

    reportSpecResults: function(spec) {
      var result = spec.results();
      var msg = '';
      if (result.skipped) {
        msg = this.stringWithColor_('-', this.color_.ignore());
      } else if (result.passed()) {
        msg = this.stringWithColor_('.', this.color_.pass());
      } else {
        msg = this.stringWithColor_('F', this.color_.fail());
        this.addFailureToFailures_(spec);
      }
      this.spec_results += msg;
      this.print_(msg);
    },

    addFailureToFailures_: function(spec) {
      this.failureTree_.add(spec)
    },

    printRunnerResults_: function(runner){
      var results = runner.results();
      var specs = runner.specs();
      var msg = '';
      var skippedCount = 0;
      specs.forEach(function(spec) {
        if (spec.results().skipped) {
          skippedCount++;
        }
      });
      var passedCount = specs.length - skippedCount;
      msg += passedCount + ' test' + ((passedCount === 1) ? '' : 's') + ', ';
      msg += results.totalCount + ' assertion' + ((results.totalCount === 1) ? '' : 's') + ', ';
      msg += results.failedCount + ' failure' + ((results.failedCount === 1) ? '' : 's') + ', ';
      msg += skippedCount + ' skipped' + '\n';
      return msg;
    },

      // Helper Methods //
    stringWithColor_: function(stringValue, color) {
      return (color || this.color_.neutral()) + stringValue + this.color_.neutral();
    },

    printLine_: function(stringValue) {
      this.print_(stringValue);
      this.print_('\n');
    }
  };

  // ***************************************************************
  // TerminalVerboseReporter uses the TerminalReporter's constructor
  // ***************************************************************
  jasmineNode.TerminalVerboseReporter = function(config) {
    jasmineNode.TerminalReporter.call(this, config);
    // The extra field in this object
    this.indent_ = 0;
  }


  jasmineNode.TerminalVerboseReporter.prototype = {
    reportSpecResults: function(spec) {
      if (spec.results().failedCount > 0) {
        this.addFailureToFailures_(spec);
      }

      this.specResults_[spec.id] = {
        messages: spec.results().getItems(),
        result: spec.results().failedCount > 0 ? 'failed' : 'passed'
      };
    },

    reportRunnerResults: function(runner) {
      var messages = new Array();
      this.buildMessagesFromResults_(messages, this.suites_);

      var messages_length = messages.length;
      for (var i = 0; i < messages_length-1; i++) {
        this.printLine_(messages[i]);
      }

      this.print_(messages[messages_length-1]);

      // Call the parent object's method
      jasmineNode.TerminalReporter.prototype.reportRunnerResults.call(this, runner);
    },

    buildMessagesFromResults_: function(messages, results, depth) {
      var element, specResult, specIndentSpaces, msg = '';
      depth = (depth === undefined) ? 0 : depth;

      var results_length = results.length;
      for (var i = 0; i < results_length; i++) {
        element = results[i];

        if (element.type === 'spec') {
          specResult = this.specResults_[element.id.toString()];

          if (specResult.result === 'passed') {
            msg = this.stringWithColor_(this.indentMessage_(element.name, depth), this.color_.pass());
          } else {
            msg = this.stringWithColor_(this.indentMessage_(element.name, depth), this.color_.fail());
          }

          messages.push(msg);
        } else {
          messages.push('');
          messages.push(this.indentMessage_(element.name, depth));
        }

        this.buildMessagesFromResults_(messages, element.children, depth + 2);
      }
    },

    indentMessage_: function(message, indentCount) {
      var _indent = '';
      for (var i = 0; i < indentCount; i++) {
        _indent += '  ';
      }
      return (_indent + message);
    }
  };

  // Inherit from TerminalReporter
  jasmineNode.TerminalVerboseReporter.prototype.__proto__ = jasmineNode.TerminalReporter.prototype;

  //
  // Exports
  //
  exports.jasmineNode = jasmineNode;
})();
