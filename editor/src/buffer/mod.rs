use ropey::Rope;
use std::ops::Range;

/// Text buffer using rope data structure for efficient editing
pub struct Buffer {
    rope: Rope,
    version: usize,
    undo_stack: Vec<Change>,
    redo_stack: Vec<Change>,
}

#[derive(Debug, Clone)]
pub struct Change {
    pub start: usize,
    pub end: usize,
    pub text: String,
}

impl Buffer {
    /// Create a new empty buffer
    pub fn new() -> Self {
        Self {
            rope: Rope::new(),
            version: 0,
            undo_stack: Vec::new(),
            redo_stack: Vec::new(),
        }
    }

    /// Create buffer from text
    pub fn from_text(text: &str) -> Self {
        Self {
            rope: Rope::from_str(text),
            version: 0,
            undo_stack: Vec::new(),
            redo_stack: Vec::new(),
        }
    }

    /// Get buffer length in bytes
    pub fn len(&self) -> usize {
        self.rope.len_bytes()
    }

    /// Check if buffer is empty
    pub fn is_empty(&self) -> bool {
        self.rope.len_bytes() == 0
    }

    /// Get number of lines
    pub fn line_count(&self) -> usize {
        self.rope.len_lines()
    }

    /// Get text as string
    pub fn text(&self) -> String {
        self.rope.to_string()
    }

    /// Get text in range
    pub fn text_range(&self, range: Range<usize>) -> String {
        self.rope.slice(range.start..range.end).to_string()
    }

    /// Get line text
    pub fn line(&self, line_idx: usize) -> String {
        if line_idx >= self.line_count() {
            return String::new();
        }
        let start = self.rope.line_to_char(line_idx);
        let end = if line_idx + 1 < self.line_count() {
            self.rope.line_to_char(line_idx + 1)
        } else {
            self.rope.len_chars()
        };
        self.rope.slice(start..end).to_string()
    }

    /// Insert text at position
    pub fn insert_text(&mut self, pos: usize, text: &str) {
        if pos > self.len() {
            log::warn!("Insert position {} beyond buffer length {}", pos, self.len());
            return;
        }

        // Save change for undo
        let change = Change {
            start: pos,
            end: pos,
            text: text.to_string(),
        };
        self.undo_stack.push(change);
        self.redo_stack.clear();

        // Insert text
        self.rope.insert(pos, text);
        self.version += 1;

        log::debug!("Inserted {} bytes at position {}", text.len(), pos);
    }

    /// Delete range
    pub fn delete_range(&mut self, range: Range<usize>) {
        if range.end > self.len() {
            log::warn!("Delete range {:?} beyond buffer length {}", range, self.len());
            return;
        }

        // Save change for undo
        let deleted_text = self.text_range(range.clone());
        let change = Change {
            start: range.start,
            end: range.end,
            text: deleted_text,
        };
        self.undo_stack.push(change);
        self.redo_stack.clear();

        // Delete range
        self.rope.remove(range);
        self.version += 1;

        log::debug!("Deleted range {:?}", range);
    }

    /// Undo last change
    pub fn undo(&mut self) -> bool {
        if let Some(change) = self.undo_stack.pop() {
            // Reverse the change
            if change.start == change.end {
                // Was an insert, so delete
                self.rope.remove(change.start..change.start + change.text.len());
            } else {
                // Was a delete, so insert
                self.rope.insert(change.start, &change.text);
            }
            self.redo_stack.push(change);
            self.version += 1;
            true
        } else {
            false
        }
    }

    /// Redo last undone change
    pub fn redo(&mut self) -> bool {
        if let Some(change) = self.redo_stack.pop() {
            if change.start == change.end {
                // Redo insert
                self.rope.insert(change.start, &change.text);
            } else {
                // Redo delete
                self.rope.remove(change.start..change.end);
            }
            self.undo_stack.push(change);
            self.version += 1;
            true
        } else {
            false
        }
    }

    /// Get current version (for change tracking)
    pub fn version(&self) -> usize {
        self.version
    }

    /// Convert byte offset to line and column
    pub fn offset_to_position(&self, offset: usize) -> (usize, usize) {
        let line = self.rope.byte_to_line(offset);
        let line_start = self.rope.line_to_byte(line);
        let col = offset - line_start;
        (line, col)
    }

    /// Convert line and column to byte offset
    pub fn position_to_offset(&self, line: usize, col: usize) -> usize {
        if line >= self.line_count() {
            return self.len();
        }
        let line_start = self.rope.line_to_byte(line);
        let line_len = self.rope.line(line).len_bytes();
        line_start + col.min(line_len)
    }
}

impl Default for Buffer {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_buffer_creation() {
        let buffer = Buffer::new();
        assert_eq!(buffer.len(), 0);
        assert!(buffer.is_empty());
    }

    #[test]
    fn test_insert_text() {
        let mut buffer = Buffer::new();
        buffer.insert_text(0, "Hello, World!");
        assert_eq!(buffer.text(), "Hello, World!");
        assert_eq!(buffer.len(), 13);
    }

    #[test]
    fn test_delete_range() {
        let mut buffer = Buffer::from_text("Hello, World!");
        buffer.delete_range(7..12);
        assert_eq!(buffer.text(), "Hello, !");
    }

    #[test]
    fn test_undo_redo() {
        let mut buffer = Buffer::new();
        buffer.insert_text(0, "Hello");
        buffer.insert_text(5, " World");

        assert_eq!(buffer.text(), "Hello World");

        buffer.undo();
        assert_eq!(buffer.text(), "Hello");

        buffer.redo();
        assert_eq!(buffer.text(), "Hello World");
    }

    #[test]
    fn test_line_operations() {
        let buffer = Buffer::from_text("Line 1\nLine 2\nLine 3");
        assert_eq!(buffer.line_count(), 3);
        assert_eq!(buffer.line(0), "Line 1\n");
        assert_eq!(buffer.line(1), "Line 2\n");
        assert_eq!(buffer.line(2), "Line 3");
    }
}
