module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        "plugin:vue/vue3-recommended",
        "eslint:recommended",
        "plugin:prettier/recommended",
    ],
    plugins: ["vue", "html", "prettier"],
    rules: {
        "prettier/prettier": "error",
    },
    overrides: [
        {
            files: [
              "**/__tests__/*.{j,t}s?(x)",
              "**/tests/unit/**/*.spec.{j,t}s?(x)",
          ],
          env: {
                jest: true,
            },
        },
    ],
}
