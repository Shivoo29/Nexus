; Keywords
[
  "as"
  "async"
  "await"
  "break"
  "const"
  "continue"
  "else"
  "enum"
  "fn"
  "for"
  "if"
  "impl"
  "in"
  "let"
  "loop"
  "match"
  "mod"
  "move"
  "mut"
  "pub"
  "ref"
  "return"
  "static"
  "struct"
  "trait"
  "type"
  "unsafe"
  "use"
  "where"
  "while"
] @keyword

; Functions
(function_item name: (identifier) @function)
(call_expression function: (identifier) @function.call)
(call_expression function: (field_expression field: (field_identifier) @function.call))

; Types
(type_identifier) @type
(primitive_type) @type.builtin

; Strings
(string_literal) @string
(char_literal) @string

; Numbers
(integer_literal) @number
(float_literal) @number

; Comments
(line_comment) @comment
(block_comment) @comment

; Constants
(boolean_literal) @constant.builtin
((identifier) @constant (#match? @constant "^[A-Z][A-Z\\d_]*$"))

; Parameters
(parameter (identifier) @parameter)

; Properties
(field_identifier) @property
