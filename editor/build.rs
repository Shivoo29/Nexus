fn main() {
    // Build script for platform-specific setup
    println!("cargo:rerun-if-changed=build.rs");

    #[cfg(target_os = "windows")]
    {
        // Windows-specific build configuration
        println!("cargo:rustc-link-arg=/SUBSYSTEM:WINDOWS");
        println!("cargo:rustc-link-arg=/ENTRY:mainCRTStartup");
    }

    #[cfg(target_os = "macos")]
    {
        // macOS-specific build configuration
        println!("cargo:rustc-link-lib=framework=Metal");
        println!("cargo:rustc-link-lib=framework=MetalKit");
        println!("cargo:rustc-link-lib=framework=Foundation");
    }

    #[cfg(target_os = "linux")]
    {
        // Linux-specific build configuration
        println!("cargo:rustc-link-lib=X11");
        println!("cargo:rustc-link-lib=vulkan");
    }
}
