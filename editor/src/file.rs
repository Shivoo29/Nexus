use anyhow::Result;
use std::path::{Path, PathBuf};
use std::fs;
use crate::buffer::Buffer;

pub struct FileManager {
    current_file: Option<PathBuf>,
    is_modified: bool,
}

impl FileManager {
    pub fn new() -> Self {
        Self {
            current_file: None,
            is_modified: false,
        }
    }

    /// Open a file and load its contents into the buffer
    pub fn open(&mut self, path: impl AsRef<Path>, buffer: &mut Buffer) -> Result<()> {
        let path = path.as_ref();
        let content = fs::read_to_string(path)?;

        // Create new buffer from file content
        *buffer = Buffer::from_text(&content);

        self.current_file = Some(path.to_path_buf());
        self.is_modified = false;

        log::info!("📂 Opened file: {}", path.display());
        Ok(())
    }

    /// Save the current buffer to the current file
    pub fn save(&mut self, buffer: &Buffer) -> Result<()> {
        if let Some(path) = self.current_file.clone() {
            self.save_as(&path, buffer)?;
            Ok(())
        } else {
            Err(anyhow::anyhow!("No file currently open. Use save_as instead."))
        }
    }

    /// Save the buffer to a specific path
    pub fn save_as(&mut self, path: impl AsRef<Path>, buffer: &Buffer) -> Result<()> {
        let path = path.as_ref();
        let content = buffer.text();

        // Create parent directories if they don't exist
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent)?;
        }

        fs::write(path, content)?;

        self.current_file = Some(path.to_path_buf());
        self.is_modified = false;

        log::info!("💾 Saved file: {}", path.display());
        Ok(())
    }

    /// Check if the current file has been modified
    pub fn is_modified(&self) -> bool {
        self.is_modified
    }

    /// Mark the file as modified
    pub fn set_modified(&mut self, modified: bool) {
        self.is_modified = modified;
    }

    /// Get the current file path
    pub fn current_file(&self) -> Option<&Path> {
        self.current_file.as_deref()
    }

    /// Get the current file name
    pub fn current_file_name(&self) -> Option<&str> {
        self.current_file
            .as_ref()
            .and_then(|p| p.file_name())
            .and_then(|n| n.to_str())
    }

    /// Close the current file
    pub fn close(&mut self) {
        self.current_file = None;
        self.is_modified = false;
    }

    /// Create a new empty file
    pub fn new_file(&mut self, buffer: &mut Buffer) {
        *buffer = Buffer::new();
        self.current_file = None;
        self.is_modified = false;
        log::info!("📄 Created new file");
    }
}

impl Default for FileManager {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::fs;
    use std::path::PathBuf;

    #[test]
    fn test_save_and_open() {
        let temp_dir = std::env::temp_dir();
        let test_file = temp_dir.join("nexus_test.txt");

        // Clean up if exists
        let _ = fs::remove_file(&test_file);

        let mut file_manager = FileManager::new();
        let mut buffer = Buffer::from_text("Hello, Nexus!");

        // Save
        file_manager.save_as(&test_file, &buffer).unwrap();
        assert_eq!(file_manager.current_file(), Some(test_file.as_path()));
        assert!(!file_manager.is_modified());

        // Open
        let mut buffer2 = Buffer::new();
        file_manager.open(&test_file, &mut buffer2).unwrap();
        assert_eq!(buffer2.text(), "Hello, Nexus!");

        // Clean up
        let _ = fs::remove_file(&test_file);
    }

    #[test]
    fn test_modified_flag() {
        let mut file_manager = FileManager::new();
        assert!(!file_manager.is_modified());

        file_manager.set_modified(true);
        assert!(file_manager.is_modified());

        file_manager.set_modified(false);
        assert!(!file_manager.is_modified());
    }
}
