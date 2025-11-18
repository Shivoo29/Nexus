#!/bin/bash
# Cross-compile Nexus for Windows

set -e

echo "🪟 Building Nexus for Windows..."

# Install target if not present
rustup target add x86_64-pc-windows-gnu

# Build
cargo build --release --target x86_64-pc-windows-gnu

# Get version
VERSION=$(grep "^version" Cargo.toml | sed 's/version = "\(.*\)"/\1/')

# Create dist directory
mkdir -p dist

# Copy binary
cp target/x86_64-pc-windows-gnu/release/nexus-editor.exe dist/nexus-$VERSION-windows.exe

echo "✅ Windows build complete!"
echo "📦 Binary: dist/nexus-$VERSION-windows.exe"
