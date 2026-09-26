; Diagnostics. Match only TeX's line-oriented message forms so control sequence
; names such as \GenericError and \GenericWarning remain ordinary text.
((line) @invalid.illegal.log.latex
  (#match? @invalid.illegal.log.latex "^\\s*!")
  (#set! adjust.startAndEndAroundFirstMatchOf "^\\s*!"))

((line) @invalid.illegal.log.latex
  (#match? @invalid.illegal.log.latex "(?:^(?:\\s*!.*\\bError:|(?:LaTeX(?: Font| Encoding)?|Package \\S+|Class \\S+) Error:)|\\bEmergency stop\\b|\\bFatal error\\b)")
  (#set! adjust.startAndEndAroundFirstMatchOf "(?:\\bError(?=:)|\\bEmergency stop\\b|\\bFatal error\\b)"))

((line) @invalid.illegal.log.latex
  (#match? @invalid.illegal.log.latex "^\\s*[^\\s:]+\\.tex:[0-9]+:")
  (#set! adjust.startAndEndAroundFirstMatchOf "^\\s*[^\\s:]+\\.tex:[0-9]+:"))

((line) @invalid.deprecated.log.latex
  (#match? @invalid.deprecated.log.latex "(?:^\\s*(?:Overfull|Underfull)|^(?:LaTeX(?: Font| Encoding)?|Package \\S+|Class \\S+) Warning:|^pdfTeX warning:?)")
  (#set! adjust.startAndEndAroundFirstMatchOf "\\b(?:Overfull|Underfull|Warning|warning)\\b"))

((line) @keyword.control.hyphenation.log.latex
  (#match? @keyword.control.hyphenation.log.latex "^\\s*(?:Overfull|Underfull)\\b")
  (#set! adjust.startAndEndAroundFirstMatchOf "\\b(?:Overfull|Underfull)\\b"))

((line) @comment.block.documentation.log.latex
  (#match? @comment.block.documentation.log.latex "^(?:LaTeX(?: Font| Encoding)?|Package \\S+|Class \\S+) Info:")
  (#set! adjust.startAndEndAroundFirstMatchOf "\\bInfo(?=:)"))

; Message owners and record labels.
((line) @support.type.log.latex
  (#match? @support.type.log.latex "^(?:LaTeX(?: Font| Encoding)?|Package \\S+|Class \\S+) (?:Info|Warning|Error):")
  (#set! adjust.startAndEndAroundFirstMatchOf "^(?:LaTeX(?: Font| Encoding)?|Package \\S+|Class \\S+)"))

((line) @keyword.other.label.log.latex
  (#match? @keyword.other.label.log.latex "^(?:Document Class|Package|File|PDF statistics):")
  (#set! adjust.startAndEndAroundFirstMatchOf "^(?:Document Class|Package|File|PDF statistics):"))

((line) @keyword.other.summary.log.latex
  (#match? @keyword.other.summary.log.latex "^(?:(?:Output|Transcript) written on |Here is how much of TeX's memory you used:)")
  (#set! adjust.startAndEndAroundFirstMatchOf "^(?:(?:Output|Transcript) written on|Here is how much of TeX's memory you used)(?= |:)"))

; TeX uses asymmetric `name' quotes. Parse them per line instead of allowing a
; closing apostrophe to turn the following hundreds of lines into one string.
((line) @string.quoted.single.log.latex
  (#match? @string.quoted.single.log.latex "`[^'\\r\\n]+'")
  (#set! adjust.startAndEndAroundFirstMatchOf "`[^'\\r\\n]+'"))

((line) @string.quoted.single.log.latex
  (#match? @string.quoted.single.log.latex "'[^'\\r\\n]+'")
  (#not-match? @string.quoted.single.log.latex "`")
  (#set! adjust.startAndEndAroundFirstMatchOf "'[^'\\r\\n]+'"))

((line) @string.quoted.double.log.latex
  (#match? @string.quoted.double.log.latex "\"[^\"\\r\\n]*\"")
  (#set! adjust.startAndEndAroundFirstMatchOf "\"[^\"\\r\\n]*\""))

; Paths, dates, versions, times, and source locations.
((line) @string.unquoted.path.log.latex
  (#match? @string.unquoted.path.log.latex "^\\(?[A-Za-z]:[\\\\/]")
  (#set! adjust.startAndEndAroundFirstMatchOf "[A-Za-z]:[\\\\/][^\\r\\n)>]*"))

((line) @constant.other.date.log.latex
  (#match? @constant.other.date.log.latex "\\b[12][0-9]{3}[-/][0-9]{2}[-/][0-9]{2}\\b")
  (#set! adjust.startAndEndAroundFirstMatchOf "\\b[12][0-9]{3}[-/][0-9]{2}[-/][0-9]{2}\\b"))

((line) @constant.other.date.log.latex
  (#match? @constant.other.date.log.latex "\\b[0-9]{1,2} [A-Z]{3} [12][0-9]{3}\\b")
  (#set! adjust.startAndEndAroundFirstMatchOf "\\b[0-9]{1,2} [A-Z]{3} [12][0-9]{3}\\b"))

((line) @constant.other.time.log.latex
  (#match? @constant.other.time.log.latex "\\b[0-2][0-9]:[0-5][0-9](?::[0-5][0-9])?\\b")
  (#set! adjust.startAndEndAroundFirstMatchOf "\\b[0-2][0-9]:[0-5][0-9](?::[0-5][0-9])?\\b"))

((line) @constant.other.version.log.latex
  (#match? @constant.other.version.log.latex "\\bv[0-9]+(?:\\.[0-9A-Za-z]+){1,}\\b")
  (#set! adjust.startAndEndAroundFirstMatchOf "\\bv[0-9]+(?:\\.[0-9A-Za-z]+){1,}\\b"))

((line) @constant.other.version.log.latex
  (#match? @constant.other.version.log.latex "\\bVersion [0-9]+(?:[.-][0-9A-Za-z]+)+")
  (#set! adjust.startAndEndAroundFirstMatchOf "(?<=Version )[0-9]+(?:[.-][0-9A-Za-z]+)+"))

((line) @constant.numeric.line-number.log.latex
  (#match? @constant.numeric.line-number.log.latex "\\bon input line [0-9]+")
  (#set! adjust.startAndEndAroundFirstMatchOf "(?<=on input line )[0-9]+"))

((line) @constant.numeric.font-size.log.latex
  (#match? @constant.numeric.font-size.log.latex "<[0-9]+(?:\\.[0-9]+)?>")
  (#set! adjust.startAndEndAroundFirstMatchOf "(?<=<)[0-9]+(?:\\.[0-9]+)?(?=>)"))

; Register assignments. LaTeX3 control sequences use underscores and colons,
; so stopping at ASCII letters would highlight only the initial \l or \g.
((line) @variable.other.control-sequence.log.latex
  (#match? @variable.other.control-sequence.log.latex "^\\s*\\\\[A-Za-z@:_][A-Za-z0-9@:_]*\\s*=")
  (#set! adjust.startAndEndAroundFirstMatchOf "\\\\[A-Za-z@:_][A-Za-z0-9@:_]*(?=\\s*=)"))

((line) @keyword.operator.assignment.log.latex
  (#match? @keyword.operator.assignment.log.latex "^\\s*\\\\[A-Za-z@:_][A-Za-z0-9@:_]*\\s*=")
  (#set! adjust.startAndEndAroundFirstMatchOf "="))

((line) @support.type.register.log.latex
  (#match? @support.type.register.log.latex "=\\s*\\\\(?:count|dimen|skip|box|toks|muskip|insert|write|mathgroup|read|language)[0-9]+\\s*$")
  (#set! adjust.startAndEndAroundFirstMatchOf "\\\\(?:count|dimen|skip|box|toks|muskip|insert|write|mathgroup|read|language)(?=[0-9]+\\s*$)"))

((line) @constant.numeric.register.log.latex
  (#match? @constant.numeric.register.log.latex "=\\s*\\\\(?:count|dimen|skip|box|toks|muskip|insert|write|mathgroup|read|language)[0-9]+\\s*$")
  (#set! adjust.startAndEndAroundFirstMatchOf "[0-9]+(?=\\s*$)"))

; Other control sequences use the same support-function scope as LaTeX source.
((line) @support.function.log.latex
  (#match? @support.function.log.latex "^\\s*\\\\(?:[A-Za-z@:_][A-Za-z0-9@:_]*|\\S)")
  (#not-match? @support.function.log.latex "^\\s*\\\\[A-Za-z@:_][A-Za-z0-9@:_]*\\s*=")
  (#set! adjust.startAndEndAroundFirstMatchOf "\\\\(?:[A-Za-z@:_][A-Za-z0-9@:_]*|\\S)"))

((line) @support.function.log.latex
  (#match? @support.function.log.latex "\\b(?:Redefining|Overwriting) \\\\(?:[A-Za-z@:_][A-Za-z0-9@:_]*|\\S)")
  (#set! adjust.startAndEndAroundFirstMatchOf "\\\\(?:[A-Za-z@:_][A-Za-z0-9@:_]*|\\S)"))
