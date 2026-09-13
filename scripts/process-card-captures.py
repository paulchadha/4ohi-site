from PIL import Image
from pathlib import Path
import hashlib,json
items={
'palace':('C:/Users/paulc/Documents/PalaceApp/tmp/palace-responsive/device/portfolio-native-table.png','Actual Samsung app screenshot; system bars cropped'),
'hearts':('docs/card-source-captures/hearts-table.png','Actual Hearts web render from unchanged mobile-app source; local bot table'),
'spades':('C:/Users/paulc/.codex/worktrees/225a/Spades/tmp/spades-phone.png','Actual app web render from September 12 audit; local bot bidding'),
'euchre':('C:/Users/paulc/.codex/worktrees/2951/Euchre/tmp/table-844x390.png','Actual app web render from September 12 audit; local bot calling'),
'solitaire':('C:/Users/paulc/OneDrive/Documents/ChatGPT/Solitare/assets/solitaire/home-garden-v2.png','Artwork used in the Solitaire app; not a gameplay screenshot'),
'war':('C:/Users/paulc/OneDrive/Documents/ChatGPT/WAR/assets/war/tables/four-hearts-palace-garden.png','Artwork used in the War app; not a gameplay screenshot')}
records=[]
for key,(src,kind) in items.items():
 p=Path(src); im=Image.open(p).convert('RGB'); original=im.size
 if key=='palace': im=im.crop((0,48,im.width,im.height-40))
 im.thumbnail((1600,1200)); target=Path('assets/card-apps')/(key+'.webp'); im.save(target,quality=90,method=6)
 records.append(dict(product=key,path=str(target).replace('\\','/'),sourceName=p.name,sourceSHA256=hashlib.sha256(p.read_bytes()).hexdigest(),kind=kind,originalSize=original,width=im.width,height=im.height))
Path('assets/card-apps/provenance.json').write_text(json.dumps(records,indent=2))
canvas=Image.new('RGB',(900,1000));y=0
for key in ['hearts','solitaire','war']:
 im=Image.open('assets/card-apps/'+key+'.webp');im.thumbnail((900,330));canvas.paste(im,(0,y));y+=330
canvas.save('docs/card-source-captures/final-art-review.jpg',quality=75)
