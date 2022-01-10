IO["map"] = function(f) {
  return function(act) {
    return function() {
      return f(act());
    };
  };
};

IO["apply"] = function(act1) {
  return function(act2) {
    return function() {
      return act1()(act2());
    };
  };
};

IO["bind"] = function(f) {
  return function(act) {
      return function() {
        return f(act())();
      };
  };
};

IO["pure"] = function(x) {
  return function() {
    return x;
  };
};
