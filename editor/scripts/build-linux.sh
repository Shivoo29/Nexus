#!/bin/bash
# Build Nexus for Linux

set -e

echo "🐧 Building Nexus for Linux..."

# Build
cargo build --release --target x86_64-unknown-linux-gnu

# Get version
VERSION=$(grep "^version" Cargo.toml | sed 's/version = "\(.*\)"/\1/')

# Create dist directory
mkdir -p dist

# Copy binary
cp target/x86_64-unknown-linux-gnu/release/nexus-editor dist/nexus-$VERSION-linux

# Make AppImage (optional)
if command -v appimagetool &> /dev/null; then
    echo "Creating AppImage..."

    mkdir -p dist/AppDir/usr/bin
    cp dist/nexus-$VERSION-linux dist/AppDir/usr/bin/nexus-editor

    # Create desktop file
    cat > dist/AppDir/nexus.desktop <<EOF
[Desktop Entry]
Type=Application
Name=Nexus
Comment=AI-Native Code Editor
Exec=nexus-editor
Icon=nexus
Categories=Development;IDE;
Terminal=false
EOF

    appimagetool dist/AppDir dist/nexus-$VERSION-linux.AppImage
    echo "✅ AppImage created: dist/nexus-$VERSION-linux.AppImage"
fi

echo "✅ Linux build complete!"
echo "📦 Binary: dist/nexus-$VERSION-linux"
