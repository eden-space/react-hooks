module.exports = {
  // "stories": [
  //   `../packages/**/${process.env.project}/components/**/__story__/**/*.mdx`,
  //   `../packages/**/${process.env.project}/components/**/__story__/**/*.@(js|jsx|ts|tsx)`
  // ],
  stories: [`../packages/**/__story__/**/*.mdx`, `../packages/**/__story__/**/*.@(js|jsx|ts|tsx)`],
  addons: [
    'storybook-addon-turbo-build',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
  core: {
    builder: 'webpack5',
  },
  webpackFinal: async (config) => {
    // Turn off docgen plugin as it breaks bundle with displayName
    config.plugins.pop();
    return config;
  },
};
