# language-log

Log syntax highlighting with an inline filter panel.

## Features

- **Grammars**: provides TextMate grammars.
- **Log grammar**: highlights common log formats including generic logs, syslog, Apache, Android, iOS, Python, npm, JBoss, CBS, and other application logs.
- **Inline filter panel**: adds a bottom filter panel for log files using the `source.log` grammar.
- **Text filtering**: filters visible log lines by the typed query, matched literally by default.
- **Regex filtering**: toggle the regex button to match the query as a regular expression instead of literal text.
- **Case sensitivity**: toggle case sensitive matching for the text filter with the case button.
- **Log level filters**: hide verbose, info, debug, warning, or error lines with joined toolbar buttons.
- **Tail mode**: keep the editor scrolled to the bottom when the log buffer changes.
- **Persistent state**: each editor remembers its filter query, toggles, and hidden log levels per file across sessions.

## Installation

To install `language-log` search for _language-log_ in the Install pane of the Lumine settings or run `lumine --install lumine-code/language-log`.

## Commands

Commands available in `atom-workspace`:

- `language-log:toggle-log-panel`: toggle log filter panel,
- `language-log:toggle-focus`: move focus between the filter input and the editor.

## Customization

The style of the filter panel can be adjusted in the user's `styles.less` file, e.g. tint the timestamp separator:

```less
.language-log-view {
  --log-item-color: #4a5568;
}
```

## Contributing

Got ideas to make this package better, found a bug, or want to help add new features? Just drop your thoughts on GitHub. Any feedback is welcome!
