# Nexus Architecture 🏗️

## System Overview

Nexus is a high-performance, GPU-accelerated code editor built in Rust with native AI and Discord integration. The architecture prioritizes **speed**, **extensibility**, and **seamless integration** of traditionally separate tools.

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER INTERFACE                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Editor  │  │ Discord  │  │   File   │  │ Terminal │       │
│  │   Pane   │  │  Sidebar │  │ Explorer │  │   Pane   │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
└───────┼─────────────┼─────────────┼─────────────┼──────────────┘
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                      │
        ┌─────────────▼──────────────────────────────────┐
        │           CORE APPLICATION LAYER                │
        │                                                  │
        │  ┌───────────────┐  ┌──────────────────┐      │
        │  │  Event Loop   │  │  State Manager   │      │
        │  │   (Tokio)     │  │   (Arc<RwLock>)  │      │
        │  └───────┬───────┘  └─────────┬────────┘      │
        │          │                     │                │
        │  ┌───────▼─────────────────────▼──────┐       │
        │  │       Command Dispatcher             │       │
        │  └──────┬────────────┬─────────┬───────┘       │
        └─────────┼────────────┼─────────┼───────────────┘
                  │            │         │
      ┌───────────▼──┐  ┌──────▼─────┐  ┌▼──────────┐
      │ Editor Core  │  │  AI Engine │  │  Discord  │
      │   (Rope,     │  │  (Multi-   │  │   Layer   │
      │  Tree-sitter)│  │   LLM)     │  │  (Voice,  │
      └──────┬───────┘  └──────┬─────┘  │   Chat)   │
             │                 │         └────┬──────┘
      ┌──────▼─────────────────▼──────┐      │
      │      GPU Rendering Engine      │      │
      │  (Metal / Vulkan / DirectX)    │      │
      └────────────┬───────────────────┘      │
                   │                           │
      ┌────────────▼──────────┐    ┌──────────▼────────┐
      │   GPU (Rendering,     │    │  Network Layer    │
      │   Compute, ML)        │    │  (WebRTC, WS)     │
      └───────────────────────┘    └───────────────────┘
```

---

## Core Components

### 1. Editor Core (Rust)

**Location**: `/src/editor/`

**Responsibilities:**
- Text buffer management (rope data structure)
- Cursor and selection handling
- Undo/redo system
- Syntax highlighting (tree-sitter)
- File I/O operations

**Key Technologies:**
- `ropey` - Efficient text rope
- `tree-sitter` - Parsing and syntax highlighting
- `lsp-types` - Language Server Protocol
- `notify` - File system watching

**Architecture:**

```rust
// Buffer management
pub struct Buffer {
    rope: Rope,              // Text content
    tree: Tree,              // Syntax tree
    version: usize,          // For change tracking
    undo_stack: Vec<Change>,
    redo_stack: Vec<Change>,
}

// Editor state
pub struct Editor {
    buffers: HashMap<BufferId, Buffer>,
    views: Vec<View>,        // Split panes
    cursors: Vec<Cursor>,    // Multi-cursor support
    selections: Vec<Selection>,
}

// Event loop
async fn main_loop(mut editor: Editor, rx: Receiver<Event>) {
    while let Some(event) = rx.recv().await {
        match event {
            Event::KeyPress(key) => handle_keypress(&mut editor, key),
            Event::MouseMove(pos) => update_cursor(&mut editor, pos),
            Event::FileChanged(path) => reload_buffer(&mut editor, path),
            // ... more events
        }
        
        // Render frame
        render_frame(&editor).await;
    }
}
```

---

### 2. GPU Rendering Engine

**Location**: `/src/renderer/`

**Responsibilities:**
- Text glyph rasterization
- Syntax highlighting shaders
- Cursor and selection rendering
- Smooth scrolling
- UI element rendering

**Rendering Pipeline:**

```
Text Buffer → GPU Upload → Vertex Shader → Fragment Shader → Screen
     ↓            ↓              ↓               ↓
  [UTF-8]    [GPU Buffer]   [Transform]    [Colorize]
```

**Platform-Specific Backends:**

#### Metal (macOS)
```rust
// src/renderer/metal.rs
use metal::*;

pub struct MetalRenderer {
    device: Device,
    command_queue: CommandQueue,
    pipeline_state: RenderPipelineState,
    vertex_buffer: Buffer,
    glyph_atlas: Texture,
}

