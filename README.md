# language-log

Syntax highlighting for log files.

Log levels are marked with the `definition.log.log-*` scopes, which the `log-filter` package uses to hide lines by severity.

## Features

- **Grammars**: provides TextMate grammars.
- **Log grammar**: highlights common log formats including generic logs, syslog, Apache, Android, iOS, Python, npm, JBoss, CBS, and other application logs.
- **Log levels**: colors verbose, info, debug, warning, and error lines apart from the rest.
- **Timestamps**: recognizes the timestamp of a line across the supported formats.
- **Soft wrap**: turns soft wrap off for log files, so one entry stays one line.

## Installation

To install `language-log` search for _language-log_ in the Install pane of the Lumine settings or run `lumine --install lumine-code/language-log`.

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub. Any feedback is welcome!
