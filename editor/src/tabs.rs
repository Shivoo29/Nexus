use crate::buffer::Buffer;
use crate::cursor::Cursor;
use std::path::PathBuf;

#[derive(Debug)]
pub struct Tab {
    pub buffer: Buffer,
    pub cursor: Cursor,
    pub file_path: Option<PathBuf>,
    pub is_modified: bool,
    pub title: String,
}

impl Tab {
    pub fn new(title: String) -> Self {
        Self {
            buffer: Buffer::new(),
            cursor: Cursor::new(),
            file_path: None,
            is_modified: false,
            title,
        }
    }

    pub fn from_file(path: PathBuf, content: String) -> Self {
        let mut buffer = Buffer::new();
        buffer.insert_text(0, &content);

        let title = path
            .file_name()
            .and_then(|n| n.to_str())
            .unwrap_or("Untitled")
            .to_string();

        Self {
            buffer,
            cursor: Cursor::new(),
            file_path: Some(path),
            is_modified: false,
            title,
        }
    }

    pub fn display_title(&self) -> String {
        if self.is_modified {
            format!("{}*", self.title)
        } else {
            self.title.clone()
        }
    }
}

pub struct TabManager {
    tabs: Vec<Tab>,
    active_index: usize,
}

impl TabManager {
    pub fn new() -> Self {
        // Start with one untitled tab
        let mut tabs = Vec::new();
        tabs.push(Tab::new("Untitled".to_string()));

        Self {
            tabs,
            active_index: 0,
        }
    }

    pub fn add_tab(&mut self, tab: Tab) {
        self.tabs.push(tab);
        self.active_index = self.tabs.len() - 1;
    }

    pub fn close_tab(&mut self, index: usize) -> bool {
        if self.tabs.len() <= 1 {
            // Don't close the last tab
            return false;
        }

        if index < self.tabs.len() {
            self.tabs.remove(index);

            // Adjust active index
            if self.active_index >= self.tabs.len() {
                self.active_index = self.tabs.len() - 1;
            } else if self.active_index > index {
                self.active_index -= 1;
            }

            true
        } else {
            false
        }
    }

    pub fn close_active_tab(&mut self) -> bool {
        self.close_tab(self.active_index)
    }

    pub fn switch_to_tab(&mut self, index: usize) {
        if index < self.tabs.len() {
            self.active_index = index;
        }
    }

    pub fn next_tab(&mut self) {
        self.active_index = (self.active_index + 1) % self.tabs.len();
    }

    pub fn previous_tab(&mut self) {
        if self.active_index == 0 {
            self.active_index = self.tabs.len() - 1;
        } else {
            self.active_index -= 1;
        }
    }

    pub fn active_tab(&self) -> &Tab {
        &self.tabs[self.active_index]
    }

    pub fn active_tab_mut(&mut self) -> &mut Tab {
        &mut self.tabs[self.active_index]
    }

    pub fn tabs(&self) -> &[Tab] {
        &self.tabs
    }

    pub fn active_index(&self) -> usize {
        self.active_index
    }

    pub fn tab_count(&self) -> usize {
        self.tabs.len()
    }
}

impl Default for TabManager {
    fn default() -> Self {
        Self::new()
    }
}
