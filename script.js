var RESET_CODE='k7#Pz!2Lm@9Q';
var DEADLINE=new Date(2026,8,29,18,0,0);
var UK='7b_users',SK='7b_session',VK='7b_votes',VDK='7b_voted';
var IDEAS=[
{id:1,emoji:'🌟',title:'Увеличить знаменитость класса',desc:'Участвовать на мероприятиях и флэшмобах'},
{id:2,emoji:'🧼',title:'Улучшить гигиену',desc:'Приобрести: туалетную бумагу, мыло'},
{id:3,emoji:'📋',title:'Сделать конкретные правила',desc:'Избрание старост класса, конкретный список дежурных'},
{id:4,emoji:'⚖️',title:'Увеличить равенство',desc:'Равные права для всех учеников, для мальчиков и девочек'}];

var store={
get:function(k,d){try{var v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}},
set:function(k,v){localStorage.setItem(k,JSON.stringify(v))},
del:function(k){localStorage.removeItem(k)}};

function simpleHash(s){var h1=0xdeadbeef,h2=0x41c6ce57;for(var i=0;i<s.length;i++){var c=s.charCodeAt(i);h1=Math.imul(h1^c,2654435761);h2=Math.imul(h2^c,1597334677)}h1=Math.imul(h1^(h1>>>16),2246822507)^Math.imul(h2^(h2>>>13),3266489909);h2=Math.imul(h2^(h2>>>16),2246822507)^Math.imul(h1^(h1>>>13),3266489909);return(h2>>>0).toString(16).padStart(8,'0')+(h1>>>0).toString(16).padStart(8,'0')}
function norm(s){return s.trim().replace(/\s+/g,' ').replace(/ё/g,'е').replace(/Ё/g,'Е').toLowerCase()}
function genId(){var c='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789',s='';for(var i=0;i<8;i++)s+=c[Math.floor(Math.random()*c.length)];return s}
function fp(){var r=[navigator.userAgent,screen.width+'x'+screen.height,new Date().getTimezoneOffset(),navigator.language].join('|');return '#'+simpleHash(r).slice(0,6)}

