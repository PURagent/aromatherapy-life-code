/* Standard native Figma plugin API; no MCP APIs, network, or account changes. */
async function buildCelestialSanctuary() {
  const fileKey = 'LqRPvQwLT21JOqbGjazCyh';
  if (figma.fileKey && figma.fileKey !== fileKey) throw new Error('Open the existing Life Code — The Amber Atelier file.');
  const existingPage = figma.root.children.find(p => p.name === '03 · The Celestial Sanctuary');
  if (existingPage) throw new Error('Fantasy page already exists; stopped to preserve the existing design.');
  if (!figma.root.children.some(p => p.name === '02 · Native web design')) throw new Error('Prior native design was not found.');
  const page = figma.createPage(); page.name = '03 · The Celestial Sanctuary';
  await figma.setCurrentPageAsync(page);
  await Promise.all([
    {family:'Cormorant Garamond',style:'Regular'}, {family:'Cormorant Garamond',style:'Italic'},
    {family:'Noto Sans Thai',style:'Regular'}, {family:'Noto Sans Thai',style:'Medium'},
  ].map(font => figma.loadFontAsync(font)));

  const colors = { base:'#090611', surface:'#1b1226', ink:'#f1e6f5', muted:'#bfb1ca', amber:'#d9c092', displayAccent:'#e5c994', button:'#d5b778', border:'#75637d', subtle:'#0f0a17', selected:'#533957', buttonInk:'#221426' };
  const collection = figma.variables.createVariableCollection('Celestial Sanctuary');
  const variables = {}, tokenNames = {};
  for (const [name, value] of Object.entries(colors)) {
    const variable = figma.variables.createVariable('sanctuary/' + name, collection, 'COLOR');
    variable.scopes = ['FRAME_FILL','SHAPE_FILL','TEXT_FILL','STROKE_COLOR'];
    variable.setValueForMode(collection.defaultModeId, rgb(value));
    variable.setVariableCodeSyntax('WEB', '--sanctuary-' + name);
    variables[variable.name] = variable; tokenNames[name] = variable.name;
  }
  function rgb(hex) { return {r:parseInt(hex.slice(1,3),16)/255,g:parseInt(hex.slice(3,5),16)/255,b:parseInt(hex.slice(5,7),16)/255}; }
  function paint(name) {
    const p = {type:'SOLID',color:rgb(colors[name] || name)};
    return variables[tokenNames[name]] ? figma.variables.setBoundVariableForPaint(p,'color',variables[tokenNames[name]]) : p;
  }
  function fill(node, name) { node.fills = name ? [paint(name)] : []; }
  function auto(parent,name,direction,width,gap=0,padding=0,bg) {
    const n=figma.createFrame(); if(parent)parent.appendChild(n); n.name=name;n.layoutMode=direction;
    n.resize(width,1);n.primaryAxisSizingMode=direction==='VERTICAL'?'AUTO':'FIXED';n.counterAxisSizingMode=direction==='VERTICAL'?'FIXED':'AUTO';
    n.itemSpacing=gap;n.paddingLeft=n.paddingRight=n.paddingTop=n.paddingBottom=padding;fill(n,bg);n.clipsContent=false;return n;
  }
  function fixed(parent,name,width,height,bg) {
    const n=figma.createFrame();parent.appendChild(n);n.name=name;n.resize(width,height);fill(n,bg);n.clipsContent=false;return n;
  }
  function text(parent,name,value,size=14,line=1.7,width,family='Noto Sans Thai',style='Regular',color='ink') {
    const n=figma.createText();parent.appendChild(n);n.name=name;n.fontName={family,style};n.fontSize=size;
    n.lineHeight={unit:'PIXELS',value:size*line};n.characters=value;fill(n,color);
    if(width){n.resize(width,1);n.textAutoResize='HEIGHT';if(parent.layoutMode && parent.layoutMode!=='NONE')n.layoutSizingVertical='HUG';}else{n.textAutoResize='WIDTH_AND_HEIGHT';}
    return n;
  }
  function icon(parent,path,size=21,color='ink') {
    const svg=`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${path}" stroke="${colors[color]||color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const n=figma.createNodeFromSvg(svg);parent.appendChild(n);n.name='Icon';return n;
  }
  function mark(parent,size=39) {
    const petals=Array.from({length:6},(_,i)=>`<ellipse cx="24" cy="17" rx="5.5" ry="10" transform="rotate(${i*60} 24 24)" stroke="#d5b778" stroke-width=".7"/>`).join('');
    const n=figma.createNodeFromSvg(`<svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="21" stroke="#d5b778" stroke-width=".7"/>${petals}<circle cx="24" cy="24" r="2" fill="#d5b778"/></svg>`);parent.appendChild(n);n.name='BrandMark / editable vector';return n;
  }
  function decode64(s) {
    const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';const out=[];let bits=0,value=0;
    for(let i=0;i<s.length;i++){const n=alphabet.indexOf(s[i]);if(n<0)continue;value=(value<<6)|n;bits+=6;if(bits>=8){bits-=8;out.push((value>>bits)&255);}}
    return new Uint8Array(out);
  }
  const existingArtwork=await figma.getNodeByIdAsync('6:9');
  const existingArtworkFill=existingArtwork && Array.isArray(existingArtwork.fills) ? existingArtwork.fills.find(f=>f.type==='IMAGE') : null;
  const artworkHash=EMBEDDED.artwork?figma.createImage(decode64(EMBEDDED.artwork)).hash:existingArtworkFill?.imageHash;
  if(!artworkHash)throw new Error('The original Higgsfield artwork is missing; stopped before creating artboards.');
  const imageHashes={artwork:artworkHash};
  for(const size of ['desktop','mobile'])imageHashes[size]=EMBEDDED[size]?figma.createImage(decode64(EMBEDDED[size])).hash:imageHashes.artwork;
  function photo(parent,name,width,height,hash,mode='FILL') {const n=fixed(parent,name,width,height);n.fills=[{type:'IMAGE',imageHash:hash,scaleMode:mode}];n.clipsContent=true;return n;}

  // One native reusable button component; all uses are editable component instances.
  const components=auto(page,'Celestial Sanctuary / Native components','VERTICAL',720,24,32,'surface');components.x=2300;components.y=200;
  text(components,'Component documentation','Primary action / ปุ่มหลัก',24,1.5,650);
  text(components,'Usage','Noto Sans Thai · 14 px · 55 px touch target. Reused by header, hero, form, and scene controls.',13,1.7,650,'Noto Sans Thai','Regular','muted');
  const pill=figma.createComponent();components.appendChild(pill);pill.name='Action / Primary';pill.description='Life Code primary action. Editable label. Source: .button.primary / atelier.css.';
  pill.layoutMode='HORIZONTAL';pill.counterAxisAlignItems='CENTER';pill.primaryAxisSizingMode='AUTO';pill.counterAxisSizingMode='AUTO';pill.itemSpacing=24;pill.paddingTop=16;pill.paddingBottom=16;pill.paddingLeft=24;pill.paddingRight=24;pill.cornerRadius=4;fill(pill,'button');
  const label=text(pill,'Label','เริ่มสำรวจรหัสของคุณ',14,1.5,undefined,'Noto Sans Thai','Medium','buttonInk');
  const labelKey=pill.addComponentProperty('Label','TEXT',label.characters);label.componentPropertyReferences={characters:labelKey};
  const arrow=icon(pill,'M5 12h14m-5-5 5 5-5 5',21,'buttonInk');arrow.name='Arrow';
  const showArrow=pill.addComponentProperty('Show arrow','BOOLEAN',true);arrow.componentPropertyReferences={visible:showArrow};
  function button(parent,value,{small=false,secondary=false,fullWidth=false,arrow=true}={}) {
    const n=pill.createInstance();parent.appendChild(n);n.name=`Action / ${value}`;n.setProperties({[labelKey]:value,[showArrow]:arrow});
    if(small){n.paddingTop=10;n.paddingBottom=10;n.paddingLeft=15;n.paddingRight=15;n.itemSpacing=10;}
    if(secondary){fill(n,'base');n.strokes=[paint('border')];n.strokeWeight=1;for(const child of n.findAll(x=>x.type==='TEXT'))fill(child,'ink');for(const child of n.findAll(x=>x.type==='VECTOR'))child.strokes=[paint('ink')];}
    if(fullWidth){n.resize(parent.width-parent.paddingLeft-parent.paddingRight,55);n.primaryAxisSizingMode='FIXED';n.primaryAxisAlignItems='SPACE_BETWEEN';}
    return n;
  }
  function line(parent,width) {const n=figma.createRectangle();parent.appendChild(n);n.name='Divider';n.resize(width,1);fill(n,'border');n.opacity=.5;return n;}
  function between(parent,name,width,pad=0) {const n=auto(parent,name,'HORIZONTAL',width,0,pad);n.primaryAxisAlignItems='SPACE_BETWEEN';n.counterAxisAlignItems='CENTER';return n;}
  function linkedText(parent,name,value,size=13,color='ink') {const n=text(parent,name,value,size,1.6,undefined,'Noto Sans Thai','Regular',color);return n;}

  function header(root,mobile) {
    const w=root.width;const h=between(root,'Header',w,mobile?22:64);h.paddingTop=h.paddingBottom=mobile?20:25;
    const brand=auto(h,'Brand','HORIZONTAL',mobile?150:230,10);brand.primaryAxisSizingMode='AUTO';brand.counterAxisSizingMode='AUTO';brand.counterAxisAlignItems='CENTER';mark(brand,mobile?29:39);
    const b=auto(brand,'Brand text','VERTICAL',160,0);b.counterAxisSizingMode='AUTO';text(b,'Life Code','Life Code',mobile?27:32,1.05,undefined,'Cormorant Garamond');text(b,'Practitioner','by หมอเน่ mornaenae',mobile?9:10,1.5,undefined,'Noto Sans Thai','Regular','muted');
    const nav=auto(h,'Navigation','HORIZONTAL',mobile?160:350,mobile?17:34);nav.primaryAxisSizingMode='AUTO';nav.counterAxisSizingMode='AUTO';nav.counterAxisAlignItems='CENTER';
    if(!mobile)linkedText(nav,'Original design','The original ↗',12,'muted');linkedText(nav,'Catalogue','สำรวจกลิ่น',mobile?11:13);button(nav,'เริ่มต้น',{small:true,secondary:true,arrow:!mobile});
  }
  function centerText(parent,name,value,size,line,width,family='Noto Sans Thai',style='Regular',color='ink') {
    const n=text(parent,name,value,size,line,width,family,style,color);n.textAlignHorizontal='CENTER';return n;
  }
  function spark(parent,size=28) {
    const n=figma.createNodeFromSvg('<svg width="'+size+'" height="'+size+'" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 2c0 10-4 14-14 14 10 0 14 4 14 14 0-10 4-14 14-14-10 0-14-4-14-14Z" stroke="#d5b778" stroke-width="1.1"/><path d="m5 5 4 4m14 14 4 4M5 27l4-4M23 9l4-4" stroke="#d5b778"/></svg>');parent.appendChild(n);n.name='Spark / source SVG';return n;
  }
  function hero(root,mobile) {
    const w=root.width, inner=mobile?w-40:w-112;
    const section=auto(root,'Portal Hero','VERTICAL',w,0,mobile?20:56,'base');section.paddingTop=34;section.paddingBottom=0;section.counterAxisAlignItems='CENTER';
    const heading=auto(section,'Portal heading','VERTICAL',inner,10);heading.counterAxisAlignItems='CENTER';
    centerText(heading,'Main title',mobile?'Aromatherapy\nLife Code':'Aromatherapy Life Code',mobile?54:90,1.05,inner,'Cormorant Garamond','Regular','displayAccent');
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
    text(copy,'Story title','เมื่อความหอม\nพบกับจินตนาการ',mobile?32:41,1.5,copy.width,'Noto Sans Thai','Regular','displayAccent');
    text(copy,'Story description','ให้ความชอบพาคุณออกเดินทาง\nผ่านสีสัน เรื่องราว และโลกของกลิ่น\nในแบบของ หมอเน่ mornaenae',mobile?13:14,2,copy.width,'Noto Sans Thai','Regular','muted');
    text(copy,'Catalogue link','ค้นพบโลกของกลิ่น →',13,1.8,copy.width,'Noto Sans Thai','Regular','displayAccent');
    const imageColumn=auto(section,'Concept artwork','VERTICAL',mobile?inner:734,17);
    const art=photo(imageColumn,'Higgsfield / The Celestial Sanctuary',imageColumn.width,mobile?430:545,imageHashes.artwork);art.topLeftRadius=art.topRightRadius=mobile?125:160;art.bottomLeftRadius=art.bottomRightRadius=4;art.strokes=[paint('displayAccent')];art.strokeWeight=.7;
    const caption=between(imageColumn,'Artwork caption',imageColumn.width);text(caption,'Artwork title','The Celestial Sanctuary',mobile?20:22,1.3,undefined,'Cormorant Garamond','Italic','displayAccent');text(caption,'Artwork credit','ภาพศิลปะแนวคิด · Higgsfield',mobile?8:9,1.8,undefined,'Noto Sans Thai','Regular','muted');
    const ritual=auto(root,'Ritual Divider','HORIZONTAL',root.width,20,mobile?24:210);ritual.counterAxisAlignItems='CENTER';ritual.primaryAxisAlignItems='CENTER';spark(ritual,18);text(ritual,'Ritual phrase','YOUR STORY IS A UNIVERSE',mobile?7:9,2,undefined,'Noto Sans Thai','Regular','displayAccent');spark(ritual,18);
  }
  function field(parent,label,placeholder,width) {
    const f=auto(parent,`Field / ${label}`,'VERTICAL',width,8);text(f,'Label',label,13,1.5,width);
    const input=auto(f,'Input','HORIZONTAL',width,0,14,'surface');input.paddingTop=input.paddingBottom=13;input.strokes=[paint('border')];input.strokeWeight=1;input.cornerRadius=5;text(input,'Placeholder',placeholder,14,1.6,undefined,'Noto Sans Thai','Regular','muted');return f;
  }
  function form(root,mobile) {
    const w=root.width,inner=mobile?w-48:1078;const section=auto(root,'Begin / Pending formula form',mobile?'VERTICAL':'HORIZONTAL',w,mobile?30:105,0);section.paddingTop=mobile?65:115;section.paddingBottom=mobile?30:72;section.paddingLeft=section.paddingRight=(w-inner)/2;
    const copy=auto(section,'Begin / Invitation','VERTICAL',mobile?inner:460,22);const title=auto(copy,'Begin headline','VERTICAL',copy.width,0);text(title,'Begin','Begin',mobile?65:84,.95,copy.width,'Cormorant Garamond');text(title,'With you','with you.',mobile?65:84,.95,copy.width,'Cormorant Garamond','Italic','displayAccent');text(copy,'Begin Thai invitation',mobile?'เริ่มทำความรู้จักเรื่องราวในแบบของคุณ':'เริ่มทำความรู้จัก\nเรื่องราวในแบบของคุณ',mobile?21:25,1.6,copy.width);text(copy,'Form explanation','กรอกข้อมูลเพื่อทดลองขั้นตอนของ Life Code\nใช้เวลาเพียงช่วงสั้น ๆ และไม่ต้องสมัครสมาชิก',mobile?12:13,1.9,copy.width,'Noto Sans Thai','Regular','muted');if(!mobile){mark(copy,65);text(copy,'Memory only notice','ชื่อและวันเกิดอยู่ในหน้านี้ชั่วคราว\nคุณเลือกเริ่มใหม่ได้ทุกเมื่อ',11,1.8,copy.width,'Noto Sans Thai','Regular','muted');}
    const panel=auto(section,'Form panel','VERTICAL',mobile?inner:513,18,mobile?21:32,'surface');panel.cornerRadius=16;const fw=panel.width-panel.paddingLeft-panel.paddingRight;
    text(panel,'Form title','ทำความรู้จักรหัสของคุณ',mobile?21:23,1.5,fw);text(panel,'Form description','ลองกรอกข้อมูลเพื่อดูสถานะของรหัส ไม่ต้องสมัครสมาชิก',mobile?11:12,1.8,fw,'Noto Sans Thai','Regular','muted');text(panel,'Formula pending notice','ต้นแบบนี้ยังไม่เปิดการคำนวณ จนกว่าจะตรวจสอบกติกาและตัวอย่างที่ยืนยันแล้ว',11,1.8,fw,'Noto Sans Thai','Regular','amber');
    field(panel,'ชื่อของคุณ *','ชื่อที่ต้องการใช้',fw);
    const birth=auto(panel,'Birth date','VERTICAL',fw,10);text(birth,'Date legend','วันเดือนปีเกิด *',13,1.5,fw);
    const toggles=auto(birth,'Calendar era','HORIZONTAL',142,0,4,'subtle');toggles.cornerRadius=8;const be=auto(toggles,'Buddhist Era / selected','HORIZONTAL',67,0,9,'selected');be.cornerRadius=6;text(be,'B.E.','พ.ศ.',12,1.6);const ce=auto(toggles,'Common Era','HORIZONTAL',67,0,9);text(ce,'C.E.','ค.ศ.',12,1.6);
    const dates=auto(birth,'Date fields','HORIZONTAL',fw,10);for(const [name,width]of [['วัน',(fw-20)*.24],['เดือน',(fw-20)*.44],['ปี',(fw-20)*.32]]){const input=auto(dates,`Select / ${name}`,'HORIZONTAL',width,0,12,'surface');input.strokes=[paint('border')];input.strokeWeight=1;input.cornerRadius=5;input.primaryAxisAlignItems='SPACE_BETWEEN';text(input,'Value',name,14,1.6);text(input,'Dropdown','⌄',14,1.6);}
    text(birth,'Date help','เลือกวัน เดือน และปีเกิด โดยสลับ พ.ศ. หรือ ค.ศ. ได้',11,1.8,fw,'Noto Sans Thai','Regular','muted');field(panel,'เวลาเกิด (ไม่บังคับ)','--:--',fw);text(panel,'Time help','เว้นว่างได้ หากไม่ทราบเวลาเกิด',11,1.8,fw,'Noto Sans Thai','Regular','muted');button(panel,'ดูสถานะรหัสของฉัน',{fullWidth:true});const reset=text(panel,'Clear data','ล้างข้อมูล',12,1.6,fw);reset.textAlignHorizontal='CENTER';text(panel,'Privacy note','ข้อมูลอยู่ในหน้านี้ชั่วคราวเท่านั้น · ความเป็นส่วนตัว',10,1.8,fw,'Noto Sans Thai','Regular','muted');
    return section;
  }
  function ending(root,mobile) {
    const inner=mobile?root.width-48:1028;
    const section=auto(root,'Discovery and number reference','VERTICAL',root.width,18,0);section.paddingLeft=section.paddingRight=(root.width-inner)/2;section.paddingTop=24;section.paddingBottom=42;
    text(section,'Discovery title','เรื่องราวของตัวเลขและความหอม',mobile?17:19,1.6,inner);text(section,'Discovery description','เริ่มจากชื่อกลิ่นที่คุณอยากรู้จัก',mobile?11:13,1.8,inner,'Noto Sans Thai','Regular','muted');text(section,'Catalogue link','สำรวจกลิ่นทั้งหมด →',13,1.8,inner);fixed(section,'Spacing / reference',1,20);text(section,'Number reference title','เรื่องราวของตัวเลข',mobile?18:20,1.6,inner);text(section,'Number reference pending','ความหมายและการจับคู่กลิ่นจะปรากฏเมื่อเจ้าของแบรนด์ยืนยันแล้ว',mobile?11:12,1.8,inner,'Noto Sans Thai','Regular','muted');
    const numbers=auto(section,'Number reference links','HORIZONTAL',inner,mobile?10:14);numbers.layoutWrap='WRAP';numbers.counterAxisSpacing=10;for(let i=1;i<=9;i++){const n=auto(numbers,`Reference / ${i}`,'VERTICAL',44,3,0,'surface');n.topLeftRadius=n.topRightRadius=22;n.bottomLeftRadius=n.bottomRightRadius=4;n.strokes=[paint('displayAccent')];n.strokeWeight=.5;const t=text(n,'Reference number',String(i),30,1.5,44,'Cormorant Garamond');t.textAlignHorizontal='CENTER';line(n,44);}
    const footer=auto(root,'Footer','VERTICAL',root.width,20,mobile?24:64);footer.paddingTop=46;line(footer,root.width-footer.paddingLeft-footer.paddingRight);const signature=text(footer,'Signature','Life Code',mobile?53:62,1.1,root.width-footer.paddingLeft-footer.paddingRight,'Cormorant Garamond','Regular','displayAccent');signature.textAlignHorizontal='CENTER';const motto=text(footer,'Motto','A little closer to yourself.',mobile?17:19,1.2,signature.width,'Cormorant Garamond','Italic','displayAccent');motto.textAlignHorizontal='CENTER';fixed(footer,'Spacing / disclaimer',1,25);text(footer,'Disclaimer','เนื้อหานี้นำเสนอแนวคิดเรื่องตัวเลขและกลิ่นเพื่อการเรียนรู้ ไม่ใช่การประเมินสุขภาพหรือคำแนะนำทางการแพทย์',mobile?10:11,1.9,signature.width,'Noto Sans Thai','Regular','muted');text(footer,'Footer metadata','Aromatherapy Life Code · หมอเน่ mornaenae   ·   ความเป็นส่วนตัว',mobile?10:11,1.9,signature.width,'Noto Sans Thai','Regular','muted');
  }

  const created=[];
  for(const mobile of [false,true]){
    const root=auto(page,mobile?'Fantasy Mobile · 390':'Fantasy Desktop · 1440','VERTICAL',mobile?390:1440,0,0,'base');root.x=mobile?1800:200;root.y=200;created.push(root);
    header(root,mobile);hero(root,mobile);story(root,mobile);form(root,mobile);ending(root,mobile);
  }
  figma.currentPage.selection=created;
  figma.viewport.scrollAndZoomIntoView(created);
  const report={artboards:created.map(n=>({id:n.id,name:n.name,width:n.width,height:n.height})),componentFrame:components.id,actualSceneCaptures:{desktop:Boolean(EMBEDDED.desktop),mobile:Boolean(EMBEDDED.mobile)},editable:true};
  print(JSON.stringify({page:{id:page.id,name:page.name},...report}));

}
await buildCelestialSanctuary();
