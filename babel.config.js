module.exports = function(api) {
  api.cache(true);
  const plugins = [];
  plugins.push([
    './plugins/babel-plugin-attach-class',
    {
      className: 'appier-ds'
    }
  ]);

  return {
    plugins
  };
};
