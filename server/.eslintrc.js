module.exports = {
  env: {
    node: true,
    browser: true,
    commonjs: true,
  },
  extends: "eslint:recommended",
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "script",
  },
  rules: {
    semi: ["error", "always"],
    quotes: ["error", "double"],
  },
};
