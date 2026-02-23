use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use tauri::Manager;
use tauri_plugin_dialog::{DialogExt, FilePath};
use tokio::sync::oneshot;

// --- Data structures ---

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RecentEntry {
    pub path: String,
    pub display_name: String,
    pub kind: String,
    pub last_opened_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
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

// --- Helper functions ---

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

// --- Existing command ---

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
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
