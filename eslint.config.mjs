import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";

export default tseslint.config(
    {
        ignores: [
            "**/dist/*",
            "**/coverage/*",
            "**/.github/*",
            "eslint.config.mjs",
        ],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        files: ["**/*.ts"],
    },
    {
        rules: {
            "@typescript-eslint/no-unused-vars": [
                "error",
                { 
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_"  
                }
                
            ],
            "@typescript-eslint/no-explicit-any": "warn",
            "no-useless-catch": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/typedef": "off",
        },
    }
);