const assert=require('node:assert/strict');
const C=require('../dist/commerce-core.js');
const A=require('../dist/accounts-core.js');
globalThis.MarketCore=C;

// 주문 대표 상태와 쿠폰 복구
const db={orgs:[{id:'o1',name:'첫 기관',tag:'첫 몰'},{id:'o2',name:'두 기관',tag:'두 몰'}],products:[{id:'p1',name:'상품 A',org:'o1',price:20000,original:30000,stock:10,category:'패션·잡화',image:'hero'},{id:'p2',name:'상품 B',org:'o2',price:15000,original:20000,stock:5,category:'리빙·주방',image:'mug'}],orders:[],settlements:[],settings:{fee:5}};
C.ensure(db);
const agency1={role:'agency',org:'o1'},agency2={role:'agency',org:'o2'},coupon=db.market.coupons.find(c=>c.id==='cp-demo-o1');
const order=C.checkout(db,[{id:'p1',qty:1},{id:'p2',qty:1}],{name:'구매자',address:'주소'},'cp-demo-o1');
assert.equal(coupon.used,1);
assert.ok(db.market.audit.some(a=>a.org==='o1'&&a.text.includes(order.id)),'주문 기록은 기관별로 남겨야 합니다');
assert.ok(db.market.audit.some(a=>a.org==='o2'&&a.text.includes(order.id)));
assert.ok(!db.market.audit.some(a=>a.org===null&&a.text.includes(order.id)),'기관 없는 주문 기록은 다른 기관에 노출됩니다');

// o2만 취소해도 할인은 o1 상품에 걸려 있으므로 쿠폰은 복구하지 않음
C.updateFulfillment(db,agency2,order.id,'o2',{status:'취소 완료'});
assert.equal(coupon.used,1);
assert.equal(order.status,'신규 주문 / 취소 완료');

// o1 배송 → 구매 확정 후 대표 상태 갱신
for(const status of ['상품 준비 중','배송 중','배송 완료'])C.updateFulfillment(db,agency1,order.id,'o1',{status,tracking:'T1'});
order.fulfillments.find(f=>f.org==='o1').status='구매 확정';C.syncOrder(db,order);
assert.equal(order.status,'구매 확정 / 취소 완료');

// 반품 완료 시 대표 상태와 쿠폰 복구(한 번만)
const claim=C.createClaim(db,agency1,order.id,'o1',{type:'반품',reason:'테스트'});
C.processClaim(db,agency1,claim.id,'승인');C.processClaim(db,agency1,claim.id,'처리 완료');
assert.equal(order.status,'반품 완료 / 취소 완료');
assert.equal(coupon.used,0);assert.equal(order.couponRestored,true);
C.syncOrder(db,order);assert.equal(coupon.used,0,'쿠폰은 한 번만 복구해야 합니다');

// 전체 취소 시 쿠폰 복구
const second=C.checkout(db,[{id:'p1',qty:1}],{name:'구매자',address:'주소'},'cp-demo-o1');
assert.equal(coupon.used,1);
C.updateFulfillment(db,agency1,second.id,'o1',{status:'취소 완료'});
assert.equal(second.status,'취소 완료');assert.equal(coupon.used,0);

// 약한 비밀번호 차단
(async()=>{
 const adb={orgs:db.orgs,orders:[],role:null};
 await assert.rejects(A.register(adb,{name:'가',email:'weak@example.com',password:'aaaaaaaa',confirm:'aaaaaaaa',role:'buyer'}),/2가지/);
 await assert.rejects(A.register(adb,{name:'가',email:'weak@example.com',password:'abababab',confirm:'abababab',role:'buyer'}),/2가지/);
 const s=await A.register(adb,{name:'가',email:'ok@example.com',password:'smile-2026',confirm:'smile-2026',role:'buyer'});
 assert.equal(s.role,'buyer');
 console.log('PASS: order status sync, coupon restore once on full cancel/return, per-institution order logs, weak password rejection.');
})().catch(e=>{console.error(e);process.exit(1)});
