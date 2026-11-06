'use strict';
// Browser-local accounts for the private interactive prototype. This is not server authentication.
const AccountCore=(()=>{
 const assert=(ok,message)=>{if(!ok)throw Error(message)};
 const scope=org=>org?'org:'+org:'site';
 const encode=bytes=>Array.from(new Uint8Array(bytes),n=>n.toString(16).padStart(2,'0')).join('');
 const decode=hex=>Uint8Array.from(hex.match(/.{2}/g)||[],n=>parseInt(n,16));
 const avatar=()=>1+crypto.getRandomValues(new Uint32Array(1))[0]%30;
 const id=()=>crypto.randomUUID();
 async function derive(password,salt){const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(password),'PBKDF2',false,['deriveBits']);return encode(await crypto.subtle.deriveBits({name:'PBKDF2',salt:decode(salt),iterations:120000,hash:'SHA-256'},key,256))}
 function ensure(db){db.localAccounts??=[];db.storeMembers??=[];db.accountProfiles??={};for(const order of db.orders||[])if(order.mine&&!order.ownerAccount)order.ownerAccount='buyer'+(order.fulfillments?.[0]?.org?':'+order.fulfillments[0].org:'');return db}
 async function register(db,input){ensure(db);const email=String(input.email||'').trim().toLowerCase(),name=String(input.name||'').trim(),org=input.org||null,role=org?'buyer':input.role;assert(!org||db.orgs.some(o=>o.id===org),'기관을 확인해 주세요.');assert(['buyer','individual','company'].includes(role),'가입 유형을 확인해 주세요.');assert(name&&name.length<=40,'이름을 40자 이내로 입력해 주세요.');assert(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),'이메일을 확인해 주세요.');assert(String(input.password||'').length>=8&&String(input.password||'').length<=128,'비밀번호를 8~128자로 입력해 주세요.');assert(input.password===input.confirm,'비밀번호 확인이 일치하지 않습니다.');const key=scope(org)+'|'+email;assert(!db.localAccounts.some(a=>a.key===key),'이 이메일로 가입한 체험 계정이 있습니다. 로그인해 주세요.');const salt=encode(crypto.getRandomValues(new Uint8Array(16))),hash=await derive(input.password,salt);assert(!db.localAccounts.some(a=>a.key===key),'이미 가입한 체험 계정입니다.');const a={id:id(),key,email,name,role,org,membership:org?(input.membership||'후원자'):'',salt,hash,createdAt:new Date().toISOString(),status:'활성',failures:0,lockedUntil:0};db.localAccounts.push(a);db.accountProfiles['email:'+a.id]={avatar:avatar(),details:{name,email}};join(db,a.org,'email:'+a.id,a.name,a.membership,'이메일 체험');return session(a)}
 function session(a){return {kind:'email',accountKey:'email:'+a.id,userId:a.id,role:a.role,buyerOrg:a.org,name:a.name,email:a.email,membership:a.membership}}
 async function login(db,input){ensure(db);const email=String(input.email||'').trim().toLowerCase(),a=db.localAccounts.find(a=>a.key===scope(input.org)+'|'+email);assert(a,'이메일 또는 비밀번호를 확인해 주세요. 가입한 기관몰도 확인해 주세요.');assert(a.status==='활성','이 체험 계정은 이용이 중지되어 있습니다.');assert(!a.lockedUntil||a.lockedUntil<Date.now(),'잠시 후 다시 시도해 주세요.');const hash=await derive(String(input.password||''),a.salt);let mismatch=hash.length^a.hash.length;for(let i=0;i<hash.length;i++)mismatch|=hash.charCodeAt(i)^a.hash.charCodeAt(i);if(mismatch){a.failures=(a.failures||0)+1;if(a.failures>=5){a.lockedUntil=Date.now()+60000;a.failures=0}throw Error('이메일 또는 비밀번호를 확인해 주세요.')}a.failures=0;a.lockedUntil=0;return session(a)}
 function join(db,org,accountKey,name,membership='후원자',provider='테스트'){if(!org)return;ensure(db);const old=db.storeMembers.find(m=>m.org===org&&m.accountKey===accountKey);if(old){old.name=name;old.lastLogin=new Date().toISOString();return old}const m={id:id(),org,accountKey,name,membership,provider,status:'활성',createdAt:new Date().toISOString(),lastLogin:new Date().toISOString()};db.storeMembers.unshift(m);return m}
 function owns(db,record){return record.ownerAccount?record.ownerAccount===MarketCore.accountId(db):!!record.mine}
 return {ensure,register,login,join,avatar,owns};
})();
if(typeof module!=='undefined')module.exports=AccountCore;
