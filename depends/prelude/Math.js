$Math["sqrt"] = Math.sqrt;
$Math["cbrt"] = Math.cbrt;

$Math["exp"] = Math.exp;

$Math["**"] = function(x) {
  return function(y) {
    return Math.pow(x, y);
  }
}

$Math["log"] = Math.log;

$Math["pi"] = Math.PI;

$Math["sin"] = Math.sin;
$Math["cos"] = Math.cos;
$Math["tan"] = Math.tan;

$Math["asin"] = Math.asin;
$Math["acos"] = Math.acos;
$Math["atan"] = Math.atan;

$Math["atan2"] = function(x) {
  return function(y) {
    return Math.atan2(x, y);
  }
}

$Math["sinh"] = Math.sinh;
$Math["cosh"] = Math.cosh;
$Math["tanh"] = Math.tanh;

$Math["asinh"] = Math.asinh;
$Math["acosh"] = Math.acosh;
$Math["atanh"] = Math.atanh;

$Math["hypot"] = function(x) {
  return function(y) {
    return Math.hypot(x, y);
  }
}
