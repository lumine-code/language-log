# language-log

Log, report, and traceback language support.

Log levels are marked with the `keyword.other.log.log-*` scopes, which the `log-filter` package uses to hide lines by severity.

## Features

- **Grammars**: provides Tree-sitter grammars for generic logs and specialized output formats.
- **Formats**: handles generic logs, JUnit reports, LaTeX logs, Python tracebacks, and SOFiSTiK output.
- **Parser assets**: uses line-oriented parsing for LaTeX and shares one log parser across the other formats.
- **Log levels**: colors verbose, info, debug, warning, and error lines apart from the rest.
- **Timestamps**: recognizes the timestamp of a line across the supported formats.
- **Soft wrap**: turns soft wrap off for log files, so one entry stays one line.

## Installation

To install `language-log` search for it in the Install pane of the Lumine settings, or run the command `lumine --install lumine-code/language-log`.

## Services

- `todo.injection`: consumed to highlight task annotations in log output.

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub. Any feedback is welcome!
