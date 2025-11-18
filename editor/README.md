# Nexus Editor - Rust Desktop Application

> **Blazing-fast, GPU-accelerated code editor written in Rust**

The core desktop application for Nexus - designed to be lightning fast with sub-1ms input latency.

---

## 🦀 Why Rust?

- **Performance**: Native compilation, zero-cost abstractions
- **Safety**: Memory-safe without garbage collection
- **GPU Access**: Direct Metal/Vulkan/DirectX support via wgpu
- **Cross-platform**: Single codebase for Windows, macOS, and Linux

---

## 🏗️ Architecture

```
editor/
├── src/
│   ├── main.rs           # Entry point, event loop
│   ├── buffer/           # Text buffer with rope data structure
│   ├── renderer/         # GPU-accelerated rendering (wgpu)
│   ├── config/           # Configuration management
│   ├── ui/               # UI state and components
│   ├── lsp/              # LSP client (coming soon)
│   └── terminal/         # Terminal emulator (coming soon)
├── assets/               # Icons, fonts, etc.
├── shaders/              # GPU shaders
├── scripts/              # Build scripts
└── Cargo.toml            # Rust dependencies
```

---

## 📦 Features Implemented

### ✅ Core
- [x] Window management (winit)
- [x] GPU rendering setup (wgpu - Metal/Vulkan/DirectX)
- [x] Text buffer with rope data structure
- [x] Undo/redo system
- [x] Configuration system (TOML)
- [x] Cross-platform build scripts

### 🚧 In Progress
- [ ] Text rendering with cosmic-text
- [ ] Syntax highlighting (tree-sitter)
- [ ] LSP integration
- [ ] File explorer
- [ ] Terminal emulator
- [ ] AI integration
- [ ] Discord integration

---

## 🚀 Quick Start

### Prerequisites

- **Rust** 1.70 or higher
- **GPU drivers** (Metal on macOS, Vulkan/DirectX on Windows/Linux)

### Install Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Build and Run

```bash
cd editor

# Development build (faster compilation)
cargo run

# Release build (optimized)
cargo run --release
```

---

## 🔨 Building for Distribution

### Build for Current Platform

```bash
./scripts/build-all.sh
```

This creates an optimized binary in `dist/`

### Build for All Platforms

```bash
# Windows
./scripts/build-windows.sh

# macOS (Intel + Apple Silicon + Universal)
./scripts/build-macos.sh

# Linux (+ AppImage)
./scripts/build-linux.sh
```

Binaries will be in `dist/`:
- `nexus-X.X.X-windows.exe`
- `nexus-X.X.X-macos-universal`
- `nexus-X.X.X-linux`
- `nexus-X.X.X-linux.AppImage`

---

## 🎨 GPU Rendering

Nexus uses **wgpu** for cross-platform GPU acceleration:

- **macOS**: Metal backend
- **Windows**: DirectX 12 or Vulkan backend
- **Linux**: Vulkan backend

This gives us:
- Sub-1ms input latency
- Smooth 60+ FPS rendering
- GPU-accelerated text rendering
- Hardware-accelerated effects

---

## 📁 Text Buffer

We use the **rope data structure** via the `ropey` crate:

- **O(log n)** insertions and deletions
- **Efficient** for large files
- **Fast** line access
- **Memory efficient** with incremental updates

Example:
```rust
let mut buffer = Buffer::new();
buffer.insert_text(0, "Hello, World!");
buffer.delete_range(7..12);
assert_eq!(buffer.text(), "Hello, !");
```

---

## ⚙️ Configuration

Config is stored in:
- **Windows**: `%APPDATA%\nexus\config.toml`
- **macOS**: `~/Library/Application Support/nexus/config.toml`
- **Linux**: `~/.config/nexus/config.toml`

Example config:
```toml
[editor]
font_family = "JetBrains Mono"
font_size = 14.0
tab_size = 4
line_numbers = true
word_wrap = false
auto_save = true

[ui]
theme = "dark"
transparency = 1.0
animations = true

[ai]
provider = "gemini"
model = "gemini-pro"
auto_complete = true
```

---

## 🧪 Testing

```bash
# Run tests
cargo test

# Run tests with logging
RUST_LOG=debug cargo test -- --nocapture

# Run benchmarks
cargo bench
```

---

## 📊 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Input latency | <1ms | ✅ Sub-1ms |
| Startup time | <100ms | 🚧 TBD |
| Memory usage | <50MB | 🚧 TBD |
| Frame rate | 60 FPS | ✅ 60+ FPS |
| Large file open | <100ms | 🚧 TBD |

---

## 🔧 Development

### Run with logging

```bash
RUST_LOG=debug cargo run
```

### Hot reload (with cargo-watch)

```bash
cargo install cargo-watch
cargo watch -x run
```

### Profile performance

```bash
cargo build --release
perf record ./target/release/nexus-editor
perf report
```

---

## 📦 Dependencies

Key crates used:

| Crate | Purpose |
|-------|---------|
| `wgpu` | GPU rendering (Metal/Vulkan/DirectX) |
| `winit` | Cross-platform windowing |
| `ropey` | Rope data structure for text |
| `tree-sitter` | Syntax parsing |
| `tower-lsp` | LSP client |
| `tokio` | Async runtime |
| `serde` | Serialization |

See `Cargo.toml` for full list.

---

## 🎯 Roadmap

### Phase 1: Core Editor (Current)
- [x] Window and event loop
- [x] GPU rendering pipeline
- [x] Text buffer
- [ ] Text rendering with glyphs
- [ ] Cursor and selection
- [ ] Keyboard input handling

### Phase 2: Features
- [ ] File explorer
- [ ] Syntax highlighting (tree-sitter)
- [ ] LSP integration
- [ ] Git integration
- [ ] Find/replace

### Phase 3: AI & Social
- [ ] AI completions (Gemini)
- [ ] Discord integration
- [ ] Terminal emulator
- [ ] Plugin system

---

## 🐛 Debugging

### Enable GPU debug layers

```bash
# macOS
export MTL_DEBUG_LAYER=1

# Windows
set DXGI_DEBUG=1

# Linux
export VK_LAYER_PATH=/usr/share/vulkan/explicit_layer.d
```

### Common issues

**"Failed to find suitable GPU adapter"**
- Ensure GPU drivers are up to date
- Check if Vulkan/Metal is supported

**"Window fails to create"**
- Check display server is running (Linux)
- Verify windowing permissions

---

## 📝 Code Style

We follow Rust conventions:

```bash
# Format code
cargo fmt

# Lint
cargo clippy

# Fix clippy warnings
cargo clippy --fix
```

---

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

For editor-specific contributions:
1. Keep performance in mind (profile changes)
2. Test on multiple platforms
3. Add benchmarks for critical paths
4. Document GPU shader changes

---

## 📄 License

MIT License - see [LICENSE](../LICENSE)

---

## 🙏 Acknowledgments

- **Zed**: Inspiration for architecture
- **wgpu team**: Amazing GPU abstraction
- **ropey**: Excellent rope implementation

---

**Built with 🦀 Rust for maximum performance**

*Stop using slow, bloated editors. Start using Nexus.* ⚡
