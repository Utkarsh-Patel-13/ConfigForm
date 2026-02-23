import type { ConfigTypeDefinition } from "./types";

const editorconfig: ConfigTypeDefinition = {
	id: "editorconfig",
	displayName: ".editorconfig",
	patterns: [".editorconfig"],
	format: "ini",
	fields: [
		// ── Root ─────────────────────────────────────────────────────────────────
		{
			key: "root",
			label: "Root",
			type: "boolean",
			group: "Root",
			description:
				"Stop searching for .editorconfig files in parent directories. Should be true in the project root.",
		},
		// ── All Files [*] ────────────────────────────────────────────────────────
		{
			key: "[*].indent_style",
			label: "Indent Style",
			type: "enum",
			options: ["space", "tab"],
			group: "All Files",
			description: "Use spaces or hard tabs for indentation.",
		},
		{
			key: "[*].indent_size",
			label: "Indent Size",
			type: "number",
			group: "All Files",
			description:
				"Number of columns per indentation level. When set to tab, uses tab_width.",
		},
		{
			key: "[*].tab_width",
			label: "Tab Width",
			type: "number",
			group: "All Files",
			description:
				"Width of a tab character in columns. Defaults to indent_size if not set.",
		},
		{
			key: "[*].end_of_line",
			label: "End of Line",
			type: "enum",
			options: ["lf", "crlf", "cr"],
			group: "All Files",
			description:
				"Line ending style. lf = Unix, crlf = Windows, cr = classic Mac.",
		},
		{
			key: "[*].charset",
			label: "Charset",
			type: "enum",
			options: ["utf-8", "utf-8-bom", "utf-16be", "utf-16le", "latin1"],
			group: "All Files",
			description: "Character set encoding for files.",
		},
		{
			key: "[*].trim_trailing_whitespace",
			label: "Trim Trailing Whitespace",
			type: "boolean",
			group: "All Files",
			description: "Remove trailing whitespace before newlines on save.",
		},
		{
			key: "[*].insert_final_newline",
			label: "Insert Final Newline",
			type: "boolean",
			group: "All Files",
			description: "Ensure all files end with a newline on save.",
		},
		{
			key: "[*].max_line_length",
			label: "Max Line Length",
			type: "number",
			group: "All Files",
			description:
				'Maximum characters per line. Set to "off" in the file to disable. Editors use this as a soft wrap guide.',
		},
	],
};

export default editorconfig;