impl MetalRenderer {
    pub fn render_text(&self, text: &str, pos: Point) {
        // Create vertex data
        let vertices = self.create_text_vertices(text, pos);
        
        // Encode render commands
        let command_buffer = self.command_queue.new_command_buffer();
        let encoder = command_buffer.new_render_command_encoder(&render_pass);
        
        encoder.set_render_pipeline_state(&self.pipeline_state);
        encoder.set_vertex_buffer(0, Some(&self.vertex_buffer), 0);
        encoder.draw_primitives(MTLPrimitiveType::Triangle, 0, vertices.len());
        
        encoder.end_encoding();
        command_buffer.commit();
    }
}
```

#### Vulkan (Linux/Windows)
```rust
// src/renderer/vulkan.rs
use vulkano::*;

pub struct VulkanRenderer {
    device: Arc<Device>,
    queue: Arc<Queue>,
    pipeline: Arc<GraphicsPipeline>,
    framebuffers: Vec<Arc<Framebuffer>>,
}
```

**Text Rendering Optimization:**
- Glyph atlas caching (all characters pre-rendered)
- Instanced rendering (one draw call per frame)
- Sub-pixel positioning
- GPU font hinting

**Performance Targets:**
- 60 FPS minimum (16.67ms per frame)
- Sub-1ms input-to-photon latency
- 10,000+ lines rendered without lag

---

### 3. AI Engine (Multi-LLM)

**Location**: `/src/ai/`

**Responsibilities:**
- LLM API integration
- Context management
- Prompt engineering
- Response streaming
- Token counting and billing

**Architecture:**

```rust
// LLM provider trait
#[async_trait]
pub trait LLMProvider: Send + Sync {
    async fn complete(&self, prompt: &str, context: &Context) -> Result<String>;
    async fn stream_complete(&self, prompt: &str, context: &Context) -> Result<Stream<String>>;
    fn name(&self) -> &str;
    fn max_tokens(&self) -> usize;
}

// Gemini implementation
pub struct GeminiProvider {
    client: reqwest::Client,
    api_key: String,
    model: String,
}

#[async_trait]
impl LLMProvider for GeminiProvider {
    async fn complete(&self, prompt: &str, context: &Context) -> Result<String> {
        let request = self.build_request(prompt, context);
        let response = self.client.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent")
            .json(&request)
            .send()
            .await?;
        
        // Parse and return
        Ok(response.json().await?)
    }
}

// AI Engine manages all providers
pub struct AIEngine {
    providers: HashMap<String, Box<dyn LLMProvider>>,
    active_provider: String,
    context_builder: ContextBuilder,
}

impl AIEngine {
    pub async fn get_completion(&self, prompt: &str) -> Result<String> {
        let context = self.context_builder.build();
        let provider = self.providers.get(&self.active_provider).unwrap();
        provider.complete(prompt, &context).await
    }
}
```

**Context Management:**

```rust
pub struct Context {
    current_file: String,
    cursor_position: Point,
    selection: Option<Range>,
    open_files: Vec<String>,
    project_structure: ProjectTree,
    recent_edits: Vec<Edit>,
    symbol_table: SymbolTable,
}

pub struct ContextBuilder {
    max_tokens: usize,
}

impl ContextBuilder {
    pub fn build(&self, editor: &Editor) -> Context {
        // Intelligently select relevant context
        // Priority:
        // 1. Current file (full)
        // 2. Selected code (if any)
        // 3. Imported files (partial)
        // 4. Project symbols
        // 5. Recent edits
        
        Context {
            // ... build context
        }
    }
}
```

**Smart Features:**

1. **Code Completion**
   - Analyze cursor position and surrounding code
   - Generate context-aware suggestions
   - Rank by relevance using embedding similarity

2. **Code Explanation**
   - Extract function/class at cursor
   - Include dependencies
   - Generate natural language explanation

3. **Refactoring**
   - Parse entire file
   - Identify patterns
   - Suggest improvements with diff preview

---

### 4. Discord Integration Layer

**Location**: `/src/discord/`

**Responsibilities:**
- Discord API integration
- Voice/video communication
- Real-time messaging
- Presence management
- Collaborative editing synchronization

**Architecture:**

```rust
pub struct DiscordClient {
    token: String,
    gateway: WebSocketStream,
    voice_client: Option<VoiceClient>,
    rpc_client: RPCClient,
}

