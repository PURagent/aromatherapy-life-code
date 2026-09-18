# Native Amber Atelier builder

The native builder **ran successfully through Scripter in the authenticated Figma editor** and produced complete editable desktop and mobile page content. Its source follows the implemented HomePage, FormPage, App, and atelier.css. The new page uses an editable reusable Action component, editable text, auto layout, vector brand marks, and the actual Higgsfield artwork. It contains no formula or personal calculation output. See [the actual verification report](../docs/figma-verification.json) and [current artboard links](../docs/figma-handoff.md).

The browser Figma editor did not expose the Development import menu in this session. Import this development plugin through Figma Desktop when available. No plugin is published, no network access is used, and no account upgrade is performed. A Figma-generated development plugin ID may be required by the import UI; obtain it using Figma's Create new plugin flow and add the ID to the manifest rather than inventing a published ID.

`scripter.js` is the approximately 24 KB native editor script that was executed. It uses the image fill already present on node `6:9` instead of embedding image bytes, creates a new page named `02 · Native web design`, and preserves the initial draft. It has no MCP dependency and makes no network request. Generate it with `node figma-plugin/build-scripter.mjs`. It deliberately refuses to run again while the created page exists.

Generate `code.js` before import:

```powershell
node .\figma-plugin\build.mjs
```

For the real scene captures, pass two local PNG crops of the Three.js scene from desktop and mobile:

```powershell
node .\figma-plugin\build.mjs 'C:\absolute\desktop-scene.png' 'C:\absolute\mobile-scene.png'
```

With no scene capture paths the native Figma scene panels explicitly use the real Higgsfield concept artwork as a static design fallback. This is not an exact visual match to the running 3D scene. The image and all code are embedded in `code.js` locally. `source.js` is the maintainable source; `code.js` is generated.

After import, run **Life Code · Native Amber Atelier** in the existing file:

https://www.figma.com/design/LqRPvQwLT21JOqbGjazCyh

The plugin intentionally stops when artboards named `Native Desktop · 1440` or `Native Mobile · 390` already exist, avoiding accidental duplicate runs. After a successful run, inspect both pages at normal zoom, check all Thai text wrapping and field sizing, compare against the running app, and check the console report for `actualSceneCaptures`.

Validation: JavaScript syntax checks passed, the Scripter variant executed successfully, and the editor's read-only verification found zero text overflow and zero collapsed horizontal rows in the current native desktop/mobile artboards. Their font families match the application. The standalone manifest import remains unexecuted. Replacement of the two static concept hero fills with actual Three.js scene captures remains separate from the successful native layout build.

API manifest fields were checked against [Figma's official manifest documentation](https://developers.figma.com/docs/plugins/manifest/).
