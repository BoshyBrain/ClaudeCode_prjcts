/* ============================================================
   Loop · Campus Token Economy — app.js
   Vanilla JS. In-memory state, no backend, no localStorage.
   ============================================================ */

/* ---------- 1. State ---------- */
const state = {
  lang: 'en',
  user: { name: 'Liza', role: 'Student · 2 year · BA', initial: 'L' },
  balance: 340,
  closedTasks: 12,
  weekGain: 80,
  weekGoal: 120,
  taken: {},
  histFilter: 'all',
  history: [
    { t:'Helped with statistics',   he:'עזרתי בסטטיסטיקה',       s:'Today',      sHe:'היום',         d:+25, type:'plus'  },
    { t:'Student for an Open Day',   he:'סטודנט ליום פתוח',       s:'Yesterday',  sHe:'אתמול',         d:+15, type:'plus'  },
    { t:'Explained topics in math',  he:'הסברתי נושאים במתמטיקה', s:'3 days ago', sHe:'לפני 3 ימים',  d:+20, type:'plus'  },
    { t:'Discount at Coffee time',   he:'הנחה ב-Coffee time',     s:'4 days ago', sHe:'לפני 4 ימים',  d:-30, type:'minus' },
  ],
};

/* ---------- 2. i18n dictionary ---------- */
const T = {
  hi:            { en:'Hi, ', he:'היי, ' },
  ready:         { en:'Ready to help?', he:'מוכנים לעזור?' },
  tokenBalance:  { en:'Token balance', he:'יתרת טוקנים' },
  closed:        { en:'Closed', he:'הושלמו' },
  tasksWord:     { en:' tasks', he:' משימות' },
  thisWeek:      { en:'This week', he:'השבוע' },
  weeklyGoal:    { en:'Weekly goal', he:'יעד שבועי' },
  pickTask:      { en:"Let's go! Pick a task", he:'קדימה! בחרו משימה' },
  fDate:         { en:'Date', he:'תאריך' },
  fCategory:     { en:'Category', he:'קטגוריה' },
  task:          { en:'Task', he:'משימה' },
  reward:        { en:'Reward', he:'תגמול' },
  description:   { en:'Description', he:'תיאור' },
  location:      { en:'Location', he:'מיקום' },
  requestedBy:   { en:'Requested by', he:'פורסם על ידי' },
  msgAuthor:     { en:'Message author', he:'שלחו הודעה למפרסם' },
  taskTaken:     { en:'✓ Task taken — open chat', he:'✓ נלקחה — פתחו צ׳אט' },
  needHelp:      { en:'Do you need help?', he:'צריכים עזרה?' },
  postGetHelp:   { en:'Post your task and get help', he:'פרסמו משימה וקבלו עזרה' },
  taskTitle:     { en:'Task title', he:'כותרת המשימה' },
  titlePh:       { en:'e.g. Help with statistics', he:'לדוגמה: עזרה בסטטיסטיקה' },
  descPh:        { en:'Describe what you need help with, where and when...', he:'תארו במה אתם צריכים עזרה, איפה ומתי...' },
  publish:       { en:'Publish task', he:'פרסמו משימה' },
  addTitleFirst: { en:'Add a task title first', he:'הוסיפו קודם כותרת למשימה' },
  taskPublished: { en:'Task published to campus', he:'המשימה פורסמה בקמפוס' },
  spendTokens:   { en:'Spend tokens', he:'הוצאת טוקנים' },
  discountsAt:   { en:'Discounts at venues around campus', he:'הנחות בעסקים סביב הקמפוס' },
  availableForYou:{ en:'Available for you', he:'זמין עבורכם' },
  notEnough:     { en:'Not enough tokens for ', he:'אין מספיק טוקנים עבור ' },
  purchased:     { en:'Purchased: ', he:'נרכש: ' },
  showCode:      { en:'Show this code at the counter to get your discount.', he:'הציגו את הקוד בקופה כדי לקבל את ההנחה.' },
  balance:       { en:'Balance', he:'יתרה' },
  messages:      { en:'Messages', he:'הודעות' },
  history:       { en:'History', he:'היסטוריה' },
  fAll:          { en:'All', he:'הכול' },
  fEarned:       { en:'Earned', he:'הרווחתם' },
  fSpent:        { en:'Spent', he:'הוצאתם' },
  nothingHere:   { en:'Nothing here yet', he:'עדיין אין כאן כלום' },
  tapToOpen:     { en:'Tap to open chat', he:'הקישו לפתיחת צ׳אט' },
  messagePh:     { en:'Message...', he:'הודעה...' },
  greatThanks:   { en:'Great, thanks!', he:'מעולה, תודה!' },
  taskCtx:       { en:'Task · ', he:'משימה · ' },
  lTokens:       { en:'L‑tokens', he:'L‑טוקנים' },
  helpIntro:     { en:'L‑tokens are the campus currency of loop. You earn them by helping other students and spend them on perks around Bar‑Ilan.', he:'L‑טוקנים הם מטבע הקמפוס של loop. מרוויחים אותם בעזרה לסטודנטים אחרים ומוציאים אותם על הטבות סביב בר‑אילן.' },
  whatIsIt:      { en:'What is it?', he:'מה זה?' },
  whatIsItD:     { en:'An internal point that lives only inside loop — not real money. 1 task done = a few', he:'נקודה פנימית שקיימת רק בתוך loop — לא כסף אמיתי. משימה אחת שהושלמה = כמה' },
  inBalance:     { en:'in your balance.', he:'ביתרה שלכם.' },
  howToEarn:     { en:'How to earn', he:'איך מרוויחים' },
  howToEarnD:    { en:'Take a task from the feed — help with studies, tech, an errand — finish it, and the reward in', he:'קחו משימה מהפיד — עזרה בלימודים, טכנולוגיה או סידור — סיימו אותה, והתגמול ב' },
  isAddedToYou:  { en:'is added to you.', he:'מתווסף אליכם.' },
  whereToSpend:  { en:'Where to spend', he:'איפה מוציאים' },
  whereToSpendD: { en:'Use', he:'השתמשו ב' },
  whereToSpendD2:{ en:'for discounts at campus cafés and partner spots — see the Spend tab for the current offers.', he:'לקבלת הנחות בבתי קפה ובעסקים שותפים בקמפוס — ראו את לשונית ההוצאה למבצעים הנוכחיים.' },
  suppTitle:     { en:'Have a problem or feedback?', he:'יש בעיה או משוב?' },
  suppSub:       { en:"We'd love to hear from you.", he:'נשמח לשמוע מכם.' },
  writeUs:       { en:'Write us', he:'כתבו לנו' },
  notNow:        { en:'Not now', he:'לא עכשיו' },
  openingEmail:  { en:'Opening your email app', he:'פותח את אפליקציית הדוא״ל' },
  contactSupport:{ en:'Contact support', he:'פנייה לתמיכה' },
  myTask:        { en:'My task', he:'המשימה שלי' },
  openTill:      { en:'Open till ', he:'פתוח עד ' },
};
function t(k){ return (T[k] && T[k][state.lang]) || (T[k] && T[k].en) || k; }
function isRTL(){ return state.lang === 'he'; }

