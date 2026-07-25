const { formatTimestamp } = require("../lib/util");
const LogFilter = require("../lib/log-filter");

describe("language-log", () => {
  let workspaceElement;

  beforeEach(async () => {
    workspaceElement = atom.views.getView(atom.workspace);
    jasmine.attachToDOM(workspaceElement);
    await atom.packages.activatePackage("language-log");
  });

  describe("grammar", () => {
    it("loads the Log grammar", () => {
      const grammar = atom.grammars.grammarForScopeName("source.log");
      expect(grammar).toBeTruthy();
      expect(grammar.name).toBe("Log");
    });

    it("selects the Log grammar for .log files", () => {
      const grammar = atom.grammars.selectGrammar("output.log", "");
      expect(grammar.scopeName).toBe("source.log");
    });

    it("tokenizes an error line", () => {
      const grammar = atom.grammars.grammarForScopeName("source.log");
      const { tokens } = grammar.tokenizeLine("2026-01-01 10:00:00 ERROR something broke");
      const scopes = tokens.flatMap((token) => token.scopes);
      expect(scopes.some((scope) => scope.includes("log"))).toBe(true);
    });
  });

  describe("filter panel", () => {
    it("shows the filter panel for log files and toggles it", async () => {
      const editor = await atom.workspace.open("sample.log");
      editor.setText("2026-01-01 10:00:00 INFO hello\n");
      expect(editor.getGrammar().scopeName).toBe("source.log");

      let panels = atom.workspace.getBottomPanels();
      expect(panels.some((panel) => panel.className === "language-log-panel")).toBe(true);

      atom.commands.dispatch(workspaceElement, "language-log:toggle-log-panel");
      panels = atom.workspace.getBottomPanels();
      expect(panels.some((panel) => panel.className === "language-log-panel")).toBe(false);

      atom.commands.dispatch(workspaceElement, "language-log:toggle-log-panel");
      panels = atom.workspace.getBottomPanels();
      expect(panels.some((panel) => panel.className === "language-log-panel")).toBe(true);
    });
  });

  describe("timestamps", () => {
    it("formats timestamps as DD-MM-YYYY HH:mm:ss", () => {
      const date = new Date(2026, 0, 2, 3, 4, 5);
      expect(formatTimestamp(date)).toBe("02-01-2026 03:04:05");
    });

    it("parses ISO-like timestamps", async () => {
      const editor = await atom.workspace.open();
      const filter = new LogFilter(editor);
      const time = filter.parseTimestamp("2026-03-04 05:06:07");
      expect(time instanceof Date).toBe(true);
      expect(time.getFullYear()).toBe(2026);
      expect(time.getMonth()).toBe(2);
      expect(time.getDate()).toBe(4);
    });

    it("assumes the current year for year-less timestamps", async () => {
      const editor = await atom.workspace.open();
      const filter = new LogFilter(editor);
      const time = filter.parseTimestamp("Dec 25 13:00:00");
      expect(time instanceof Date).toBe(true);
      expect(time.getFullYear()).toBe(new Date().getFullYear());
    });

    it("rejects unparsable timestamps", async () => {
      const editor = await atom.workspace.open();
      const filter = new LogFilter(editor);
      expect(filter.parseTimestamp("not a timestamp")).toBe(false);
    });
  });
});
