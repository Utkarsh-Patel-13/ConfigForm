export type RecentKind = "project" | "file";

export interface RecentEntry {
	path: string;
	displayName: string;
	kind: RecentKind;
	lastOpenedAt: string;
}

export interface RecentEntryWithStatus extends RecentEntry {
	accessible: boolean;
}
