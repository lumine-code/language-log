(trace) @support.constant.log-level.trace.sofistik-output
(error) @invalid.illegal.sofistik-output
(warn) @invalid.deprecated.sofistik-output
(info) @support.constant.log-level.info.sofistik-output
(debug) @support.constant.log-level.debug.sofistik-output
(year_month_day) @constant.other.date.sofistik-output
(time) @constant.other.time.sofistik-output
(number) @constant.numeric.sofistik-output
(string_literal) @string.quoted.sofistik-output
(constant) @constant.language.sofistik-output

((string_literal) @punctuation.definition.string.begin.sofistik-output
  (#set! adjust.startAndEndAroundFirstMatchOf "^[\"'`]"))
((string_literal) @punctuation.definition.string.end.sofistik-output
  (#set! adjust.startAndEndAroundFirstMatchOf "[\"'`]$"))
