Prelude.Internal = {
  deepCopy: function(object) {
    var result = Array.isArray(object) ? [] : {};
    for(var key in object) {
      var value = object[key];
      if(typeof value === "object")
        result[key] = this.deepCopy(value);
      else result[key] = value;
    }
    return result;
  },

  equals: function(x, y) {
    if(typeof x === "object" && typeof y === "object") {
      if(Array.isArray(x) !== Array.isArray(y))
        return false;
      if(Object.keys(x).length !== Object.keys(y).length)
        return false;
      for(var key in x) {
        if(!this.equals(x[key], y[key]))
          return false;
      }
      return true;
    }
    return x === y;
  },

  lessThan: function(x, y) {
    if(typeof x === "object" && typeof y === "object") {
      if(Array.isArray(x) !== Array.isArray(y))
        return false;
      if(Object.keys(x).length !== Object.keys(y).length)
        return false;
      var keys = Object.keys(x).sort();
      for(var i = 0; i < keys.length; i++) {
        if(this.lessThan(x[keys[i]], y[keys[i]]))
          return true;
        if(this.greaterThan(x[keys[i]], y[keys[i]]))
          return false;
      }
      return false;
    }
    return x < y;
  },

  greaterThan: function(x, y) {
    if(typeof x === "object" && typeof y === "object") {
      if(Array.isArray(x) !== Array.isArray(y))
        return false;
      if(Object.keys(x).length !== Object.keys(y).length)
        return false;
      var keys = Object.keys(x).sort();
      for(var i = 0; i < keys.length; i++) {
        if(this.greaterThan(x[keys[i]], y[keys[i]]))
          return true;
        if(this.lessThan(x[keys[i]], y[keys[i]]))
          return false;
      }
      return false;
    }
    return x > y;
  },

  convertBool: function(bool) {
    return bool ? ["True", {}] : ["False", {}];
  }
};

Prelude["float"] = function(x) { return x; };

Prelude["round"] = Math.round;
Prelude["floor"] = Math.floor;
Prelude["ceil"] = Math.ceil;

Prelude["+"] = function(x) {
  return function(y) {
    return x + y;
  };
};

Prelude["~"] = function(x) {
  return function(y) {
    return x - y;
  };
};

Prelude["*"] = function(x) {
  return function(y) {
    return x * y;
  };
};

Prelude["negate"] = function(x) { return -x; };

Prelude["abs"] = Math.abs;
Prelude["signum"] = Math.sign;

Prelude["div"] = function(x) {
  return function(y) {
    return Math.floor(y / x);
  };
};

Prelude["quot"] = function(x) {
  return function(y) {
    var q = y / x;
    return q < 0 ? Math.ceil(q) : Math.floor(q);
  };
};

Prelude["mod"] = function(x) {
  return function(y) {
    return (y % x + x) % x;
  };
};

Prelude["rem"] = function(x) {
  return function(y) {
    return y % x;
  };
};

Prelude["/"] = function(x) {
  return function(y) {
    return x / y;
  };
};

Prelude["unit"] = {};

Prelude["?"] = function(label) {
  return function(struct) {
    return struct[label][0];
  };
};

Prelude["delete"] = function(label) {
  return function(struct) {
    struct = Prelude.Internal.deepCopy(struct);
    if(struct[label].length === 0)
      delete struct[label];
    else struct[label].shift();
    return struct;
  };
};

Prelude[":="] = function(label) {
  return function(value) {
    return function(struct) {
      struct = Prelude.Internal.deepCopy(struct);
      if(label in struct)
        struct[label].unshift(value);
      else struct[label] = [value];
      return struct;
    };
  };
};

Prelude["^"] = function(label) {
  return function(value) {
    return [label, value];
  };
};

Prelude["embed"] = function(label) {
  return function(variant) {
    return variant;
  };
};

Prelude["match"] = function(label) {
  return function(f) {
    return function(g) {
      return function(variant) {
        return variant[0] === label ? f(variant[1]) : g(variant);
      };
    };
  };
};

Prelude["=="] = function(x) {
  return function(y) {
    return Prelude.Internal.convertBool(Prelude.Internal.equals(x, y));
  };
};

Prelude["<"] = function(x) {
  return function(y) {
    return Prelude.Internal.convertBool(Prelude.Internal.lessThan(x, y));
  };
};

Prelude[">"] = function(x) {
  return function(y) {
    return Prelude.Internal.convertBool(Prelude.Internal.greaterThan(x, y));
  };
};

Prelude["isFinite"] = isFinite;
Prelude["isNaN"] = isNaN;
