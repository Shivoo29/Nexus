#!/bin/bash
# Build Nexus for macOS (Intel and Apple Silicon)

set -e

echo "🍎 Building Nexus for macOS..."

# Install targets if not present
rustup target add x86_64-apple-darwin
rustup target add aarch64-apple-darwin

# Get version
VERSION=$(grep "^version" Cargo.toml | sed 's/version = "\(.*\)"/\1/')

# Create dist directory
mkdir -p dist

# Build for Intel
echo "Building for Intel (x86_64)..."
cargo build --release --target x86_64-apple-darwin
cp target/x86_64-apple-darwin/release/nexus-editor dist/nexus-$VERSION-macos-intel

# Build for Apple Silicon
echo "Building for Apple Silicon (aarch64)..."
cargo build --release --target aarch64-apple-darwin
cp target/aarch64-apple-darwin/release/nexus-editor dist/nexus-$VERSION-macos-arm

# Create universal binary
echo "Creating universal binary..."
lipo -create \
    dist/nexus-$VERSION-macos-intel \
    dist/nexus-$VERSION-macos-arm \
    -output dist/nexus-$VERSION-macos-universal

echo "✅ macOS builds complete!"
echo "📦 Intel:     dist/nexus-$VERSION-macos-intel"
echo "📦 ARM:       dist/nexus-$VERSION-macos-arm"
echo "📦 Universal: dist/nexus-$VERSION-macos-universal"
