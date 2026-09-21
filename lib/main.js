const LOG_SCOPES_WITH_TODOS = [
  "source.log",
  "text.junit-test-report",
  "text.log.latex",
  "text.python.traceback",
  "text.sofistik-output",
  "text.plain",
];

exports.consumeTodoInjection = (todo) => {
  const registrations = [];
  for (const scopeName of LOG_SCOPES_WITH_TODOS) {
    registrations.push(todo.addInjectionPoint(scopeName, { types: ["word", "string_literal"] }));
  }
  return {
    dispose() {
      for (const registration of registrations.splice(0)) registration.dispose();
    },
  };
};
