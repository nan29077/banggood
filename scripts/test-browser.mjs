// 브라우저 화면 회귀 테스트 (선택 실행)
// 준비: npm i -D playwright && npx playwright install chromium
// 실행: npm run test:browser   (설치된 크롬을 쓰려면 CHROME_PATH 환경 변수를 지정)
import assert from 'node:assert/strict';
import {createServer} from './dev-server.mjs';

let chromium;
try { ({chromium} = await import('playwright')); }
catch { console.log('SKIP: playwright가 설치되어 있지 않습니다. npm i -D playwright && npx playwright install chromium 후 다시 실행해 주세요.'); process.exit(0); }

const server = createServer();
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}/#`;
const browser = await chromium.launch(process.env.CHROME_PATH ? {executablePath: process.env.CHROME_PATH, args: ['--no-sandbox']} : {});
const results = [];
const check = (name, ok, detail = '') => { results.push([name, ok, detail]); if (!ok) console.error('FAIL:', name, detail); };

async function page(mobile = true) {
  const ctx = await browser.newContext({viewport: mobile ? {width: 390, height: 844} : {width: 1440, height: 900}, isMobile: mobile, hasTouch: mobile});
  await ctx.route('**/*', r => /fonts\.(googleapis|gstatic)/.test(r.request().url()) ? r.abort() : r.continue());
  const pg = await ctx.newPage();
  pg.errors = []; pg.dialogs = [];
  pg.on('pageerror', e => pg.errors.push(String(e)));
  pg.on('dialog', d => { pg.dialogs.push(d.message()); d.dismiss(); });
  return pg;
}
const go = async (pg, route, wait = 300) => { await pg.goto(BASE + route); await pg.waitForTimeout(wait); };
const click = (pg, sel) => pg.evaluate(s => document.querySelector(s).click(), sel);
const login = async (pg, role, org) => {
  if (org) await go(pg, '/institution/' + org); else await go(pg, '/');
  await click(pg, `[data-action="test-login"][data-role="${role}"]`); await pg.waitForTimeout(400);
};
const text = pg => pg.evaluate(() => document.querySelector('#app').innerText);

