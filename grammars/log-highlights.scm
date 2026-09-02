(trace) @keyword.other.log.log-verbose
(debug) @keyword.other.log.log-debug
(info) @keyword.other.log.log-info
(warn) @keyword.other.log.log-warning
(error) @keyword.other.log.log-error
(year_month_day) @constant.other.date.log
(time) @constant.other.time.log
(string_literal) @string.quoted.log
(number) @constant.numeric.log
(constant) @constant.language.log

((string_literal) @punctuation.definition.string.begin.log
  (#set! adjust.startAndEndAroundFirstMatchOf "^[\"']"))
((string_literal) @punctuation.definition.string.end.log
  (#set! adjust.startAndEndAroundFirstMatchOf "[\"']$"))
