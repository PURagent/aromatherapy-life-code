import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
let source = readFileSync(resolve(here, 'source.js'), 'utf8');
source = source.replace("const page = figma.root.children.find", "let page = figma.root.children.find");
source = source.replace("const prior = page.children.filter", "if(figma.root.children.some(p=>p.name==='02 · Native web design'))throw new Error('The native design page already exists. Stopped to avoid duplication.');\n  const prior = page.children.filter");
source = source.replace("  const components=auto(page", "  page=figma.createPage();page.name='02 · Native web design';await figma.setCurrentPageAsync(page);\n  const components=auto(page");
source = source.replace("for(const id of ['3:25','3:26']){const node=await figma.getNodeByIdAsync(id);if(node)node.visible=false;}", "// Existing draft artboards are preserved on their original page.");
source = source.replace("buildAmberAtelier().catch(error=>{console.error(error);figma.closePlugin(error instanceof Error?error.message:String(error));});", "await buildAmberAtelier();");
source = source.replace(/figma\.closePlugin\(EMBEDDED\.desktop&&EMBEDDED\.mobile\?[^\n]+/, "console.log('Native desktop/mobile created; inspect the selected frames. Static scenes reuse the actual Higgsfield concept artwork.');");
writeFileSync(resolve(here, 'scripter.js'), `// Native Figma editor script. Uses only existing in-file Higgsfield image bytes.\n// No MCP calls, network, uploads, purchases, or account changes.\nconst EMBEDDED={artwork:null,desktop:null,mobile:null};\n${source}`);
console.log('Generated scripter.js with existing Figma artwork fill.');
