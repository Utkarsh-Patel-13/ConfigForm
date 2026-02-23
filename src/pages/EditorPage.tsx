import { invoke } from "@tauri-apps/api/core";
import { useCallback } from "react";
import ErrorPanel from "../components/editor/ErrorPanel";
import RawView from "../components/editor/RawView";
import Sidebar from "../components/editor/Sidebar";
import TopBar from "../components/editor/TopBar";
import VisualForm from "../components/editor/VisualForm";
import { useEditorState } from "../hooks/useEditorState";
import { useProjectScan } from "../hooks/useProjectScan";
import { parseFile } from "../lib/parser";
import type { ConfigFileMatch } from "../lib/scanner";
import { CONFIG_REGISTRY } from "../registry/index";

interface Props {
	projectPath: string;
	onClose: () => void;
}

export default function EditorPage({ projectPath, onClose }: Props) {
	const { result, loading } = useProjectScan(projectPath);
	const { state, selectFile, handleParseError, updateField, setMode, save } =
		useEditorState();

	const handleFileSelect = useCallback(
		async (file: ConfigFileMatch) => {
			const configType = CONFIG_REGISTRY.find(
				(c) => c.id === file.configTypeId,
			);
			if (!configType) return;

			try {
				const rawContent = await invoke<string>("read_file", {
					path: file.path,
				});
				try {
					const { values, unknownFields } = parseFile(
						rawContent,
						configType.format,
						configType.fields,
					);
					selectFile(file, configType, rawContent, values, unknownFields);
				} catch (parseErr) {
					handleParseError(file, rawContent, String(parseErr));
				}
			} catch (readErr) {
				handleParseError(file, "", String(readErr));
			}
		},
		[selectFile, handleParseError],
	);

	const handleSave = useCallback(async () => {
		await save((path, content) => invoke("write_file", { path, content }));
	}, [save]);

	const {
		selectedFile,
		configType,
		mode,
		saveStatus,
		values,
		unknownFields,
		errors,
		parseError,
		rawContent,
	} = state;
	const isDirty = saveStatus === "dirty";

	return (
		<div className="flex flex-col h-screen">
			<TopBar
				fileName={selectedFile?.filename ?? null}
				saveStatus={saveStatus}
				errorCount={Object.keys(errors).length}
				onSave={handleSave}
				mode={mode}
				onModeChange={setMode}
				parseError={parseError !== null}
				onClose={onClose}
			/>
			<div className="flex flex-1 overflow-hidden">
				<Sidebar
					result={result}
					loading={loading}
					selectedFile={selectedFile}
					onSelect={handleFileSelect}
					isDirty={isDirty}
				/>
				<main className="flex-1 overflow-y-auto p-6">
					{parseError ? (
						<>
							<ErrorPanel
								parseError={parseError}
								filePath={selectedFile?.path ?? ""}
							/>
							<div className="mt-4">
								<RawView rawContent={rawContent} isDirty={false} />
							</div>
						</>
					) : mode === "raw" ? (
						<RawView rawContent={rawContent} isDirty={isDirty} />
					) : selectedFile && configType ? (
						<VisualForm
							configType={configType}
							values={values}
							unknownFields={unknownFields}
							errors={errors}
							onFieldChange={updateField}
						/>
					) : (
						<div className="flex items-center justify-center h-full">
							<p className="text-base-content/50 text-sm">
								Select a file to start editing
							</p>
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