try {
  for (const mobile of [true, false]) {
    const pg = await page(mobile);
    // 1. 전 화면과 역할별 콘솔 메뉴가 오류 없이 열림
    for (const r of ['/', '/live', '/shop', '/institutions', '/institution/o1', '/product/p1', '/cart', '/checkout', '/donate', '/impact', '/my', '/login', '/signup', '/support', '/terms', '/privacy'])
      await go(pg, r, 150);
    for (const role of ['individual', 'company', 'agency', 'admin']) {
      await login(pg, role);
      const sections = await pg.evaluate(() => [...new Set([...document.querySelectorAll('[data-action="console-tab"]')].map(e => e.dataset.section))]);
      for (const s of sections) {
        await click(pg, `[data-action="console-tab"][data-section="${s}"]`); await pg.waitForTimeout(80);
        const overflow = await pg.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
        if (overflow) check(`${role}:${s} 가로 넘침 없음`, false);
      }
      await pg.evaluate(() => actions.logout());
    }
    check(`${mobile ? '모바일' : 'PC'} 전 화면 스크립트 오류 없음`, pg.errors.length === 0, pg.errors.join(' | '));
    await pg.context().close();
  }

  const pg = await page();
  // 2. 덧붙인 화면 요소가 빠지지 않음
  await go(pg, '/');
  check('홈 테스트 로그인 패널', !!await pg.$('.main-login-panel'));
  check('푸터 약관 링크', !!await pg.$('.legal-links a[href="#/privacy"]'));
  await go(pg, '/institution/o1');
  check('기관몰 로그인 패널', !!await pg.$('.store-login-card'));
  check('기관몰 공지', !!await pg.$('.shop-announcement'));
  await login(pg, 'agency');
  await click(pg, '[data-action="console-tab"][data-section="mall"]'); await pg.waitForTimeout(300);
  check('기관 로고 관리', !!await pg.$('.institution-logo-manager'));
  // 3. 몰 이름의 $ 문자 보존
  await pg.evaluate(() => { shopSettings('o1').mallTitle = '$& 방긋 $1몰'; save(); });
  await go(pg, '/institution/o1');
  check('몰 이름 특수문자 보존', await pg.evaluate(() => document.querySelector('.store-login-card h3')?.textContent.includes('$& 방긋 $1몰') && document.querySelector('.mall-header-brand strong')?.textContent === '$& 방긋 $1몰'));
  // 4. 카테고리 이름 스크립트 차단
  await pg.evaluate(() => { MarketCore.saveCategory(db, merchantActor(), {org: 'o1', name: '"><img src=x onerror=alert(1)>', parent: null, visible: true}); save(); actions.logout(); });
  pg.dialogs.length = 0; await go(pg, '/', 400); await go(pg, '/shop', 400);
  check('카테고리 XSS 차단', pg.dialogs.length === 0);
  await pg.evaluate(() => localStorage.clear()); await go(pg, '/');
  // 5. 없는 기관 주소
  await go(pg, '/institution/zzz');
  check('없는 기관 안내', (await text(pg)).includes('찾을 수 없어요'));
  // 6. 모달 + 뒤로가기
  await go(pg, '/shop'); await go(pg, '/live'); await click(pg, '[data-action="search"]'); await pg.waitForTimeout(150);
  await pg.goBack(); await pg.waitForTimeout(300);
  check('뒤로가기로 모달 닫힘', !await pg.evaluate(() => !!document.querySelector('#modal-root').innerHTML));
  // 7. 비회원 쿠폰 주문 → 로그인 연결 → 취소 → 쿠폰 복구
  await go(pg, '/'); await pg.evaluate(() => addToCart('p1', 2));
  await go(pg, '/checkout');
  await pg.selectOption('#checkout-coupon', 'cp-demo-o1'); await pg.waitForTimeout(150);
  await pg.check('#merchant-checkout-form input[type=checkbox]'); await pg.click('#merchant-checkout-form button'); await pg.waitForTimeout(400);
  check('주문 완료 안내 표시', (await pg.evaluate(() => document.querySelector('#modal-root').innerText)).includes('주문 체험을 완료'));
  const orderId = await pg.evaluate(() => db.orders[0].id);
  await click(pg, '[data-action="close-modal"]'); await pg.goBack(); await pg.waitForTimeout(300);
  check('주문 후 뒤로가기 시 주문서로 돌아가지 않음', !pg.url().endsWith('/checkout'));
  await login(pg, 'buyer', 'o1');
  check('비회원 주문이 로그인 계정에 연결', await pg.evaluate(id => AccountCore.owns(db, db.orders.find(o => o.id === id)), orderId));
  await pg.evaluate(() => actions.logout());
  await login(pg, 'agency');
  await pg.evaluate(id => { MarketCore.updateFulfillment(db, merchantActor(), id, 'o1', {status: '취소 완료'}); save(); }, orderId);
  check('취소 후 주문 상태·쿠폰 복구', await pg.evaluate(id => db.orders.find(o => o.id === id).status === '취소 완료' && db.market.coupons[0].used === 0, orderId));
  // 8. 비로그인 기부 → 로그인 후 이어서 신청
  await pg.evaluate(() => actions.logout()); await go(pg, '/donate');
  await pg.fill('#donate-form [name=donor]', '홍길동'); await pg.fill('#donate-form [name=email]', 'donor@example.com'); await pg.click('#donate-form button.primary-btn'); await pg.waitForTimeout(200);
  await pg.fill('#donate-form [name=name]', '머그컵'); await pg.click('#donate-form button.primary-btn'); await pg.waitForTimeout(200);
  await pg.check('#donate-form input[type=checkbox]'); await pg.click('#donate-form button.primary-btn'); await pg.waitForTimeout(300);
  check('비로그인 기부 시 로그인 안내', await pg.evaluate(() => !db.role && document.querySelector('#modal-root').innerText.includes('로그인')));
  await click(pg, '#modal-root [data-action="test-login"][data-role="individual"]'); await pg.waitForTimeout(400);
  await pg.check('#donate-form input[type=checkbox]'); await pg.click('#donate-form button.primary-btn'); await pg.waitForTimeout(400);
  check('로그인 후 작성 내용 그대로 신청', await pg.evaluate(() => db.donations[0].donor === '홍길동' && db.donations[0].ownerAccount === 'individual'));
  // 9. 손상된 저장 데이터
  for (const bad of ['{"orders":null}', '{"orgs":[]}', 'not json']) {
    await pg.evaluate(v => localStorage.setItem('banggeut-demo-v1', v), bad); await go(pg, '/', 400);
    check('손상 데이터 복구 ' + bad, (await text(pg)).length > 500);
  }
  check('시나리오 스크립트 오류 없음', pg.errors.length === 0, pg.errors.join(' | '));
} finally {
  await browser.close(); server.close();
}
const failed = results.filter(r => !r[1]);
console.log(`${failed.length ? 'FAIL' : 'PASS'}: browser regression ${results.length - failed.length}/${results.length}`);
process.exit(failed.length ? 1 : 0);
