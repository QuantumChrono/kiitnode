// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*", "readonly/**", ".agents/**"],
  },
  {
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]);
