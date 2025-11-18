#!/bin/bash
# Build Nexus for all platforms

set -e

echo "🦀 Building Nexus for all platforms..."

# Get version from Cargo.toml
VERSION=$(grep "^version" Cargo.toml | sed 's/version = "\(.*\)"/\1/')
echo "📦 Version: $VERSION"

# Create dist directory
mkdir -p dist

# Build for current platform
echo ""
echo "🔨 Building for current platform..."
cargo build --release

# Detect current platform
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    PLATFORM="linux"
    EXT=""
elif [[ "$OSTYPE" == "darwin"* ]]; then
    PLATFORM="macos"
    EXT=""
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    PLATFORM="windows"
    EXT=".exe"
fi

echo "✅ Built for $PLATFORM"

# Copy binary to dist
cp target/release/nexus-editor$EXT dist/nexus-$VERSION-$PLATFORM$EXT

echo ""
echo "✅ Build complete!"
echo "📦 Binary location: dist/nexus-$VERSION-$PLATFORM$EXT"
echo ""
echo "To build for other platforms, use:"
echo "  ./scripts/build-windows.sh"
echo "  ./scripts/build-macos.sh"
echo "  ./scripts/build-linux.sh"
