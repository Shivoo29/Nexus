// Vertex shader for text rendering

struct VertexInput {
    @location(0) position: vec2<f32>,
}

struct InstanceInput {
    @location(1) glyph_position: vec2<f32>,
    @location(2) glyph_size: vec2<f32>,
    @location(3) uv_offset: vec2<f32>,
    @location(4) uv_size: vec2<f32>,
    @location(5) color: vec4<f32>,
}

struct VertexOutput {
    @builtin(position) clip_position: vec4<f32>,
    @location(0) tex_coords: vec2<f32>,
    @location(1) color: vec4<f32>,
}

struct Uniforms {
    view_proj: mat4x4<f32>,
}

@group(0) @binding(0)
var<uniform> uniforms: Uniforms;

@vertex
fn vs_main(
    vertex: VertexInput,
    instance: InstanceInput,
) -> VertexOutput {
    var out: VertexOutput;

    // Calculate world position
    let world_pos = vec2<f32>(
        instance.glyph_position.x + vertex.position.x * instance.glyph_size.x,
        instance.glyph_position.y + vertex.position.y * instance.glyph_size.y,
    );

    // Apply projection
    out.clip_position = uniforms.view_proj * vec4<f32>(world_pos, 0.0, 1.0);

    // Calculate texture coordinates
    out.tex_coords = instance.uv_offset + vertex.position * instance.uv_size;
    out.color = instance.color;

    return out;
}

// Fragment shader for text rendering

@group(0) @binding(1)
var t_atlas: texture_2d<f32>;

@group(0) @binding(2)
var s_atlas: sampler;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    let alpha = textureSample(t_atlas, s_atlas, in.tex_coords).a;
    return vec4<f32>(in.color.rgb, in.color.a * alpha);
}
