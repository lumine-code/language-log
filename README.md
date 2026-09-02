# language-log

Log, report, traceback, and plain-text language support.

Log levels are marked with the `keyword.other.log.log-*` scopes, which the `log-filter` package uses to hide lines by severity.

## Features

- **Grammars**: provides Tree-sitter grammars built from [tree-sitter-log](https://github.com/Tudyx/tree-sitter-log).
- **Formats**: handles generic logs, JUnit reports, LaTeX logs, Python tracebacks, SOFiSTiK output, and plain text.
- **Shared parser**: reuses one compiled parser while preserving format-specific scopes and selection rules.
- **Log levels**: colors verbose, info, debug, warning, and error lines apart from the rest.
- **Timestamps**: recognizes the timestamp of a line across the supported formats.
- **Soft wrap**: turns soft wrap off for log files, so one entry stays one line.

## Installation

To install `language-log` search for it in the Install pane of the Lumine settings, or run the command `lumine --install lumine-code/language-log`.

## Services

- `todo.injection`: consumed to highlight task annotations in log output.

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub. Any feedback is welcome!
