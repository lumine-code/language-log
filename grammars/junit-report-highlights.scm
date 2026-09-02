(error) @invalid.illegal.junit-test-report
(warn) @invalid.deprecated.junit-test-report
(number) @constant.numeric.junit-test-report
(string_literal) @string.quoted.junit-test-report

((word) @entity.name.type.testsuite.junit-test-report
  (#eq? @entity.name.type.testsuite.junit-test-report "Testsuite"))

((word) @entity.name.function.testcase.junit-test-report
  (#eq? @entity.name.function.testcase.junit-test-report "Testcase"))

((word) @keyword.other.stack-frame.junit-test-report
  (#eq? @keyword.other.stack-frame.junit-test-report "at"))
