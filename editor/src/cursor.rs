use std::ops::Range;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct Position {
    pub line: usize,
    pub column: usize,
}

impl Position {
    pub fn new(line: usize, column: usize) -> Self {
        Self { line, column }
    }

    pub fn zero() -> Self {
        Self { line: 0, column: 0 }
    }
}

#[derive(Debug, Clone)]
pub struct Cursor {
    pub position: Position,
    pub selection: Option<Range<Position>>,
    pub blink_state: bool,
    pub blink_timer: f32,
}

impl Cursor {
    pub fn new() -> Self {
        Self {
            position: Position::zero(),
            selection: None,
            blink_state: true,
            blink_timer: 0.0,
        }
    }

    pub fn move_to(&mut self, position: Position) {
        self.position = position;
        self.reset_blink();
    }

    pub fn move_left(&mut self) {
        if self.position.column > 0 {
            self.position.column -= 1;
        } else if self.position.line > 0 {
            self.position.line -= 1;
            // Would need buffer to know line length
            // For now, just move to beginning
            self.position.column = 0;
        }
        self.reset_blink();
    }

    pub fn move_right(&mut self, max_column: usize) {
        self.position.column += 1;
        if self.position.column > max_column {
            self.position.column = 0;
            self.position.line += 1;
        }
        self.reset_blink();
    }

    pub fn move_up(&mut self) {
        if self.position.line > 0 {
            self.position.line -= 1;
        }
        self.reset_blink();
    }

    pub fn move_down(&mut self) {
        self.position.line += 1;
        self.reset_blink();
    }

    pub fn start_selection(&mut self) {
        self.selection = Some(self.position..self.position);
    }

    pub fn clear_selection(&mut self) {
        self.selection = None;
    }

    pub fn update_selection(&mut self, position: Position) {
        if let Some(ref mut selection) = self.selection {
            selection.end = position;
        }
    }

    pub fn has_selection(&self) -> bool {
        self.selection.is_some()
    }

    pub fn update_blink(&mut self, delta_time: f32) {
        self.blink_timer += delta_time;
        if self.blink_timer >= 0.5 {
            self.blink_state = !self.blink_state;
            self.blink_timer = 0.0;
        }
    }

    pub fn reset_blink(&mut self) {
        self.blink_state = true;
        self.blink_timer = 0.0;
    }

    pub fn should_draw(&self) -> bool {
        self.blink_state
    }
}

impl Default for Cursor {
    fn default() -> Self {
        Self::new()
    }
}

impl PartialOrd for Position {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.cmp(other))
    }
}

impl Ord for Position {
    fn cmp(&self, other: &Self) -> std::cmp::Ordering {
        match self.line.cmp(&other.line) {
            std::cmp::Ordering::Equal => self.column.cmp(&other.column),
            other => other,
        }
    }
}
