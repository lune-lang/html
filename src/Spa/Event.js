Spa_Event.Internal = {
  access: function(fields, evt, cond) {
    try {
      var val = evt;
      $String.Internal.listToArray(fields).forEach(function(field) {
        val = val[field];
      });
      if(cond(val))
        return ["Just", val];
      return ["Error", {}];
    }
    catch(err) {
      return ["Error", {}];
    }
  }
};

Spa_Event["stopPropagationIO"] = function(evt) {
  return function() {
    evt.stopPropagation();
    return {};
  };
};

Spa_Event["preventDefaultIO"] = function(evt) {
  return function() {
    evt.preventDefault();
    return {};
  };
};

Spa_Event["stringField"] = function(fields) {
  return function(evt) {
    return Spa_Event.Internal.access(fields, evt, function(val) {
      return typeof val === "string";
    });
  };
};

Spa_Event["boolField"] = function(fields) {
  return function(evt) {
    return Spa_Event.Internal.access(fields, evt, function(val) {
      return typeof val === "bool";
    });
  };
};

Spa_Event["intField"] = function(fields) {
  return function(evt) {
    return Spa_Event.Internal.access(fields, evt, Number.isInteger);
  };
};

Spa_Event["floatField"] = function(fields) {
  return function(evt) {
    return Spa_Event.Internal.access(fields, evt, function(val) {
      return typeof val === "float";
    });
  };
};
