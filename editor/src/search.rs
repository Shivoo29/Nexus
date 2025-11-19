use crate::buffer::Buffer;
use crate::cursor::{Cursor, Position};

#[derive(Debug, Clone)]
pub struct SearchMatch {
    pub start_line: usize,
    pub start_column: usize,
    pub end_line: usize,
    pub end_column: usize,
    pub start_offset: usize,
    pub end_offset: usize,
}

pub struct SearchState {
    pub query: String,
    pub replace_text: String,
    pub is_active: bool,
    pub is_replace_mode: bool,
    pub matches: Vec<SearchMatch>,
    pub current_match_index: Option<usize>,
    pub case_sensitive: bool,
    pub use_regex: bool,
}

impl SearchState {
    pub fn new() -> Self {
        Self {
            query: String::new(),
            replace_text: String::new(),
            is_active: false,
            is_replace_mode: false,
            matches: Vec::new(),
            current_match_index: None,
            case_sensitive: false,
            use_regex: false,
        }
    }

    pub fn activate(&mut self) {
        self.is_active = true;
        self.query.clear();
        self.replace_text.clear();
        self.matches.clear();
        self.current_match_index = None;
    }

    pub fn deactivate(&mut self) {
        self.is_active = false;
        self.query.clear();
        self.replace_text.clear();
        self.matches.clear();
        self.current_match_index = None;
    }

    pub fn toggle_replace_mode(&mut self) {
        self.is_replace_mode = !self.is_replace_mode;
    }

    pub fn update_query(&mut self, query: String, buffer: &Buffer) {
        self.query = query;
        self.find_all_matches(buffer);
    }

    pub fn find_all_matches(&mut self, buffer: &Buffer) {
        self.matches.clear();
        self.current_match_index = None;

        if self.query.is_empty() {
            return;
        }

        let text = buffer.text();
        let search_text = if self.case_sensitive {
            text.clone()
        } else {
            text.to_lowercase()
        };

        let query = if self.case_sensitive {
            self.query.clone()
        } else {
            self.query.to_lowercase()
        };

        let mut start = 0;
        while let Some(pos) = search_text[start..].find(&query) {
            let absolute_pos = start + pos;
            let end_pos = absolute_pos + query.len();

            // Convert byte offsets to line/column positions
            let (start_line, start_column) = buffer.offset_to_position(absolute_pos);
            let (end_line, end_column) = buffer.offset_to_position(end_pos);

            self.matches.push(SearchMatch {
                start_line,
                start_column,
                end_line,
                end_column,
                start_offset: absolute_pos,
                end_offset: end_pos,
            });

            start = end_pos;
        }

        // Set current match to first one if any matches found
        if !self.matches.is_empty() {
            self.current_match_index = Some(0);
        }
    }

    pub fn find_next(&mut self) {
        if self.matches.is_empty() {
            return;
        }

        self.current_match_index = Some(match self.current_match_index {
            Some(idx) => (idx + 1) % self.matches.len(),
            None => 0,
        });
    }

    pub fn find_previous(&mut self) {
        if self.matches.is_empty() {
            return;
        }

        self.current_match_index = Some(match self.current_match_index {
            Some(idx) => {
                if idx == 0 {
                    self.matches.len() - 1
                } else {
                    idx - 1
                }
            }
            None => 0,
        });
    }

    pub fn current_match(&self) -> Option<&SearchMatch> {
        if let Some(idx) = self.current_match_index {
            self.matches.get(idx)
        } else {
            None
        }
    }

    pub fn replace_current(&mut self, buffer: &mut Buffer, cursor: &mut Cursor) -> bool {
        if let Some(match_item) = self.current_match() {
            let start_offset = match_item.start_offset;
            let end_offset = match_item.end_offset;

            // Delete the matched text
            buffer.delete_range(start_offset..end_offset);

            // Insert replacement text
            buffer.insert_text(start_offset, &self.replace_text);

            // Update cursor position
            cursor.position = Position {
                line: match_item.start_line,
                column: match_item.start_column + self.replace_text.len(),
            };
            cursor.clear_selection();

            // Re-find matches since buffer changed
            self.find_all_matches(buffer);

            // Move to next match if available
            if !self.matches.is_empty() {
                self.current_match_index = Some(0);
            }

            true
        } else {
            false
        }
    }

    pub fn replace_all(&mut self, buffer: &mut Buffer) -> usize {
        let mut replacements = 0;
        let matches = self.matches.clone();

        // Replace from end to beginning to maintain offsets
        for match_item in matches.iter().rev() {
            buffer.delete_range(match_item.start_offset..match_item.end_offset);
            buffer.insert_text(match_item.start_offset, &self.replace_text);
            replacements += 1;
        }

        // Re-find matches
        self.find_all_matches(buffer);

        replacements
    }

    pub fn match_count(&self) -> usize {
        self.matches.len()
    }
}

impl Default for SearchState {
    fn default() -> Self {
        Self::new()
    }
}
