use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use tauri::Manager;
use tauri_plugin_dialog::{DialogExt, FilePath};
use tokio::sync::oneshot;

// --- Data structures ---

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecentEntry {
    pub path: String,
    pub display_name: String,
    pub kind: String,
    pub last_opened_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RecentEntryWithStatus {
    pub path: String,
    pub display_name: String,
    pub kind: String,
    pub last_opened_at: String,
    pub accessible: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RecentStore {
    pub version: u32,
    pub entries: Vec<RecentEntry>,
}

// --- File I/O helpers ---

fn scan_dir(dir: &Path, patterns: &[String], results: &mut Vec<String>) {
    const SKIP_DIRS: &[&str] = &["node_modules", "dist", "build", "target", "out"];

    let entries = match fs::read_dir(dir) {
        Ok(e) => e,
        Err(_) => return,
    };

    for entry in entries.flatten() {
        let path = entry.path();
        let file_name = entry.file_name();
        let name = file_name.to_string_lossy();

        if path.is_dir() {
            // Skip hidden directories (e.g. .git, .next, .cache) and known heavy dirs
            if name.starts_with('.') || SKIP_DIRS.contains(&name.as_ref()) {
                continue;
            }
            scan_dir(&path, patterns, results);
        } else if path.is_file()
            && patterns.iter().any(|p| p.as_str() == name.as_ref())
        {
            results.push(path.to_string_lossy().to_string());
        }
    }
}

// --- Recent entry helpers ---

fn read_store(app: &tauri::AppHandle) -> RecentStore {
    let data_dir = match app.path().app_data_dir() {
        Ok(dir) => dir,
        Err(_) => {
            return RecentStore {
                version: 1,
                entries: vec![],
            }
        }
    };
    let file_path = data_dir.join("recent.json");
    let contents = match fs::read_to_string(file_path) {
        Ok(c) => c,
        Err(_) => {
            return RecentStore {
                version: 1,
                entries: vec![],
            }
        }
    };
    serde_json::from_str::<RecentStore>(&contents).unwrap_or(RecentStore {
        version: 1,
        entries: vec![],
    })
}

fn write_store(app: &tauri::AppHandle, store: &RecentStore) -> Result<(), String> {
    let data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?;
    fs::create_dir_all(&data_dir).map_err(|e| e.to_string())?;
    let file_path = data_dir.join("recent.json");
    let json = serde_json::to_string_pretty(store).map_err(|e| e.to_string())?;
    fs::write(file_path, json).map_err(|e| e.to_string())
}

fn entries_with_status(entries: &[RecentEntry]) -> Vec<RecentEntryWithStatus> {
    entries
        .iter()
        .map(|e| RecentEntryWithStatus {
            path: e.path.clone(),
            display_name: e.display_name.clone(),
            kind: e.kind.clone(),
            last_opened_at: e.last_opened_at.clone(),
            accessible: Path::new(&e.path).exists(),
        })
        .collect()
}

fn file_path_to_string(fp: FilePath) -> String {
    match fp {
        FilePath::Path(pb) => pb.to_string_lossy().to_string(),
        FilePath::Url(u) => u.to_string(),
    }
}

// --- Tauri commands ---

#[tauri::command]
async fn get_recent_entries(app: tauri::AppHandle) -> Result<Vec<RecentEntryWithStatus>, String> {
    let store = read_store(&app);
    Ok(entries_with_status(&store.entries))
}

#[tauri::command]
async fn add_recent_entry(
    app: tauri::AppHandle,
    path: String,
    kind: String,
) -> Result<Vec<RecentEntryWithStatus>, String> {
    let mut store = read_store(&app);

    let display_name = Path::new(&path)
        .file_name()
        .and_then(|n| n.to_str())
        .unwrap_or(&path)
        .to_string();

    let now = chrono::Utc::now().to_rfc3339();

    store.entries.retain(|e| e.path != path);
    store.entries.insert(
        0,
        RecentEntry {
            path,
            display_name,
            kind,
            last_opened_at: now,
        },
    );
    store.entries.truncate(10);

    write_store(&app, &store)?;
    Ok(entries_with_status(&store.entries))
}

#[tauri::command]
async fn remove_recent_entry(
    app: tauri::AppHandle,
    path: String,
) -> Result<Vec<RecentEntryWithStatus>, String> {
    let mut store = read_store(&app);
    store.entries.retain(|e| e.path != path);
    write_store(&app, &store)?;
    Ok(entries_with_status(&store.entries))
}

#[tauri::command]
async fn open_folder_dialog(app: tauri::AppHandle) -> Result<Option<String>, String> {
    let (tx, rx) = oneshot::channel::<Option<FilePath>>();
    app.dialog()
        .file()
        .set_title("Open Project")
        .pick_folder(move |result| {
            let _ = tx.send(result);
        });
    rx.await
        .map_err(|e| e.to_string())
        .map(|path| path.map(file_path_to_string))
}

#[tauri::command]
async fn open_file_dialog(app: tauri::AppHandle) -> Result<Option<String>, String> {
    let (tx, rx) = oneshot::channel::<Option<FilePath>>();
    app.dialog()
        .file()
        .set_title("Open File")
        .pick_file(move |result| {
            let _ = tx.send(result);
        });
    rx.await
        .map_err(|e| e.to_string())
        .map(|path| path.map(file_path_to_string))
}

// --- File I/O commands ---

#[tauri::command]
async fn scan_project(project_path: String, patterns: Vec<String>) -> Result<Vec<String>, String> {
    let root = Path::new(&project_path);
    let mut results = Vec::new();
    scan_dir(root, &patterns, &mut results);
    Ok(results)
}

#[tauri::command]
async fn read_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[tauri::command]
async fn write_file(path: String, content: String) -> Result<(), String> {
    let target = Path::new(&path);
    let parent = target.parent().ok_or_else(|| "invalid path: no parent directory".to_string())?;
    let tmp_name = format!(
        ".{}.tmp",
        target
            .file_name()
            .and_then(|n| n.to_str())
            .unwrap_or("file")
    );
    let tmp_path = parent.join(tmp_name);
    fs::write(&tmp_path, &content).map_err(|e| e.to_string())?;
    fs::rename(&tmp_path, target).map_err(|e| e.to_string())
}

// --- Misc commands ---

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// --- Entry point ---

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            get_recent_entries,
            add_recent_entry,
            remove_recent_entry,
            open_folder_dialog,
            open_file_dialog,
            scan_project,
            read_file,
            write_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
