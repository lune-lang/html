Spa_Element["text"] = function(text) {
  return text;
};

Spa_Element["node"] = function(tag) {
  return function(props) {
    return function(children) {
      obj = Spa_Element["addProperties"](props)({ style : {} });
      return Spa.Internal.m(tag, obj, $String.Internal.listToArray(children));
    };
  };
};

Spa_Element["addStyle"] = function(name) {
  return function(value) {
    return function(obj) {
      obj.style[name] = value;
      return obj;
    };
  };
};

Spa_Element["addAttribute"] = function(name) {
  return function(value) {
    return function(obj) {
      obj[name] = value;
      return obj;
    };
  };
};

Spa_Element["addListener"] = function(name) {
  return function(callback) {
    return function(obj) {
      obj[name] = function(evt) {
        Spa.Internal.state = Prelude["?"]("Set")
          (callback(evt)(Spa.Internal.state)());
      };
      return obj;
    };
  };
};
