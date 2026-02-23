import type { ConfigTypeDefinition } from "./types";

const tsconfig: ConfigTypeDefinition = {
	id: "tsconfig",
	displayName: "tsconfig.json",
	patterns: ["tsconfig.json"],
	format: "jsonc",
	fields: [
		// ── Top Level ──────────────────────────────────────────────────────────
		{
			key: "extends",
			label: "Extends",
			type: "string",
			group: "Top Level",
			description:
				'Path to a base tsconfig to inherit settings from (e.g. "./tsconfig.base.json").',
		},
		{
			key: "include",
			label: "Include",
			type: "array",
			itemType: "string",
			group: "Top Level",
			description: "Glob patterns of files to include in the compilation.",
		},
		{
			key: "exclude",
			label: "Exclude",
			type: "array",
			itemType: "string",
			group: "Top Level",
			description:
				"Glob patterns to exclude. Defaults to node_modules, outDir.",
		},
		{
			key: "files",
			label: "Files",
			type: "array",
			itemType: "string",
			group: "Top Level",
			description:
				"Explicit list of files to compile. Disables glob-based discovery.",
		},
		// ── Type Checking ──────────────────────────────────────────────────────
		{
			key: "compilerOptions.strict",
			label: "Strict",
			type: "boolean",
			group: "Type Checking",
			description: "Enable all strict type-checking options at once.",
		},
		{
			key: "compilerOptions.strictNullChecks",
			label: "Strict Null Checks",
			type: "boolean",
			group: "Type Checking",
			description: "Distinguish null and undefined from other types.",
		},
		{
			key: "compilerOptions.strictFunctionTypes",
			label: "Strict Function Types",
			type: "boolean",
			group: "Type Checking",
			description:
				"Enable stricter checking of function type parameter contravariance.",
		},
		{
			key: "compilerOptions.strictPropertyInitialization",
			label: "Strict Property Initialization",
			type: "boolean",
			group: "Type Checking",
			description:
				"Ensure class properties are initialized in the constructor.",
		},
		{
			key: "compilerOptions.noImplicitAny",
			label: "No Implicit Any",
			type: "boolean",
			group: "Type Checking",
			description: "Raise an error on expressions with an implied any type.",
		},
		{
			key: "compilerOptions.noImplicitThis",
			label: "No Implicit This",
			type: "boolean",
			group: "Type Checking",
			description: "Raise an error when this has an implied any type.",
		},
		{
			key: "compilerOptions.noImplicitReturns",
			label: "No Implicit Returns",
			type: "boolean",
			group: "Type Checking",
			description:
				"Report an error when not all code paths in a function return a value.",
		},
		{
			key: "compilerOptions.noUnusedLocals",
			label: "No Unused Locals",
			type: "boolean",
			group: "Type Checking",
			description: "Report errors on unused local variables.",
		},
		{
			key: "compilerOptions.noUnusedParameters",
			label: "No Unused Parameters",
			type: "boolean",
			group: "Type Checking",
			description: "Report errors on unused function parameters.",
		},
		{
			key: "compilerOptions.noFallthroughCasesInSwitch",
			label: "No Fallthrough Cases In Switch",
			type: "boolean",
			group: "Type Checking",
			description: "Report errors for fallthrough cases in switch statements.",
		},
		{
			key: "compilerOptions.noUncheckedIndexedAccess",
			label: "No Unchecked Indexed Access",
			type: "boolean",
			group: "Type Checking",
			description:
				"Add undefined to index signature results to reflect runtime behaviour.",
		},
		{
			key: "compilerOptions.noImplicitOverride",
			label: "No Implicit Override",
			type: "boolean",
			group: "Type Checking",
			description:
				"Require the override keyword when overriding a base-class member.",
		},
		{
			key: "compilerOptions.exactOptionalPropertyTypes",
			label: "Exact Optional Property Types",
			type: "boolean",
			group: "Type Checking",
			description:
				"Differentiate between an optional property being absent vs set to undefined.",
		},
		{
			key: "compilerOptions.alwaysStrict",
			label: "Always Strict",
			type: "boolean",
			group: "Type Checking",
			description:
				'Parse in strict mode and emit "use strict" in every output file.',
		},
		// ── Output ─────────────────────────────────────────────────────────────
		{
			key: "compilerOptions.target",
			label: "Target",
			type: "enum",
			group: "Output",
			options: [
				"ES5",
				"ES6",
				"ES2015",
				"ES2016",
				"ES2017",
				"ES2018",
				"ES2019",
				"ES2020",
				"ES2021",
				"ES2022",
				"ES2023",
				"ES2024",
				"ESNext",
			],
			description: "The JavaScript language version to compile output to.",
		},
		{
			key: "compilerOptions.outDir",
			label: "Out Directory",
			type: "string",
			group: "Output",
			description: "Redirect compiled output files into this directory.",
		},
		{
			key: "compilerOptions.outFile",
			label: "Out File",
			type: "string",
			group: "Output",
			description:
				"Concatenate all output into a single file (AMD/System modules only).",
		},
		{
			key: "compilerOptions.rootDir",
			label: "Root Directory",
			type: "string",
			group: "Output",
			description:
				"The root directory of input files. Used to control the output directory structure.",
		},
		{
			key: "compilerOptions.noEmit",
			label: "No Emit",
			type: "boolean",
			group: "Output",
			description: "Do not emit compiled output files — type-checking only.",
		},
		{
			key: "compilerOptions.declaration",
			label: "Declaration",
			type: "boolean",
			group: "Output",
			description: "Generate .d.ts declaration files.",
		},
		{
			key: "compilerOptions.declarationDir",
			label: "Declaration Directory",
			type: "string",
			group: "Output",
			description: "Output directory for generated .d.ts files.",
		},
		{
			key: "compilerOptions.declarationMap",
			label: "Declaration Map",
			type: "boolean",
			group: "Output",
			description: "Generate source maps for .d.ts files.",
		},
		{
			key: "compilerOptions.sourceMap",
			label: "Source Map",
			type: "boolean",
			group: "Output",
			description: "Generate .js.map source map files alongside .js output.",
		},
		{
			key: "compilerOptions.inlineSourceMap",
			label: "Inline Source Map",
			type: "boolean",
			group: "Output",
			description: "Embed source maps inline in the output JavaScript files.",
		},
		{
			key: "compilerOptions.removeComments",
			label: "Remove Comments",
			type: "boolean",
			group: "Output",
			description: "Strip all comments from the output.",
		},
		{
			key: "compilerOptions.preserveConstEnums",
			label: "Preserve Const Enums",
			type: "boolean",
			group: "Output",
			description: "Disable erasing const enum declarations in generated code.",
		},
		{
			key: "compilerOptions.incremental",
			label: "Incremental",
			type: "boolean",
			group: "Output",
			description: "Save .tsbuildinfo to enable incremental compilation.",
		},
		{
			key: "compilerOptions.composite",
			label: "Composite",
			type: "boolean",
			group: "Output",
			description:
				"Enable constraints required for TypeScript project references.",
		},
		// ── Module ─────────────────────────────────────────────────────────────
		{
			key: "compilerOptions.module",
			label: "Module",
			type: "enum",
			group: "Module",
			options: [
				"None",
				"CommonJS",
				"AMD",
				"System",
				"UMD",
				"ES6",
				"ES2015",
				"ES2020",
				"ES2022",
				"ESNext",
				"Node16",
				"NodeNext",
				"Preserve",
			],
			description: "The module code generation format.",
		},
		{
			key: "compilerOptions.moduleResolution",
			label: "Module Resolution",
			type: "enum",
			group: "Module",
			options: ["classic", "node", "node10", "node16", "nodenext", "bundler"],
			description: "How TypeScript looks up a file from a module specifier.",
		},
		{
			key: "compilerOptions.moduleDetection",
			label: "Module Detection",
			type: "enum",
			group: "Module",
			options: ["auto", "legacy", "force"],
			description:
				"Controls how TypeScript determines whether a file is a module or script.",
		},
		{
			key: "compilerOptions.baseUrl",
			label: "Base URL",
			type: "string",
			group: "Module",
			description: "Base directory for resolving non-relative module names.",
		},
		{
			key: "compilerOptions.paths",
			label: "Paths",
			type: "record",
			group: "Module",
			description:
				'Path alias mappings relative to baseUrl (e.g. { "@/*": ["./src/*"] }).',
		},
		{
			key: "compilerOptions.resolveJsonModule",
			label: "Resolve JSON Module",
			type: "boolean",
			group: "Module",
			description: "Allow importing .json files.",
		},
		{
			key: "compilerOptions.esModuleInterop",
			label: "ES Module Interop",
			type: "boolean",
			group: "Module",
			description:
				"Emit helpers to ease support for importing CommonJS modules as ES defaults.",
		},
		{
			key: "compilerOptions.allowSyntheticDefaultImports",
			label: "Allow Synthetic Default Imports",
			type: "boolean",
			group: "Module",
			description: "Allow default imports from modules with no default export.",
		},
		{
			key: "compilerOptions.isolatedModules",
			label: "Isolated Modules",
			type: "boolean",
			group: "Module",
			description:
				"Ensure each file can be safely transpiled without type information (Babel/esbuild/SWC compatibility).",
		},
		{
			key: "compilerOptions.verbatimModuleSyntax",
			label: "Verbatim Module Syntax",
			type: "boolean",
			group: "Module",
			description:
				"Enforce import type for type-only imports. Modern replacement for isolatedModules.",
		},
		{
			key: "compilerOptions.allowImportingTsExtensions",
			label: "Allow Importing TS Extensions",
			type: "boolean",
			group: "Module",
			description:
				"Allow imports to include .ts/.tsx extensions (requires noEmit or declaration).",
		},
		{
			key: "compilerOptions.allowArbitraryExtensions",
			label: "Allow Arbitrary Extensions",
			type: "boolean",
			group: "Module",
			description:
				"Allow importing files with any extension when a .d.ts declaration file is present.",
		},
		// ── Language ───────────────────────────────────────────────────────────
		{
			key: "compilerOptions.lib",
			label: "Lib",
			type: "array",
			itemType: "string",
			group: "Language",
			description:
				'Built-in type definitions to include (e.g. ["ES2023", "DOM", "DOM.Iterable"]).',
		},
		{
			key: "compilerOptions.jsx",
			label: "JSX",
			type: "enum",
			group: "Language",
			options: [
				"preserve",
				"react",
				"react-jsx",
				"react-jsxdev",
				"react-native",
				"none",
			],
			description: "How JSX expressions are transformed in output files.",
		},
		{
			key: "compilerOptions.allowJs",
			label: "Allow JS",
			type: "boolean",
			group: "Language",
			description: "Allow JavaScript files to be included in the project.",
		},
		{
			key: "compilerOptions.checkJs",
			label: "Check JS",
			type: "boolean",
			group: "Language",
			description:
				"Enable type checking in JavaScript files (requires allowJs).",
		},
		{
			key: "compilerOptions.experimentalDecorators",
			label: "Experimental Decorators",
			type: "boolean",
			group: "Language",
			description: "Enable legacy stage-2 decorator support.",
		},
		{
			key: "compilerOptions.emitDecoratorMetadata",
			label: "Emit Decorator Metadata",
			type: "boolean",
			group: "Language",
			description:
				"Emit design-type metadata for decorated declarations (requires experimentalDecorators).",
		},
		{
			key: "compilerOptions.useDefineForClassFields",
			label: "Use Define For Class Fields",
			type: "boolean",
			group: "Language",
			description:
				"Use ECMAScript-spec-compliant class field semantics (define vs assign).",
		},
		// ── Libraries ──────────────────────────────────────────────────────────
		{
			key: "compilerOptions.skipLibCheck",
			label: "Skip Lib Check",
			type: "boolean",
			group: "Libraries",
			description: "Skip type checking of all .d.ts declaration files.",
		},
		{
			key: "compilerOptions.types",
			label: "Types",
			type: "array",
			itemType: "string",
			group: "Libraries",
			description:
				'Limit which @types packages are included globally (e.g. ["node", "jest"]).',
		},
		{
			key: "compilerOptions.typeRoots",
			label: "Type Roots",
			type: "array",
			itemType: "string",
			group: "Libraries",
			description:
				"Paths to type definition directories (default: node_modules/@types).",
		},
		// ── Compatibility ──────────────────────────────────────────────────────
		{
			key: "compilerOptions.forceConsistentCasingInFileNames",
			label: "Force Consistent Casing In File Names",
			type: "boolean",
			group: "Compatibility",
			description: "Disallow imports that differ from a file's casing on disk.",
		},
	],
};

export default tsconfig;
