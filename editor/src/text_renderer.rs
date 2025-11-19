use anyhow::Result;
use cosmic_text::{Attrs, Buffer as TextBuffer, FontSystem, Metrics, SwashCache};
use wgpu::{Device, Queue, TextureFormat};

pub struct TextRenderer {
    font_system: FontSystem,
    swash_cache: SwashCache,
    atlas: TextureAtlas,
}

impl TextRenderer {
    pub fn new(device: &Device, queue: &Queue, surface_format: TextureFormat) -> Result<Self> {
        let font_system = FontSystem::new();

        // Load default fonts
        log::info!("📝 Initializing font system");

        let swash_cache = SwashCache::new();
        let atlas = TextureAtlas::new(device, queue, surface_format)?;

        Ok(Self {
            font_system,
            swash_cache,
            atlas,
        })
    }

    pub fn render_text(
        &mut self,
        device: &Device,
        queue: &Queue,
        text: &str,
        font_size: f32,
        line_height: f32,
        color_fn: Option<&dyn Fn(usize) -> [f32; 4]>,
    ) -> Result<Vec<GlyphInstance>> {
        // Create cosmic-text buffer
        let metrics = Metrics::new(font_size, line_height);
        let mut buffer = TextBuffer::new(&mut self.font_system, metrics);

        // Set text
        buffer.set_text(&mut self.font_system, text, Attrs::new(), cosmic_text::Shaping::Advanced);

        // Layout text
        buffer.set_size(&mut self.font_system, 1280.0, 800.0);
        buffer.shape_until_scroll(&mut self.font_system);

        let mut instances = Vec::new();

        // Process each line
        for run in buffer.layout_runs() {
            for glyph in run.glyphs.iter() {
                // Get cache key from glyph
                let physical_glyph = glyph.physical((0., 0.), 1.0);
                let cache_key = physical_glyph.cache_key;

                // Rasterize glyph if not in cache
                let image_opt = self
                    .swash_cache
                    .get_image(&mut self.font_system, cache_key);

                if let Some(image) = image_opt {
                    // Add glyph to atlas
                    let atlas_pos = self.atlas.add_glyph(device, queue, &image)?;

                    // Get color from callback or use white
                    let color = if let Some(ref color_fn) = color_fn {
                        color_fn(glyph.start)
                    } else {
                        [1.0, 1.0, 1.0, 1.0]
                    };

                    // Create instance
                    instances.push(GlyphInstance {
                        position: [physical_glyph.x as f32, physical_glyph.y as f32],
                        size: [image.placement.width as f32, image.placement.height as f32],
                        uv_offset: atlas_pos.uv_offset,
                        uv_size: atlas_pos.uv_size,
                        color,
                    });
                }
            }
        }

        Ok(instances)
    }

    pub fn render_text_at_position(
        &mut self,
        device: &Device,
        queue: &Queue,
        text: &str,
        font_size: f32,
        x: f32,
        y: f32,
        color: [f32; 4],
    ) -> Result<Vec<GlyphInstance>> {
        // Create cosmic-text buffer
        let metrics = Metrics::new(font_size, font_size * 1.2);
        let mut buffer = TextBuffer::new(&mut self.font_system, metrics);

        // Set text
        buffer.set_text(&mut self.font_system, text, Attrs::new(), cosmic_text::Shaping::Advanced);

        // Layout text
        buffer.set_size(&mut self.font_system, 1280.0, 800.0);
        buffer.shape_until_scroll(&mut self.font_system);

        let mut instances = Vec::new();

        // Process each line
        for run in buffer.layout_runs() {
            for glyph in run.glyphs.iter() {
                // Get cache key from glyph
                let physical_glyph = glyph.physical((0., 0.), 1.0);
                let cache_key = physical_glyph.cache_key;

                // Rasterize glyph if not in cache
                let image_opt = self
                    .swash_cache
                    .get_image(&mut self.font_system, cache_key);

                if let Some(image) = image_opt {
                    // Add glyph to atlas
                    let atlas_pos = self.atlas.add_glyph(device, queue, &image)?;

                    // Create instance with custom position
                    instances.push(GlyphInstance {
                        position: [physical_glyph.x as f32 + x, physical_glyph.y as f32 + y],
                        size: [image.placement.width as f32, image.placement.height as f32],
                        uv_offset: atlas_pos.uv_offset,
                        uv_size: atlas_pos.uv_size,
                        color,
                    });
                }
            }
        }

        Ok(instances)
    }

    pub fn atlas_texture(&self) -> &wgpu::Texture {
        &self.atlas.texture
    }

    pub fn atlas_view(&self) -> &wgpu::TextureView {
        &self.atlas.view
    }

    pub fn atlas_sampler(&self) -> &wgpu::Sampler {
        &self.atlas.sampler
    }
}

#[repr(C)]
#[derive(Copy, Clone, Debug, bytemuck::Pod, bytemuck::Zeroable)]
pub struct GlyphInstance {
    pub position: [f32; 2],
    pub size: [f32; 2],
    pub uv_offset: [f32; 2],
    pub uv_size: [f32; 2],
    pub color: [f32; 4],
}

