(error) @invalid.illegal.python-traceback
(warn) @invalid.deprecated.python-traceback
(number) @constant.numeric.python-traceback
(string_literal) @string.quoted.double.python-traceback

((word) @keyword.control.exception.python-traceback
  (#eq? @keyword.control.exception.python-traceback "Traceback"))

((word) @keyword.other.file.python-traceback
  (#eq? @keyword.other.file.python-traceback "File"))

((word) @keyword.other.line.python-traceback
  (#eq? @keyword.other.line.python-traceback "line"))
