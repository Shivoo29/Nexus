; Keywords
[
  "and"
  "as"
  "assert"
  "async"
  "await"
  "break"
  "class"
  "continue"
  "def"
  "del"
  "elif"
  "else"
  "except"
  "finally"
  "for"
  "from"
  "global"
  "if"
  "import"
  "in"
  "is"
  "lambda"
  "nonlocal"
  "not"
  "or"
  "pass"
  "raise"
  "return"
  "try"
  "while"
  "with"
  "yield"
] @keyword

(function_definition name: (identifier) @function)
(call function: (identifier) @function.call)
(string) @string
(integer) @number
(float) @number
(comment) @comment
(true) @constant.builtin
(false) @constant.builtin
(none) @constant.builtin