function showScreen(id){document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active')});document.getElementById(id).classList.add('active');window.scrollTo(0,0);var n=document.getElementById('bottom-nav');if(n){n.style.display=(id==='auth-screen'||id==='thanks-screen')?'none':'flex'}document.querySelectorAll('.nav button').forEach(function(b){b.classList.toggle('active',b.dataset.screen===id)})}
function goTo(id){showScreen(id);if(id==='stats-screen')updateStats();if(id==='profile-screen')updateProfile();if(id==='home-screen')updateHome();if(id==='vote-screen')updateVote()}

function showErr(id,msg){var el=document.getElementById(id);if(!el)return;if(msg){el.textContent=msg;el.classList.add('show')}else{el.textContent='';el.classList.remove('show')}}
function clearErrs(a){a.forEach(function(id){showErr(id,'')})}

document.getElementById('tab-login').onclick=function(){this.classList.add('active');document.getElementById('tab-register').classList.remove('active');document.getElementById('login-form').classList.add('active');document.getElementById('register-form').classList.remove('active')};
document.getElementById('tab-register').onclick=function(){this.classList.add('active');document.getElementById('tab-login').classList.remove('active');document.getElementById('register-form').classList.add('active');document.getElementById('login-form').classList.remove('active')};

document.getElementById('register-btn').onclick=function(){
clearErrs(['register-name-error','register-password-error','register-password2-error','register-error']);
var n=document.getElementById('register-name').value.trim();
var p=document.getElementById('register-password').value;
var p2=document.getElementById('register-password2').value;
if(n.replace(/\s/g,'').length<3)return showErr('register-name-error','Имя должно быть не короче 3 букв');
if(p.length<6)return showErr('register-password-error','Пароль должен быть не короче 6 символов');
if(p!==p2)return showErr('register-password2-error','Пароли не совпадают');
var u=store.get(UK,{});var k=norm(n);
if(u[k])return showErr('register-error','Такой избиратель уже зарегистрирован');
u[k]={name:n,hash:simpleHash(p),id:genId(),registered:Date.now()};
store.set(UK,u);store.set(SK,k);
document.getElementById('register-name').value='';
document.getElementById('register-password').value='';
document.getElementById('register-password2').value='';
enterApp()};

document.getElementById('login-btn').onclick=function(){
clearErrs(['login-name-error','login-password-error','login-error']);
var n=document.getElementById('login-name').value.trim();
var p=document.getElementById('login-password').value;
if(!n)return showErr('login-name-error','Введите имя и фамилию');
if(!p)return showErr('login-password-error','Введите пароль');
var u=store.get(UK,{});
var usr=u[norm(n)];
if(!usr||usr.hash!==simpleHash(p))return showErr('login-error','Неверное имя или пароль');
store.set(SK,norm(n));
document.getElementById('login-name').value='';
document.getElementById('login-password').value='';
enterApp()};

document.getElementById('logout-btn').onclick=function(){store.del(SK);showScreen('auth-screen');updateCount()};

function enterApp(){showScreen('home-screen');updateCount();renderIdeas();renderVote();updateHome();updateVote();updateStats();updateProfile();startTimer()}
function currentUser(){var k=store.get(SK,null);if(!k)return null;var u=store.get(UK,{});return u[k]?Object.assign({key:k},u[k]):null}
function updateCount(){var el=document.getElementById('user-count');if(el)el.textContent=Object.keys(store.get(UK,{})).length}
function getVotes(){return store.get(VK,{1:[],2:[],3:[],4:[]})}
function hasVoted(){return store.get(VDK,{})[fp()]||null}
function totalVotes(){var v=getVotes();return Object.keys(v).reduce(function(s,k){return s+v[k].length},0)}

function submitVote(id){if(hasVoted()){updateVote();return}var v=getVotes();if(!v[id])v[id]=[];v[id].push(Date.now());store.set(VK,v);var vd=store.get(VDK,{});vd[fp()]=id;store.set(VDK,vd);showScreen('thanks-screen');updateStats();updateHome();updateProfile()}

function renderIdeas(){var g=document.getElementById('ideas-grid');if(!g)return;var v=getVotes();g.innerHTML=IDEAS.map(function(i){var c=(v[i.id]||[]).length;return '<div class="icard"><div class="i-emoji">'+i.emoji+'</div><div class="i-title">'+i.title+'</div><div class="i-desc">'+i.desc+'</div><div class="i-votes">'+c+' голосов</div></div>'}).join('')}

function renderVote(){var b=document.getElementById('vote-options');if(!b)return;b.innerHTML=IDEAS.map(function(i){return '<label class="vopt" data-idea="'+i.id+'"><input type="radio" name="vote" class="vradio" value="'+i.id+'" style="display:none"><div class="vopt-c"><div class="v-emoji">'+i.emoji+'</div><div><h3>'+i.title+'</h3><p>'+i.desc+'</p></div></div></label>'}).join('');b.querySelectorAll('.vopt').forEach(function(o){o.onclick=function(){b.querySelectorAll('.vopt').forEach(function(x){x.classList.remove('sel')});o.classList.add('sel');o.querySelector('.vradio').checked=true}})}

document.getElementById('vote-submit').onclick=function(){
var c=document.querySelector('.vradio:checked');
var a=document.getElementById('agree-checkbox');
if(!c)return alert('Выберите идею');
if(!a.checked)return alert('Подтвердите согласие');
if(new Date()>DEADLINE)return alert('Голосование завершено');
submitVote(parseInt(c.value,10))};

function updateHome(){var el=document.getElementById('total-votes-home');if(el)el.textContent=totalVotes();renderIdeas()}
function updateVote(){var a=document.getElementById('vote-already'),f=document.getElementById('vote-form-box');if(!a||!f)return;if(hasVoted()){a.classList.remove('hide');f.classList.add('hide')}else{a.classList.add('hide');f.classList.remove('hide')}}

function updateStats(){
var v=getVotes();var t=totalVotes();
var sorted=IDEAS.slice().sort(function(a,b){return(v[b.id]||[]).length-(v[a.id]||[]).length});
var medals=['🥇','🥈','🥉','🏅'];
var list=document.getElementById('stats-list');
if(list){list.innerHTML=sorted.map(function(i,idx){var c=(v[i.id]||[]).length;var p=t?(c/t*100).toFixed(1):'0.0';return '<div class="scard"><div class="sh"><div class="sm">'+medals[idx]+'</div><div class="se">'+i.emoji+'</div><div><h3>'+i.title+'</h3><div class="sv">'+c+' голосов · '+p+'%</div></div></div><div class="pbar"><div class="pfill" style="width:'+p+'%"></div></div><div class="sdesc">'+i.desc+'</div></div>'}).join('')}
var l=document.getElementById('leader-text');
if(l){if(t===0)l.textContent='Пока нет голосов';else{var top=sorted[0];l.textContent=top.emoji+' '+top.title+' — '+(v[top.id]||[]).length+' голосов'}}
var m=document.getElementById('my-status');if(m)m.textContent=hasVoted()?'✅ Проголосовал(а)':'Ещё не голосовал(а)';
var tl=document.getElementById('timeline-list');
if(tl){var all=[];Object.keys(v).forEach(function(k){v[k].forEach(function(ts){all.push(ts)})});all.sort(function(a,b){return b-a});if(all.length===0)tl.textContent='Пока пусто';else tl.innerHTML=all.slice(0,30).map(function(ts){var d=new Date(ts);var s=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')+':'+String(d.getSeconds()).padStart(2,'0');return '<div style="padding:8px 0;border-bottom:1px solid rgba(100,150,255,.1)">📦 Голос принят · '+s+'</div>'}).join('')}}

function updateProfile(){
var u=currentUser();if(!u)return;
var n=document.getElementById('profile-name');if(n)n.textContent=u.name;
var a=document.getElementById('avatar');if(a)a.textContent=u.name.split(' ').map(function(p){return p[0]}).join('').toUpperCase().slice(0,2);
var i=document.getElementById('profile-id');if(i)i.textContent='#'+u.id;
var r=new Date(u.registered);var mo=['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
var inf=document.getElementById('profile-info');if(inf)inf.textContent='Избиратель класса 7Б · регистрация '+r.getDate()+' '+mo[r.getMonth()]+' '+r.getFullYear();
var vp=document.getElementById('vote-pill');var vid=hasVoted();
if(vp){if(vid){vp.textContent='✅ Голос отдан';vp.className='pill green'}else{vp.textContent='Ещё не голосовал';vp.className='pill gray'}}
var cc=document.getElementById('my-choice-card');var ce=document.getElementById('my-choice');
if(cc&&ce){if(vid){var idea=IDEAS.find(function(x){return x.id==vid});if(idea){cc.classList.remove('hide');ce.textContent=idea.emoji+' '+idea.title}}else cc.classList.add('hide')}}

var timerInt=null;
function startTimer(){if(timerInt)clearInterval(timerInt);function u(){var d=DEADLINE-new Date();if(d<=0){document.getElementById('t-d').textContent='0';document.getElementById('t-h').textContent='00';document.getElementById('t-m').textContent='00';document.getElementById('t-s').textContent='00';return}document.getElementById('t-d').textContent=Math.floor(d/86400000);document.getElementById('t-h').textContent=String(Math.floor((d%86400000)/3600000)).padStart(2,'0');document.getElementById('t-m').textContent=String(Math.floor((d%3600000)/60000)).padStart(2,'0');document.getElementById('t-s').textContent=String(Math.floor((d%60000)/1000)).padStart(2,'0')}u();timerInt=setInterval(u,1000)}

document.querySelectorAll('.nav button').forEach(function(b){b.onclick=function(){goTo(b.dataset.screen)}});

var rm=document.getElementById('restart-modal');
document.getElementById('open-restart').onclick=function(){rm.classList.add('active');document.getElementById('reset-error').classList.remove('show');document.getElementById('reset-code').value=''};
document.getElementById('reset-cancel').onclick=function(){rm.classList.remove('active')};
rm.querySelector('.mov').onclick=function(){rm.classList.remove('active')};
document.getElementById('reset-confirm').onclick=function(){var c=document.getElementById('reset-code').value;var e=document.getElementById('reset-error');if(c===RESET_CODE){localStorage.clear();location.reload()}else{e.textContent='Неверный код разработчика.';e.classList.add('show')}};

var am=document.getElementById('agreement-modal');
function showAgreement(){am.classList.add('active')}
document.getElementById('read-agreement').onclick=showAgreement;
document.getElementById('agreement-close').onclick=function(){am.classList.remove('active')};
am.querySelector('.mov').onclick=function(){am.classList.remove('active')};

document.getElementById('open-devs').onclick=function(){document.getElementById('devs-text').classList.toggle('hide')};

window.addEventListener('DOMContentLoaded',function(){if(currentUser())enterApp();else{showScreen('auth-screen');updateCount()}});
window.goTo=goTo;window.showAgreement=showAgreement;
