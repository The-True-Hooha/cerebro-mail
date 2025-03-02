// This configuration only applies to the package manager root.
/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["eslint:recommended", "next/core-web-vitals", "prettier"],
  plugins: [],
  rules: {
    "no-unused-vars": "warn",
    "no-console": "warn",
  },
};