describe("language-log", () => {
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-log");
  });

  const tokenizeLine = (line) =>
    lumine.grammars.grammarForScopeName("source.log").tokenizeLine(line).tokens;

  const scopesOf = (line) => tokenizeLine(line).flatMap((token) => token.scopes);

  it("loads the Log grammar", () => {
    const grammar = lumine.grammars.grammarForScopeName("source.log");
    expect(grammar).toBeTruthy();
    expect(grammar.name).toBe("Log");
  });

  it("selects the Log grammar for log files", () => {
    expect(lumine.grammars.selectGrammar("output.log", "").scopeName).toBe("source.log");
    expect(lumine.grammars.selectGrammar("messages.syslog", "").scopeName).toBe("source.log");
  });

  it("turns soft wrap off for log files", () => {
    expect(lumine.config.get("language.softWrap", { scope: [".source.log"] })).toBe(false);
  });

  describe("log levels", () => {
    // The `definition.log.log-*` scopes are what `log-filter` filters on, so
    // they are part of the grammar's contract rather than styling alone.
    it("marks an error line", () => {
      expect(scopesOf("2026-01-01 10:00:00 ERROR something broke")).toContain(
        "definition.log.log-error",
      );
    });

    it("marks a warning line", () => {
      expect(scopesOf("2026-01-01 10:00:00 WARN disk almost full")).toContain(
        "definition.log.log-warning",
      );
    });

    it("marks an info line", () => {
      expect(scopesOf("2026-01-01 10:00:00 INFO server started")).toContain(
        "definition.log.log-info",
      );
    });

    it("leaves a plain line unmarked", () => {
      const scopes = scopesOf("2026-01-01 10:00:00 just a message");
      expect(scopes.some((scope) => scope.startsWith("definition.log.log-"))).toBe(false);
    });
  });

  describe("timestamps", () => {
    it("marks the timestamp of a line", () => {
      const scopes = scopesOf("2026-01-01 10:00:00 INFO server started");
      expect(scopes.some((scope) => scope.includes("timestamp"))).toBe(true);
    });

    it("marks a syslog timestamp", () => {
      const scopes = scopesOf("Dec 25 13:00:00 host sshd[1]: accepted");
      expect(scopes.some((scope) => scope.includes("timestamp"))).toBe(true);
    });
  });
});
