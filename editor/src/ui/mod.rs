// UI module for Nexus Editor
// This will contain UI components like:
// - Command palette
// - File explorer
// - Status bar
// - Tabs
// - Settings panel

pub struct UiState {
    pub file_explorer_open: bool,
    pub command_palette_open: bool,
    pub active_tab: usize,
}

impl Default for UiState {
    fn default() -> Self {
        Self {
            file_explorer_open: true,
            command_palette_open: false,
            active_tab: 0,
        }
    }
}

impl UiState {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn toggle_file_explorer(&mut self) {
        self.file_explorer_open = !self.file_explorer_open;
    }

    pub fn toggle_command_palette(&mut self) {
        self.command_palette_open = !self.command_palette_open;
    }

    pub fn set_active_tab(&mut self, index: usize) {
        self.active_tab = index;
    }
}
