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
mod file_tree;
mod input;
mod renderer;
mod search;
mod syntax;
mod tabs;
mod text_renderer;
mod ui;

use renderer::Renderer;
use config::Config;
use file::FileManager;
use file_tree::FileTree;
use input::InputHandler;
use search::SearchState;
use syntax::SyntaxHighlighter;
use tabs::{Tab, TabManager};
use std::env;

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

    // Create tab manager
    let mut tab_manager = TabManager::new();
    tab_manager.active_tab_mut().buffer.insert_text(0, "// Welcome to Nexus!\n// The AI-native code editor that doesn't suck.\n\nfn main() {\n    println!(\"Hello, World!\");\n}\n");
    log::info!("📑 Tab manager initialized");

    // Create input handler
    let mut input_handler = InputHandler::new();
    log::info!("⌨️  Input handler initialized");

    // Create file manager
    let mut file_manager = FileManager::new();
    log::info!("📁 File manager initialized");

    // Create syntax highlighter (default to Rust)
    let mut syntax_highlighter = SyntaxHighlighter::new("rs").ok();
    let mut syntax_tokens = if let Some(ref mut highlighter) = syntax_highlighter {
        highlighter.highlight(&tab_manager.active_tab().buffer.text())
    } else {
        Vec::new()
    };
    log::info!("🎨 Syntax highlighter initialized");

    // Create search state
    let mut search_state = SearchState::new();
    log::info!("🔍 Search state initialized");

    // Create file tree explorer
    let current_dir = env::current_dir()?;
    let mut file_tree = FileTree::new(current_dir).unwrap_or_else(|e| {
        log::warn!("Failed to create file tree: {}. Using empty tree.", e);
        FileTree {
            nodes: Vec::new(),
            selected_index: 0,
            is_visible: false,
            root_path: env::current_dir().unwrap_or_default(),
        }
    });
    log::info!("🌳 File tree initialized");

    // Track buffer version to detect modifications
    let mut last_buffer_version = tab_manager.active_tab().buffer.version();

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
                    // Get tab info before borrowing
                    let tab_index = tab_manager.active_index();
                    let tab_count = tab_manager.tab_count();

                    // Update active tab (in a block to drop mutable borrow)
                    {
                        let active_tab = tab_manager.active_tab_mut();

                        // Update cursor blink (assume 16ms frame time)
                        active_tab.cursor.update_blink(0.016);

                        // Check if buffer has been modified
                        if active_tab.buffer.version() != last_buffer_version {
                            active_tab.is_modified = true;
                            last_buffer_version = active_tab.buffer.version();

                            // Re-highlight syntax
                            if let Some(ref mut highlighter) = syntax_highlighter {
                                syntax_tokens = highlighter.highlight(&active_tab.buffer.text());
                            }

                            // Update window title to show modification status
                            let title = format!(
                                "Nexus - {} ({}/{})",
                                active_tab.display_title(),
                                tab_index + 1,
                                tab_count
                            );
                            window.set_title(&title);
                        }
                    } // Drop mutable borrow here

                    // Now borrow immutably for rendering
                    let active_tab = tab_manager.active_tab();
                    match renderer.render(
                        &active_tab.buffer,
                        &active_tab.cursor,
                        &syntax_tokens,
                        active_tab.file_path.as_ref().and_then(|p| p.file_name()?.to_str()),
                        active_tab.is_modified,
                        &file_tree,
                        &tab_manager,
                        &search_state,
                    ) {
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
                            let is_ctrl_w = event.logical_key == winit::keyboard::Key::Character("w".into());
                            let is_ctrl_t = event.logical_key == winit::keyboard::Key::Character("t".into());
                            let is_ctrl_b = event.logical_key == winit::keyboard::Key::Character("b".into());
                            let is_ctrl_z = event.logical_key == winit::keyboard::Key::Character("z".into());
                            let is_ctrl_y = event.logical_key == winit::keyboard::Key::Character("y".into());

                            match key_code {
                                KeyCode::KeyS if is_ctrl_s => {
                                    // Ctrl+S - Save file
                                    let active_tab = tab_manager.active_tab_mut();
                                    if file_manager.current_file().is_some() {
                                        match file_manager.save(&active_tab.buffer) {
                                            Ok(_) => {
                                                active_tab.is_modified = false;
                                                log::info!("✅ File saved");
                                            }
                                            Err(e) => log::error!("❌ Save failed: {}", e),
                                        }
                                    } else {
                                        match file_manager.save_as("untitled.txt", &active_tab.buffer) {
                                            Ok(_) => {
                                                active_tab.is_modified = false;
                                                log::info!("✅ File saved as untitled.txt");
                                            }
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
                                    let active_tab = tab_manager.active_tab();
                                    input_handler.copy(&active_tab.buffer, &active_tab.cursor);
                                    return;
                                }
                                KeyCode::KeyV if is_ctrl_v => {
                                    let active_tab = tab_manager.active_tab_mut();
                                    input_handler.paste(&mut active_tab.buffer, &mut active_tab.cursor);
                                    return;
                                }
                                KeyCode::KeyX if is_ctrl_x => {
                                    let active_tab = tab_manager.active_tab_mut();
                                    input_handler.cut(&mut active_tab.buffer, &mut active_tab.cursor);
                                    return;
                                }
                                KeyCode::KeyZ if is_ctrl_z => {
                                    // Ctrl+Z - Undo
                                    let active_tab = tab_manager.active_tab_mut();
                                    if active_tab.buffer.undo() {
                                        // Clamp cursor position to valid range
                                        let line_count = active_tab.buffer.line_count();
                                        if active_tab.cursor.position.line >= line_count {
                                            active_tab.cursor.position.line = line_count.saturating_sub(1);
                                        }
                                        let line_len = active_tab.buffer.line_len(active_tab.cursor.position.line);
                                        if active_tab.cursor.position.column > line_len {
                                            active_tab.cursor.position.column = line_len;
                                        }
                                        log::info!("↶ Undo");
                                    } else {
                                        log::info!("↶ Nothing to undo");
                                    }
                                    return;
                                }
                                KeyCode::KeyY if is_ctrl_y => {
                                    // Ctrl+Y - Redo
                                    let active_tab = tab_manager.active_tab_mut();
                                    if active_tab.buffer.redo() {
                                        // Clamp cursor position to valid range
                                        let line_count = active_tab.buffer.line_count();
                                        if active_tab.cursor.position.line >= line_count {
                                            active_tab.cursor.position.line = line_count.saturating_sub(1);
                                        }
                                        let line_len = active_tab.buffer.line_len(active_tab.cursor.position.line);
                                        if active_tab.cursor.position.column > line_len {
                                            active_tab.cursor.position.column = line_len;
                                        }
                                        log::info!("↷ Redo");
                                    } else {
                                        log::info!("↷ Nothing to redo");
                                    }
                                    return;
                                }
                                KeyCode::KeyW if is_ctrl_w => {
                                    // Ctrl+W - Close active tab
                                    if tab_manager.close_active_tab() {
                                        log::info!("📑 Tab closed");
                                        // Re-highlight the new active tab
                                        if let Some(ref mut highlighter) = syntax_highlighter {
                                            syntax_tokens = highlighter.highlight(&tab_manager.active_tab().buffer.text());
                                        }
                                        last_buffer_version = tab_manager.active_tab().buffer.version();
                                    }
                                    return;
                                }
                                KeyCode::KeyT if is_ctrl_t => {
                                    // Ctrl+T - New tab
                                    tab_manager.add_tab(Tab::new("Untitled".to_string()));
                                    log::info!("📑 New tab created");
                                    // Re-highlight the new tab
                                    if let Some(ref mut highlighter) = syntax_highlighter {
                                        syntax_tokens = highlighter.highlight(&tab_manager.active_tab().buffer.text());
                                    }
                                    last_buffer_version = tab_manager.active_tab().buffer.version();
                                    return;
                                }
                                KeyCode::KeyB if is_ctrl_b => {
                                    // Ctrl+B - Toggle file tree
                                    file_tree.toggle_visibility();
                                    if file_tree.is_visible {
                                        log::info!("🌳 File tree opened");
                                        log::info!("📁 Current directory: {}", file_tree.root_path.display());
                                        log::info!("   {} files/folders found", file_tree.nodes.len());
                                        if let Some(node) = file_tree.get_selected_node() {
                                            log::info!("   Selected: {}", node.name);
                                        }
                                    } else {
                                        log::info!("🌳 File tree closed");
                                    }
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
                                            let active_tab = tab_manager.active_tab_mut();
                                            active_tab.cursor.position.line = match_item.start_line;
                                            active_tab.cursor.position.column = match_item.start_column;
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
                    // Check if file tree is handling input
                    if file_tree.is_visible {
                        // File tree navigation
                        if event.state == ElementState::Pressed {
                            if let winit::keyboard::PhysicalKey::Code(key_code) = event.physical_key {
                                use winit::keyboard::KeyCode;
                                match key_code {
                                    KeyCode::ArrowUp => {
                                        file_tree.move_selection_up();
                                        if let Some(node) = file_tree.get_selected_node() {
                                            log::info!("🌳 Selected: {}", node.name);
                                        }
                                        return;
                                    }
                                    KeyCode::ArrowDown => {
                                        file_tree.move_selection_down();
                                        if let Some(node) = file_tree.get_selected_node() {
                                            log::info!("🌳 Selected: {}", node.name);
                                        }
                                        return;
                                    }
                                    KeyCode::Enter => {
                                        if let Err(e) = file_tree.toggle_selected_expand() {
                                            log::error!("❌ Failed to expand: {}", e);
                                        } else if let Some(node) = file_tree.get_selected_node() {
                                            if node.is_dir {
                                                log::info!("📁 Toggled: {}", node.name);
                                            } else {
                                                log::info!("📄 Selected file: {}", node.path.display());
                                                // TODO: Open file in new tab
                                            }
                                        }
                                        return;
                                    }
                                    _ => {}
                                }
                            }
                        }
                        // Don't fall through to normal input handling when file tree is visible
                        return;
                    }

                    let active_tab = tab_manager.active_tab_mut();
                    if !search_state.is_active {
                        input_handler.handle_key_event(&event, &mut active_tab.buffer, &mut active_tab.cursor);
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
                                            search_state.find_all_matches(&active_tab.buffer);
                                        }
                                    }
                                    KeyCode::Enter => {
                                        // Enter - Find next
                                        if !search_state.matches.is_empty() {
                                            search_state.find_next();
                                            if let Some(match_item) = search_state.current_match() {
                                                active_tab.cursor.position.line = match_item.start_line;
                                                active_tab.cursor.position.column = match_item.start_column;
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
                        let active_tab = tab_manager.active_tab_mut();
                        if search_state.is_active {
                            // Update search query
                            search_state.query.push_str(&text);
                            search_state.find_all_matches(&active_tab.buffer);
                            log::debug!("Search query: {:?} ({} matches)", search_state.query, search_state.match_count());
                        } else {
                            // Normal text input
                            input_handler.handle_text_input(&text, &mut active_tab.buffer, &mut active_tab.cursor);
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
