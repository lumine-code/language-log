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

  it("keeps TeX quotes line-bound and highlights LaTeX log records", async () => {
    const editor = await lumine.workspace.open("latex-regression.log");
    const lines = [
      "This is pdfTeX, Version 3.141592653-2.6-1.40.27 (MiKTeX 25.4) 8 JAN 2026 20:49",
      "(C:\\Users\\Ada\\AppData\\Local\\Programs\\MiKTeX\\tex/latex/tools/tabularx.sty",
      "Package: tabularx 2023/12/11 v2.12a `tabularx' package",
      "\\l__siunitx_number_round_precision_int=\\count385",
      "LaTeX Font Info:    External font `lmex10' loaded for size",
      "(Font)              <12> on input line 330.",
      "LaTeX Info: Redefining \\GenericWarning on input line 433.",
      "Package foo Warning: Something happened.",
      "\\GenericWarning: remains a control sequence.",
      "! LaTeX Error: File `missing.sty' not found.",
      "\\GenericError: remains a control sequence.",
      "Overfull \\hbox (1.0pt too wide) in paragraph at lines 10--12",
      "Output written on main.pdf (1 page, 1234 bytes).",
      "",
    ];
    editor.setText(lines.join("\n"));
    lumine.grammars.autoAssignLanguageMode(editor.getBuffer());
    const languageMode = editor.getBuffer().getLanguageMode();
    await languageMode.ready;

    const scopesFor = (row, needle, offset = 0) => {
      const column = lines[row].indexOf(needle);
      expect(column).not.toBe(-1);
      return editor.scopeDescriptorForBufferPosition([row, column + offset]).getScopesArray();
    };

    expect(editor.getGrammar().scopeName).toBe("text.log.latex");
    expect(languageMode.tree.rootNode.hasError).toBe(false);
    expect(languageMode.tree.rootNode.descendantsOfType("string_literal")).toEqual([]);

    expect(scopesFor(0, "3.141")).toContain("constant.other.version.log.latex");
    expect(scopesFor(0, "8 JAN 2026")).toContain("constant.other.date.log.latex");
    expect(scopesFor(0, "20:49")).toContain("constant.other.time.log.latex");
    expect(scopesFor(1, "C:\\Users")).toContain("string.unquoted.path.log.latex");
    expect(scopesFor(2, "Package:")).toContain("keyword.other.label.log.latex");
    expect(scopesFor(2, "2023/12/11")).toContain("constant.other.date.log.latex");
    expect(scopesFor(2, "v2.12a")).toContain("constant.other.version.log.latex");
    expect(scopesFor(2, "tabularx'", 2)).toContain("string.quoted.single.log.latex");
    expect(scopesFor(3, "precision")).toContain("variable.other.control-sequence.log.latex");
    expect(scopesFor(3, "=")).toContain("keyword.operator.assignment.log.latex");
    expect(scopesFor(3, "\\count")).toContain("support.type.register.log.latex");
    expect(scopesFor(3, "385")).toContain("constant.numeric.register.log.latex");
    expect(scopesFor(3, "precision")).not.toContain("string.quoted.single.log.latex");
    expect(scopesFor(4, "LaTeX Font")).toContain("support.type.log.latex");
    expect(scopesFor(4, "Info")).toContain("comment.block.documentation.log.latex");
    expect(scopesFor(4, "lmex10")).toContain("string.quoted.single.log.latex");
    expect(scopesFor(5, "12")).toContain("constant.numeric.font-size.log.latex");
    expect(scopesFor(5, "330")).toContain("constant.numeric.line-number.log.latex");
    expect(scopesFor(5, "Font")).not.toContain("string.quoted.single.log.latex");
    expect(scopesFor(6, "\\GenericWarning")).toContain("support.function.log.latex");
    expect(scopesFor(7, "Warning")).toContain("invalid.deprecated.log.latex");
    expect(scopesFor(8, "GenericWarning")).not.toContain("invalid.deprecated.log.latex");
    expect(scopesFor(9, "!")).toContain("invalid.illegal.log.latex");
    expect(scopesFor(9, "Error")).toContain("invalid.illegal.log.latex");
    expect(scopesFor(10, "GenericError")).not.toContain("invalid.illegal.log.latex");
    expect(scopesFor(11, "Overfull")).toContain("keyword.control.hyphenation.log.latex");
    expect(scopesFor(12, "Output written on")).toContain("keyword.other.summary.log.latex");
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

  it("hosts TODO highlighting on both token and line parsers", async () => {
    await lumine.packages.activatePackage("language-todo");
    const cases = [
      {
        fileName: "tasks.log",
        text: "TODO repair this step\n",
        position: [0, 0],
      },
      {
        fileName: "latex-tasks.log",
        text: "This is pdfTeX, Version 3.141592653\nTODO repair this document\n",
        position: [1, 0],
      },
    ];

    for (const { fileName, text, position } of cases) {
      const editor = await lumine.workspace.open(fileName);
      editor.setText(text);
      lumine.grammars.autoAssignLanguageMode(editor.getBuffer());
      await editor.languageMode.ready;
      await conditionPromise(() =>
        editor
          .scopeDescriptorForBufferPosition(position)
          .getScopesArray()
          .includes("storage.type.class.todo"),
      );

      expect(editor.scopeDescriptorForBufferPosition(position).getScopesArray()).toContain(
        "storage.type.class.todo",
      );
    }
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

  it("compiles every highlights query with the intended parser assets", async () => {
    const grammars = VARIANTS.map(({ scopeName }) =>
      lumine.grammars.grammarForScopeName(scopeName),
    );
    const wasmPaths = new Set(grammars.map((grammar) => grammar.treeSitterGrammarPath));
    const sharedWasmPath = path.join(__dirname, "..", "grammars", "log.wasm");
    const latexWasmPath = path.join(__dirname, "..", "grammars", "plain-text.wasm");

    expect(wasmPaths).toEqual(new Set([sharedWasmPath, latexWasmPath]));
    expect(fs.existsSync(sharedWasmPath)).toBe(true);
    expect(fs.existsSync(latexWasmPath)).toBe(true);
    expect(
      grammars
        .filter((grammar) => grammar.scopeName !== "text.log.latex")
        .every((grammar) => grammar.treeSitterGrammarPath === sharedWasmPath),
    ).toBe(true);
    expect(
      grammars.find((grammar) => grammar.scopeName === "text.log.latex").treeSitterGrammarPath,
    ).toBe(latexWasmPath);
    for (const grammar of grammars) {
      expect(await grammar.getQuery("highlightsQuery")).toBeTruthy();
    }
  });
});