impl DiscordClient {
    pub async fn connect(&mut self) -> Result<()> {
        // Connect to Discord Gateway
        self.gateway = WebSocketStream::connect(GATEWAY_URL).await?;
        
        // Authenticate
        self.send_identify().await?;
        
        // Start heartbeat
        tokio::spawn(self.heartbeat_loop());
        
        Ok(())
    }
    
    pub async fn join_voice_channel(&mut self, channel_id: u64) -> Result<()> {
        // Request voice state
        self.send_voice_state_update(channel_id).await?;
        
        // Receive voice server info
        let voice_server = self.recv_voice_server_update().await?;
        
        // Connect to voice
        self.voice_client = Some(VoiceClient::connect(voice_server).await?);
        
        Ok(())
    }
}
```

**Voice Integration:**

```rust
pub struct VoiceClient {
    udp_socket: UdpSocket,
    rtp_session: RTPSession,
    opus_encoder: OpusEncoder,
    opus_decoder: OpusDecoder,
}

impl VoiceClient {
    pub async fn send_audio(&mut self, pcm_data: &[i16]) -> Result<()> {
        // Encode with Opus
        let opus_data = self.opus_encoder.encode(pcm_data)?;
        
        // Packetize as RTP
        let rtp_packet = self.rtp_session.create_packet(opus_data);
        
        // Send via UDP
        self.udp_socket.send(&rtp_packet).await?;
        
        Ok(())
    }
    
    pub async fn recv_audio(&mut self) -> Result<Vec<i16>> {
        // Receive RTP packet
        let mut buf = [0u8; 1500];
        let (len, _) = self.udp_socket.recv_from(&mut buf).await?;
        
        // Decode RTP
        let opus_data = self.rtp_session.parse_packet(&buf[..len])?;
        
        // Decode Opus to PCM
        let pcm_data = self.opus_decoder.decode(opus_data)?;
        
        Ok(pcm_data)
    }
}
```

**Collaborative Editing (Operational Transformation):**

```rust
pub struct CollaborativeSession {
    session_id: Uuid,
    participants: Vec<User>,
    document: SharedDocument,
    operation_queue: VecDeque<Operation>,
}

pub enum Operation {
    Insert { pos: usize, text: String, user_id: Uuid },
    Delete { pos: usize, len: usize, user_id: Uuid },
    MoveCursor { pos: Point, user_id: Uuid },
}

impl CollaborativeSession {
    pub fn apply_operation(&mut self, op: Operation) -> Result<()> {
        // Transform operation against pending operations
        let transformed_op = self.transform_operation(op);
        
        // Apply to document
        match transformed_op {
            Operation::Insert { pos, text, .. } => {
                self.document.insert(pos, &text);
            }
            Operation::Delete { pos, len, .. } => {
                self.document.delete(pos, len);
            }
            Operation::MoveCursor { pos, user_id } => {
                self.update_cursor(user_id, pos);
            }
        }
        
        // Broadcast to other participants
        self.broadcast_operation(transformed_op).await?;
        
        Ok(())
    }
    
    fn transform_operation(&self, op: Operation) -> Operation {
        // Operational Transformation algorithm
        // Ensures consistency across all clients
        // ... implementation
    }
}
```

---

### 5. LSP (Language Server Protocol) Client

**Location**: `/src/lsp/`

**Responsibilities:**
- Communication with language servers
- Diagnostics (errors/warnings)
- Code completion
- Go-to-definition
- Hover information
- Refactoring

**Architecture:**

```rust
pub struct LSPClient {
    process: Child,
    stdin: ChildStdin,
    stdout: BufReader<ChildStdout>,
    request_id: AtomicU64,
    pending_requests: Arc<Mutex<HashMap<u64, oneshot::Sender<Value>>>>,
}

impl LSPClient {
    pub async fn start(command: &str, args: &[&str]) -> Result<Self> {
        let mut process = Command::new(command)
            .args(args)
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .spawn()?;
        
        let stdin = process.stdin.take().unwrap();
        let stdout = BufReader::new(process.stdout.take().unwrap());
        
        let mut client = LSPClient {
            process,
            stdin,
            stdout,
            request_id: AtomicU64::new(0),
            pending_requests: Arc::new(Mutex::new(HashMap::new())),
        };
        
        // Send initialize request
        client.initialize().await?;
        
        // Start response handler
        tokio::spawn(client.handle_responses());
        
        Ok(client)
    }
    
