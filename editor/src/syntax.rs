use anyhow::Result;
use tree_sitter::{Language, Parser, Query, QueryCursor};

extern "C" {
    fn tree_sitter_rust() -> Language;
    fn tree_sitter_javascript() -> Language;
    fn tree_sitter_typescript() -> Language;
    fn tree_sitter_python() -> Language;
}

#[derive(Debug, Clone, Copy, PartialEq)]
pub enum TokenType {
    Keyword,
    Function,
    Type,
    String,
    Number,
    Comment,
    Operator,
    Variable,
    Property,
    Parameter,
    Constant,
    Normal,
}

impl TokenType {
    pub fn color(&self) -> [f32; 4] {
        match self {
            TokenType::Keyword => [0.86, 0.20, 0.18, 1.0],      // Red
            TokenType::Function => [0.38, 0.51, 0.71, 1.0],     // Blue
            TokenType::Type => [0.27, 0.52, 0.53, 1.0],         // Cyan
            TokenType::String => [0.60, 0.76, 0.29, 1.0],       // Green
            TokenType::Number => [0.83, 0.60, 0.45, 1.0],       // Orange
            TokenType::Comment => [0.50, 0.50, 0.50, 1.0],      // Gray
            TokenType::Operator => [0.80, 0.80, 0.80, 1.0],     // Light gray
            TokenType::Variable => [0.90, 0.90, 0.90, 1.0],     // White
            TokenType::Property => [0.78, 0.67, 0.84, 1.0],     // Purple
            TokenType::Parameter => [0.85, 0.85, 0.70, 1.0],    // Yellow-ish
            TokenType::Constant => [0.83, 0.60, 0.45, 1.0],     // Orange
            TokenType::Normal => [1.0, 1.0, 1.0, 1.0],          // White
        }
    }
}

#[derive(Debug, Clone)]
pub struct Token {
    pub start: usize,
    pub end: usize,
    pub token_type: TokenType,
}

pub struct SyntaxHighlighter {
    parser: Parser,
    language: Language,
    query: Option<Query>,
}

impl SyntaxHighlighter {
    pub fn new(file_extension: &str) -> Result<Self> {
        let mut parser = Parser::new();

        let language = unsafe {
            match file_extension {
                "rs" => tree_sitter_rust(),
                "js" | "jsx" => tree_sitter_javascript(),
                "ts" | "tsx" => tree_sitter_typescript(),
                "py" => tree_sitter_python(),
                _ => tree_sitter_rust(), // Default to Rust
            }
        };

        parser.set_language(language)?;

        // Create highlighting query based on language
        let query_source = match file_extension {
            "rs" => include_str!("../queries/rust.scm"),
            "js" | "jsx" => include_str!("../queries/javascript.scm"),
            "ts" | "tsx" => include_str!("../queries/typescript.scm"),
            "py" => include_str!("../queries/python.scm"),
            _ => include_str!("../queries/rust.scm"),
        };

        let query = Query::new(language, query_source).ok();

        Ok(Self {
            parser,
            language,
            query,
        })
    }

    pub fn highlight(&mut self, source_code: &str) -> Vec<Token> {
        let tree = match self.parser.parse(source_code, None) {
            Some(tree) => tree,
            None => return vec![],
        };

        let mut tokens = Vec::new();

        if let Some(ref query) = self.query {
            let mut cursor = QueryCursor::new();
            let captures = cursor.captures(query, tree.root_node(), source_code.as_bytes());

            for (match_item, capture_index) in captures {
                let capture = match_item.captures[capture_index];
                let capture_name = &query.capture_names()[capture.index as usize];

                let token_type = match capture_name.as_str() {
                    "keyword" => TokenType::Keyword,
                    "function" | "function.call" => TokenType::Function,
                    "type" | "type.builtin" => TokenType::Type,
                    "string" => TokenType::String,
                    "number" => TokenType::Number,
                    "comment" => TokenType::Comment,
                    "operator" => TokenType::Operator,
                    "variable" => TokenType::Variable,
                    "property" => TokenType::Property,
                    "parameter" => TokenType::Parameter,
                    "constant" | "constant.builtin" => TokenType::Constant,
                    _ => TokenType::Normal,
                };

                tokens.push(Token {
                    start: capture.node.start_byte(),
                    end: capture.node.end_byte(),
                    token_type,
                });
            }
        }

        tokens.sort_by_key(|t| t.start);
        tokens
    }

    pub fn get_color_at_offset(&self, offset: usize, tokens: &[Token]) -> [f32; 4] {
        for token in tokens {
            if offset >= token.start && offset < token.end {
                return token.token_type.color();
            }
        }
        TokenType::Normal.color()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_rust_highlighting() {
        let mut highlighter = SyntaxHighlighter::new("rs").unwrap();
        let source = "fn main() { println!(\"Hello\"); }";
        let tokens = highlighter.highlight(source);
        assert!(!tokens.is_empty());
    }
}
