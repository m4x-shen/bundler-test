module.exports = function ({ className = '' }) {
  return {
    postcssPlugin: 'postcss-attach-class',

    Once(root) {
      root.walkRules(rule => {
        if (
          !className ||
          !rule.selector.startsWith('.') ||
          rule.selector.includes(',') ||
          rule.selector.includes(className) ||
          ['.light', '.dark'].includes(rule.selector)
        )
          return;

        rule.selector = `:where(.${className})${rule.selector}`;
      });
    },
  };
};

module.exports.postcss = true;
