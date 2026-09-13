const fs = require("fs");
const path = require("path");

const VARIANTS = [
  {
    scopeName: "source.log",
    fileName: "output.log",
    text: "2026-08-03 09:14:02 INFO service started\n",
    position: [0, 22],
    capture: "keyword.other.log.log-info",
    injectionNames: ["log"],
  },
  {
    scopeName: "text.junit-test-report",
    fileName: "report.txt",
    text: "Testsuite: com.example.Sample\nTestcase: passes took 0.12 sec\nERROR failed\n",
    position: [0, 2],
    capture: "entity.name.type.testsuite.junit-test-report",
    injectionNames: ["junit-report"],
  },
  {
    scopeName: "text.log.latex",
    fileName: "document.log",
    text: "This is pdfTeX, Version 3.141592653\nOverfull box\n",
    position: [1, 2],
    capture: "keyword.control.hyphenation.log.latex",
    injectionNames: ["latex-log"],
  },
  {
    scopeName: "text.python.traceback",
    fileName: "failure.pytb",
    text: 'Traceback (most recent call last):\n  File "app.py", line 7\nValueError: bad value\n',
    position: [0, 2],
    capture: "keyword.control.exception.python-traceback",
    injectionNames: ["python-traceback", "pytb"],
  },
  {
    scopeName: "text.sofistik-output",
    fileName: "analysis.erg",
    text: "ERROR calculation failed\n",
    position: [0, 2],
    capture: "invalid.illegal.sofistik-output",
    injectionNames: ["sofistik-output"],
  },
  {
    scopeName: "text.plain",
    fileName: "notes.txt",
    text: "Plain text paragraph.\n",
    position: [0, 0],
    capture: "meta.paragraph.text",
    injectionNames: ["text", "plain", "plaintext"],
  },
];

describe("Log Tree-sitter grammar family", () => {
  beforeEach(async () => {
    await lumine.packages.activatePackage("language-log");
  });

  it("selects the grammar and preserves log-filter severity scopes", async () => {
    const editor = await lumine.workspace.open(path.join(__dirname, "fixtures", "sample.log"));
    const languageMode = editor.getBuffer().getLanguageMode();
    await languageMode.ready;

    expect(editor.getGrammar().scopeName).toBe("source.log");
    expect(languageMode.tree.rootNode.hasError).toBe(false);
    expect(editor.scopeDescriptorForBufferPosition([0, 25]).getScopesArray()).toContain(
      "keyword.other.log.log-info",
    );
    expect(editor.scopeDescriptorForBufferPosition([4, 25]).getScopesArray()).toContain(
      "keyword.other.log.log-warning",
    );
    expect(editor.scopeDescriptorForBufferPosition([5, 25]).getScopesArray()).toContain(
      "keyword.other.log.log-error",
    );
    expect(editor.scopeDescriptorForBufferPosition([0, 2]).getScopesArray()).toContain(
      "constant.other.date.log",
    );
  });

  it("highlights Chromium log headers without absorbing the severity", async () => {
    const editor = await lumine.workspace.open("chromium.log");
    editor.setText(
      "[0620/092918.288:ERROR:registration_protocol_win.cc(108)] CreateFile failed (0x2)\n" +
        "RROR is ordinary text without the Chromium timestamp prefix\n",
    );
    await editor.languageMode.ready;

    for (const column of [17, 21]) {
      expect(editor.scopeDescriptorForBufferPosition([0, column]).getScopesArray()).toContain(
        "keyword.other.log.log-error",
      );
    }
    expect(editor.scopeDescriptorForBufferPosition([0, 1]).getScopesArray()).toContain(
      "constant.other.timestamp.log",
    );
    expect(editor.scopeDescriptorForBufferPosition([0, 1]).getScopesArray()).not.toContain(
      "constant.numeric.log",
    );
    expect(editor.scopeDescriptorForBufferPosition([0, 23]).getScopesArray()).toContain(
      "string.unquoted.filename.log",
    );
    expect(editor.scopeDescriptorForBufferPosition([0, 52]).getScopesArray()).toContain(
      "constant.numeric.line-number.log",
    );
    expect(editor.scopeDescriptorForBufferPosition([0, 79]).getScopesArray()).toContain(
      "constant.numeric.log",
    );
    expect(editor.scopeDescriptorForBufferPosition([0, 79]).getScopesArray()).not.toContain(
      "constant.numeric.line-number.log",
    );
    expect(editor.scopeDescriptorForBufferPosition([1, 0]).getScopesArray()).not.toContain(
      "keyword.other.log.log-error",
    );
  });

  it("claims log and syslog files and disables soft wrap", () => {
    expect(lumine.grammars.selectGrammar("output.log", "").scopeName).toBe("source.log");
    expect(lumine.grammars.selectGrammar("messages.syslog", "").scopeName).toBe("source.log");
    expect(lumine.config.get("editor.softWrap", { scope: [".source.log"] })).toBe(false);
  });

  it("registers an unambiguous injection name for every variant", () => {
    for (const { scopeName, injectionNames } of VARIANTS) {
      const grammar = lumine.grammars.grammarForScopeName(scopeName);
      expect(grammar.injectionNames).toEqual(injectionNames);
      for (const name of injectionNames) {
        expect(lumine.grammars.treeSitterGrammarForLanguageString(name)).toBe(grammar);
      }
    }
  });

  it("hosts TODO highlighting on parsed log tokens", async () => {
    await lumine.packages.activatePackage("language-todo");
    const editor = await lumine.workspace.open("tasks.log");
    editor.setText("TODO repair this step\n");
    await editor.languageMode.ready;
    await conditionPromise(() =>
      editor
        .scopeDescriptorForBufferPosition([0, 0])
        .getScopesArray()
        .includes("storage.type.class.todo"),
    );

    expect(editor.scopeDescriptorForBufferPosition([0, 0]).getScopesArray()).toContain(
      "storage.type.class.todo",
    );
  });

  for (const variant of VARIANTS) {
    it(`selects and highlights ${variant.scopeName}`, async () => {
      const editor = await lumine.workspace.open(variant.fileName);
      editor.setText(variant.text);
      lumine.grammars.autoAssignLanguageMode(editor.getBuffer());
      const languageMode = editor.getBuffer().getLanguageMode();
      await languageMode.ready;

      expect(editor.getGrammar().scopeName).toBe(variant.scopeName);
      expect(editor.scopeDescriptorForBufferPosition(variant.position).getScopesArray()).toContain(
        variant.capture,
      );
    });
  }

  it("compiles every highlights query against one shared Wasm parser", async () => {
    const grammars = VARIANTS.map(({ scopeName }) =>
      lumine.grammars.grammarForScopeName(scopeName),
    );
    const wasmPaths = new Set(grammars.map((grammar) => grammar.treeSitterGrammarPath));
    const sharedWasmPath = path.join(__dirname, "..", "grammars", "log.wasm");

    expect(wasmPaths).toEqual(new Set([sharedWasmPath]));
    expect(fs.existsSync(sharedWasmPath)).toBe(true);
    for (const grammar of grammars) {
      expect(await grammar.getQuery("highlightsQuery")).toBeTruthy();
    }
  });
});
