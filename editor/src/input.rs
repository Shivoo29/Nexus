use winit::event::{KeyEvent, ElementState};
use winit::keyboard::{KeyCode, PhysicalKey};
use crate::buffer::Buffer;
use crate::cursor::Cursor;

pub struct InputHandler;

impl InputHandler {
    pub fn new() -> Self {
        Self
    }

    pub fn handle_key_event(&self, event: &KeyEvent, buffer: &mut Buffer, cursor: &mut Cursor) {
        if event.state != ElementState::Pressed {
            return;
        }

        match event.physical_key {
            PhysicalKey::Code(key_code) => {
                match key_code {
                    // Arrow keys
                    KeyCode::ArrowLeft => {
                        cursor.clear_selection();
                        cursor.move_left();
                    }
                    KeyCode::ArrowRight => {
                        cursor.clear_selection();
                        let line = cursor.position.line;
                        let max_col = if line < buffer.line_count() {
                            buffer.line_len(line)
                        } else {
                            0
                        };
                        cursor.move_right(max_col);
                    }
                    KeyCode::ArrowUp => {
                        cursor.clear_selection();
                        cursor.move_up();
                    }
                    KeyCode::ArrowDown => {
                        cursor.clear_selection();
                        cursor.move_down();
                    }

                    // Backspace
                    KeyCode::Backspace => {
                        if cursor.has_selection() {
                            // Delete selection
                            self.delete_selection(buffer, cursor);
                        } else if cursor.position.column > 0 {
                            // Delete character before cursor
                            let pos = self.cursor_to_byte_offset(buffer, cursor);
                            if pos > 0 {
                                buffer.delete_range(pos - 1..pos);
                                cursor.move_left();
                            }
                        } else if cursor.position.line > 0 {
                            // Delete newline - join with previous line
                            let pos = self.cursor_to_byte_offset(buffer, cursor);
                            if pos > 0 {
                                buffer.delete_range(pos - 1..pos);
                                cursor.move_up();
                                // Move to end of previous line
                                let prev_line_len = buffer.line_len(cursor.position.line);
                                cursor.position.column = prev_line_len;
                            }
                        }
                    }

                    // Delete
                    KeyCode::Delete => {
                        if cursor.has_selection() {
                            self.delete_selection(buffer, cursor);
                        } else {
                            let pos = self.cursor_to_byte_offset(buffer, cursor);
                            if pos < buffer.len() {
                                buffer.delete_range(pos..pos + 1);
                            }
                        }
                    }

                    // Enter
                    KeyCode::Enter => {
                        if cursor.has_selection() {
                            self.delete_selection(buffer, cursor);
                        }
                        let pos = self.cursor_to_byte_offset(buffer, cursor);
                        buffer.insert_text(pos, "\n");
                        cursor.position.line += 1;
                        cursor.position.column = 0;
                        cursor.clear_selection();
                    }

                    // Tab
                    KeyCode::Tab => {
                        if cursor.has_selection() {
                            self.delete_selection(buffer, cursor);
                        }
                        let pos = self.cursor_to_byte_offset(buffer, cursor);
                        buffer.insert_text(pos, "    "); // 4 spaces
                        cursor.position.column += 4;
                        cursor.clear_selection();
                    }

                    _ => {}
                }
            }
            _ => {}
        }
    }

    pub fn handle_text_input(&self, text: &str, buffer: &mut Buffer, cursor: &mut Cursor) {
        // Delete selection if any
        if cursor.has_selection() {
            self.delete_selection(buffer, cursor);
        }

        // Insert text at cursor position
        let pos = self.cursor_to_byte_offset(buffer, cursor);
        buffer.insert_text(pos, text);

        // Update cursor position
        for ch in text.chars() {
            if ch == '\n' {
                cursor.position.line += 1;
                cursor.position.column = 0;
            } else {
                cursor.position.column += 1;
            }
        }

        cursor.clear_selection();
    }

    fn delete_selection(&self, buffer: &mut Buffer, cursor: &mut Cursor) {
        if let Some(ref selection) = cursor.selection {
            let start = self.position_to_byte_offset(buffer, &selection.start);
            let end = self.position_to_byte_offset(buffer, &selection.end);

            let (start, end) = if start <= end {
                (start, end)
            } else {
                (end, start)
            };

            buffer.delete_range(start..end);

            // Move cursor to start of selection
            cursor.position = if selection.start <= selection.end {
                selection.start.clone()
            } else {
                selection.end.clone()
            };

            cursor.clear_selection();
        }
    }

    fn cursor_to_byte_offset(&self, buffer: &Buffer, cursor: &Cursor) -> usize {
        self.position_to_byte_offset(buffer, &cursor.position)
    }

    fn position_to_byte_offset(&self, buffer: &Buffer, pos: &crate::cursor::Position) -> usize {
        buffer.position_to_offset(pos.line, pos.column)
    }
}

impl Default for InputHandler {
    fn default() -> Self {
        Self::new()
    }
}
