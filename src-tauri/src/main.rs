// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    sync::{Arc, Mutex},
    time::Duration,
};
use tauri::Manager;
use tokio::time::sleep;

#[derive(Default)]
struct ClipboardHistory(Arc<Mutex<Vec<String>>>);

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard::init())
        .setup(|app| {
            let handle = app.handle();
            let clipboard_history = ClipboardHistory::default();
            let clipboard_history_clone = clipboard_history.0.clone();

            tauri::async_runtime::spawn(async move {
                let mut previous_clipboard_content = String::new();
                let clipboard = handle.state::<tauri_plugin_clipboard::ClipboardManager>();
                loop {
                    if let Ok(new_clipboard_content) = clipboard.read_text() {
                        if new_clipboard_content != previous_clipboard_content {
                            previous_clipboard_content = new_clipboard_content.clone();
                            let mut history = clipboard_history_clone.lock().unwrap();
                            if !history.contains(&new_clipboard_content) {
                                history.insert(0, new_clipboard_content);
                            }
                        }
                    }
                    sleep(Duration::from_secs(1)).await;
                }
            });

            app.manage(clipboard_history);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
