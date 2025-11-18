# Nexus Plugin Development Guide 🔌

Build extensions that enhance Nexus with custom functionality.

---

## Plugin System Overview

Nexus plugins can be written in:
- **Rust** (native, fastest)
- **Lua** (scripting, easiest)
- **WASM** (portable, safe)

---

## Quick Start

### 1. Create Plugin
```bash
make plugin-new NAME=myplugin
cd plugins/myplugin
```

### 2. Implement Plugin Trait
```rust
// src/lib.rs
use nexus_plugin_api::*;

pub struct MyPlugin {
    config: PluginConfig,
}

impl Plugin for MyPlugin {
    fn name(&self) -> &str { "My Plugin" }
    fn version(&self) -> &str { "1.0.0" }
    
    fn on_activate(&mut self, ctx: &PluginContext) -> Result<()> {
        // Register commands
        ctx.register_command("myplugin.hello", |_| {
            ctx.show_message("Hello from plugin!");
        });
        
        // Register keybindings
        ctx.register_keybinding("Ctrl+Shift+H", "myplugin.hello");
        
        Ok(())
    }
    
    fn on_deactivate(&mut self) -> Result<()> {
        // Cleanup
        Ok(())
    }
}

#[no_mangle]
pub extern "C" fn create_plugin() -> Box<dyn Plugin> {
    Box::new(MyPlugin {
        config: PluginConfig::default(),
    })
}
```

### 3. Build & Test
```bash
cargo build --release
cp target/release/libmyplugin.so ~/.nexus/plugins/
```

---

## Plugin API

### Context API
```rust
// Get editor state
let buffer = ctx.get_active_buffer()?;
let text = buffer.get_text();
let cursor = buffer.get_cursor();

// Modify buffer
buffer.insert(cursor, "Hello");
buffer.delete(start, end);

// Show UI
ctx.show_message("Info");
ctx.show_error("Error");
ctx.show_input("Enter name:", |input| {
    // Handle input
});

// Register components
ctx.register_command(name, handler);
ctx.register_keybinding(key, command);
ctx.register_language_server(lang, cmd);
ctx.register_theme(theme);
```

---

## Example Plugins

### 1. Custom Formatter
```rust
pub struct FormatterPlugin;

impl Plugin for FormatterPlugin {
    fn on_activate(&mut self, ctx: &PluginContext) -> Result<()> {
        ctx.register_command("format.custom", |ctx| {
            let buffer = ctx.get_active_buffer()?;
            let text = buffer.get_text();
            
            // Custom formatting logic
            let formatted = my_format(&text);
            
            buffer.set_text(&formatted);
            Ok(())
        });
        
        Ok(())
    }
}
```

### 2. Live Preview
```rust
pub struct PreviewPlugin {
    server: Option<HttpServer>,
}

impl Plugin for PreviewPlugin {
    fn on_activate(&mut self, ctx: &PluginContext) -> Result<()> {
        // Start HTTP server
        self.server = Some(HttpServer::new(8080)?);
        
        // Watch for changes
        ctx.on_buffer_change(|buffer| {
            if buffer.is_html() || buffer.is_markdown() {
                self.server.reload();
            }
        });
        
        ctx.register_command("preview.open", |ctx| {
            open::that("http://localhost:8080")?;
            Ok(())
        });
        
        Ok(())
    }
}
```

### 3. Git Integration
```rust
pub struct GitPlugin;

impl Plugin for GitPlugin {
    fn on_activate(&mut self, ctx: &PluginContext) -> Result<()> {
        ctx.register_command("git.commit", |ctx| {
            ctx.show_input("Commit message:", |msg| {
                let output = std::process::Command::new("git")
                    .args(&["commit", "-m", &msg])
                    .output()?;
                    
                ctx.show_message(&String::from_utf8_lossy(&output.stdout));
            });
        });
        
        Ok(())
    }
}
```

---

## Lua Plugins

### Simple Lua Plugin
```lua
-- ~/.nexus/plugins/myplugin.lua

function activate(ctx)
    ctx:register_command("myplugin.hello", function()
        ctx:show_message("Hello from Lua!")
    end)
    
    ctx:register_keybinding("Ctrl+L", "myplugin.hello")
end

function deactivate()
    -- Cleanup
end
```

---

## WASM Plugins

### WASM Plugin
```rust
// Compile to WASM
// cargo build --target wasm32-unknown-unknown

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn activate(ctx: JsValue) {
    let ctx: PluginContext = ctx.into();
    
    ctx.register_command("myplugin.hello", || {
        ctx.show_message("Hello from WASM!");
    });
}
```

---

## Plugin Configuration

### plugin.toml
```toml
[plugin]
name = "My Plugin"
version = "1.0.0"
description = "Does cool things"
author = "Your Name"
license = "MIT"

[dependencies]
other_plugin = "^2.0"

[settings]
enable_feature_x = true
max_items = 100
```

### Reading Config
```rust
impl Plugin for MyPlugin {
    fn on_activate(&mut self, ctx: &PluginContext) -> Result<()> {
        let config = ctx.get_config()?;
        
        if config.get_bool("enable_feature_x")? {
            // Enable feature
        }
        
        Ok(())
    }
}
```

---

## Publishing

### 1. Prepare Plugin
```bash
# Update version in Cargo.toml
# Update CHANGELOG.md
# Build release
cargo build --release
```

### 2. Create Package
```bash
nexus plugin package
# Creates myplugin-1.0.0.npkg
```

### 3. Publish
```bash
nexus plugin publish
# Uploads to Nexus marketplace
```

---

## Best Practices

1. **Performance**
   - Minimize blocking operations
   - Use async for I/O
   - Cache expensive computations

2. **Security**
   - Validate all inputs
   - Don't execute arbitrary code
   - Use safe API boundaries

3. **UX**
   - Provide clear error messages
   - Make commands discoverable
   - Add keyboard shortcuts

4. **Documentation**
   - Write clear README
   - Provide usage examples
   - Document all commands

---

## Debugging

```rust
// Enable debug logging
ctx.log_debug("Debug message");
ctx.log_info("Info message");
ctx.log_error("Error message");

// Use standard debugging
#[cfg(debug_assertions)]
dbg!(&some_var);
```

---

## Resources

- [Plugin API Docs](https://docs.nexus-ide.dev/plugins)
- [Example Plugins](https://github.com/nexus-ide/plugins)
- [Plugin Discord](https://discord.gg/nexus-plugins)

---

**Happy plugin building! 🚀**
