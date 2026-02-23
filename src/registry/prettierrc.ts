import type { ConfigTypeDefinition } from "./types";

const prettierrc: ConfigTypeDefinition = {
	id: "prettierrc",
	displayName: "Prettier Config",
	patterns: [".prettierrc", ".prettierrc.json"],
	format: "json",
	fields: [
		// ── Formatting ─────────────────────────────────────────────────────────
		{
			key: "printWidth",
			label: "Print Width",
			type: "number",
			group: "Formatting",
			description: "Wrap lines that exceed this length. Default: 80.",
			validate: [
				{ rule: "min", value: 40, message: "Print width must be at least 40" },
				{
					rule: "max",
					value: 200,
					message: "Print width must be at most 200",
				},
			],
		},
		{
			key: "tabWidth",
			label: "Tab Width",
			type: "number",
			group: "Formatting",
			description: "Number of spaces per indentation level. Default: 2.",
			validate: [
				{ rule: "min", value: 1, message: "Tab width must be at least 1" },
				{ rule: "max", value: 8, message: "Tab width must be at most 8" },
			],
		},
		{
			key: "useTabs",
			label: "Use Tabs",
			type: "boolean",
			group: "Formatting",
			description: "Indent with tabs instead of spaces. Default: false.",
		},
		{
			key: "endOfLine",
			label: "End of Line",
			type: "enum",
			group: "Formatting",
			options: ["lf", "crlf", "cr", "auto"],
			description:
				'Line ending style. "lf" recommended for cross-platform projects. Default: lf.',
		},
		// ── Punctuation ────────────────────────────────────────────────────────
		{
			key: "semi",
			label: "Semicolons",
			type: "boolean",
			group: "Punctuation",
			description: "Print semicolons at the end of statements. Default: true.",
		},
		{
			key: "trailingComma",
			label: "Trailing Comma",
			type: "enum",
			group: "Punctuation",
			options: ["all", "es5", "none"],
			description:
				'Add trailing commas in multi-line structures. "all" includes function params. Default: all.',
		},
		{
			key: "arrowParens",
			label: "Arrow Function Parens",
			type: "enum",
			group: "Punctuation",
			options: ["always", "avoid"],
			description:
				'Parentheses around sole arrow function parameters. Default: "always".',
		},
		// ── Quotes ─────────────────────────────────────────────────────────────
		{
			key: "singleQuote",
			label: "Single Quotes",
			type: "boolean",
			group: "Quotes",
			description:
				"Use single quotes instead of double quotes. Default: false.",
		},
		{
			key: "jsxSingleQuote",
			label: "JSX Single Quotes",
			type: "boolean",
			group: "Quotes",
			description: "Use single quotes in JSX attributes. Default: false.",
		},
		{
			key: "quoteProps",
			label: "Quote Props",
			type: "enum",
			group: "Quotes",
			options: ["as-needed", "consistent", "preserve"],
			description:
				'When to add quotes around object property keys. Default: "as-needed".',
		},
		// ── Spacing ────────────────────────────────────────────────────────────
		{
			key: "bracketSpacing",
			label: "Bracket Spacing",
			type: "boolean",
			group: "Spacing",
			description:
				"Print spaces between brackets in object literals: { foo: bar }. Default: true.",
		},
		{
			key: "bracketSameLine",
			label: "Bracket Same Line",
			type: "boolean",
			group: "Spacing",
			description:
				"Put the closing > of a multi-line JSX/HTML element on the last line. Default: false.",
		},
		{
			key: "singleAttributePerLine",
			label: "Single Attribute Per Line",
			type: "boolean",
			group: "Spacing",
			description:
				"Enforce one HTML/JSX attribute per line in multi-line elements. Default: false.",
		},
		{
			key: "objectWrap",
			label: "Object Wrap",
			type: "enum",
			group: "Spacing",
			options: ["preserve", "collapse"],
			description:
				'How to wrap object literals — "preserve" keeps author intent. Default: preserve.',
		},
		// ── Prose & Markup ─────────────────────────────────────────────────────
		{
			key: "proseWrap",
			label: "Prose Wrap",
			type: "enum",
			group: "Prose & Markup",
			options: ["always", "never", "preserve"],
			description:
				'Wrap Markdown prose at printWidth. "preserve" keeps as-is. Default: preserve.',
		},
		{
			key: "htmlWhitespaceSensitivity",
			label: "HTML Whitespace Sensitivity",
			type: "enum",
			group: "Prose & Markup",
			options: ["css", "strict", "ignore"],
			description:
				'Whitespace handling in HTML. "css" follows display property. Default: css.',
		},
		{
			key: "vueIndentScriptAndStyle",
			label: "Vue Indent Script and Style",
			type: "boolean",
			group: "Prose & Markup",
			description:
				"Indent the contents of <script> and <style> tags in Vue SFCs. Default: false.",
		},
		// ── Embedded Language ──────────────────────────────────────────────────
		{
			key: "embeddedLanguageFormatting",
			label: "Embedded Language Formatting",
			type: "enum",
			group: "Embedded Language",
			options: ["auto", "off"],
			description:
				'Format embedded code (CSS-in-JS, markdown code fences, etc.). Default: "auto".',
		},
		// ── Pragmas ────────────────────────────────────────────────────────────
		{
			key: "requirePragma",
			label: "Require Pragma",
			type: "boolean",
			group: "Pragmas",
			description:
				"Only format files that contain a @prettier or @format pragma comment. Default: false.",
		},
		{
			key: "insertPragma",
			label: "Insert Pragma",
			type: "boolean",
			group: "Pragmas",
			description:
				"Insert a @format pragma at the top of formatted files. Default: false.",
		},
		// ── Experimental ──────────────────────────────────────────────────────
		{
			key: "experimentalTernaries",
			label: "Experimental Ternaries",
			type: "boolean",
			group: "Experimental",
			description:
				"Use a new ternary formatting style (Prettier 3.1+). Default: false.",
		},
		{
			key: "experimentalOperatorPosition",
			label: "Experimental Operator Position",
			type: "enum",
			group: "Experimental",
			options: ["end", "start"],
			description:
				'Where to place binary operators when line-wrapping. Default: "end".',
		},
	],
};

export default prettierrc;
