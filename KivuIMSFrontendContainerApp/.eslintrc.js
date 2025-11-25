// .eslintrc.js
/* eslint-disable */
module.exports = {
  parserOptions: {
    ecmaVersion: 2020, // Modern ECMAScript version
    sourceType: "script" // For CommonJS (module.exports)
  },
  parser: "@typescript-eslint/parser",
  extends: [
    "airbnb",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ],
  plugins: ["@typescript-eslint", "react", "react-hooks", "prettier"],
  rules: {
    "no-param-reassign": [
      "error",
      {
        props: true,
        ignorePropertyModificationsFor: ["state"] // Allow Redux Toolkit's "state"
      }
    ],
    "react-hooks/exhaustive-deps": "off",
    "react/jsx-props-no-spreading": "off",
    "no-console": "warn",
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function"
      }
    ],
    "react/button-has-type": "off",
    "jsx-a11y/control-has-associated-label": "off",
    "react/require-default-props": "off",
    "prettier/prettier": [
      "error",
      {
        singleQuote: false, // Use double quotes
        bracketSpacing: true // Add space after {}, except in JSX props
      }
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never"
      }
    ],
    "import/prefer-default-export": "off",
    "react/jsx-curly-spacing": [
      "error",
      {
        when: "never", // No space inside {} in JSX props
        children: true
      }
    ],
    "react/jsx-filename-extension": [
      "warn",
      { extensions: [".jsx", ".tsx"] } // Allow .tsx for React components
    ],
    "@typescript-eslint/explicit-module-boundary-types": "off", // Adjust as needed
    "@typescript-eslint/no-unused-vars": ["warn"] // Adjust as needed
  },
  settings: {
    react: {
      version: "detect"
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  }
};
