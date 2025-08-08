use std::process::{Command, Child};
use std::sync::{Arc, Mutex};
use std::path::PathBuf;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

pub struct PythonBackendState {
    process: Option<Child>,
}

impl PythonBackendState {
    pub fn new() -> Self {
        Self { process: None }
    }

    pub fn start(&mut self) -> Result<(), String> {
        if self.process.is_some() {
            return Ok(());
        }

        let executable_path = get_backend_path();
        println!("Starting Python backend from: {}", executable_path.display());

        match Command::new(executable_path)
            .spawn() {
                Ok(process) => {
                    self.process = Some(process);
                    Ok(())
                },
                Err(e) => Err(format!("Failed to start Python backend: {}", e)),
            }
    }

    pub fn stop(&mut self) {
        if let Some(mut process) = self.process.take() {
            let _ = process.kill();
            let _ = process.wait();
            println!("Python backend stopped");
        }
    }
}

fn get_backend_path() -> PathBuf {
    let exe_dir = tauri::utils::platform::current_exe()
        .unwrap()
        .parent()
        .unwrap()
        .to_path_buf();
    
    #[cfg(target_os = "windows")]
    let backend_exe = "doclink_converter.exe";
    
    #[cfg(not(target_os = "windows"))]
    let backend_exe = "doclink_converter";
    
    exe_dir.join(backend_exe)
}

#[tauri::command]
pub async fn start_backend(state: tauri::State<'_, Arc<Mutex<PythonBackendState>>>) -> Result<(), String> {
    let mut state = state.lock().unwrap();
    state.start()
}

#[tauri::command]
pub async fn stop_backend(state: tauri::State<'_, Arc<Mutex<PythonBackendState>>>) -> Result<(), String> {
    let mut state = state.lock().unwrap();
    state.stop();
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let backend_state = Arc::new(Mutex::new(PythonBackendState::new()));
    
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(backend_state.clone())
        .invoke_handler(tauri::generate_handler![greet, start_backend, stop_backend])
        .setup(move |_app| {
            // Start the backend when the app starts
            let mut state = backend_state.lock().unwrap();
            if let Err(e) = state.start() {
                eprintln!("Error starting backend: {}", e);
            }
            Ok(())
        })
        .on_window_event(move |event| {
            if let tauri::WindowEvent::Destroyed = event.event() {
                // Stop the backend when the app is closed
                let mut state = backend_state.lock().unwrap();
                state.stop();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
