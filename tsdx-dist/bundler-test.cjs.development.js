'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (e.indexOf(n) >= 0) continue;
    t[n] = r[n];
  }
  return t;
}

var _excluded = ["someProp"],
  _excluded2 = ["someProp"],
  _excluded3 = ["someProp"],
  _excluded4 = ["someProp"];
// in React.forwardRef<Ref, Props>
// when Props is extended from React.ComponentPropsWithRef
// the bundled type will be Pick<Props, ...>
var MyComponent = /*#__PURE__*/React.forwardRef(function (_ref, ref) {
  var someProp = _ref.someProp,
    props = _objectWithoutPropertiesLoose(_ref, _excluded);
  return React.createElement("div", Object.assign({}, props, {
    ref: ref
  }), someProp);
});
var MyComponent2 = /*#__PURE__*/React.forwardRef(function (_ref2, ref) {
  var someProp = _ref2.someProp,
    props = _objectWithoutPropertiesLoose(_ref2, _excluded2);
  return React.createElement("div", Object.assign({}, props, {
    ref: ref
  }), someProp);
});
var MyComponent3 = function MyComponent3(_ref3) {
  var someProp = _ref3.someProp,
    props = _objectWithoutPropertiesLoose(_ref3, _excluded3);
  return React.createElement("div", Object.assign({}, props), someProp);
};
// the Pick behavior does not happen when only using React.forwardRef
var MyComponent4 = /*#__PURE__*/React.forwardRef(function (_ref4, ref) {
  var someProp = _ref4.someProp,
    props = _objectWithoutPropertiesLoose(_ref4, _excluded4);
  return React.createElement("div", Object.assign({}, props, {
    ref: ref
  }), someProp);
});

exports.MyComponent = MyComponent;
exports.MyComponent2 = MyComponent2;
exports.MyComponent3 = MyComponent3;
exports.MyComponent4 = MyComponent4;
//# sourceMappingURL=bundler-test.cjs.development.js.map