/* ---------- 3. Hebrew seed translations ---------- */
const HE = {
  tasks: {
    stat:   { title:'עזרה בסטטיסטיקה', tag:'עזרה אקדמית', desc:'עזרו לי להבין SPSS ולבנות טבלה לדו״ח סטטיסטי. בערך שעה, אונליין או בספרייה.', loc:'ספרייה, בניין בק 410', by:'דשה' },
    open:   { title:'סטודנט ליום פתוח', tag:'אירוע בקמפוס', desc:'מחפשים סטודנט נחמד שיעזור להדריך מבקרים ביום הפתוח של הפקולטה. בערך שעתיים.', loc:'כניסה ראשית, שער 1', by:'אגודת הסטודנטים' },
    math:   { title:'הסבר נושאים במתמטיקה', tag:'עזרה אקדמית', desc:'צריך הסבר מהיר על נגזרות ואינטגרלים לפני המבחן. הקפה עליי.', loc:'קפיטריה, בניין 502', by:'קייט' },
    gen:    { title:'עזרה בגנטיקה', tag:'עזרה אקדמית', desc:'תקוע על תרגיל בגנטיקה — הכלאות מנדל והסתברות. בערך 90 דקות.', loc:'מדעי החיים, חדר 218', by:'נועם' },
    flyers: { title:'חלוקת עלונים בקמפוס', tag:'סידורי משרד', desc:'עזרו לחלק עלונים לאירוע סטודנטים ליד השער הראשי. בערך שעה.', loc:'שער ראשי', by:'אפנאסי' },
  },
  venues: {
    coffee: { name:'Coffee time', sub:'קפה · מיקום בניין 401', pct:'15% הנחה' },
    mood:   { name:'Mood cafe',   sub:'מנת צהריים · מיקום בניין 403', pct:'10% הנחה' },
    mich:   { name:'מכלול בר-אילן', sub:'מכשירי כתיבה · מיקום בניין 102', pct:'8% הנחה' },
    aroma:  { name:'Aroma',       sub:'מנת צהריים · מיקום שער 1', pct:'10% הנחה' },
  },
};
function taskTitle(x){ return isRTL() && x.heKey && HE.tasks[x.heKey] ? HE.tasks[x.heKey].title : x.title; }
function taskTag(x){   return isRTL() && x.heKey && HE.tasks[x.heKey] ? HE.tasks[x.heKey].tag   : x.tag; }
function taskDesc(x){  return isRTL() && x.heKey && HE.tasks[x.heKey] ? HE.tasks[x.heKey].desc  : x.desc; }
function taskLoc(x){   return isRTL() && x.heKey && HE.tasks[x.heKey] ? HE.tasks[x.heKey].loc   : x.location; }
function taskBy(x){    return isRTL() && x.heKey && HE.tasks[x.heKey] ? HE.tasks[x.heKey].by    : x.by; }
function taskDue(x){
  if (x.dueDate) return t('openTill') + x.dueDate;
  if (x.mine) return t('myTask');
  return x.due;
}
function venueName(v){ return isRTL() && HE.venues[v.id] ? HE.venues[v.id].name : v.name; }
function venueSub(v){  return isRTL() && HE.venues[v.id] ? HE.venues[v.id].sub  : v.sub; }
function venuePct(v){  return isRTL() && HE.venues[v.id] ? HE.venues[v.id].pct  : v.pct; }

