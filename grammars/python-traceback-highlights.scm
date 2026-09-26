(trace) @support.constant.log-level.trace.python-traceback
(debug) @support.constant.log-level.debug.python-traceback
(info) @support.constant.log-level.info.python-traceback
(error) @invalid.illegal.python-traceback
(warn) @invalid.deprecated.python-traceback
(year_month_day) @constant.other.date.python-traceback
(time) @constant.other.time.python-traceback
(number) @constant.numeric.python-traceback
(string_literal) @string.quoted.python-traceback
(constant) @constant.language.python-traceback

((string_literal) @punctuation.definition.string.begin.python-traceback
  (#set! adjust.startAndEndAroundFirstMatchOf "^[\"'`]"))
((string_literal) @punctuation.definition.string.end.python-traceback
  (#set! adjust.startAndEndAroundFirstMatchOf "[\"'`]$"))

((word) @keyword.control.exception.python-traceback
  (#eq? @keyword.control.exception.python-traceback "Traceback"))

((word) @keyword.other.file.python-traceback
  (#eq? @keyword.other.file.python-traceback "File"))

((word) @keyword.other.line.python-traceback
  (#eq? @keyword.other.line.python-traceback "line"))
