from pathlib import Path
out=Path(__file__).resolve().parents[1]/'dist/assets/avatars'
# The characters are editable, native SVG artwork; institution marks are separate.
animals=[
('모찌 토끼','#f6f0e8','#f3e4de','rabbit'),('꿀잠 곰','#c99f7d','#f5ebd7','bear'),('살구 고양이','#edb48a','#f6e6d8','cat'),('몽실 강아지','#e8d4b5','#e7efdf','dog'),('단풍 여우','#e29a68','#f5ead9','fox'),('포근 판다','#f8f5ed','#e7ece4','panda'),('유칼 코알라','#b4bdb7','#eeece5','koala'),('콩알 햄스터','#e7bc82','#f6eadb','hamster'),('동글 수달','#a98468','#e6eee9','otter'),('빙수 펭귄','#657d88','#e4eced','penguin'),('햇살 병아리','#f2cf70','#f5edda','chick'),('도담 오리','#f7edc8','#e5eddf','duck'),('초록 개구리','#a3ba83','#edf1df','frog'),('용감 사자','#e8bc73','#f4e7d5','lion'),('줄무늬 호랑이','#eab074','#e8eddf','tiger'),('복숭아 돼지','#e9b2a6','#f5e9dd','pig'),('솜솜 양','#f2eee5','#e8ebdf','sheep'),('우유 젖소','#f5f2e9','#f0e7df','cow'),('밤톨 라쿤','#b5b3a9','#e5eddf','raccoon'),('새싹 사슴','#cfa67e','#f5ead9','deer'),('도토리 다람쥐','#c5966c','#e6eddf','squirrel'),('밤송 고슴도치','#b5977b','#f2e8dc','hedgehog'),('하품 하마','#b9aebc','#e8e9ed','hippo'),('구름 코끼리','#b8c5c6','#f3e9df','elephant'),('파도 물개','#c9d7d5','#e6eef0','seal'),('느긋 카피바라','#b69c7f','#f0e8d7','capybara'),('방긋 쿼카','#c6a488','#e5eddf','quokka'),('별빛 부엉이','#ba9d7b','#eee7dc','owl'),('마시멜로 알파카','#f5eadb','#e8ecdf','alpaca'),('새싹 공룡','#a9bd94','#f5eddc','dino')]
for i,(name,fur,bg,kind) in enumerate(animals,1):
 pre='';post='';face='';head=f'<ellipse cx="104" cy="116" rx="58" ry="53" fill="{fur}"/>'
 roundears=['bear','panda','koala','hamster','otter','raccoon','hippo','capybara','quokka','lion']
 if kind in roundears:
  r=22 if kind=='koala' else 16
  color='#55615c' if kind=='panda' else fur
  pre+=f'<circle cx="61" cy="74" r="{r}" fill="{color}"/><circle cx="147" cy="74" r="{r}" fill="{color}"/><circle cx="61" cy="75" r="{r-7}" fill="#e9c6b3"/><circle cx="147" cy="75" r="{r-7}" fill="#e9c6b3"/>'
 if kind in ['rabbit','alpaca']:
  pre+=f'<ellipse cx="77" cy="58" rx="15" ry="36" fill="{fur}" transform="rotate(-10 77 58)"/><ellipse cx="131" cy="58" rx="15" ry="36" fill="{fur}" transform="rotate(10 131 58)"/><ellipse cx="77" cy="56" rx="6" ry="23" fill="#eab9ab"/><ellipse cx="131" cy="56" rx="6" ry="23" fill="#eab9ab"/>'
 if kind in ['cat','fox','tiger','cow','deer','squirrel','owl']:
  pre+=f'<path d="M49 99Q35 40 78 73M130 73Q174 39 159 99" fill="{fur}"/><path d="m50 80 4-23 18 21m65 0 17-21 4 23" fill="#e7b2a0"/>'
 if kind=='dog':pre+='<ellipse cx="48" cy="111" rx="18" ry="40" fill="#bc926f" transform="rotate(12 48 111)"/><ellipse cx="160" cy="111" rx="18" ry="40" fill="#bc926f" transform="rotate(-12 160 111)"/>'
 if kind=='lion':pre+='<path d="M104 49c17-20 36-7 38 5 24-7 36 8 30 26 22 8 26 30 13 42 11 23-7 42-23 39-6 25-33 28-44 15-22 17-45 7-47-9-27 4-37-17-28-31-20-17-11-41 4-45-11-25 6-42 25-37 7-20 27-22 32-5" fill="#bd8956"/>'
 if kind=='hedgehog':pre+='<path d="m38 137-6-34 10 2-2-24 15 3 1-26 17 9 12-27 15 20 20-21 10 22 22-12 2 23 22-3-5 25 15 11-14 23z" fill="#86715e"/>'
 if kind=='elephant':pre+=f'<ellipse cx="44" cy="111" rx="28" ry="42" fill="{fur}"/><ellipse cx="164" cy="111" rx="28" ry="42" fill="{fur}"/><ellipse cx="44" cy="112" rx="16" ry="29" fill="#e0bdb6"/><ellipse cx="164" cy="112" rx="16" ry="29" fill="#e0bdb6"/>'
 if kind in ['penguin','owl']:
  face+='<path d="M61 115c-7-43 39-49 43-17 5-32 50-26 43 17 15 40-101 40-86 0" fill="#f8f3e6"/>'
 if kind in ['panda','raccoon']:
  color='#5e6860' if kind=='panda' else '#7e8175'
  face+=f'<ellipse cx="78" cy="110" rx="17" ry="20" fill="{color}" transform="rotate(20 78 110)"/><ellipse cx="130" cy="110" rx="17" ry="20" fill="{color}" transform="rotate(-20 130 110)"/>'
 if kind in ['fox','otter','hamster','dog','bear','capybara','quokka','hedgehog','alpaca']:
  face+='<ellipse cx="104" cy="132" rx="31" ry="22" fill="#f7ead7"/>'
 if kind=='frog':
  pre+=f'<circle cx="72" cy="79" r="20" fill="{fur}"/><circle cx="136" cy="79" r="20" fill="{fur}"/>'
 if kind=='sheep':
  pre+=''.join(f'<circle cx="{x}" cy="{y}" r="22" fill="#f6f0e5"/>' for x,y in [(56,84),(79,67),(107,65),(135,68),(155,88),(52,114),(158,117),(65,147),(145,148)])
  head='<ellipse cx="104" cy="117" rx="46" ry="49" fill="#d2bda3"/>'
 if kind=='cow':face+='<path d="M48 107c-4-34 37-53 47-27 10 24-18 47-47 27" fill="#6a7066"/><ellipse cx="104" cy="137" rx="32" ry="20" fill="#eab6ac"/>'
 if kind=='pig':face+='<ellipse cx="104" cy="137" rx="28" ry="20" fill="#d9938e"/><ellipse cx="95" cy="136" rx="3" ry="5" fill="#9d736e"/><ellipse cx="113" cy="136" rx="3" ry="5" fill="#9d736e"/>'
 if kind=='deer':pre+='<path d="M77 75 66 42 56 31m10 14-17-3m83 33 11-33 10-11m-10 14 17-3" stroke="#a98c6b" stroke-width="8" fill="none" stroke-linecap="round"/>'
 if kind in ['tiger','cat']:
  face+='<path d="m92 65 4 21m16-21-3 21M48 111l19 6m-19 8 19 3m94-17-19 6m19 8-19 3" stroke="#a57b57" stroke-width="5" stroke-linecap="round"/>'
 if kind=='squirrel':face+='<path d="M95 64v23m18-23v23" stroke="#e9ceb0" stroke-width="7" stroke-linecap="round"/><path d="M99 143v10h11v-10" fill="#fff9ee"/>'
 if kind=='dino':
  pre+='<path d="m80 71 5-26 15 24 14-27 11 31 20-18 4 34" fill="#829d6c"/>'
  face+='<ellipse cx="104" cy="133" rx="35" ry="23" fill="#d6dfba"/><circle cx="88" cy="130" r="3" fill="#718366"/><circle cx="120" cy="130" r="3" fill="#718366"/>'
 eyes=''
 for x in [81,127]:eyes+=f'<ellipse cx="{x}" cy="111" rx="4.5" ry="6" fill="#4d5147"/><circle cx="{x+1}" cy="109" r="1.4" fill="#fff"/>'
 if kind=='frog':eyes='<circle cx="74" cy="86" r="5" fill="#4d5147"/><circle cx="134" cy="86" r="5" fill="#4d5147"/>'
 cheeks='<ellipse cx="68" cy="126" rx="9" ry="5" fill="#e8a99c" opacity=".65"/><ellipse cx="140" cy="126" rx="9" ry="5" fill="#e8a99c" opacity=".65"/>'
 mouth='<path d="M93 141q11 12 22 0" stroke="#6e6255" stroke-width="3" stroke-linecap="round" fill="none"/>'
 nose='<ellipse cx="104" cy="128" rx="5" ry="3.5" fill="#846d5b"/>'
 if kind in ['chick','duck','penguin','owl']:nose='<path d="m97 128 7-5 7 5-7 7z" fill="#dba24e"/>'
 if kind=='duck':nose='<ellipse cx="104" cy="130" rx="17" ry="7" fill="#e3ac57"/>'
 if kind=='elephant':post+='<path d="M94 128v22q0 19 17 15l9-4" fill="none" stroke="#a3b1b3" stroke-width="17" stroke-linecap="round"/>';nose=''
 if kind in ['pig','cow','dino']:nose=''
 if kind=='seal':
  pre+='<ellipse cx="57" cy="144" rx="26" ry="10" fill="#b8cbc8" transform="rotate(-25 57 144)"/><ellipse cx="151" cy="144" rx="26" ry="10" fill="#b8cbc8" transform="rotate(25 151 144)"/>'
  face+='<path d="M60 125h20m-21 8 20-3m49-5h20m-20 5 20 3" stroke="#8ba19b" stroke-width="2" stroke-linecap="round"/>'
 # Small, different finishing details maintain a coherent character family.
 accessory=''
 if i%5==1:accessory='<path d="M104 65q-24-10-13-24 14 1 13 24 0-24 16-27 8 18-16 27" fill="#8fa87c"/>'
 elif i%5==2:accessory='<path d="m86 164 18 8-18 9zm36 0-18 8 18 9z" fill="#d8aa75"/><circle cx="104" cy="172" r="4" fill="#bd9063"/>'
 elif i%5==3:accessory='<circle cx="146" cy="84" r="10" fill="#f1cc77"/><circle cx="146" cy="84" r="4" fill="#c19e59"/>'
 elif i%5==4:accessory='<path d="M94 171q10-20 20 0l-10 10z" fill="#dc9b86"/>'
 else:accessory='<path d="m155 52 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill="#d8bb77"/>'
 svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 208 208" role="img" aria-label="{name}"><title>{name}</title><circle cx="104" cy="104" r="100" fill="{bg}"/><ellipse cx="104" cy="187" rx="46" ry="17" fill="{fur}"/>{pre}{head}{face}{eyes}{cheeks}{nose}{mouth}{post}{accessory}</svg>'
 (out/f'avatar-{i:02}.svg').write_text(svg)
print(f'Created {len(animals)} SVG character profiles.')