    pub async fn completion(&self, uri: &str, position: Position) -> Result<Vec<CompletionItem>> {
        let params = CompletionParams {
            text_document: TextDocumentIdentifier { uri: uri.to_string() },
            position,
            context: None,
        };
        
        let response = self.send_request("textDocument/completion", params).await?;
        
        Ok(serde_json::from_value(response)?)
    }
    
    pub async fn goto_definition(&self, uri: &str, position: Position) -> Result<Location> {
        let params = GotoDefinitionParams {
            text_document_position: TextDocumentPositionParams {
                text_document: TextDocumentIdentifier { uri: uri.to_string() },
                position,
            },
            work_done_progress_params: Default::default(),
            partial_result_params: Default::default(),
        };
        
        let response = self.send_request("textDocument/definition", params).await?;
        
        Ok(serde_json::from_value(response)?)
    }
}
```

---

### 6. GPU Compute Engine

**Location**: `/src/gpu_compute/`

**Responsibilities:**
- Execute code on GPU
- ML model inference
- Shader compilation
- Performance monitoring

**CUDA Integration:**

```rust
use cudarc::driver::*;

pub struct CUDAExecutor {
    device: CudaDevice,
    context: CudaContext,
}

impl CUDAExecutor {
    pub fn execute_python(&self, code: &str) -> Result<String> {
        // Compile Python to CUDA kernel (via Numba or similar)
        let kernel = self.compile_to_cuda(code)?;
        
        // Load kernel
        let module = self.device.load_ptx(kernel)?;
        let function = module.get_function("main")?;
        
        // Execute
        let output = self.launch_kernel(function)?;
        
        Ok(output)
    }
}
```

**Metal Compute:**

```rust
use metal::*;

pub struct MetalComputeExecutor {
    device: Device,
    command_queue: CommandQueue,
}

impl MetalComputeExecutor {
    pub fn execute_kernel(&self, shader_source: &str, inputs: &[Buffer]) -> Result<Buffer> {
        // Compile shader
        let library = self.device.new_library_with_source(shader_source, &CompileOptions::new())?;
        let function = library.get_function("main", None)?;
        
        // Create pipeline
        let pipeline = self.device.new_compute_pipeline_state_with_function(&function)?;
        
        // Create command buffer
        let command_buffer = self.command_queue.new_command_buffer();
        let encoder = command_buffer.new_compute_command_encoder();
        
        // Set inputs
        encoder.set_compute_pipeline_state(&pipeline);
        for (i, buffer) in inputs.iter().enumerate() {
            encoder.set_buffer(i as u64, Some(buffer), 0);
        }
        
        // Dispatch
        let thread_group_size = MTLSize { width: 256, height: 1, depth: 1 };
        let thread_groups = MTLSize { width: (inputs[0].length() + 255) / 256, height: 1, depth: 1 };
        encoder.dispatch_thread_groups(thread_groups, thread_group_size);
        
        encoder.end_encoding();
        command_buffer.commit();
        command_buffer.wait_until_completed();
        
        // Return result
        Ok(outputs[0].clone())
    }
}
```

---

### 7. Plugin System

**Location**: `/src/plugins/`

**Responsibilities:**
- Load and manage plugins
- Provide safe API
- Handle plugin lifecycle
- Enable hot-reload

**Architecture:**

```rust
pub trait Plugin: Send + Sync {
    fn name(&self) -> &str;
    fn version(&self) -> &str;
    fn on_activate(&mut self, ctx: &PluginContext) -> Result<()>;
    fn on_deactivate(&mut self) -> Result<()>;
}

pub struct PluginManager {
    plugins: HashMap<String, Box<dyn Plugin>>,
    plugin_loader: PluginLoader,
}

impl PluginManager {
    pub fn load_plugin(&mut self, path: &Path) -> Result<()> {
        // Load shared library
        let lib = unsafe { Library::new(path)? };
        
        // Get plugin constructor
        let constructor: Symbol<fn() -> Box<dyn Plugin>> = 
            unsafe { lib.get(b"create_plugin")? };
        
        // Create plugin instance
        let mut plugin = constructor();
        
        // Activate
        let ctx = self.create_context();
        plugin.on_activate(&ctx)?;
        
        // Store
        self.plugins.insert(plugin.name().to_string(), plugin);
        
        Ok(())
    }
}
```

**WASM Plugin Support:**

```rust
use wasmer::*;

pub struct WASMPlugin {
    instance: Instance,
    store: Store,
}

