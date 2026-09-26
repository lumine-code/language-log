const LOG_TODO_NODES_BY_SCOPE = {
  "source.log": ["word", "string_literal"],
  "text.junit-test-report": ["word", "string_literal"],
  "text.log.latex": ["line"],
  "text.python.traceback": ["word", "string_literal"],
  "text.sofistik-output": ["word", "string_literal"],
};

exports.consumeTodoInjection = (todo) => {
  const registrations = [];
  for (const [scopeName, types] of Object.entries(LOG_TODO_NODES_BY_SCOPE)) {
    registrations.push(todo.addInjectionPoint(scopeName, { types }));
  }
  return {
    dispose() {
      for (const registration of registrations.splice(0)) registration.dispose();
    },
  };
};
