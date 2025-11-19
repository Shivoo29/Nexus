use anyhow::Result;
use winit::{
    event::{Event, WindowEvent},
    event_loop::EventLoop,
    window::WindowBuilder,
};

mod buffer;
mod config;
mod cursor;
mod file;
mod input;
mod renderer;
mod search;
mod syntax;
mod text_renderer;
mod ui;

use renderer::Renderer;
use buffer::Buffer;
use config::Config;
use cursor::Cursor;
use file::FileManager;
use input::InputHandler;
use search::SearchState;
use syntax::SyntaxHighlighter;

fn main() -> Result<()> {
    // Initialize logger
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();

    log::info!("🚀 Starting Nexus Editor v{}", env!("CARGO_PKG_VERSION"));

    // Load configuration
    let _config = Config::load()?;
    log::info!("⚙️  Configuration loaded");

    // Create event loop
    let event_loop = EventLoop::new()?;

    // Create window
    let window = WindowBuilder::new()
        .with_title("Nexus - AI-Native Code Editor")
        .with_inner_size(winit::dpi::LogicalSize::new(1280, 800))
        .build(&event_loop)?;

    log::info!("🪟 Window created");

    // Initialize GPU renderer
    let mut renderer = pollster::block_on(Renderer::new(&window))?;
    log::info!("🎨 GPU renderer initialized");

    // Create text buffer
    let mut buffer = Buffer::new();
    buffer.insert_text(0, "// Welcome to Nexus!\n// The AI-native code editor that doesn't suck.\n\nfn main() {\n    println!(\"Hello, World!\");\n}\n");
    log::info!("📝 Text buffer initialized");

    // Create cursor
    let mut cursor = Cursor::new();
    log::info!("🖱️  Cursor initialized");

    // Create input handler
    let mut input_handler = InputHandler::new();
    log::info!("⌨️  Input handler initialized");

    // Create file manager
    let mut file_manager = FileManager::new();
    log::info!("📁 File manager initialized");

    // Create syntax highlighter (default to Rust)
    let mut syntax_highlighter = SyntaxHighlighter::new("rs").ok();
    let mut syntax_tokens = if let Some(ref mut highlighter) = syntax_highlighter {
        highlighter.highlight(&buffer.text())
    } else {
        Vec::new()
    };
    log::info!("🎨 Syntax highlighter initialized");

    // Create search state
    let mut search_state = SearchState::new();
    log::info!("🔍 Search state initialized");

    // Track buffer version to detect modifications
    let mut last_buffer_version = buffer.version();

    // Event loop
    log::info!("🔄 Entering event loop");

    event_loop.run(move |event, control_flow| {
        match event {
            Event::WindowEvent { event, .. } => match event {
                WindowEvent::CloseRequested => {
                    log::info!("👋 Closing Nexus");
                    control_flow.exit();
                }
                WindowEvent::Resized(physical_size) => {
                    renderer.resize(physical_size);
                }
                WindowEvent::RedrawRequested => {
                    // Update cursor blink (assume 16ms frame time)
                    cursor.update_blink(0.016);

                    // Check if buffer has been modified
                    if buffer.version() != last_buffer_version {
                        file_manager.set_modified(true);
                        last_buffer_version = buffer.version();

                        // Re-highlight syntax
                        if let Some(ref mut highlighter) = syntax_highlighter {
                            syntax_tokens = highlighter.highlight(&buffer.text());
                        }

                        // Update window title to show modification status
                        let title = if let Some(filename) = file_manager.current_file_name() {
                            if file_manager.is_modified() {
                                format!("Nexus - {}*", filename)
                            } else {
                                format!("Nexus - {}", filename)
                            }
                        } else {
                            if file_manager.is_modified() {
                                "Nexus - Untitled*".to_string()
                            } else {
                                "Nexus - Untitled".to_string()
                            }
                        };
                        window.set_title(&title);
                    }

                    match renderer.render(&buffer, &cursor, &syntax_tokens) {
                        Ok(_) => {}
                        Err(e) => {
                            log::error!("Render error: {:?}", e);
                        }
                    }
                }
                WindowEvent::KeyboardInput { event, .. } => {
                    use winit::event::ElementState;

                    // Check for Ctrl+S (save)
                    if event.state == ElementState::Pressed {
                        if let winit::keyboard::PhysicalKey::Code(key_code) = event.physical_key {
                            use winit::keyboard::KeyCode;

                            // Detect Ctrl modifier
                            let is_ctrl_s = event.logical_key == winit::keyboard::Key::Character("s".into());
                            let is_ctrl_o = event.logical_key == winit::keyboard::Key::Character("o".into());
                            let is_ctrl_c = event.logical_key == winit::keyboard::Key::Character("c".into());
                            let is_ctrl_v = event.logical_key == winit::keyboard::Key::Character("v".into());
                            let is_ctrl_x = event.logical_key == winit::keyboard::Key::Character("x".into());
                            let is_ctrl_f = event.logical_key == winit::keyboard::Key::Character("f".into());
                            let is_ctrl_h = event.logical_key == winit::keyboard::Key::Character("h".into());

                            match key_code {
                                KeyCode::KeyS if is_ctrl_s => {
                                    // Ctrl+S - Save file
                                    if file_manager.current_file().is_some() {
                                        match file_manager.save(&buffer) {
                                            Ok(_) => log::info!("✅ File saved"),
                                            Err(e) => log::error!("❌ Save failed: {}", e),
                                        }
                                    } else {
                                        match file_manager.save_as("untitled.txt", &buffer) {
                                            Ok(_) => log::info!("✅ File saved as untitled.txt"),
                                            Err(e) => log::error!("❌ Save failed: {}", e),
                                        }
                                    }
                                    return;
                                }
                                KeyCode::KeyO if is_ctrl_o => {
                                    log::info!("📂 Open file dialog (not implemented yet)");
                                    return;
                                }
                                KeyCode::KeyC if is_ctrl_c => {
                                    input_handler.copy(&buffer, &cursor);
                                    return;
                                }
                                KeyCode::KeyV if is_ctrl_v => {
                                    input_handler.paste(&mut buffer, &mut cursor);
                                    return;
                                }
                                KeyCode::KeyX if is_ctrl_x => {
                                    input_handler.cut(&mut buffer, &mut cursor);
                                    return;
                                }
                                KeyCode::KeyF if is_ctrl_f => {
                                    // Ctrl+F - Open find dialog
                                    if !search_state.is_active {
                                        search_state.activate();
                                        log::info!("🔍 Find dialog opened");
                                    }
                                    return;
                                }
                                KeyCode::KeyH if is_ctrl_h => {
                                    // Ctrl+H - Open find/replace dialog
                                    if !search_state.is_active {
                                        search_state.activate();
                                    }
                                    search_state.is_replace_mode = true;
                                    log::info!("🔄 Find/Replace dialog opened");
                                    return;
                                }
                                KeyCode::Escape => {
                                    // Escape - Close search dialog
                                    if search_state.is_active {
                                        search_state.deactivate();
                                        log::info!("🔍 Search dialog closed");
                                        return;
                                    }
                                }
                                KeyCode::F3 => {
                                    // F3 - Find next
                                    if search_state.is_active && !search_state.matches.is_empty() {
                                        search_state.find_next();
                                        if let Some(match_item) = search_state.current_match() {
                                            cursor.position.line = match_item.start_line;
                                            cursor.position.column = match_item.start_column;
                                            log::info!("🔍 Found match {}/{}",
                                                search_state.current_match_index.unwrap_or(0) + 1,
                                                search_state.match_count());
                                        }
                                        return;
                                    }
                                }
                                _ => {}
                            }
                        }
                    }

                    // Handle normal keyboard input
                    if !search_state.is_active {
                        input_handler.handle_key_event(&event, &mut buffer, &mut cursor);
                        log::debug!("Key event: {:?}", event);
                    } else {
                        // Handle search input (backspace, etc.)
                        if event.state == ElementState::Pressed {
                            if let winit::keyboard::PhysicalKey::Code(key_code) = event.physical_key {
                                use winit::keyboard::KeyCode;
                                match key_code {
                                    KeyCode::Backspace => {
                                        if !search_state.query.is_empty() {
                                            search_state.query.pop();
                                            search_state.find_all_matches(&buffer);
                                        }
                                    }
                                    KeyCode::Enter => {
                                        // Enter - Find next
                                        if !search_state.matches.is_empty() {
                                            search_state.find_next();
                                            if let Some(match_item) = search_state.current_match() {
                                                cursor.position.line = match_item.start_line;
                                                cursor.position.column = match_item.start_column;
                                            }
                                        }
                                    }
                                    _ => {}
                                }
                            }
                        }
                    }
                }
                WindowEvent::Ime(ime_event) => {
                    // Handle text input (typed characters)
                    use winit::event::Ime;
                    if let Ime::Commit(text) = ime_event {
                        if search_state.is_active {
                            // Update search query
                            search_state.query.push_str(&text);
                            search_state.find_all_matches(&buffer);
                            log::debug!("Search query: {:?} ({} matches)", search_state.query, search_state.match_count());
                        } else {
                            // Normal text input
                            input_handler.handle_text_input(&text, &mut buffer, &mut cursor);
                            log::debug!("Text input: {:?}", text);
                        }
                    }
                }
                _ => {}
            },
            Event::AboutToWait => {
                window.request_redraw();
            }
            _ => {}
        }
    })?;

    Ok(())
}
