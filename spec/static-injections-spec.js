const fs = require("fs");
const path = require("path");

const packagePath = (name) => {
  const sibling = path.resolve(__dirname, "..", "..", name);
  return fs.existsSync(sibling) ? sibling : name;
};

describe("Log static annotations", () => {
  let editor;

  beforeEach(async () => {
    await lumine.packages.activatePackage(packagePath("language-log"));
    await lumine.packages.activatePackage(packagePath("language-todo"));
  });

  afterEach(() => editor?.destroy());

  for (const scope of [
    "source.log",
    "text.junit-test-report",
    "text.log.latex",
    "text.python.traceback",
    "text.sofistik-output",
  ]) {
    it(`filters ordinary records and annotates the actual nodes of ${scope}`, async () => {
      editor = await lumine.workspace.open();
      editor.setGrammar(lumine.grammars.grammarForScopeName(scope));
      editor.setText("ordinary message\nTODO repair this step\n");
      await editor.languageMode.ready;
      await editor.languageMode.atGrammarSettlement();
      const layers = editor.languageMode.getAllInjectionLayers();
      expect(layers.length).toBe(1);
      expect(layers[0].grammar.scopeName).toBe("text.todo");
      expect(layers[0].getCurrentRanges().every((range) => range.start.row === 1)).toBe(true);
      expect(editor.scopeDescriptorForBufferPosition([1, 0]).getScopesArray()).toContain(
        "storage.type.class.todo",
      );
    });
  }
});
