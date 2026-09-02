const languageLog = require("../lib/main");

describe("Log grammar injections", () => {
  it("registers TODOs on the real token nodes of every grammar variant", () => {
    const todo = { addInjectionPoint: jasmine.createSpy("addInjectionPoint") };

    languageLog.consumeTodoInjection(todo);

    expect(todo.addInjectionPoint.calls.allArgs()).toEqual([
      ["source.log", { types: ["word", "string_literal"] }],
      ["text.junit-test-report", { types: ["word", "string_literal"] }],
      ["text.log.latex", { types: ["word", "string_literal"] }],
      ["text.python.traceback", { types: ["word", "string_literal"] }],
      ["text.sofistik-output", { types: ["word", "string_literal"] }],
      ["text.plain", { types: ["word", "string_literal"] }],
    ]);
  });
});
