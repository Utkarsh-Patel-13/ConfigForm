import { invoke } from "@tauri-apps/api/core";
import { useCallback, useEffect, useState } from "react";
import type { RecentEntryWithStatus, RecentKind } from "../types/recent";

interface UseRecentResult {
	entries: RecentEntryWithStatus[];
	loading: boolean;
	error: string | null;
	addEntry: (path: string, kind: RecentKind) => Promise<void>;
	removeEntry: (path: string) => Promise<void>;
	clearAll: () => Promise<void>;
}

export function useRecent(): UseRecentResult {
	const [entries, setEntries] = useState<RecentEntryWithStatus[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		invoke<RecentEntryWithStatus[]>("get_recent_entries")
			.then(setEntries)
			.catch((err) => setError(String(err)))
			.finally(() => setLoading(false));
	}, []);

	const addEntry = useCallback(async (path: string, kind: RecentKind) => {
		try {
			const updated = await invoke<RecentEntryWithStatus[]>(
				"add_recent_entry",
				{
					path,
					kind,
				},
			);
			setEntries(updated);
		} catch (err) {
			setError(String(err));
		}
	}, []);

	const removeEntry = useCallback(async (path: string) => {
		try {
			const updated = await invoke<RecentEntryWithStatus[]>(
				"remove_recent_entry",
				{ path },
			);
			setEntries(updated);
		} catch (err) {
			setError(String(err));
		}
	}, []);

	const clearAll = useCallback(async () => {
		const snapshot = [...entries];
		try {
			for (const entry of snapshot) {
				await invoke("remove_recent_entry", { path: entry.path });
			}
			setEntries([]);
		} catch (err) {
			setError(String(err));
		}
	}, [entries]);

	return { entries, loading, error, addEntry, removeEntry, clearAll };
}
