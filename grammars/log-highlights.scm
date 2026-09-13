(trace) @keyword.other.log.log-verbose
(debug) @keyword.other.log.log-debug
(info) @keyword.other.log.log-info
(warn) @keyword.other.log.log-warning
(error) @keyword.other.log.log-error
(year_month_day) @constant.other.date.log
(time) @constant.other.time.log
(string_literal) @string.quoted.log
(constant) @constant.language.log

((number) @constant.numeric.log
  (#not-match? @constant.numeric.log "^[0-9]{4}/[0-9]{6}\\.[0-9]{3}(?::[A-Fa-f]+)?$"))

((number) @constant.other.timestamp.log
  (#match? @constant.other.timestamp.log "^[0-9]{4}/[0-9]{6}\\.[0-9]{3}")
  (#set! adjust.startAndEndAroundFirstMatchOf "^[0-9]{4}/[0-9]{6}\\.[0-9]{3}"))

; The broad upstream number token consumes :E from Chromium's
; [MMDD/HHMMSS.mmm:ERROR:file(line)] header. Rejoin the split severity in
; the query so it keeps the same scope used by log-filter.
((number) @keyword.other.log.log-error
  (#match? @keyword.other.log.log-error "^[0-9]{4}/[0-9]{6}\\.[0-9]{3}:E$")
  (#is? test.textAt "nextNamedSibling RROR")
  (#set! adjust.startAndEndAroundFirstMatchOf "E$"))

((word) @keyword.other.log.log-error
  (#eq? @keyword.other.log.log-error "RROR")
  (#is? test.matchAt "previousNamedSibling ^[0-9]{4}/[0-9]{6}\\.[0-9]{3}:E$"))

((word) @string.unquoted.filename.log
  (#match? @string.unquoted.filename.log "\\.(?:c|cc|cpp|cxx|h|hh|hpp|hxx)$"))

((number) @constant.numeric.line-number.log
  (#is? test.matchAt "previousNamedSibling \\.(?:c|cc|cpp|cxx|h|hh|hpp|hxx)$"))

((string_literal) @punctuation.definition.string.begin.log
  (#set! adjust.startAndEndAroundFirstMatchOf "^[\"']"))
((string_literal) @punctuation.definition.string.end.log
  (#set! adjust.startAndEndAroundFirstMatchOf "[\"']$"))