impl GlyphInstance {
    pub fn desc() -> wgpu::VertexBufferLayout<'static> {
        wgpu::VertexBufferLayout {
            array_stride: std::mem::size_of::<GlyphInstance>() as wgpu::BufferAddress,
            step_mode: wgpu::VertexStepMode::Instance,
            attributes: &[
                // Position
                wgpu::VertexAttribute {
                    offset: 0,
                    shader_location: 0,
                    format: wgpu::VertexFormat::Float32x2,
                },
                // Size
                wgpu::VertexAttribute {
                    offset: std::mem::size_of::<[f32; 2]>() as wgpu::BufferAddress,
                    shader_location: 1,
                    format: wgpu::VertexFormat::Float32x2,
                },
                // UV offset
                wgpu::VertexAttribute {
                    offset: std::mem::size_of::<[f32; 4]>() as wgpu::BufferAddress,
                    shader_location: 2,
                    format: wgpu::VertexFormat::Float32x2,
                },
                // UV size
                wgpu::VertexAttribute {
                    offset: std::mem::size_of::<[f32; 6]>() as wgpu::BufferAddress,
                    shader_location: 3,
                    format: wgpu::VertexFormat::Float32x2,
                },
                // Color
                wgpu::VertexAttribute {
                    offset: std::mem::size_of::<[f32; 8]>() as wgpu::BufferAddress,
                    shader_location: 4,
                    format: wgpu::VertexFormat::Float32x4,
                },
            ],
        }
    }
}

struct TextureAtlas {
    texture: wgpu::Texture,
    view: wgpu::TextureView,
    sampler: wgpu::Sampler,
    size: u32,
    next_x: u32,
    next_y: u32,
    row_height: u32,
}

struct AtlasPosition {
    uv_offset: [f32; 2],
    uv_size: [f32; 2],
}

impl TextureAtlas {
    fn new(device: &Device, _queue: &Queue, _format: TextureFormat) -> Result<Self> {
        let size = 2048; // 2048x2048 texture atlas

        let texture = device.create_texture(&wgpu::TextureDescriptor {
            label: Some("Text Atlas"),
            size: wgpu::Extent3d {
                width: size,
                height: size,
                depth_or_array_layers: 1,
            },
            mip_level_count: 1,
            sample_count: 1,
            dimension: wgpu::TextureDimension::D2,
            format: wgpu::TextureFormat::Rgba8UnormSrgb,
            usage: wgpu::TextureUsages::TEXTURE_BINDING | wgpu::TextureUsages::COPY_DST,
            view_formats: &[],
        });

        let view = texture.create_view(&wgpu::TextureViewDescriptor::default());

        let sampler = device.create_sampler(&wgpu::SamplerDescriptor {
            label: Some("Text Sampler"),
            address_mode_u: wgpu::AddressMode::ClampToEdge,
            address_mode_v: wgpu::AddressMode::ClampToEdge,
            address_mode_w: wgpu::AddressMode::ClampToEdge,
            mag_filter: wgpu::FilterMode::Linear,
            min_filter: wgpu::FilterMode::Linear,
            mipmap_filter: wgpu::FilterMode::Nearest,
            ..Default::default()
        });

        Ok(Self {
            texture,
            view,
            sampler,
            size,
            next_x: 0,
            next_y: 0,
            row_height: 0,
        })
    }

    fn add_glyph(
        &mut self,
        _device: &Device,
        queue: &Queue,
        image: &cosmic_text::SwashImage,
    ) -> Result<AtlasPosition> {
        let width = image.placement.width as u32;
        let height = image.placement.height as u32;

        // Check if we need to move to next row
        if self.next_x + width > self.size {
            self.next_x = 0;
            self.next_y += self.row_height;
            self.row_height = 0;
        }

        // Check if atlas is full
        if self.next_y + height > self.size {
            return Err(anyhow::anyhow!("Text atlas is full"));
        }

        // Copy glyph data to texture
        let data: Vec<u8> = image
            .data
            .iter()
            .flat_map(|&alpha| vec![255, 255, 255, alpha])
            .collect();

        queue.write_texture(
            wgpu::ImageCopyTexture {
                texture: &self.texture,
                mip_level: 0,
                origin: wgpu::Origin3d {
                    x: self.next_x,
                    y: self.next_y,
                    z: 0,
                },
                aspect: wgpu::TextureAspect::All,
            },
            &data,
            wgpu::ImageDataLayout {
                offset: 0,
                bytes_per_row: Some(width * 4),
                rows_per_image: Some(height),
            },
            wgpu::Extent3d {
                width,
                height,
                depth_or_array_layers: 1,
            },
        );

        let uv_offset = [
            self.next_x as f32 / self.size as f32,
            self.next_y as f32 / self.size as f32,
        ];

        let uv_size = [
            width as f32 / self.size as f32,
            height as f32 / self.size as f32,
        ];

        // Update position
        self.next_x += width;
        self.row_height = self.row_height.max(height);

        Ok(AtlasPosition { uv_offset, uv_size })
    }
}
