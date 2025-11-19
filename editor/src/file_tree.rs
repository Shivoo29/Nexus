use std::path::{Path, PathBuf};
use std::fs;
use anyhow::Result;

#[derive(Debug, Clone)]
pub struct FileTreeNode {
    pub path: PathBuf,
    pub name: String,
    pub is_dir: bool,
    pub is_expanded: bool,
    pub depth: usize,
}

pub struct FileTree {
    pub nodes: Vec<FileTreeNode>,
    pub selected_index: usize,
    pub is_visible: bool,
    pub root_path: PathBuf,
}

impl FileTree {
    pub fn new(root_path: PathBuf) -> Result<Self> {
        let mut tree = Self {
            nodes: Vec::new(),
            selected_index: 0,
            is_visible: false,
            root_path: root_path.clone(),
        };

        tree.refresh()?;
        Ok(tree)
    }

    pub fn refresh(&mut self) -> Result<()> {
        self.nodes.clear();
        self.scan_directory(&self.root_path.clone(), 0)?;
        Ok(())
    }

    fn scan_directory(&mut self, path: &Path, depth: usize) -> Result<()> {
        if depth > 5 {
            // Limit depth to avoid too deep recursion
            return Ok(());
        }

        let mut entries: Vec<_> = fs::read_dir(path)?
            .filter_map(|e| e.ok())
            .collect();

        // Sort: directories first, then files, alphabetically
        entries.sort_by(|a, b| {
            let a_is_dir = a.path().is_dir();
            let b_is_dir = b.path().is_dir();

            match (a_is_dir, b_is_dir) {
                (true, false) => std::cmp::Ordering::Less,
                (false, true) => std::cmp::Ordering::Greater,
                _ => a.file_name().cmp(&b.file_name()),
            }
        });

        for entry in entries {
            let path = entry.path();
            let name = entry.file_name().to_string_lossy().to_string();

            // Skip hidden files and common ignore patterns
            if name.starts_with('.') || name == "target" || name == "node_modules" {
                continue;
            }

            let is_dir = path.is_dir();

            self.nodes.push(FileTreeNode {
                path: path.clone(),
                name,
                is_dir,
                is_expanded: depth == 0, // Expand only root level by default
                depth,
            });

            // Recursively scan subdirectories if expanded
            if is_dir && depth == 0 {
                self.scan_directory(&path, depth + 1)?;
            }
        }

        Ok(())
    }

    pub fn toggle_visibility(&mut self) {
        self.is_visible = !self.is_visible;
    }

    pub fn move_selection_up(&mut self) {
        if self.selected_index > 0 {
            self.selected_index -= 1;
        }
    }

    pub fn move_selection_down(&mut self) {
        if self.selected_index < self.nodes.len().saturating_sub(1) {
            self.selected_index += 1;
        }
    }

    pub fn toggle_selected_expand(&mut self) -> Result<()> {
        if let Some(node) = self.nodes.get_mut(self.selected_index) {
            if node.is_dir {
                node.is_expanded = !node.is_expanded;
                // Rebuild tree to show/hide children
                let selected_path = node.path.clone();
                self.refresh()?;
                // Try to restore selection
                if let Some(idx) = self.nodes.iter().position(|n| n.path == selected_path) {
                    self.selected_index = idx;
                }
            }
        }
        Ok(())
    }

    pub fn get_selected_path(&self) -> Option<&Path> {
        self.nodes.get(self.selected_index).map(|n| n.path.as_path())
    }

    pub fn get_selected_node(&self) -> Option<&FileTreeNode> {
        self.nodes.get(self.selected_index)
    }

    pub fn render_text(&self) -> String {
        let mut text = String::new();
        text.push_str("File Explorer\n");
        text.push_str("─".repeat(30).as_str());
        text.push('\n');

        for (idx, node) in self.nodes.iter().enumerate() {
            let indent = "  ".repeat(node.depth);
            let marker = if idx == self.selected_index { ">" } else { " " };
            let icon = if node.is_dir {
                if node.is_expanded { "📂" } else { "📁" }
            } else {
                "📄"
            };

            text.push_str(&format!("{} {}{} {}\n", marker, indent, icon, node.name));
        }

        text
    }
}
