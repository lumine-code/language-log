const LOG_SCOPES_WITH_TODOS = [
  "source.log",
  "text.junit-test-report",
  "text.log.latex",
  "text.python.traceback",
  "text.sofistik-output",
  "text.plain",
];

exports.consumeTodoInjection = (todo) => {
  for (const scopeName of LOG_SCOPES_WITH_TODOS) {
    todo.addInjectionPoint(scopeName, { types: ["word", "string_literal"] });
  }
};
