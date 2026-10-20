// Web derivatives of the approved Sling Bling art. Source files are read only.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const source = path.resolve(process.argv[2] || '');
const out = path.resolve(__dirname, '../assets/sling-bling');
if (!fs.existsSync(path.join(source, 'creatures.png'))) throw Error('Supply the approved bling artwork directory');
fs.mkdirSync(out, {recursive:true});
async function cell(file, columns, rows, column, row, name, width) {
  const input = path.join(source,file), meta = await sharp(input).metadata();
  const left=Math.round(meta.width*column/columns)+3, top=Math.round(meta.height*row/rows)+3;
  const right=Math.round(meta.width*(column+1)/columns)-3, bottom=Math.round(meta.height*(row+1)/rows)-3;
  await sharp(input).extract({left,top,width:right-left,height:bottom-top}).resize({width,withoutEnlargement:true}).webp({quality:90}).toFile(path.join(out,name+'.webp'));
}
(async()=>{
  await sharp(path.join(source,'logo.png')).trim().resize({width:1000,withoutEnlargement:true}).webp({quality:90}).toFile(path.join(out,'logo.webp'));
  await sharp(path.join(source,'icon-1024.png')).resize(768,768).webp({quality:90}).toFile(path.join(out,'tile-768.webp'));
  for (const [name,x,y] of [['eagle',0,0],['bull',1,0],['dragon',3,0],['lion',0,1]]) await cell('creatures.png',5,4,x,y,name,320);
  for (const [name,x,y] of [['tuscany',0,0],['kyoto',1,0],['santorini',2,0],['dubai',3,0],['london',4,0],['paris',2,2]]) await cell('environments.png',5,4,x,y,name,400);
  for (const [name,x,y] of [['coin',0,0],['ruby',1,0],['sapphire',3,0],['portal',0,1]]) await cell('tokens.png',4,3,x,y,name,240);
  console.log('Created 16 approved web derivatives; original artwork untouched.');
})();
