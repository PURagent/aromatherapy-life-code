import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
let source = readFileSync(resolve(import.meta.dirname, 'source.js'), 'utf8');
source = source.replaceAll('buildAmberAtelier', 'buildCelestialSanctuary');
const start = source.indexOf('  const page =');
const end = source.indexOf('  await Promise.all', start);
source = source.slice(0, start) + `  const existingPage = figma.root.children.find(p => p.name === '03 · The Celestial Sanctuary');
  if (existingPage) throw new Error('Fantasy page already exists; stopped to preserve the existing design.');
  if (!figma.root.children.some(p => p.name === '02 · Native web design')) throw new Error('Prior native design was not found.');
  const page = figma.createPage(); page.name = '03 · The Celestial Sanctuary';
  await figma.setCurrentPageAsync(page);
` + source.slice(end);
source = source.replace(/  const colors = .*?;\r?\n/, `  const colors = { base:'#090611', surface:'#1b1226', ink:'#f1e6f5', muted:'#bfb1ca', amber:'#d9c092', displayAccent:'#e5c994', button:'#d5b778', border:'#75637d', subtle:'#0f0a17', selected:'#533957', buttonInk:'#221426' };\n`);
source = source.replace(/  const variables = .*?;\r?\n  const tokenNames = .*?;\r?\n/, `  const collection = figma.variables.createVariableCollection('Celestial Sanctuary');
  const variables = {}, tokenNames = {};
  for (const [name, value] of Object.entries(colors)) {
    const variable = figma.variables.createVariable('sanctuary/' + name, collection, 'COLOR');
    variable.scopes = ['FRAME_FILL','SHAPE_FILL','TEXT_FILL','STROKE_COLOR'];
    variable.setValueForMode(collection.defaultModeId, rgb(value));
    variable.setVariableCodeSyntax('WEB', '--sanctuary-' + name);
    variables[variable.name] = variable; tokenNames[name] = variable.name;
  }
`);
source = source.replaceAll('#9b5c28', '#d5b778').replaceAll('Amber Atelier / Native components', 'Celestial Sanctuary / Native components');
source = source.replace('pill.cornerRadius=999', 'pill.cornerRadius=4');
source = source.replace("'Medium','surface'", "'Medium','buttonInk'").replace("21,'surface'", "21,'buttonInk'");
source = source.replace("if(!mobile)linkedText(nav,'Original design','แบบแรก ↗',12,'muted');", "if(!mobile)linkedText(nav,'Original design','The original ↗',12,'muted');");
const heroStart = source.indexOf('  function hero(');
const fieldStart = source.indexOf('  function field(', heroStart);
source = source.slice(0,heroStart) + `  function centerText(parent,name,value,size,line,width,family='Noto Sans Thai',style='Regular',color='ink') {
    const n=text(parent,name,value,size,line,width,family,style,color);n.textAlignHorizontal='CENTER';return n;
  }
  function spark(parent,size=28) {
    const n=figma.createNodeFromSvg('<svg width="'+size+'" height="'+size+'" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 2c0 10-4 14-14 14 10 0 14 4 14 14 0-10 4-14 14-14-10 0-14-4-14-14Z" stroke="#d5b778" stroke-width="1.1"/><path d="m5 5 4 4m14 14 4 4M5 27l4-4M23 9l4-4" stroke="#d5b778"/></svg>');parent.appendChild(n);n.name='Spark / source SVG';return n;
  }
  function hero(root,mobile) {
    const w=root.width, inner=mobile?w-40:w-112;
    const section=auto(root,'Portal Hero','VERTICAL',w,0,mobile?20:56,'base');section.paddingTop=34;section.paddingBottom=0;section.counterAxisAlignItems='CENTER';
    const heading=auto(section,'Portal heading','VERTICAL',inner,10);heading.counterAxisAlignItems='CENTER';
    centerText(heading,'Main title',mobile?'Aromatherapy\\nLife Code':'Aromatherapy Life Code',mobile?54:90,1.05,inner,'Cormorant Garamond','Regular','displayAccent');
    centerText(heading,'Thai invitation','เปิดประตูสู่จักรวาลแห่งกลิ่น',mobile?19:24,1.6,inner,'Noto Sans Thai','Regular','displayAccent');
    centerText(heading,'Description','เรื่องราวของตัวเลข ความหอม และช่วงเวลาที่ได้กลับมาหาตัวเอง',mobile?11:13,1.8,mobile?290:inner,'Noto Sans Thai','Regular','muted');
    const scene=fixed(section,'Portal stage / live Three.js still',mobile?w:1020,mobile?430:535);section.counterAxisAlignItems='CENTER';
    photo(scene,'Live Three.js / '+(mobile?'mobile':'desktop'),scene.width,scene.height,imageHashes[mobile?'mobile':'desktop'],'FIT');
    const cap=centerText(scene,'Scene caption','ลากเพื่อหมุนชม · ขยับเพื่อเปลี่ยนมุมมอง',mobile?10:11,1.6,scene.width,'Noto Sans Thai','Regular','muted');cap.x=0;cap.y=scene.height-20;
    fixed(section,'Spacing / scene action',1,24);button(section,'เริ่มสำรวจรหัสของคุณ');fixed(section,'Spacing / disclosure',1,12);
    centerText(section,'Pending formula disclosure','ต้นแบบประสบการณ์ · รอการยืนยันสูตรคำนวณ',mobile?10:11,1.8,inner,'Noto Sans Thai','Regular','muted');
    fixed(section,'Spacing / scene controls',1,26);line(section,mobile?inner:960);
    const console=auto(section,'Scene console',mobile?'VERTICAL':'HORIZONTAL',mobile?inner:700,mobile?3:35);console.counterAxisAlignItems='CENTER';console.primaryAxisAlignItems='CENTER';console.paddingTop=10;
    const moods=auto(console,'Mood controls','HORIZONTAL',mobile?inner:360,8);moods.primaryAxisAlignItems='CENTER';
    ['ม่วงจันทรา','ครามดารา','กุหลาบราตรี'].forEach((name,i)=>{const mood=auto(moods,'Mood / '+name,'HORIZONTAL',mobile?108:112,6,10,i===0?'selected':undefined);mood.cornerRadius=24;mood.counterAxisAlignItems='CENTER';const sw=figma.createEllipse();mood.appendChild(sw);sw.resize(8,8);fill(sw,['#c29aff','#83d9fa','#f3a5cd'][i]);text(mood,'Mood label',name,10,2,undefined,'Noto Sans Thai','Regular','ink');});
    const controls=auto(console,'Motion controls','HORIZONTAL',225,25);controls.primaryAxisAlignItems='CENTER';controls.paddingTop=8;controls.paddingBottom=8;text(controls,'Spark action','✧ ปลุกประกาย',11,2,undefined,'Noto Sans Thai','Regular','displayAccent');text(controls,'Pause action','Ⅱ หยุดภาพ',11,2,undefined,'Noto Sans Thai','Regular','displayAccent');
    const metadata=between(section,'Hero bottom',inner);metadata.paddingTop=16;metadata.paddingBottom=26;text(metadata,'Art descriptor','ART · AROMA · IMAGINATION',mobile?7:9,2,undefined,'Noto Sans Thai','Regular','muted');text(metadata,'Continue','เดินทางต่อ ↓',11,2,undefined,'Noto Sans Thai','Regular','displayAccent');if(!mobile)text(metadata,'Creator','BY MORNAENAE',9,2,undefined,'Noto Sans Thai','Regular','muted');
  }
  function story(root,mobile) {
    const inner=mobile?root.width-50:1228;
    const section=auto(root,'Scent Story',mobile?'VERTICAL':'HORIZONTAL',root.width,mobile?36:64);section.paddingLeft=section.paddingRight=(root.width-inner)/2;section.paddingTop=mobile?62:96;section.paddingBottom=mobile?44:80;section.counterAxisAlignItems='CENTER';
    const copy=auto(section,'Story copy','VERTICAL',mobile?inner:430,20);spark(copy,mobile?29:38);
    text(copy,'Story title','เมื่อความหอม\\nพบกับจินตนาการ',mobile?32:41,1.5,copy.width,'Noto Sans Thai','Regular','displayAccent');
    text(copy,'Story description','ให้ความชอบพาคุณออกเดินทาง\\nผ่านสีสัน เรื่องราว และโลกของกลิ่น\\nในแบบของ หมอเน่ mornaenae',mobile?13:14,2,copy.width,'Noto Sans Thai','Regular','muted');
    text(copy,'Catalogue link','ค้นพบโลกของกลิ่น →',13,1.8,copy.width,'Noto Sans Thai','Regular','displayAccent');
    const imageColumn=auto(section,'Concept artwork','VERTICAL',mobile?inner:734,17);
    const art=photo(imageColumn,'Higgsfield / The Celestial Sanctuary',imageColumn.width,mobile?430:545,imageHashes.artwork);art.topLeftRadius=art.topRightRadius=mobile?125:160;art.bottomLeftRadius=art.bottomRightRadius=4;art.strokes=[paint('displayAccent')];art.strokeWeight=.7;
    const caption=between(imageColumn,'Artwork caption',imageColumn.width);text(caption,'Artwork title','The Celestial Sanctuary',mobile?20:22,1.3,undefined,'Cormorant Garamond','Italic','displayAccent');text(caption,'Artwork credit','ภาพศิลปะแนวคิด · Higgsfield',mobile?8:9,1.8,undefined,'Noto Sans Thai','Regular','muted');
    const ritual=auto(root,'Ritual Divider','HORIZONTAL',root.width,20,mobile?24:210);ritual.counterAxisAlignItems='CENTER';ritual.primaryAxisAlignItems='CENTER';spark(ritual,18);text(ritual,'Ritual phrase','YOUR STORY IS A UNIVERSE',mobile?7:9,2,undefined,'Noto Sans Thai','Regular','displayAccent');spark(ritual,18);
  }
` + source.slice(fieldStart);
source=source.replaceAll('Native Mobile · 390','Fantasy Mobile · 390').replaceAll('Native Desktop · 1440','Fantasy Desktop · 1440');
source=source.replace("const n=auto(numbers,`Reference / ${i}`,'VERTICAL',44,3);", "const n=auto(numbers,`Reference / ${i}`,'VERTICAL',44,3,0,'surface');n.topLeftRadius=n.topRightRadius=22;n.bottomLeftRadius=n.bottomRightRadius=4;n.strokes=[paint('displayAccent')];n.strokeWeight=.5;");
source=source.replace(/  \/\/ Preserve the initial draft[\s\S]*?  figma.currentPage.selection=created;/, '  figma.currentPage.selection=created;');
source=source.replace('console.log(JSON.stringify(report));','print(JSON.stringify({page:{id:page.id,name:page.name},...report}));');
source=source.replace(/  figma.closePlugin\([^\n]*\);/g,'');
source=source.replace(/buildCelestialSanctuary\(\)\.catch\([^\n]*\);/, 'await buildCelestialSanctuary();');
writeFileSync(resolve(import.meta.dirname, 'fantasy-source.js'),source);
const encode=(p)=>{const path=resolve(root,p);if(!existsSync(path))throw new Error('Required image missing: '+path);return readFileSync(path).toString('base64');};
const embedded={artwork:encode('docs/fantasy/figma-artwork.jpg'),desktop:encode('docs/fantasy/scene-desktop.png'),mobile:encode('docs/fantasy/scene-mobile.png')};
writeFileSync(resolve(import.meta.dirname,'fantasy-scripter.js'),`const EMBEDDED=${JSON.stringify(embedded)};\n${source}`);
console.log('Fantasy native builder ready. Existing Figma pages preserved.');
