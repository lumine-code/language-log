const path = require("path");

// The fixture beside this file is a plain sample of the language — the file to
// open when you want to look at the highlighting rather than assert on it. This
// spec is only what stops the sample quietly rotting: the grammar still claims
// it, and it still tokenizes.

describe("Log sample fixtures", () => {
  beforeEach(async () => {
    await atom.packages.activatePackage("language-log");
  });

  it("tokenizes sample.log", async () => {
    const editor = await atom.workspace.open(path.join(__dirname, "fixtures", "sample.log"));

    expect(editor.getGrammar().scopeName).toBe("source.log");

    // Read the grammar rather than the editor: a TextMate language mode
    // tokenizes lazily in the background, so scanning rows through the editor
    // reports whatever happened to be done by then — green on a fast machine
    // and red on a slow one. `tokenizeLines` is synchronous and complete.
    const text = require("fs").readFileSync(path.join(__dirname, "fixtures", "sample.log"), "utf8");
    const scopes = new Set();
    for (const tokens of editor.getGrammar().tokenizeLines(text)) {
      for (const token of tokens) {
        for (const name of token.scopes) scopes.add(name);
      }
    }

    // Every token carries the root scope, so a sample the grammar matched
    // nothing in still tokenizes — it just comes back as one flat run of
    // "source.log" and nothing else. That is what this rules out.
    scopes.delete("source.log");
    expect(scopes.size).toBeGreaterThan(0);
  });
});
