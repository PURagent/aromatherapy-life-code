/* Standard native Figma plugin API; no MCP APIs, network, or account changes. */
async function buildAmberAtelier() {
  const fileKey = 'LqRPvQwLT21JOqbGjazCyh';
  if (figma.fileKey && figma.fileKey !== fileKey) throw new Error('Open the existing Life Code — The Amber Atelier file.');
  const page = figma.root.children.find(p => p.id === '0:1' && p.name === '01 · The Amber Atelier');
  if (!page) throw new Error('Expected Amber Atelier page was not found. Nothing changed.');
  await figma.setCurrentPageAsync(page);
  const prior = page.children.filter(n => n.name === 'Native Desktop · 1440' || n.name === 'Native Mobile · 390');
  if (prior.length) { figma.viewport.scrollAndZoomIntoView(prior); throw new Error('Native artboards already exist; stopped to avoid duplication.'); }
  await Promise.all([
    {family:'Cormorant Garamond',style:'Regular'}, {family:'Cormorant Garamond',style:'Italic'},
    {family:'Noto Sans Thai',style:'Regular'}, {family:'Noto Sans Thai',style:'Medium'},
  ].map(font => figma.loadFontAsync(font)));

  const colors = { base:'#eee9df', surface:'#faf8f2', ink:'#272920', muted:'#65685d', amber:'#9b5c28', displayAccent:'#7d683d', button:'#2f3428', border:'#b5b1a5', subtle:'#eeece2', selected:'#d5d9c7' };
  const variables = Object.fromEntries((await figma.variables.getLocalVariablesAsync()).map(v => [v.name,v]));
  const tokenNames = {base:'color/base',surface:'color/surface',ink:'color/ink',muted:'color/ink-muted',amber:'color/amber'};
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
    const petals=Array.from({length:6},(_,i)=>`<ellipse cx="24" cy="17" rx="5.5" ry="10" transform="rotate(${i*60} 24 24)" stroke="#9b5c28" stroke-width=".7"/>`).join('');
    const n=figma.createNodeFromSvg(`<svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="21" stroke="#9b5c28" stroke-width=".7"/>${petals}<circle cx="24" cy="24" r="2" fill="#9b5c28"/></svg>`);parent.appendChild(n);n.name='BrandMark / editable vector';return n;
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
  const components=auto(page,'Amber Atelier / Native components','VERTICAL',720,24,32,'surface');components.x=2300;components.y=200;
  text(components,'Component documentation','Primary action / ปุ่มหลัก',24,1.5,650);
  text(components,'Usage','Noto Sans Thai · 14 px · 55 px touch target. Reused by header, hero, form, and scene controls.',13,1.7,650,'Noto Sans Thai','Regular','muted');
  const pill=figma.createComponent();components.appendChild(pill);pill.name='Action / Primary';pill.description='Life Code primary action. Editable label. Source: .button.primary / atelier.css.';
  pill.layoutMode='HORIZONTAL';pill.counterAxisAlignItems='CENTER';pill.primaryAxisSizingMode='AUTO';pill.counterAxisSizingMode='AUTO';pill.itemSpacing=24;pill.paddingTop=16;pill.paddingBottom=16;pill.paddingLeft=24;pill.paddingRight=24;pill.cornerRadius=999;fill(pill,'button');
  const label=text(pill,'Label','เริ่มสำรวจรหัสของคุณ',14,1.5,undefined,'Noto Sans Thai','Medium','surface');
  const labelKey=pill.addComponentProperty('Label','TEXT',label.characters);label.componentPropertyReferences={characters:labelKey};
  const arrow=icon(pill,'M5 12h14m-5-5 5 5-5 5',21,'surface');arrow.name='Arrow';
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
    if(!mobile)linkedText(nav,'Original design','แบบแรก ↗',12,'muted');linkedText(nav,'Catalogue','สำรวจกลิ่น',mobile?11:13);button(nav,'เริ่มต้น',{small:true,secondary:true,arrow:!mobile});
  }
  function hero(root,mobile) {
    const w=root.width;
    const section=mobile?auto(root,'Hero','VERTICAL',w,0,0):fixed(root,'Hero',w,710);
    const copy=auto(section,'Hero / Copy','VERTICAL',mobile?w-48:540,0);copy.x=mobile?24:106;copy.y=mobile?38:68;
    if(mobile){section.paddingTop=38;section.paddingLeft=24;section.paddingRight=24;section.counterAxisAlignItems='CENTER';}
    const title=auto(copy,'Headline','VERTICAL',copy.width,0);text(title,'Scent','Scent,',mobile?72:100,mobile?.88:.86,copy.width,'Cormorant Garamond');const italic=text(title,'In motion','in motion.',mobile?72:100,mobile?.88:.86,copy.width-(mobile?28:0),'Cormorant Garamond','Italic','displayAccent');if(mobile){italic.x=28;title.paddingLeft=0;const t=auto(title,'Indented second line','HORIZONTAL',copy.width,0);t.paddingLeft=28;t.appendChild(italic);}
    const invitation=text(copy,'Thai invitation',mobile?'ช่วงเวลาเล็ก ๆ ที่ได้กลับมาหาตัวเอง':'ช่วงเวลาเล็ก ๆ\nที่ได้กลับมาหาตัวเอง',mobile?20:28,1.6,copy.width);invitation.layoutAlign='STRETCH';
    const spacerA=fixed(copy,'Spacing / title to invitation',1,mobile?22:34);copy.insertChild(1,spacerA);
    const description=text(copy,'Introduction',mobile?'สำรวจความหอมและเรื่องราวของตัวเลข ในแบบของ หมอเน่ mornaenae':'สำรวจความหอมและเรื่องราวของตัวเลข\nในแบบของ หมอเน่ mornaenae',mobile?12:14,1.9,mobile?310:490,'Noto Sans Thai','Regular','muted');const s=fixed(copy,'Spacing / description',1,mobile?10:16);copy.insertChild(copy.children.indexOf(description),s);
    fixed(copy,'Spacing / action',1,mobile?22:30);button(copy,'เริ่มสำรวจรหัสของคุณ');fixed(copy,'Spacing / disclosure',1,mobile?12:15);text(copy,'Prototype disclosure','ต้นแบบประสบการณ์ · การคำนวณรอการยืนยันสูตร',mobile?10:11,1.8,copy.width,'Noto Sans Thai','Regular','muted');
    let scene;
    if(mobile){scene=fixed(section,'Hero / Scene',w,350);scene.layoutAlign='INHERIT';scene.x=-24;}
    else{scene=fixed(section,'Hero / Scene',811,658);scene.x=601;scene.y=-18;section.insertChild(0,scene);}
    photo(scene,EMBEDDED[mobile?'mobile':'desktop']?'Actual Three.js scene capture':'Higgsfield concept image — static Figma fallback',scene.width,scene.height,imageHashes[mobile?'mobile':'desktop'],'FIT');
    const sceneTitle=text(scene,'Scene caption / top','A study of scent',mobile?16:20,1.3,undefined,'Cormorant Garamond','Italic','muted');sceneTitle.x=scene.width-(mobile?145:220);sceneTitle.y=mobile?16:42;
    const caption=text(scene,'Scene caption / bottom',mobile?'ศิลปะแห่งความหอม':'ศิลปะแห่งความหอม\nขยับเมาส์เพื่อเปลี่ยนมุมมอง',mobile?12:12,1.7,220,'Noto Sans Thai','Regular','muted');caption.x=mobile?32:scene.width*.25;caption.y=scene.height-48;
    const pause=button(scene,'หยุดภาพ',{small:true,secondary:true,arrow:false});pause.x=scene.width-pause.width-(mobile?24:64);pause.y=scene.height-58;
    if(mobile){fixed(section,'Spacing / footer',1,29);}
    const bottom=auto(section,'Hero / Bottom rule','VERTICAL',mobile?w-48:1312,0);if(!mobile){bottom.x=64;bottom.y=616;}line(bottom,bottom.width);const row=between(bottom,'Hero / Metadata',bottom.width,0);row.paddingTop=row.paddingBottom=mobile?12:24;text(row,'Product label','AROMATHERAPY LIFE CODE',mobile?8:10,1.7,undefined,'Noto Sans Thai','Regular','muted');text(row,'Scroll hint','เลื่อนเพื่อสำรวจ ↓',mobile?10:12,1.7,undefined,'Noto Sans Thai','Regular','muted');if(!mobile)text(row,'Creator','BY MORNAENAE',10,1.7,undefined,'Noto Sans Thai','Regular','muted');
    return section;
  }
  function story(root,mobile) {
    const w=root.width,inner=mobile?w-48:1228;
    const section=auto(root,'Scent story','VERTICAL',w,0,0);section.paddingTop=mobile?62:105;section.paddingLeft=section.paddingRight=(w-inner)/2;if(mobile)section.counterAxisAlignItems='CENTER';
    const heading=auto(section,'Story / Heading',mobile?'VERTICAL':'HORIZONTAL',inner,mobile?22:45);heading.primaryAxisAlignItems=mobile?'MIN':'SPACE_BETWEEN';heading.counterAxisAlignItems=mobile?'MIN':'MAX';
    text(heading,'Story title','ความหอมมีเรื่องราว\nและคุณก็เช่นกัน',mobile?28:38,1.6,mobile?inner:610);
    text(heading,'Story introduction','ให้การสำรวจครั้งนี้เริ่มจากความชอบของคุณ\nค่อย ๆ ทำความรู้จักชื่อกลิ่น และแนวคิดเรื่องตัวเลข\nโดยไม่ต้องรีบหาคำตอบให้กับตัวเอง',mobile?12:14,2,mobile?inner:465,'Noto Sans Thai','Regular','muted');
    fixed(section,'Spacing / story image',1,mobile?28:48);
    const art=photo(section,'Higgsfield / The Amber Study',mobile?w:inner,mobile?390:560,imageHashes.artwork);if(mobile)art.x=-24;
    const captions=between(section,'Artwork captions',inner);captions.paddingTop=16;text(captions,'Artwork title','The Amber Study',mobile?23:26,1.3,undefined,'Cormorant Garamond','Italic','displayAccent');text(captions,'Artwork credit','ภาพศิลปะแนวคิด · Higgsfield',mobile?9:10,1.5,undefined,'Noto Sans Thai','Regular','muted');
    const close=auto(section,'Story / Close',mobile?'VERTICAL':'HORIZONTAL',inner,mobile?12:0);close.primaryAxisAlignItems=mobile?'MIN':'SPACE_BETWEEN';close.paddingTop=mobile?24:35;close.paddingBottom=mobile?35:64;text(close,'Story closing invitation','เลือกสำรวจจากสิ่งที่ดึงดูดคุณ',mobile?12:14,1.8,undefined,'Noto Sans Thai','Regular','muted');text(close,'Catalogue action','ค้นพบโลกของกลิ่น →',mobile?13:14,1.8);line(section,inner);
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
    const numbers=auto(section,'Number reference links','HORIZONTAL',inner,mobile?10:14);numbers.layoutWrap='WRAP';numbers.counterAxisSpacing=10;for(let i=1;i<=9;i++){const n=auto(numbers,`Reference / ${i}`,'VERTICAL',44,3);const t=text(n,'Reference number',String(i),30,1.5,44,'Cormorant Garamond');t.textAlignHorizontal='CENTER';line(n,44);}
    const footer=auto(root,'Footer','VERTICAL',root.width,20,mobile?24:64);footer.paddingTop=46;line(footer,root.width-footer.paddingLeft-footer.paddingRight);const signature=text(footer,'Signature','Life Code',mobile?53:62,1.1,root.width-footer.paddingLeft-footer.paddingRight,'Cormorant Garamond','Regular','displayAccent');signature.textAlignHorizontal='CENTER';const motto=text(footer,'Motto','A little closer to yourself.',mobile?17:19,1.2,signature.width,'Cormorant Garamond','Italic','displayAccent');motto.textAlignHorizontal='CENTER';fixed(footer,'Spacing / disclaimer',1,25);text(footer,'Disclaimer','เนื้อหานี้นำเสนอแนวคิดเรื่องตัวเลขและกลิ่นเพื่อการเรียนรู้ ไม่ใช่การประเมินสุขภาพหรือคำแนะนำทางการแพทย์',mobile?10:11,1.9,signature.width,'Noto Sans Thai','Regular','muted');text(footer,'Footer metadata','Aromatherapy Life Code · หมอเน่ mornaenae   ·   ความเป็นส่วนตัว',mobile?10:11,1.9,signature.width,'Noto Sans Thai','Regular','muted');
  }

  const created=[];
  for(const mobile of [false,true]){
    const root=auto(page,mobile?'Native Mobile · 390':'Native Desktop · 1440','VERTICAL',mobile?390:1440,0,0,'base');root.x=mobile?1800:200;root.y=200;created.push(root);
    header(root,mobile);hero(root,mobile);story(root,mobile);form(root,mobile);ending(root,mobile);
  }
  // Preserve the initial draft for history; hide only our known original artboards.
  for(const id of ['3:25','3:26']){const node=await figma.getNodeByIdAsync(id);if(node)node.visible=false;}
  figma.currentPage.selection=created;
  figma.viewport.scrollAndZoomIntoView(created);
  const report={artboards:created.map(n=>({id:n.id,name:n.name,width:n.width,height:n.height})),componentFrame:components.id,actualSceneCaptures:{desktop:Boolean(EMBEDDED.desktop),mobile:Boolean(EMBEDDED.mobile)},editable:true};
  console.log(JSON.stringify(report));
  figma.closePlugin(EMBEDDED.desktop&&EMBEDDED.mobile?'Native desktop and mobile designs created. Review both artboards.':'Native layouts created with Higgsfield concept art. Actual scene captures are still required for visual parity.');
}
buildAmberAtelier().catch(error=>{console.error(error);figma.closePlugin(error instanceof Error?error.message:String(error));});
