// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      // Custom rule we added to turn off 'prefer-inject'
      "@angular-eslint/prefer-inject": "off",

      // Disables the 'unused vars' rule for variables like 'NewsDashBoardComponent' in app.routes.ts,
      // which are technically used by the router but flagged by the linter.
      // It also ignores the common '_' variable used to ignore function parameters.
      "@typescript-eslint/no-unused-vars": "off",

      // Disables the rule that enforces 'as Type' over '<Type>' for type assertions.
      "@typescript-eslint/consistent-type-assertions": "off"
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    // Disables accessibility rules for click handlers, allowing click events without corresponding keyboard events.
    // It's recommended to address these from an accessibility standpoint rather than simply disabling them.
    rules: {
      "@angular-eslint/template/click-events-have-key-events": "off",
      "@angular-eslint/template/interactive-supports-focus": "off"
    },
  },
  // This is the block for test files.
  {
    files: [
      "**/*.spec.ts",
      "**/*.d.ts"
    ],
    rules: {
      // Disables the 'prefer-const' rule, as it is often a nuisance in tests.
      "prefer-const": "off",
      // Disables the 'no-empty-function' rule.
      "no-empty-function": "off",

      // Disables the 'no-explicit-any' rule, which is often needed in tests for mocking.
      "@typescript-eslint/no-explicit-any": "off"
    }
  },
  // This is the block for Storybook files.
  {
    files: [
      "**/stories/*.ts",
      "**/*.stories.ts"
    ],
    rules: {
      // Disables rules that are irrelevant to storybook files.
      "@angular-eslint/component-selector": "off",
      "@angular-eslint/use-lifecycle-interface": "off",
      "prefer-const": "off",
      "max-classes-per-file": "off",

      // Disables the rule that prevents 'on' prefixes in output bindings for Storybook files.
      "@angular-eslint/no-output-on-prefix": "off"
    }
  }
);
