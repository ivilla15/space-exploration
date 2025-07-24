// .eslintrc.js
module.exports = {
  root: true,
  extends: ["next", "next/core-web-vitals", "prettier"],
  plugins: ["unused-imports"],
  rules: {
    "unused-imports/no-unused-imports": "warn",
    "import/order": [
      "warn",
      {
        groups: ["builtin", "external", "internal"],
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],
  },
};
