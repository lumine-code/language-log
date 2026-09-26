(trace) @support.constant.log-level.trace.junit-test-report
(debug) @support.constant.log-level.debug.junit-test-report
(info) @support.constant.log-level.info.junit-test-report
(error) @invalid.illegal.junit-test-report
(warn) @invalid.deprecated.junit-test-report
(year_month_day) @constant.other.date.junit-test-report
(time) @constant.other.time.junit-test-report
(number) @constant.numeric.junit-test-report
(string_literal) @string.quoted.junit-test-report
(constant) @constant.language.junit-test-report

((string_literal) @punctuation.definition.string.begin.junit-test-report
  (#set! adjust.startAndEndAroundFirstMatchOf "^[\"'`]"))
((string_literal) @punctuation.definition.string.end.junit-test-report
  (#set! adjust.startAndEndAroundFirstMatchOf "[\"'`]$"))

((word) @entity.name.type.testsuite.junit-test-report
  (#eq? @entity.name.type.testsuite.junit-test-report "Testsuite"))

((word) @entity.name.function.testcase.junit-test-report
  (#eq? @entity.name.function.testcase.junit-test-report "Testcase"))

((word) @keyword.other.stack-frame.junit-test-report
  (#eq? @keyword.other.stack-frame.junit-test-report "at"))
