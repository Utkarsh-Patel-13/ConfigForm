import type { ConfigTypeDefinition } from "./types";

const biome: ConfigTypeDefinition = {
	id: "biome",
	displayName: "biome.json",
	patterns: ["biome.json", "biome.jsonc"],
	format: "jsonc",
	fields: [
		// ── Root Config ─────────────────────────────────────────────────────────
		{
			key: "$schema",
			label: "Schema",
			type: "string",
			group: "Root Config",
			description:
				"URL to the Biome JSON schema for editor autocomplete and validation.",
		},
		{
			key: "root",
			label: "Root",
			type: "boolean",
			group: "Root Config",
			description:
				"Mark this as a root configuration. Set false in nested packages to avoid errors.",
		},
		{
			key: "extends",
			label: "Extends",
			type: "array",
			itemType: "string",
			group: "Root Config",
			description:
				'Paths to other Biome configs to inherit from. Use ["//"] in nested configs to extend root.',
		},
		// ── VCS ──────────────────────────────────────────────────────────────────
		{
			key: "vcs.enabled",
			label: "Enabled",
			type: "boolean",
			group: "VCS",
			description: "Enable VCS (git) integration.",
		},
		{
			key: "vcs.clientKind",
			label: "Client Kind",
			type: "enum",
			options: ["git"],
			group: "VCS",
			description: "The VCS client to use. Currently only git is supported.",
		},
		{
			key: "vcs.useIgnoreFile",
			label: "Use Ignore File",
			type: "boolean",
			group: "VCS",
			description:
				"Read .gitignore patterns to determine which files to ignore.",
		},
		{
			key: "vcs.root",
			label: "Root Directory",
			type: "string",
			group: "VCS",
			description:
				"Folder where Biome looks for VCS files. Defaults to the biome.json location.",
		},
		// ── Files ────────────────────────────────────────────────────────────────
		{
			key: "files.maxSize",
			label: "Max File Size",
			type: "number",
			group: "Files",
			description:
				"Maximum file size in bytes. Files exceeding this limit are silently skipped. Default: 1 MB.",
		},
		{
			key: "files.include",
			label: "Include",
			type: "array",
			itemType: "string",
			group: "Files",
			description: "Glob patterns of files Biome should process.",
		},
		{
			key: "files.ignore",
			label: "Ignore",
			type: "array",
			itemType: "string",
			group: "Files",
			description: "Glob patterns of files/folders to skip entirely.",
		},
		// ── Formatter ────────────────────────────────────────────────────────────
		{
			key: "formatter.enabled",
			label: "Enabled",
			type: "boolean",
			group: "Formatter",
			description: "Enable the Biome formatter globally.",
		},
		{
			key: "formatter.indentStyle",
			label: "Indent Style",
			type: "enum",
			options: ["tab", "space"],
			group: "Formatter",
			description: "Use hard tabs or spaces for indentation. Default: tab.",
		},
		{
			key: "formatter.indentWidth",
			label: "Indent Width",
			type: "number",
			group: "Formatter",
			description:
				"Number of spaces per indentation level (when indentStyle is space). Default: 2.",
		},
		{
			key: "formatter.lineWidth",
			label: "Line Width",
			type: "number",
			group: "Formatter",
			description: "Maximum characters per line before wrapping. Default: 80.",
		},
		{
			key: "formatter.lineEnding",
			label: "Line Ending",
			type: "enum",
			options: ["lf", "crlf", "cr"],
			group: "Formatter",
			description: "Line ending style. Default: lf.",
		},
		{
			key: "formatter.attributePosition",
			label: "Attribute Position",
			type: "enum",
			options: ["auto", "multiline"],
			group: "Formatter",
			description:
				'How to format JSX/HTML attributes. "multiline" forces one per line. Default: auto.',
		},
		{
			key: "formatter.formatWithErrors",
			label: "Format With Errors",
			type: "boolean",
			group: "Formatter",
			description: "Format files that contain syntax errors.",
		},
		{
			key: "formatter.ignore",
			label: "Ignore",
			type: "array",
			itemType: "string",
			group: "Formatter",
			description: "Glob patterns of files to skip formatting.",
		},
		// ── JS / TS Formatter ────────────────────────────────────────────────────
		{
			key: "javascript.formatter.quoteStyle",
			label: "Quote Style",
			type: "enum",
			options: ["double", "single"],
			group: "JS Formatter",
			description:
				"Single or double quotes for string literals. Default: double.",
		},
		{
			key: "javascript.formatter.jsxQuoteStyle",
			label: "JSX Quote Style",
			type: "enum",
			options: ["double", "single"],
			group: "JS Formatter",
			description: "Quote style inside JSX attributes. Default: double.",
		},
		{
			key: "javascript.formatter.trailingComma",
			label: "Trailing Comma",
			type: "enum",
			options: ["all", "es5", "none"],
			group: "JS Formatter",
			description: "Trailing commas in multi-line constructs. Default: all.",
		},
		{
			key: "javascript.formatter.semicolons",
			label: "Semicolons",
			type: "enum",
			options: ["always", "asNeeded"],
			group: "JS Formatter",
			description: "Print semicolons at statement ends. Default: always.",
		},
		{
			key: "javascript.formatter.arrowParentheses",
			label: "Arrow Parentheses",
			type: "enum",
			options: ["always", "asNeeded"],
			group: "JS Formatter",
			description:
				"Parentheses around single arrow function parameter. Default: always.",
		},
		{
			key: "javascript.formatter.bracketSpacing",
			label: "Bracket Spacing",
			type: "boolean",
			group: "JS Formatter",
			description:
				"Spaces inside object literal braces: { foo: bar }. Default: true.",
		},
		{
			key: "javascript.formatter.bracketSameLine",
			label: "Bracket Same Line",
			type: "boolean",
			group: "JS Formatter",
			description:
				"Place the closing > of a multi-line JSX element on the last line. Default: false.",
		},
		{
			key: "javascript.formatter.quoteProperties",
			label: "Quote Properties",
			type: "enum",
			options: ["asNeeded", "preserve"],
			group: "JS Formatter",
			description:
				"When to add quotes around object property names. Default: asNeeded.",
		},
		// ── Linter ───────────────────────────────────────────────────────────────
		{
			key: "linter.enabled",
			label: "Enabled",
			type: "boolean",
			group: "Linter",
			description: "Enable the Biome linter globally.",
		},
		{
			key: "linter.ignore",
			label: "Ignore",
			type: "array",
			itemType: "string",
			group: "Linter",
			description: "Glob patterns of files to skip linting.",
		},
		{
			key: "linter.rules.recommended",
			label: "Recommended Rules",
			type: "boolean",
			group: "Linter",
			description: "Enable all recommended rules (187 rules). Default: true.",
		},
		// ── JSON ─────────────────────────────────────────────────────────────────
		{
			key: "json.parser.jsonc",
			label: "Allow JSONC",
			type: "boolean",
			group: "JSON",
			description: "Allow JSON with comments (JSONC) syntax.",
		},
		{
			key: "json.parser.allowTrailingComma",
			label: "Allow Trailing Comma",
			type: "boolean",
			group: "JSON",
			description: "Allow trailing commas in JSON arrays and objects.",
		},
		{
			key: "json.formatter.enabled",
			label: "Formatter Enabled",
			type: "boolean",
			group: "JSON",
			description: "Enable formatter for JSON files.",
		},
		{
			key: "json.formatter.trailingComma",
			label: "Trailing Comma",
			type: "enum",
			options: ["none", "all"],
			group: "JSON",
			description: "Trailing commas in JSON output. Default: none.",
		},
		// ── CSS ──────────────────────────────────────────────────────────────────
		{
			key: "css.parser.tailwindDirectives",
			label: "Tailwind Directives",
			type: "boolean",
			group: "CSS",
			description:
				"Allow Tailwind CSS directives (@plugin, @utility, etc.) without parse errors.",
		},
		{
			key: "css.formatter.enabled",
			label: "Formatter Enabled",
			type: "boolean",
			group: "CSS",
			description: "Enable formatter for CSS files.",
		},
		{
			key: "css.formatter.quoteStyle",
			label: "Quote Style",
			type: "enum",
			options: ["double", "single"],
			group: "CSS",
			description: "Quote style for CSS string values. Default: double.",
		},
		{
			key: "css.linter.enabled",
			label: "Linter Enabled",
			type: "boolean",
			group: "CSS",
			description: "Enable linter for CSS files.",
		},
		// ── Assist ───────────────────────────────────────────────────────────────
		{
			key: "assist.organizeImports.enabled",
			label: "Organize Imports",
			type: "boolean",
			group: "Assist",
			description: "Automatically sort and deduplicate imports on format.",
		},
		{
			key: "assist.organizeImports.sortImportsBySource",
			label: "Sort By Source",
			type: "boolean",
			group: "Assist",
			description:
				"Sort import specifiers alphabetically by source path. Default: true.",
		},
	],
};

export default biome;
