const assert=require('node:assert/strict');
global.MarketCore=require('../dist/commerce-core.js');
const A=require('../dist/accounts-core.js');
(async()=>{
 const db={orgs:[{id:'o1',name:'첫 기관'},{id:'o2',name:'두 기관'}],role:null,orgId:'o1',profile:{name:'체험 방문자'},cart:[{id:'p1',qty:1}],wishes:['p1'],follows:[],alerts:[]};
 const input={org:'o1',name:'봉사 구매자',email:'Demo@Example.com',password:'demo-password-123',confirm:'demo-password-123',membership:'자원봉사자'};
 const session=await A.register(db,input);assert.equal(session.role,'buyer');assert.equal(session.buyerOrg,'o1');assert.equal(db.localAccounts[0].email,'demo@example.com');assert(!JSON.stringify(db.localAccounts).includes('demo-password-123'));assert(db.accountProfiles[session.accountKey].avatar>=1&&db.accountProfiles[session.accountKey].avatar<=30);assert.equal(db.storeMembers[0].membership,'자원봉사자');
 await assert.rejects(A.register(db,input),/가입/);await assert.rejects(A.login(db,{...input,org:'o2'}),/기관몰/);await assert.rejects(A.login(db,{...input,password:'wrong-password'}),/비밀번호/);
 const signed=await A.login(db,input);MarketCore.activateAccount(db,signed.role,undefined,signed);assert.equal(MarketCore.accountId(db),signed.accountKey);db.cart=[{id:'o1-product',qty:2}];db.profile.name='첫 기관 구매자';MarketCore.rememberAccount(db);
 const second=await A.register(db,{...input,org:'o2'});assert.notEqual(second.accountKey,signed.accountKey);MarketCore.activateAccount(db,'buyer',undefined,second);assert.equal(db.cart.length,0);db.cart=[{id:'o2-product',qty:1}];
 MarketCore.activateAccount(db,'buyer',undefined,signed);assert.equal(db.cart[0].id,'o1-product');assert.equal(db.profile.name,'첫 기관 구매자');assert.equal(A.owns(db,{ownerAccount:signed.accountKey}),true);assert.equal(A.owns(db,{ownerAccount:second.accountKey}),false);
 MarketCore.activateAccount(db,'admin');assert.equal(db.session,null);assert.equal(db.cart.length,0);MarketCore.activateAccount(db,'buyer',undefined,signed);assert.equal(db.cart[0].qty,2);
 db.localAccounts[0].status='이용 정지';await assert.rejects(A.login(db,input),/중지/);assert.equal(db.storeMembers.length,2);
 console.log('PASS: scoped email signup/login, password hash, duplicate/wrong-scope rejection, random avatars, membership, independent profiles/carts, record ownership, role switch.');
})().catch(e=>{console.error(e);process.exitCode=1});
