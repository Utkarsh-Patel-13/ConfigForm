import { invoke } from "@tauri-apps/api/core";
import type { ConfigTypeDefinition } from "../registry/types";

export interface ConfigFileMatch {
	/** Absolute path to the file on disk */
	path: string;
	/** Filename (basename) */
	filename: string;
	/** ID of the matching ConfigTypeDefinition */
	configTypeId: string;
}

export interface PackageGroup {
	/**
	 * Package name from package.json "name" field, or the relative directory
	 * path if no name is found. For non-monorepo projects, this is the project
	 * root name.
	 */
	name: string;
	/** Absolute path to this package's root directory */
	packagePath: string;
	/** Config files found within this package */
	files: ConfigFileMatch[];
}

export interface ProjectScanResult {
	projectPath: string;
	/** true when more than one distinct package root is detected */
	isMonorepo: boolean;
	/**
	 * Packages in order: project root first, then nested packages in
	 * alphabetical order by name.
	 */
	packages: PackageGroup[];
}

export function matchFilesToRegistry(
	paths: string[],
	registry: ConfigTypeDefinition[],
): ConfigFileMatch[] {
	const matches: ConfigFileMatch[] = [];
	for (const path of paths) {
		const filename = path.split("/").pop() ?? path;
		for (const entry of registry) {
			if (entry.patterns.includes(filename)) {
				matches.push({ path, filename, configTypeId: entry.id });
				break;
			}
		}
	}
	return matches;
}

function dirname(path: string): string {
	const idx = path.lastIndexOf("/");
	return idx > 0 ? path.slice(0, idx) : "/";
}

/** Build a set of directories known to contain a package.json from the matches list */
function buildPackageDirs(matches: ConfigFileMatch[]): Set<string> {
	const dirs = new Set<string>();
	for (const m of matches) {
		if (m.filename === "package.json") {
			dirs.add(dirname(m.path));
		}
	}
	return dirs;
}

function findNearestPackageRoot(
	filePath: string,
	projectPath: string,
	packageDirs: Set<string>,
): string {
	let dir = dirname(filePath);
	while (dir.startsWith(projectPath)) {
		if (packageDirs.has(dir)) return dir;
		const parent = dirname(dir);
		if (parent === dir) break;
		dir = parent;
	}
	return projectPath;
}

async function readPackageName(
	packagePath: string,
): Promise<string | undefined> {
	try {
		const content = await invoke<string>("read_file", {
			path: `${packagePath}/package.json`,
		});
		const parsed = JSON.parse(content) as Record<string, unknown>;
		if (typeof parsed.name === "string") return parsed.name;
	} catch {
		// no package.json or unreadable — fall through
	}
	return undefined;
}

export async function detectPackages(
	matches: ConfigFileMatch[],
	projectPath: string,
): Promise<ProjectScanResult> {
	const packageDirs = buildPackageDirs(matches);
	// Ensure projectPath itself is treated as a root even if package.json is missing
	packageDirs.add(projectPath);

	const rootMap = new Map<string, ConfigFileMatch[]>();
	for (const match of matches) {
		const root = findNearestPackageRoot(match.path, projectPath, packageDirs);
		const existing = rootMap.get(root) ?? [];
		existing.push(match);
		rootMap.set(root, existing);
	}
	// Ensure project root exists in map
	if (!rootMap.has(projectPath)) rootMap.set(projectPath, []);

	const isMonorepo = rootMap.size > 1;

	// Project root first
	const rootName =
		(await readPackageName(projectPath)) ??
		projectPath.split("/").pop() ??
		projectPath;
	const packages: PackageGroup[] = [
		{
			name: rootName,
			packagePath: projectPath,
			files: rootMap.get(projectPath) ?? [],
		},
	];

	// Other roots, sorted alphabetically by path
	const otherRoots = [...rootMap.keys()]
		.filter((r) => r !== projectPath)
		.sort();

	for (const root of otherRoots) {
		const relativeName = root.slice(projectPath.length + 1);
		const name = (await readPackageName(root)) ?? relativeName;
		packages.push({ name, packagePath: root, files: rootMap.get(root) ?? [] });
	}

	return { projectPath, isMonorepo, packages };
}
