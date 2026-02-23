import type { ConfigTypeDefinition } from "./types";

const eslintrc: ConfigTypeDefinition = {
	id: "eslintrc",
	displayName: "ESLint Config",
	patterns: [".eslintrc", ".eslintrc.json"],
	format: "json",
	fields: [
		// ── Base ───────────────────────────────────────────────────────────────
		{
			key: "root",
			label: "Root",
			type: "boolean",
			group: "Base",
			description:
				"Stop ESLint from searching for config files in parent directories.",
		},
		{
			key: "extends",
			label: "Extends",
			type: "array",
			itemType: "string",
			group: "Base",
			description:
				'Shareable configs to extend (e.g. "eslint:recommended", "plugin:@typescript-eslint/recommended").',
		},
		{
			key: "parser",
			label: "Parser",
			type: "string",
			group: "Base",
			description:
				'Custom parser module (e.g. "@typescript-eslint/parser", "@babel/eslint-parser").',
		},
		{
			key: "plugins",
			label: "Plugins",
			type: "array",
			itemType: "string",
			group: "Base",
			description:
				'ESLint plugins to load (e.g. ["@typescript-eslint", "react-hooks", "import"]).',
		},
		{
			key: "ignorePatterns",
			label: "Ignore Patterns",
			type: "array",
			itemType: "string",
			group: "Base",
			description: "Glob patterns for files ESLint should skip.",
		},
		// ── Parser Options ─────────────────────────────────────────────────────
		{
			key: "parserOptions.ecmaVersion",
			label: "ECMA Version",
			type: "enum",
			allowCustom: true,
			group: "Parser Options",
			options: [
				"latest",
				"3",
				"5",
				"6",
				"2015",
				"2016",
				"2017",
				"2018",
				"2019",
				"2020",
				"2021",
				"2022",
				"2023",
				"2024",
			],
			description: "The ECMAScript version syntax to accept.",
		},
		{
			key: "parserOptions.sourceType",
			label: "Source Type",
			type: "enum",
			group: "Parser Options",
			options: ["module", "commonjs", "script"],
			description:
				'Type of source code — use "module" for ESM (import/export).',
		},
		{
			key: "parserOptions.ecmaFeatures.jsx",
			label: "ECMAFeatures: JSX",
			type: "boolean",
			group: "Parser Options",
			description: "Enable parsing of JSX syntax.",
		},
		{
			key: "parserOptions.ecmaFeatures.globalReturn",
			label: "ECMAFeatures: Global Return",
			type: "boolean",
			group: "Parser Options",
			description: "Allow return statements at the top level of a script.",
		},
		{
			key: "parserOptions.project",
			label: "Project (tsconfig)",
			type: "string",
			group: "Parser Options",
			description:
				"Path to tsconfig.json for type-aware lint rules with @typescript-eslint.",
		},
		// ── Environment ────────────────────────────────────────────────────────
		{
			key: "env.browser",
			label: "Browser",
			type: "boolean",
			group: "Environment",
			description: "Browser globals: window, document, navigator, etc.",
		},
		{
			key: "env.node",
			label: "Node.js",
			type: "boolean",
			group: "Environment",
			description:
				"Node.js globals and scoping: process, __dirname, module, etc.",
		},
		{
			key: "env.commonjs",
			label: "CommonJS",
			type: "boolean",
			group: "Environment",
			description: "CommonJS globals: require, module, exports.",
		},
		{
			key: "env.es6",
			label: "ES6 / ES2015",
			type: "boolean",
			group: "Environment",
			description:
				"Enable ES6 globals (Map, Set, Promise, etc.) and parser features.",
		},
		{
			key: "env.es2017",
			label: "ES2017",
			type: "boolean",
			group: "Environment",
			description: "ES2017 globals (SharedArrayBuffer, Atomics, etc.).",
		},
		{
			key: "env.es2020",
			label: "ES2020",
			type: "boolean",
			group: "Environment",
			description: "ES2020 globals (BigInt, globalThis, etc.).",
		},
		{
			key: "env.es2021",
			label: "ES2021",
			type: "boolean",
			group: "Environment",
			description: "ES2021 globals.",
		},
		{
			key: "env.es2022",
			label: "ES2022",
			type: "boolean",
			group: "Environment",
			description: "ES2022 globals.",
		},
		{
			key: "env.jest",
			label: "Jest",
			type: "boolean",
			group: "Environment",
			description: "Jest globals: describe, it, expect, test, beforeEach, etc.",
		},
		{
			key: "env.mocha",
			label: "Mocha",
			type: "boolean",
			group: "Environment",
			description: "Mocha globals: describe, it, before, after, etc.",
		},
		{
			key: "env.jasmine",
			label: "Jasmine",
			type: "boolean",
			group: "Environment",
			description: "Jasmine globals: describe, it, expect, spyOn, etc.",
		},
		{
			key: "env.worker",
			label: "Web Worker",
			type: "boolean",
			group: "Environment",
			description: "Web Worker globals: self, postMessage, importScripts, etc.",
		},
		{
			key: "env.serviceworker",
			label: "Service Worker",
			type: "boolean",
			group: "Environment",
			description: "Service Worker globals: self, caches, clients, fetch, etc.",
		},
		// ── Rules & Globals ────────────────────────────────────────────────────
		{
			key: "rules",
			label: "Rules",
			type: "record",
			group: "Rules & Globals",
			description:
				'Per-rule severity overrides. Values: "off", "warn", "error" (or 0/1/2).',
		},
		{
			key: "globals",
			label: "Globals",
			type: "record",
			group: "Rules & Globals",
			description:
				'Custom global variables. Values: "readonly", "writable", or "off".',
		},
		{
			key: "settings",
			label: "Settings",
			type: "record",
			group: "Rules & Globals",
			description: "Shared settings passed to every rule that uses them.",
		},
	],
};

export default eslintrc;
