$String.Internal = {
  arrayToList: function(array) {
    if(array.length === 0)
      return ["Empty", {}]
    var first = array.shift();
    return ["Cons", {Head: [first], Tail: [this.arrayToList(array)]}]
  },

  listToArray: function(list) {
    if(list[0] === "Empty")
      return [];
    var array = this.listToArray(list[1]["Tail"][0]);
    array.unshift(list[1]["Head"][0]);
    return array;
  }
};

$String["length"] = function(str) { return str.length; };

$String["<>"] = function(str1) {
  return function(str2) { str1 + str2; };
};

$String["reverse"] = function(str) {
  return str.split("").reverse().join("");
};

$String["split"] = function(sep) {
  return function(str) {
    return $String.Internal.arrayToList(str.split(sep));
  };
};

$String["words"] = function(str) {
  return $String.Internal.arrayToList(str.split(/\s+/));
};

$String["lines"] = function(str) {
  return $String.Internal.arrayToList(str.split(/\r?\n/));
};

$String["slice"] = function(x) {
  return function(y) {
    return function(str) {
      if(x < 0) x += str.length;
      if(y < 0) y += str.length;
      if(x >= y) return "";
      return str.substring(x, y);
    };
  };
};

$String["toLower"] = function(str) { return str.toLowerCase(); };
$String["toUpper"] = function(str) { return str.toUpperCase(); };

$String["trim"] = function(str) { return str.trim(); };
$String["trimLeft"] = function(str) { return str.trimLeft(); };
$String["trimRight"] = function(str) { return str.trimRight(); };

$String["contains"] = function(sub) {
  return function(str) {
    return Prelude.Internal.convertBool(str.includes(sub));
  };
};

$String["startsWith"] = function(sub) {
  return function(str) {
    return Prelude.Internal.convertBool(str.startsWith(sub));
  };
};

$String["endsWith"] = function(sub) {
  return function(str) {
    return Prelude.Internal.convertBool(str.endsWith(sub));
  };
};

$String["replace"] = function(sub) {
  return function(rep) {
    return function(str) {
      var regex = new RegExp(sub.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      return str.replace(regex, rep);
    };
  };
};

$String["toInt"] = function(str) {
  var x = parseInt(str, 10);
  if(isNaN(x)) return Result["nothing"];
  return Prelude["^"]("Just")(x);
};

$String["fromInt"] = function(x) { return x.toString(); };

$String["toFloat"] = function(str) {
  var x = parseFloat(str, 10);
  if(isNaN(x)) return Result["nothing"];
  return Prelude["^"]("Just")(x);
};

$String["fromFloat"] = function(x) { return x.toString(); };

$String["toList"] = function(str) {
  return $String.Internal.arrayToList(str.split(''));
};

$String["fromList"] = function(list) {
  return $String.Internal.listToArray(list).join('');
};

$String["cons"] = function(c) {
  return function(str) { return c + str; };
};

$String["deconstruct"] = function(x) {
  return function(f) {
    return function(str) {
      if(str.length === 0) return x;
      return f(str.charAt(0))(str.substring(1));
    };
  };
};

$String["single"] = function(c) { return c; };
