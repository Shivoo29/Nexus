# Contributing to Nexus 🤝

Thank you for your interest in contributing to Nexus! This document will help you get started.

## Code of Conduct

Be respectful, inclusive, and constructive. We're building something amazing together.

---

## Quick Start

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/nexus.git
cd nexus

# 2. Build
cargo build

# 3. Run tests
cargo test

# 4. Start developing!
cargo run
```

---

## Development Setup

### Prerequisites
- Rust 1.70+
- GPU drivers (Metal/Vulkan/CUDA)
- Git

### Platform-Specific Setup

**macOS:**
```bash
xcode-select --install
cargo build --features metal
```

**Linux:**
```bash
sudo apt install vulkan-tools nvidia-cuda-toolkit
cargo build --features vulkan
```

**Windows:**
```powershell
# Install Visual Studio with C++ tools
cargo build --features directx
```

---

## Project Structure

```
nexus/
├── src/
│   ├── main.rs           # Entry point
│   ├── editor/           # Core editor
│   ├── renderer/         # GPU rendering
│   ├── ai/               # AI engine
│   ├── discord/          # Discord integration
│   ├── lsp/              # LSP client
│   └── plugins/          # Plugin system
├── shaders/              # GPU shaders
├── plugins/              # Built-in plugins
└── tests/                # Integration tests
```

---

## Code Style

### Rust
```rust
// Use rustfmt (automatic)
cargo fmt

// Use clippy
cargo clippy -- -D warnings

// Naming
struct MyStruct { }        // PascalCase
fn my_function() { }       // snake_case
const MAX_SIZE: usize = 100;  // SCREAMING_SNAKE

// Documentation
/// Does something cool.
///
/// # Arguments
/// * `param` - Description
///
/// # Returns
/// The result
pub fn my_function(param: i32) -> Result<String> {
    // Implementation
}
```

### Commit Messages
```bash
# Format: <type>(<scope>): <subject>

feat(editor): add multi-cursor support
fix(renderer): resolve text clipping issue
docs(readme): update installation instructions
perf(ai): optimize context building
```

**Types:** feat, fix, docs, style, refactor, perf, test, chore

---

## Testing

### Unit Tests
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_buffer_insert() {
        let mut buffer = Buffer::new();
        buffer.insert(0, "hello");
        assert_eq!(buffer.text(), "hello");
    }
}
```

### Integration Tests
```bash
# Run all tests
cargo test

# Run specific test
cargo test test_buffer_insert

# Run with output
cargo test -- --nocapture
```

### Benchmarks
```bash
cargo bench
```

---

## Pull Request Process

1. **Create a branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes**
   - Write code
   - Add tests
   - Update docs

3. **Test locally**
   ```bash
   cargo test
   cargo clippy
   cargo fmt
   ```

4. **Commit**
   ```bash
   git commit -m "feat(scope): description"
   ```

5. **Push**
   ```bash
   git push origin feature/my-feature
   ```

6. **Create PR on GitHub**
   - Fill out the template
   - Link related issues
   - Request review

---

## Areas to Contribute

### 🐛 Bug Fixes
- Check [issues labeled "bug"](https://github.com/yourusername/nexus/labels/bug)
- Reproduce the issue
- Write a failing test
- Fix and submit PR

### ✨ Features
- Check [feature requests](https://github.com/yourusername/nexus/labels/enhancement)
- Discuss approach in issue first
- Implement with tests
- Update documentation

### 📝 Documentation
- README improvements
- Code comments
- API documentation
- Tutorials and guides

### 🎨 Design
- UI/UX improvements
- Icons and graphics
- Color schemes/themes
- Accessibility

### 🔌 Plugins
- Create useful plugins
- Document plugin API
- Share in marketplace

---

## Plugin Development

### Create a Plugin

```rust
// plugins/my_plugin/src/lib.rs
use nexus_plugin_api::*;

pub struct MyPlugin;

impl Plugin for MyPlugin {
    fn name(&self) -> &str { "My Plugin" }
    fn version(&self) -> &str { "1.0.0" }
    
    fn on_activate(&mut self, ctx: &PluginContext) -> Result<()> {
        // Register commands
        ctx.register_command("my.command", |_| {
            println!("Command executed!");
        });
        
        Ok(())
    }
}

#[no_mangle]
pub extern "C" fn create_plugin() -> Box<dyn Plugin> {
    Box::new(MyPlugin)
}
```

### Test Plugin
```bash
cd plugins/my_plugin
cargo build --release
cp target/release/libmy_plugin.so ~/.nexus/plugins/
```

---

## Performance Guidelines

### Optimize for Speed
- Profile before optimizing
- Target <1ms input latency
- Minimize allocations in hot paths
- Use `#[inline]` judiciously

### Memory Usage
- Prefer `Arc` over `Clone` for large data
- Use slices instead of vectors when possible
- Pool large buffers

### GPU Usage
- Batch draw calls
- Minimize CPU↔GPU transfers
- Use instanced rendering

---

## Security Guidelines

- Never commit secrets (API keys, tokens)
- Validate all user input
- Sandbox plugin execution
- Use secure credential storage

---

## Getting Help

- 💬 [Discord Community](https://discord.gg/nexus-ide)
- 📖 [Documentation](https://docs.nexus-ide.dev)
- 🐛 [GitHub Issues](https://github.com/yourusername/nexus/issues)

---

## Recognition

Contributors are recognized in:
- [Contributors page](https://github.com/yourusername/nexus/graphs/contributors)
- Release notes
- Project README
- Monthly newsletter

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for making Nexus better! 🚀**
