import { useCallback, useReducer } from "react";
import { serializeFile } from "../lib/parser";
import type { ConfigFileMatch } from "../lib/scanner";
import { validate } from "../lib/validator";
import type { ConfigTypeDefinition } from "../registry/types";

export type SaveStatus = "clean" | "dirty" | "saving" | "saved" | "error";
export type EditorMode = "visual" | "raw";

export interface EditorState {
	selectedFile: ConfigFileMatch | null;
	/** The registry entry for the selected file — needed for validation and serialization */
	configType: ConfigTypeDefinition | null;
	values: Record<string, unknown>;
	savedValues: Record<string, unknown>;
	/** Full original parsed object — acts as base for serialization, preserving unknown fields */
	unknownFields: Record<string, unknown>;
	rawContent: string;
	mode: EditorMode;
	saveStatus: SaveStatus;
	errors: Record<string, string>;
	parseError: string | null;
}

export type EditorAction =
	| {
			type: "SELECT_FILE";
			file: ConfigFileMatch;
			configType: ConfigTypeDefinition;
			rawContent: string;
			values: Record<string, unknown>;
			unknownFields: Record<string, unknown>;
	  }
	| {
			type: "PARSE_ERROR";
			file: ConfigFileMatch;
			rawContent: string;
			error: string;
	  }
	| { type: "UPDATE_FIELD"; key: string; value: unknown }
	| { type: "SET_MODE"; mode: EditorMode }
	| { type: "SAVE_START" }
	| { type: "SAVE_SUCCESS"; rawContent: string }
	| { type: "SAVE_ERROR"; errors: Record<string, string> }
	| { type: "CLEAR_SELECTION" };

const initialState: EditorState = {
	selectedFile: null,
	configType: null,
	values: {},
	savedValues: {},
	unknownFields: {},
	rawContent: "",
	mode: "visual",
	saveStatus: "clean",
	errors: {},
	parseError: null,
};

export function editorReducer(
	state: EditorState,
	action: EditorAction,
): EditorState {
	switch (action.type) {
		case "SELECT_FILE":
			return {
				...initialState,
				selectedFile: action.file,
				configType: action.configType,
				rawContent: action.rawContent,
				values: action.values,
				savedValues: action.values,
				unknownFields: action.unknownFields,
				mode: "visual",
				saveStatus: "clean",
			};

		case "PARSE_ERROR":
			return {
				...initialState,
				selectedFile: action.file,
				configType: null,
				rawContent: action.rawContent,
				mode: "raw",
				parseError: action.error,
			};

		case "UPDATE_FIELD":
			return {
				...state,
				values: { ...state.values, [action.key]: action.value },
				saveStatus: "dirty",
				errors: { ...state.errors, [action.key]: "" },
			};

		case "SET_MODE":
			return { ...state, mode: action.mode };

		case "SAVE_START":
			return { ...state, saveStatus: "saving" };

		case "SAVE_SUCCESS":
			return {
				...state,
				saveStatus: "saved",
				savedValues: state.values,
				rawContent: action.rawContent,
				errors: {},
			};

		case "SAVE_ERROR":
			return { ...state, saveStatus: "error", errors: action.errors };

		case "CLEAR_SELECTION":
			return { ...initialState };

		default:
			return state;
	}
}

export function useEditorState() {
	const [state, dispatch] = useReducer(editorReducer, initialState);

	const selectFile = useCallback(
		(
			file: ConfigFileMatch,
			configType: ConfigTypeDefinition,
			rawContent: string,
			values: Record<string, unknown>,
			unknownFields: Record<string, unknown>,
		) => {
			dispatch({
				type: "SELECT_FILE",
				file,
				configType,
				rawContent,
				values,
				unknownFields,
			});
		},
		[],
	);

	const handleParseError = useCallback(
		(file: ConfigFileMatch, rawContent: string, error: string) => {
			dispatch({ type: "PARSE_ERROR", file, rawContent, error });
		},
		[],
	);

	const updateField = useCallback((key: string, value: unknown) => {
		dispatch({ type: "UPDATE_FIELD", key, value });
	}, []);

	const setMode = useCallback((mode: EditorMode) => {
		dispatch({ type: "SET_MODE", mode });
	}, []);

	const clearSelection = useCallback(() => {
		dispatch({ type: "CLEAR_SELECTION" });
	}, []);

	const save = useCallback(
		async (writeFn: (path: string, content: string) => Promise<void>) => {
			if (!state.selectedFile || !state.configType) return;

			const result = validate(state.configType.fields, state.values);
			if (!result.valid) {
				dispatch({ type: "SAVE_ERROR", errors: result.errors });
				return;
			}

			dispatch({ type: "SAVE_START" });
			try {
				const content = serializeFile(
					state.values,
					state.unknownFields,
					state.configType.format,
				);
				await writeFn(state.selectedFile.path, content);
				dispatch({ type: "SAVE_SUCCESS", rawContent: content });
			} catch (err) {
				dispatch({
					type: "SAVE_ERROR",
					errors: { _save: String(err) },
				});
			}
		},
		[state.selectedFile, state.configType, state.values, state.unknownFields],
	);

	return {
		state,
		selectFile,
		handleParseError,
		updateField,
		setMode,
		clearSelection,
		save,
	};
}