/* ---------- 4. Coin glyph ---------- */
const COIN = '<span class="coin"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
  '<circle cx="12" cy="12" r="11.3" fill="url(#coinRim)"/>' +
  '<circle cx="12" cy="12" r="9.6" fill="url(#coinFace)"/>' +
  '<circle cx="12" cy="12" r="9.6" fill="none" stroke="#9aa2b4" stroke-width=".5" opacity=".6"/>' +
  '<circle cx="12" cy="12" r="7.4" fill="none" stroke="#aab1c2" stroke-width=".5" opacity=".55"/>' +
  '<path d="M5.5 8.5A8 8 0 0 1 12 4.6" stroke="#fff" stroke-width="1.1" stroke-linecap="round" opacity=".75" fill="none"/>' +
  '<path d="M9.7 7.4h2.05v7.05h3.9v1.75H9.7z" fill="#5b6478"/>' +
  '</svg></span>';

/* ---------- 5. Icons ---------- */
const ic = (p,o='') => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" '+o+'>'+p+'</svg>';
const I = {
  book:   ic('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5A2.5 2.5 0 0 1 4 20.5z"/>'),
  open:   ic('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
  sigma:  ic('<path d="M17 5H7l5 7-5 7h10"/>','stroke-width="2"'),
  dna:    ic('<path d="M4 3c0 6 16 6 16 18M20 3C20 9 4 9 4 21"/><path d="M7 6h10M7.5 9h9M7.5 15h9M7 18h10"/>','stroke-width="1.6"'),
  code:   ic('<path d="m9 8-4 4 4 4M15 8l4 4-4 4"/>'),
  pin:    ic('<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>'),
  user:   ic('<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"/>'),
  check:  ic('<path d="m5 13 4 4L19 7"/>','stroke-width="2.4"'),
  coffee: ic('<path d="M3 8h14v5a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z"/><path d="M17 9h2.5a2.5 2.5 0 0 1 0 5H17"/><path d="M6 3v2M10 3v2M14 3v2"/>'),
  back:   ic('<path d="m15 5-7 7 7 7"/>','stroke-width="2.2"'),
  edit:   ic('<path d="M4 20h4l10-10-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>'),
  dots:   ic('<circle cx="5" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.4" fill="currentColor" stroke="none"/>'),
  chev:   ic('<path d="m6 9 6 6 6-6"/>'),
  send:   ic('<path d="M4 12 20 4l-6 16-3-7z"/><path d="m11 13 9-9"/>'),
  msg:    ic('<path d="M4 5h16v11H9l-5 4z"/>'),
  help:   ic('<circle cx="12" cy="12" r="9"/><path d="M9.2 9.2a2.8 2.8 0 0 1 5.3 1c0 1.8-2.5 2-2.5 3.5"/><circle cx="12" cy="17" r=".5" fill="currentColor"/>'),
  close:  ic('<path d="m6 6 12 12M18 6 6 18"/>','stroke-width="2.2"'),
  earn:   ic('<path d="m5 13 4 4L19 7"/>','stroke-width="2.2"'),
  spend2: ic('<circle cx="7" cy="7" r="2.4"/><circle cx="17" cy="17" r="2.4"/><path d="M19 5 5 19"/>'),
  what:   ic('<circle cx="12" cy="12" r="9"/><path d="M9.2 9.2a2.8 2.8 0 0 1 5.3 1c0 1.8-2.5 2-2.5 3.5"/><circle cx="12" cy="17" r=".5" fill="currentColor"/>'),
};

/* ---------- 6. Seed: TASKS, VENUES, CHATS ---------- */
const TASKS = [
  { id:'stat',   heKey:'stat',   title:'Help with statistics',     icon:I.sigma, due:'Open till 25.06', reward:25, tag:'Academic help',  desc:'Help me figure out SPSS and build a table for a statistics report. About an hour, online or in the library.', location:'Library, Beck building 410', by:'Dasha' },
  { id:'open',   heKey:'open',   title:'Student for an Open Day',  icon:I.open,  due:'Open till 25.06', reward:15, tag:'Campus event',   desc:'Looking for a friendly student to help guide visitors during the faculty Open Day. Roughly 2 hours.', location:'Main entrance, Gate 1', by:'Student Union' },
  { id:'math',   heKey:'math',   title:'Explain topics in math',   icon:I.book,  due:'Open till 24.06', reward:20, tag:'Academic help',  desc:'Need a quick walk-through of derivatives and integrals before the exam. Coffee on me.', location:'Cafeteria, Building 502', by:'Kate' },
  { id:'gen',    heKey:'gen',    title:'Help with genetics',       icon:I.dna,   due:'Open till 13.07', reward:40, tag:'Academic help',  desc:'Stuck on a genetics problem set — Mendelian crosses and probability. About 90 minutes.', location:'Life Sciences, room 218', by:'Noam' },
  { id:'flyers', heKey:'flyers', title:'Hand out flyers on campus',icon:I.open,  due:'Open till 18.06', reward:15, tag:'Office errands', desc:'Help hand out flyers for a student event near the main gate. About an hour.', location:'Main gate', by:'Afanasii' },
];

const VENUES = [
  { id:'coffee', name:'Coffee time',      sub:'Coffee · Location 401 bld',      price:30, pct:'15% discount', color:'#c0853b', logo:'C' },
  { id:'mood',   name:'Mood cafe',        sub:'Lunch set · Location 403 bld',   price:90, pct:'10% discount', color:'#7a39bb', logo:'M' },
  { id:'mich',   name:'Michlol Bar-Ilan', sub:'Stationery · Location 102 bld',  price:80, pct:'8% discount',  color:'#2435d6', logo:'B' },
  { id:'aroma',  name:'Aroma',            sub:'Lunch set · Location gate 1',    price:60, pct:'10% discount', color:'#16a06a', logo:'A' },
];

const CHATS = [
  {
    id:'dasha', name:'Dasha', online:true, unread:2, time:'16:21',
    taskTitle:'Help with statistics', reward:25,
    msgs:[
      { who:'them', text:'Hi! Thanks for taking the task 🙏' },
      { who:'them', text:'When are you free to go over the SPSS table?' },
      { who:'me',   text:'Hey! I can do today around 5pm in the library.' },
      { who:'them', text:'Perfect, that works for me.' },
      { who:'them', text:'See you at the library' },
    ],
  },
  {
    id:'afanasii', name:'Afanasii', online:false, status:'Task author', unread:0, time:'Now',
    taskTitle:'Hand out flyers on campus', reward:15,
    sys:"You're contacting Afanasii about this task",
    msgs:[
      { who:'me', text:'Hi! I can help hand out the flyers tomorrow morning.' },
    ],
  },
  {
    id:'kate', name:'Kate', listName:'Ekaterina', online:false, status:'last seen recently', unread:0, time:'Mon',
    taskTitle:'Explain topics in math', reward:20,
    msgs:[
      { who:'them', text:'Hey, are you still up for the math session?' },
      { who:'me',   text:'Yes! Derivatives and integrals, right?' },
      { who:'them', text:'Got it, sounds good' },
    ],
  },
];

/* ---------- 7. DOM refs + helpers ---------- */
const view = document.getElementById('view');
const screen = document.getElementById('screen');
const tabbar = document.getElementById('tabbar');
const toastEl = document.getElementById('toast');
const modal = document.getElementById('modal');
const modalBack = document.getElementById('modalBack');
const modalPanel = document.getElementById('modalPanel');

function esc(s){
  return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}
function render(html, anim='anim-in'){
  view.scrollTop = 0;
  view.className = 'view ' + anim;
  view.innerHTML = html;
}
function setTab(name){
  [...tabbar.children].forEach(b => b.classList.toggle('is-active', b.dataset.tab === name));
}
let toastTimer;
function toast(msg, ok=true){
  clearTimeout(toastTimer);
  const dot = ok
    ? '<span class="toast__dot">'+I.check+'</span>'
    : '<span class="toast__dot">'+I.close+'</span>';
  toastEl.className = 'toast ' + (ok ? 'toast--ok' : 'toast--err');
  toastEl.innerHTML = dot + '<span>'+esc(msg)+'</span>';
  // force reflow then show
  void toastEl.offsetWidth;
  toastEl.classList.add('is-show');
  toastTimer = setTimeout(() => toastEl.classList.remove('is-show'), 2200);
}

/* ---------- 8. Modals ---------- */
function openModal(html, variant=''){
  modalPanel.innerHTML = html;
  modal.className = 'modal ' + variant;
  // reflow so transition runs
  void modal.offsetWidth;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}
function closeModal(){
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  setTimeout(() => { if (!modal.classList.contains('is-open')) modalPanel.innerHTML = ''; }, 240);
}
modalBack.addEventListener('click', closeModal);
modal.addEventListener('click', e => {
  if (e.target.closest('[data-close]') || e.target.closest('.modal__close')) closeModal();
});

const closeBtn = '<button class="modal__close" data-close aria-label="Close">'+I.close+'</button>';
const grip = '<div class="sheet-grip"></div>';

function openCurrencyHelp(){
  const html = grip +
    '<div class="help-head"><span class="help-head__coin">'+COIN+'</span>'+
    '<h3>'+esc(t('lTokens'))+'</h3></div>'+
    '<p class="help-intro">'+esc(t('helpIntro'))+'</p>'+
    helpItem(I.what,  t('whatIsIt'),     t('whatIsItD')+' '+COIN+' '+t('inBalance'))+
    helpItem(I.check, t('howToEarn'),    t('howToEarnD')+' '+COIN+' '+t('isAddedToYou'))+
    helpItem(I.coffee,t('whereToSpend'), t('whereToSpendD')+' '+COIN+' '+t('whereToSpendD2'));
  openModal(html);
}
function helpItem(icon, title, desc){
  return '<div class="help-item"><span class="help-item__ic">'+icon+'</span>'+
    '<div><div class="help-item__t">'+esc(title)+'</div>'+
    '<div class="help-item__d">'+desc+'</div></div></div>';
}

function openSupport(){
  const html = closeBtn +
    '<div class="support"><span class="support__ic">'+I.msg+'</span>'+
    '<h3>'+esc(t('suppTitle'))+'</h3>'+
    '<p>'+esc(t('suppSub'))+'</p></div>'+
    '<button class="btn-primary" id="suppWrite">'+esc(t('writeUs'))+'</button>'+
    '<button class="btn-ghost" data-close>'+esc(t('notNow'))+'</button>';
  openModal(html, 'modal--center');
  document.getElementById('suppWrite').addEventListener('click', () => {
    window.location.href = 'mailto:krasniichert12580@gmail.com?subject=' +
      encodeURIComponent('loop — support / feedback') +
      '&body=' + encodeURIComponent('Hi loop team,\n\n');
    closeModal();
    toast(t('openingEmail'));
  });
}

function openCoupon(v){
  const code = 'LOOP-' + v.id.toUpperCase() + '-' + Math.random().toString(36).slice(2,7).toUpperCase();
  const payload = 'loop coupon | ' + v.name + ' | ' + v.pct + ' | ' + code;
  const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=420x420&margin=0&color=2435d6&data=' + encodeURIComponent(payload);
  const html = grip + closeBtn +
    '<div class="coupon">'+
      '<div class="coupon__head">'+
        '<span class="coupon__logo" style="background:'+v.color+'">'+esc(v.logo)+'</span>'+
        '<div><div class="coupon__name">'+esc(venueName(v))+'</div>'+
        '<span class="coupon__pct">'+esc(venuePct(v))+'</span></div>'+
      '</div>'+
      '<div class="coupon__qr" id="couponQr"><img src="'+esc(qrUrl)+'" alt="QR code" id="couponImg"/></div>'+
      '<div class="coupon__code">'+esc(code)+'</div>'+
      '<p class="coupon__hint">'+esc(t('showCode'))+'</p>'+
    '</div>';
  openModal(html);
  const img = document.getElementById('couponImg');
  if (img) img.addEventListener('error', () => {
    const wrap = document.getElementById('couponQr');
    if (wrap) wrap.innerHTML = '<div class="coupon__qr-fallback">'+I.spend2+'</div>';
  });
}

let menuEl = null;
function closeDotsMenu(){
  if (menuEl){ menuEl.remove(); menuEl = null; document.removeEventListener('click', onDocClickMenu, true); }
}
function onDocClickMenu(e){
  if (menuEl && !menuEl.contains(e.target)) closeDotsMenu();
}
function openDotsMenu(anchor){
  closeDotsMenu();
  menuEl = document.createElement('div');
  menuEl.className = 'menu';
  menuEl.innerHTML = '<button class="menu__item" id="menuSupport">'+I.msg+'<span>'+esc(t('contactSupport'))+'</span></button>';
  screen.appendChild(menuEl);
  const ar = anchor.getBoundingClientRect();
  const sr = screen.getBoundingClientRect();
  const top = ar.bottom - sr.top + 6;
  menuEl.style.top = top + 'px';
  if (isRTL()){
    menuEl.style.left = (ar.left - sr.left) + 'px';
  } else {
    menuEl.style.right = (sr.right - ar.right) + 'px';
  }
  void menuEl.offsetWidth;
  menuEl.classList.add('is-open');
  menuEl.querySelector('#menuSupport').addEventListener('click', () => { closeDotsMenu(); openSupport(); });
  setTimeout(() => document.addEventListener('click', onDocClickMenu, true), 0);
}

/* ---------- 9. Screens ---------- */

/* SCREEN 1 — Home */
function screenHome(){
  setTab('home');
  const u = state.user;
  const statClosed = t('closed') + ' ' + state.closedTasks + t('tasksWord');
  const tasksHtml = TASKS.map(taskCard).join('');
  const html =
    '<div class="greet">'+
      '<div><div class="greet__hi">'+esc(t('hi'))+esc(u.name)+'</div>'+
      '<div class="greet__big">'+esc(t('ready'))+'</div></div>'+
      '<span class="greet__av">'+I.user+'</span>'+
    '</div>'+

    '<div class="balance">'+
      '<div class="balance__row"><span class="balance__label">'+esc(t('tokenBalance'))+'</span>'+
        '<button class="help-dot" id="balHelp" aria-label="What are tokens?">?</button></div>'+
      '<div class="balance__amount">'+state.balance+COIN+'</div>'+
      '<div class="balance__stats">'+
        '<div class="balance__stat"><b>'+esc(t('closed'))+' '+state.closedTasks+'</b>'+esc(t('tasksWord').trim())+'</div>'+
        '<div class="balance__stat"><b>'+esc(t('thisWeek'))+'</b>+'+state.weekGain+'</div>'+
      '</div>'+
    '</div>'+

    '<div class="goal">'+
      '<div class="goal__top"><span class="goal__label">'+esc(t('weeklyGoal'))+'</span>'+
        '<span class="goal__count" dir="ltr">'+state.weekGain+' / '+state.weekGoal+'</span></div>'+
      '<div class="goal__bar"><div class="goal__fill" id="goalFill"></div></div>'+
    '</div>'+

    '<div class="sec-head"><h2>'+esc(t('pickTask'))+'</h2>'+
      '<div class="sec-head__act">'+
        '<button class="icon-btn" id="goCreate" aria-label="Create task">'+I.edit+'</button>'+
        '<button class="icon-btn" id="openDots" aria-label="More">'+I.dots+'</button>'+
      '</div></div>'+

    '<div class="filters">'+
      '<span class="pill">'+esc(t('fDate'))+I.chev+'</span>'+
      '<span class="pill">'+esc(t('fCategory'))+I.chev+'</span>'+
    '</div>'+

    '<div>'+tasksHtml+'</div>';

  render(html);

  // animate goal fill
  const pct = Math.round(state.weekGain / state.weekGoal * 100);
  requestAnimationFrame(() => {
    const f = document.getElementById('goalFill');
    if (f) f.style.width = pct + '%';
  });

  document.getElementById('balHelp').addEventListener('click', openCurrencyHelp);
  document.getElementById('goCreate').addEventListener('click', screenCreate);
  document.getElementById('openDots').addEventListener('click', e => { e.stopPropagation(); openDotsMenu(e.currentTarget); });
  view.querySelectorAll('.task').forEach(el => {
    el.addEventListener('click', () => screenTask(el.dataset.id));
  });
}
function taskCard(x){
  const rw = x.mine
    ? '<span class="task__rw task__rw--neg">&minus;'+x.cost+COIN+'</span>'
    : '<span class="task__rw">+'+x.reward+COIN+'</span>';
  return '<button class="task" data-id="'+esc(x.id)+'">'+
    '<span class="task__ic">'+x.icon+'</span>'+
    '<span class="task__mid"><span class="task__t">'+esc(taskTitle(x))+'</span>'+
    '<span class="task__sub">'+esc(taskDue(x))+'</span></span>'+
    rw+'</button>';
}

/* SCREEN 2 — Task detail */
function screenTask(id){
  const x = TASKS.find(t => t.id === id);
  if (!x) return screenHome();
  const took = state.taken[id];
  const rw = x.mine
    ? '<b style="color:#ffd0c4">&minus;'+x.cost+COIN+'</b>'
    : '<b>+'+x.reward+COIN+'</b>';
  const ctaCls = took ? 'btn-primary is-took' : 'btn-primary';
  const ctaTxt = took ? t('taskTaken') : t('msgAuthor');
  const html =
    '<div class="topbar"><button class="topbar__back" id="back" aria-label="Back">'+I.back+'</button>'+
      '<span class="topbar__title">'+esc(x.mine ? t('myTask') : t('task'))+'</span></div>'+

    '<div class="detail">'+
      '<span class="detail__tag">'+esc(taskTag(x))+'</span>'+
      '<div class="detail__title">'+esc(taskTitle(x))+'</div>'+
      '<div class="detail__rw">'+esc(t('reward'))+' '+rw+'</div>'+
    '</div>'+

    '<div class="block"><div class="block__h">'+esc(t('description'))+'</div>'+
      '<p class="block__p">'+esc(taskDesc(x))+'</p></div>'+

    '<div class="info-row"><span class="info-row__ic">'+I.pin+'</span>'+
      '<div><div class="info-row__t">'+esc(t('location'))+'</div>'+
      '<div class="info-row__v">'+esc(taskLoc(x))+'</div></div></div>'+

    '<div class="info-row info-row--req"><span class="info-row__ic">'+I.user+'</span>'+
      '<div><div class="info-row__t">'+esc(t('requestedBy'))+'</div>'+
      '<div class="info-row__v">'+esc(taskBy(x))+'</div></div></div>'+

    '<button class="'+ctaCls+'" id="cta">'+esc(ctaTxt)+'</button>';

  render(html);
  document.getElementById('back').addEventListener('click', screenHome);
  document.getElementById('cta').addEventListener('click', () => take(x));
}
function take(x){
  state.taken[x.id] = true;
  // find or create chat with author
  let chat = CHATS.find(c => c.name === x.by);
  if (!chat){
    chat = {
      id:'c_'+x.id, name:x.by, online:false, status:'Task author', unread:0, time:'Now',
      taskTitle:x.title, reward:x.reward || x.cost || 0,
      sys:"You're contacting "+x.by+" about this task",
      msgs:[],
    };
    CHATS.push(chat);
  }
  chat.unread = 0;
  screenChat(chat.id, () => screenTask(x.id));
}

/* SCREEN 3 — Create */
let createCat = 0;
function screenCreate(){
  setTab('create');
  const cats = isRTL() ? ['אקדמי','טכני','סידורי משרד','אחר'] : ['Academic','Technical','Office errands','Other'];
  const chips = cats.map((c,i) =>
    '<button class="chip'+(i===createCat?' is-on':'')+'" data-cat="'+i+'">'+esc(c)+'</button>'
  ).join('');
  const html =
    '<div class="screen-title">'+esc(t('needHelp'))+'</div>'+
    '<div class="screen-sub">'+esc(t('postGetHelp'))+'</div>'+

    '<div class="field"><label class="field__label" for="cTitle">'+esc(t('taskTitle'))+'</label>'+
      '<input class="input" id="cTitle" placeholder="'+esc(t('titlePh'))+'"/></div>'+

    '<div class="field"><label class="field__label">'+esc(t('fCategory'))+'</label>'+
      '<div class="chips" id="cChips">'+chips+'</div></div>'+

    '<div class="field"><label class="field__label" for="cDesc">'+esc(t('description'))+'</label>'+
      '<textarea class="textarea" id="cDesc" placeholder="'+esc(t('descPh'))+'"></textarea></div>'+

    '<div class="field"><label class="field__label">'+esc(t('reward'))+'</label>'+
      '<div class="range-wrap">'+
        '<input type="range" class="range" id="cReward" min="5" max="100" step="5" value="45"/>'+
        '<div class="range-labels"><span>5 🪙</span><span>100 🪙</span></div>'+
      '</div>'+
      '<span class="reward-badge" id="cRewardV">&minus;45'+COIN+'</span>'+
    '</div>'+

    '<button class="btn-primary" id="cPublish">'+esc(t('publish'))+'</button>';

  render(html);

  const chipsEl = document.getElementById('cChips');
  chipsEl.querySelectorAll('.chip').forEach(ch => {
    ch.addEventListener('click', () => {
      createCat = +ch.dataset.cat;
      chipsEl.querySelectorAll('.chip').forEach(c => c.classList.remove('is-on'));
      ch.classList.add('is-on');
    });
  });

  const range = document.getElementById('cReward');
  const badge = document.getElementById('cRewardV');
  range.addEventListener('input', () => { badge.innerHTML = '&minus;'+range.value+COIN; });

  document.getElementById('cPublish').addEventListener('click', () => {
    const title = document.getElementById('cTitle').value.trim();
    const desc = document.getElementById('cDesc').value.trim();
    const cost = +range.value;
    if (!title){
      toast(t('addTitleFirst'), false);
      document.getElementById('cTitle').focus();
      return;
    }
    const catsEn = ['Academic','Technical','Office errands','Other'];
    TASKS.unshift({
      id:'mine_'+Date.now(), title, icon:I.edit, due:t('myTask'),
      cost, mine:true, tag:catsEn[createCat], desc: desc || 'A task you posted.',
      location:'Bar-Ilan campus', by: state.user.name,
    });
    toast(t('taskPublished'));
    setTimeout(() => { setTab('home'); screenHome(); }, 700);
  });
}

/* SCREEN 4 — Spend */
function screenSpend(){
  setTab('spend');
  const venues = VENUES.map(v =>
    '<button class="venue" data-id="'+esc(v.id)+'">'+
      '<span class="venue__logo" style="background:'+v.color+'">'+esc(v.logo)+'</span>'+
      '<span class="venue__mid"><span class="venue__t">'+esc(venueName(v))+'</span>'+
      '<span class="venue__sub">'+esc(venueSub(v))+'</span></span>'+
      '<span class="venue__r"><span class="venue__price">'+v.price+COIN+'</span>'+
      '<span class="venue__pct">'+esc(venuePct(v))+'</span></span>'+
    '</button>'
  ).join('');
  const html =
    '<div class="screen-title">'+esc(t('spendTokens'))+'</div>'+
    '<div class="screen-sub">'+esc(t('discountsAt'))+'</div>'+
    '<div class="spend-avail"><span class="spend-avail__l">'+esc(t('availableForYou'))+'</span>'+
      '<span class="spend-avail__v" id="spendBal">'+state.balance+COIN+'</span></div>'+
    '<div>'+venues+'</div>';
  render(html);
  view.querySelectorAll('.venue').forEach(el => {
    el.addEventListener('click', () => buyVenue(el.dataset.id));
  });
}
function buyVenue(id){
  const v = VENUES.find(x => x.id === id);
  if (!v) return;
  if (state.balance < v.price){
    toast(t('notEnough') + venueName(v), false);
    return;
  }
  state.balance -= v.price;
  state.history.unshift({
    t:'Discount at ' + v.name, he:'הנחה ב-' + v.name,
    s:'Today', sHe:'היום', d:-v.price, type:'minus',
  });
  const bal = document.getElementById('spendBal');
  if (bal) bal.innerHTML = state.balance + COIN;
  toast(t('purchased') + v.pct);
  openCoupon(v);
}

/* SCREEN 5 — Profile */
function screenProfile(){
  setTab('profile');
  const u = state.user;
  const lang =
    '<button class="lang-toggle lang-toggle--prof" id="langToggleProf">'+
      '<span class="lang-toggle__seg'+(state.lang==='en'?' is-on':'')+'" data-l="en">EN</span>'+
      '<span class="lang-toggle__seg'+(state.lang==='he'?' is-on':'')+'" data-l="he">עב</span>'+
    '</button>';
  const seg =
    '<div class="seg">'+
      ['all','earned','spent'].map(f =>
        '<button class="seg__btn'+(state.histFilter===f?' is-on':'')+'" data-f="'+f+'">'+
        esc(f==='all'?t('fAll'):f==='earned'?t('fEarned'):t('fSpent'))+'</button>'
      ).join('')+
    '</div>';
  const html =
    '<div class="prof-top">'+lang+
      '<span class="prof-av">'+esc(u.initial)+'</span>'+
      '<div class="prof-name">'+esc(u.name)+'</div>'+
      '<div class="prof-role">'+esc(u.role)+'</div>'+
    '</div>'+

    '<div class="prof-actions">'+
      '<button class="pbtn pbtn--hi" id="pBalance">'+
        '<div class="pbtn__top"><span class="pbtn__lab">'+esc(t('balance'))+'</span>'+
          '<button class="help-dot" id="pBalHelp" aria-label="What are tokens?">?</button></div>'+
        '<span class="pbtn__val">'+state.balance+COIN+'</span>'+
      '</button>'+
      '<button class="pbtn" id="pMessages">'+
        '<div class="pbtn__top"><span class="pbtn__ic">'+I.msg+'</span></div>'+
        '<span class="pbtn__lab" style="font-weight:800;color:var(--ink);font-size:1rem">'+esc(t('messages'))+'</span>'+
      '</button>'+
    '</div>'+

    '<div class="sec-head" style="margin:18px 0 0"><h2>'+esc(t('history'))+'</h2></div>'+
    seg +
    '<div id="histList">'+renderHistory()+'</div>';

  render(html);

  document.getElementById('langToggleProf').addEventListener('click', e => {
    const seg = e.target.closest('.lang-toggle__seg');
    if (!seg) return;
    if (state.lang === seg.dataset.l) return;
    state.lang = seg.dataset.l;
    applyLang();
    screenProfile();
  });
  document.getElementById('pBalance').addEventListener('click', e => {
    if (e.target.closest('#pBalHelp')){ openCurrencyHelp(); return; }
    setTab('spend'); screenSpend();
  });
  document.getElementById('pMessages').addEventListener('click', screenMessages);
  view.querySelectorAll('.seg__btn').forEach(b => {
    b.addEventListener('click', () => {
      state.histFilter = b.dataset.f;
      view.querySelectorAll('.seg__btn').forEach(x => x.classList.toggle('is-on', x===b));
      document.getElementById('histList').innerHTML = renderHistory();
    });
  });
}
function renderHistory(){
  const f = state.histFilter;
  const list = state.history.filter(h =>
    f==='all' ? true : f==='earned' ? h.type==='plus' : h.type==='minus'
  );
  if (!list.length) return '<div class="empty">'+esc(t('nothingHere'))+'</div>';
  return list.map(h => {
    const minus = h.type === 'minus';
    const txt = isRTL() ? h.he : h.t;
    const time = isRTL() ? h.sHe : h.s;
    const amt = (h.d > 0 ? '+' : '&minus;') + Math.abs(h.d);
    return '<div class="hist">'+
      '<span class="hist__ic'+(minus?' hist__ic--minus':'')+'">'+(minus?I.coffee:I.book)+'</span>'+
      '<div class="hist__mid"><div class="hist__t">'+esc(txt)+'</div>'+
      '<div class="hist__time">'+esc(time)+'</div></div>'+
      '<span class="hist__d hist__d--'+(minus?'minus':'plus')+'">'+amt+COIN+'</span>'+
    '</div>';
  }).join('');
}

/* SCREEN 6 — Messages */
function screenMessages(){
  const rows = CHATS.map(c => {
    const name = c.listName || c.name;
    const last = c.msgs.length ? c.msgs[c.msgs.length-1].text : (c.sys || '');
    const badge = c.unread > 0 ? '<span class="mrow__badge">'+c.unread+'</span>' : '';
    return '<button class="mrow" data-id="'+esc(c.id)+'">'+
      '<span class="mrow__av">'+esc(name[0])+'</span>'+
      '<span class="mrow__mid"><span class="mrow__top">'+
        '<span class="mrow__name">'+esc(name)+'</span>'+
        '<span class="mrow__time">'+esc(c.time)+'</span></span>'+
      '<span class="mrow__prev">'+esc(last)+'</span></span>'+
      badge+'</button>';
  }).join('');
  const html =
    '<div class="topbar"><button class="topbar__back" id="back" aria-label="Back">'+I.back+'</button>'+
      '<span class="topbar__title">'+esc(t('messages'))+'</span></div>'+
    '<div>'+rows+'</div>';
  render(html);
  document.getElementById('back').addEventListener('click', screenProfile);
  view.querySelectorAll('.mrow').forEach(el => {
    el.addEventListener('click', () => {
      const c = CHATS.find(x => x.id === el.dataset.id);
      if (c) c.unread = 0;
      screenChat(el.dataset.id, screenMessages);
    });
  });
}

/* SCREEN 7 — Chat */
function screenChat(id, backFn){
  const c = CHATS.find(x => x.id === id);
  if (!c) return screenMessages();
  const statusCls = c.online ? 'chat-head__status is-online' : 'chat-head__status';
  const statusTxt = c.online ? 'online' : (c.status || 'last seen recently');
  const sys = c.sys ? '<div class="chat-sys">'+esc(c.sys)+'</div>' : '';
  const bubbles = c.msgs.map(m =>
    '<div class="bubble bubble--'+(m.who==='me'?'me':'them')+'">'+esc(m.text)+'</div>'
  ).join('');
  const html =
    '<div class="chat-head"><button class="topbar__back" id="back" aria-label="Back">'+I.back+'</button>'+
      '<span class="chat-head__av">'+esc(c.name[0])+'</span>'+
      '<div class="chat-head__mid"><div class="chat-head__name">'+esc(c.name)+'</div>'+
      '<div class="'+statusCls+'">'+esc(statusTxt)+'</div></div></div>'+

    '<div class="chat-ctx"><span class="chat-ctx__t">'+esc(t('taskCtx'))+esc(c.taskTitle)+'</span>'+
      '<span class="chat-ctx__r">+'+c.reward+COIN+'</span></div>'+

    '<div class="chat-body" id="chatBody">'+sys+bubbles+'</div>'+

    '<div class="chat-input">'+
      '<input class="chat-input__f" id="chatField" placeholder="'+esc(t('messagePh'))+'"/>'+
      '<button class="chat-input__send" id="chatSend" aria-label="Send">'+I.send+'</button>'+
    '</div>';
  render(html, '');
  const body = document.getElementById('chatBody');
  body.scrollTop = body.scrollHeight;
  document.getElementById('back').addEventListener('click', () => (backFn || screenMessages)());

  const field = document.getElementById('chatField');
  function send(){
    const text = field.value.trim();
    if (!text) return;
    c.msgs.push({ who:'me', text });
    body.insertAdjacentHTML('beforeend', '<div class="bubble bubble--me">'+esc(text)+'</div>');
    field.value = '';
    body.scrollTop = body.scrollHeight;
    setTimeout(() => {
      const reply = t('greatThanks');
      c.msgs.push({ who:'them', text:reply });
      body.insertAdjacentHTML('beforeend', '<div class="bubble bubble--them">'+esc(reply)+'</div>');
      body.scrollTop = body.scrollHeight;
    }, 900);
  }
  document.getElementById('chatSend').addEventListener('click', send);
  field.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
}

/* ---------- 10. Tab router + applyLang ---------- */
tabbar.addEventListener('click', e => {
  const btn = e.target.closest('.tab');
  if (!btn) return;
  closeDotsMenu();
  const tab = btn.dataset.tab;
  if (tab === 'home') screenHome();
  else if (tab === 'create') screenCreate();
  else if (tab === 'spend') screenSpend();
  else if (tab === 'profile') screenProfile();
});

function applyLang(){
  document.documentElement.lang = state.lang;
  screen.setAttribute('dir', isRTL() ? 'rtl' : 'ltr');
}

/* ---------- 11. Boot ---------- */
applyLang();
setTab('home');
screenHome();