impl WASMPlugin {
    pub fn load(wasm_bytes: &[u8]) -> Result<Self> {
        let store = Store::default();
        let module = Module::new(&store, wasm_bytes)?;
        
        // Create imports (API for plugin)
        let imports = imports! {
            "env" => {
                "log" => Function::new_native(&store, log_function),
                "get_text" => Function::new_native(&store, get_text_function),
                // ... more API functions
            }
        };
        
        let instance = Instance::new(&module, &imports)?;
        
        Ok(WASMPlugin { instance, store })
    }
    
    pub fn call_function(&self, name: &str, args: &[Value]) -> Result<Vec<Value>> {
        let func = self.instance.exports.get_function(name)?;
        let result = func.call(args)?;
        Ok(result.to_vec())
    }
}
```

---

## Data Flow

### Keypress to Screen

```
User Press Key
    ↓
OS Event (0.1ms)
    ↓
Event Loop Receives (0.1ms)
    ↓
Command Dispatcher (0.1ms)
    ↓
Update Buffer (0.2ms)
    ↓
Update Syntax Tree (0.3ms)
    ↓
GPU Upload (0.1ms)
    ↓
GPU Render (0.1ms)
    ↓
Display (0ms - next vsync)

Total: <1ms
```

### AI Completion Flow

```
User Types Code
    ↓
Context Builder Activates (every 500ms or on trigger)
    ↓
Extract Current File + Imports (2ms)
    ↓
Build Context (5ms)
    ↓
Send to LLM API (network latency ~20-50ms)
    ↓
Receive Streaming Response (50-200ms)
    ↓
Parse and Display Ghost Text (1ms)
    ↓
User Accepts (Tab) or Rejects (Esc)

Total: 80-260ms
```

---

## Performance Optimization Strategies

### 1. Memory Management
- Use `Arc` for shared immutable data
- Use `Mutex`/`RwLock` only when necessary
- Implement custom allocators for hot paths
- Pool large buffers (avoid allocation churn)

### 2. Rendering
- Instanced rendering (one draw call per frame)
- Glyph atlas caching
- Dirty rectangle tracking (only redraw changed areas)
- Triple buffering for smooth vsync

### 3. Concurrency
- Separate threads for: UI, LSP, File I/O, Network
- Lock-free data structures where possible
- Actor model for message passing

### 4. Disk I/O
- Memory-mapped files for large files
- Incremental file loading
- Aggressive caching
- Background file watching

---

## Security Architecture

### Sandboxing
- Plugins run in isolated processes (or WASM)
- Limited file system access
- No network access without permission
- Capability-based security

### Credential Storage
- System keychain integration (macOS Keychain, Windows Credential Manager, Linux Secret Service)
- Encrypted at rest
- Never logged or transmitted

### Code Execution
- GPU code runs in isolated context
- Resource limits (memory, time)
- No access to file system
- Audit logging for enterprise

---

## Scalability

### Large Files
- Lazy loading (load visible + small buffer)
- Streaming for files >100MB
- Incremental syntax highlighting
- Virtual scrolling

### Large Projects
- Indexed symbol search (ripgrep/ag)
- Lazy tree expansion
- Background indexing
- Distributed search for monorepos

---

## Platform Differences

| Feature | macOS | Linux | Windows |
|---------|-------|-------|---------|
| Rendering | Metal | Vulkan | DirectX |
| Compute | Metal Compute | CUDA/Vulkan | CUDA/DirectX |
| Keychain | Keychain | Secret Service | Credential Manager |
| File Watch | FSEvents | inotify | ReadDirectoryChangesW |
| Process | Grand Central Dispatch | epoll | IOCP |

---

## Technology Stack Summary

**Core:**
- Rust (systems programming)
- Tokio (async runtime)
- GPU APIs (Metal/Vulkan/DirectX)

**UI:**
- Custom GPU-accelerated rendering
- Flexbox-style layout
- Immediate mode GUI patterns

**AI:**
- HTTP clients (reqwest)
- JSON parsing (serde_json)
- Streaming (futures)

**Discord:**
- WebSocket (tokio-tungstenite)
- WebRTC (webrtc-rs)
- Opus codec (opus-rs)

**Languages:**
- Tree-sitter (parsing)
- LSP (language servers)
- Tower (LSP client)

**Plugins:**
- Dylib loading (libloading)
- WASM runtime (wasmer)
- Lua runtime (mlua)

---

**Architecture Version:** 1.0.0  
**Last Updated:** 2025  
**Maintained By:** Nexus Core Team
