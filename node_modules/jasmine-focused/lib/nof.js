(function() {
  var fs, path, walkdir, _,
    __slice = [].slice;

  fs = require('fs');

  path = require('path');

  _ = require('underscore-plus');

  walkdir = require('walkdir');

  module.exports = function() {
    var error, pattern, specContents, specDirectory, specPath, specPaths, stats, _i, _len, _results;
    specPaths = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    specPaths = _.flatten(specPaths);
    if (specPaths.length === 0) {
      specPaths = ['spec'];
    }
    specPaths = specPaths.map(function(directory) {
      return path.resolve(directory);
    });
    pattern = /^(\s*)f+(it|describe)((\s+)|(\s*\())/gm;
    _results = [];
    for (_i = 0, _len = specPaths.length; _i < _len; _i++) {
      specDirectory = specPaths[_i];
      try {
        if (!fs.statSync(specDirectory).isDirectory()) {
          continue;
        }
      } catch (_error) {
        error = _error;
        continue;
      }
      _results.push((function() {
        var _j, _len1, _ref, _ref1, _results1;
        _ref = walkdir.sync(specDirectory);
        _results1 = [];
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          specPath = _ref[_j];
          try {
            stats = fs.statSync(specPath);
            if (!stats.isFile()) {
              continue;
            }
            if (stats.size === 0) {
              continue;
            }
          } catch (_error) {
            error = _error;
            continue;
          }
          if ((_ref1 = path.extname(specPath)) !== '.coffee' && _ref1 !== '.js') {
            continue;
          }
          specContents = fs.readFileSync(specPath, 'utf8');
          _results1.push(fs.writeFileSync(specPath, specContents.replace(pattern, '$1$2$3')));
        }
        return _results1;
      })());
    }
    return _results;
  };

}).call(this);
