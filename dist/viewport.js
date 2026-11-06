'use strict';
function consoleSidebar(menu){
 const groups=[['워크스페이스',['dashboard']],['상품·쇼핑몰',['products','goods','categories','inventory','mall']],['주문·고객',['orders','shipping','claims','customers','support','shoppers','coupons']],['기부·기관',['donations','intake','tracking','matching','donors','partners','institutions']],['정산·증빙',['sales','settlements','receipts','reports','analytics']],['사이트·운영',['studio','main-management','site-design','campaigns','news','notices','members','team','settings']]];
 const used=new Set();
 let html=groups.map(([label,keys])=>{const rows=menu.filter(([k])=>keys.includes(k));rows.forEach(([k])=>used.add(k));return rows.length?`<section class="sidebar-group"><h3>${label}</h3>${rows.map(([k,l])=>btn('console-tab',esc(l),consoleSection===k?'active':'',`data-section="${k}" ${consoleSection===k?'aria-current="page"':''}`)).join('')}</section>`:''}).join('');
 html+=menu.filter(([k])=>!used.has(k)).map(([k,l])=>btn('console-tab',esc(l),consoleSection===k?'active':'',`data-section="${k}"`)).join('');
 return `<div class="sidebar-heading"><a href="#/" class="brand"><img class="brand-wordmark" src="/assets/brand/banggeut-wordmark.png" alt="방긋마켓"></a><button data-action="sidebar-close" class="sidebar-close" aria-label="메뉴 닫기">${icon('close')}</button><p>${esc(roleLabels[db.role])} 콘솔</p></div><nav class="sidebar-scroll" aria-label="콘솔 메뉴">${html}</nav><div class="sidebar-account"><a href="#/profile" class="sidebar-profile">${ownProfileImage('header-avatar')}<span><strong>${esc(db.profile.name)}</strong><small>프로필 · 계정 설정</small></span>${icon('chevron')}</a><div><a href="#/">${icon('home')} 메인으로</a>${btn('logout',icon('logout')+' 로그아웃','')}</div></div>`;
}
function initViewportChrome(){
 const contentRender=render;
 const updateViewport=()=>{const v=window.visualViewport;document.documentElement.style.setProperty('--visible-top',(v?v.offsetTop:0)+'px');document.documentElement.style.setProperty('--visible-height',(v?v.height:window.innerHeight)+'px')};
 updateViewport();window.visualViewport?.addEventListener('resize',updateViewport);window.visualViewport?.addEventListener('scroll',updateViewport);window.addEventListener('resize',updateViewport);
 actions['sidebar-open']=()=>{document.body.classList.add('sidebar-open');document.querySelector('.sidebar-close')?.focus()};
 actions['sidebar-close']=()=>document.body.classList.remove('sidebar-open');
 document.addEventListener('keydown',e=>{if(e.key==='Escape')actions['sidebar-close']()});
 render=function(reset=false){
  const chrome=document.getElementById('app-chrome');chrome.replaceChildren();document.getElementById('console-sidebar')?.remove();document.getElementById('sidebar-shade')?.remove();document.body.classList.remove('sidebar-open');
  contentRender(reset);
  const shell=document.getElementById('app');
  const isConsole=!!shell.querySelector('.console-menu');document.body.classList.toggle('console-layout',isConsole);
  const header=shell.querySelector(':scope > .app-header');const navigation=shell.querySelector(':scope > .bottom-nav');
  if(header)chrome.append(header);if(navigation)chrome.append(navigation);
  if(isConsole){
   shell.querySelector('.console-menu').remove();navigation?.remove();
   const aside=document.createElement('aside');aside.id='console-sidebar';aside.innerHTML=consoleSidebar(menus[db.role]);document.body.append(aside);
   const shade=document.createElement('button');shade.id='sidebar-shade';shade.dataset.action='sidebar-close';shade.setAttribute('aria-label','메뉴 닫기');document.body.append(shade);
   header?.insertAdjacentHTML('afterbegin','<button class="sidebar-toggle" data-action="sidebar-open" aria-label="콘솔 메뉴 열기">☰</button>');
  }
  if(reset)shell.scrollTop=0;
  updateViewport();
 };
}
