import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import type { ProjectScanResult } from "../lib/scanner";
import { detectPackages, matchFilesToRegistry } from "../lib/scanner";
import { allPatterns, CONFIG_REGISTRY } from "../registry/index";

export function useProjectScan(projectPath: string) {
	const [result, setResult] = useState<ProjectScanResult | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!projectPath) return;

		let cancelled = false;
		setLoading(true);
		setError(null);
		setResult(null);

		async function run() {
			try {
				const paths = await invoke<string[]>("scan_project", {
					projectPath,
					patterns: allPatterns(),
				});
				const matches = matchFilesToRegistry(paths, CONFIG_REGISTRY);
				const scanResult = await detectPackages(matches, projectPath);
				if (!cancelled) {
					setResult(scanResult);
				}
			} catch (err) {
				if (!cancelled) {
					setError(String(err));
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		}

		run();
		return () => {
			cancelled = true;
		};
	}, [projectPath]);

	return { result, loading, error };
}
