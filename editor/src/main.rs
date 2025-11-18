use anyhow::Result;
use winit::{
    event::{Event, WindowEvent},
    event_loop::EventLoop,
    window::WindowBuilder,
};

mod buffer;
mod config;
mod cursor;
mod renderer;
mod text_renderer;
mod ui;

use renderer::Renderer;
use buffer::Buffer;
use config::Config;
use cursor::Cursor;

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

                    match renderer.render(&buffer, &cursor) {
                        Ok(_) => {}
                        Err(e) => {
                            log::error!("Render error: {:?}", e);
                        }
                    }
                }
                WindowEvent::KeyboardInput { event, .. } => {
                    // Handle keyboard input
                    log::debug!("Key pressed: {:?}", event);
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
