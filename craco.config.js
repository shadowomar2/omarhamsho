module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Disable ESLint plugin
      webpackConfig.plugins = webpackConfig.plugins.filter(
        plugin => plugin.constructor.name !== 'ESLintWebpackPlugin'
      );
      return webpackConfig;
    }
  }
};
