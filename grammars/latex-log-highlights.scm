(error) @invalid.illegal.log.latex
(warn) @invalid.deprecated.log.latex
(info) @comment.block.documentation.log.latex
(number) @constant.numeric.log.latex
(string_literal) @string.quoted.log.latex
(year_month_day) @constant.other.date.log.latex
(time) @constant.other.time.log.latex

((word) @keyword.control.hyphenation.log.latex
  (#match? @keyword.control.hyphenation.log.latex "^(?:Overfull|Underfull)$"))
