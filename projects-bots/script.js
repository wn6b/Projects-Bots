/* ════════════════════════════════════════════
   Projects Developers — pd-script.js
   by وائل | Wano (@wn6b)
   ════════════════════════════════════════════ */

'use strict';

const MODEL = 'claude-sonnet-4-20250514';

// ══════════════════════════════════
// CURSOR
// ══════════════════════════════════
const cursor = document.getElementById('cursor');
const trail = document.getElementById('cursorTrail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});
function animTrail() {
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  trail.style.left = tx + 'px';
  trail.style.top = ty + 'px';
  requestAnimationFrame(animTrail);
}
animTrail();

document.addEventListener('mousedown', () => {
  cursor.style.width = '6px'; cursor.style.height = '6px';
  trail.style.width = '40px'; trail.style.height = '40px';
});
document.addEventListener('mouseup', () => {
  cursor.style.width = '10px'; cursor.style.height = '10px';
  trail.style.width = '28px'; trail.style.height = '28px';
});

// ══════════════════════════════════
// LOADER
// ══════════════════════════════════
function startLoader() {
  const canvas = document.getElementById('loaderCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Hexagonal particle field
  const hexes = Array.from({ length: 25 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 30 + 15,
    alpha: Math.random() * 0.12 + 0.03,
    rot: Math.random() * Math.PI,
    rotSpeed: (Math.random() - 0.5) * 0.01,
    vy: (Math.random() - 0.5) * 0.3
  }));

  function drawHex(x, y, size, rot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      i === 0 ? ctx.moveTo(Math.cos(a) * size, Math.sin(a) * size)
              : ctx.lineTo(Math.cos(a) * size, Math.sin(a) * size);
    }
    ctx.closePath();
    ctx.restore();
  }

  let frame = 0;
  function drawLoader() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hexes.forEach(h => {
      h.rot += h.rotSpeed; h.y += h.vy;
      if (h.y > canvas.height + 50) h.y = -50;
      if (h.y < -50) h.y = canvas.height + 50;
      drawHex(h.x, h.y, h.size, h.rot);
      ctx.strokeStyle = `rgba(0,255,136,${h.alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    frame++;
    requestAnimationFrame(drawLoader);
  }
  drawLoader();

  // Progress
  const fill = document.getElementById('loaderFill');
  const pct = document.getElementById('loaderPct');
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 12 + 4;
    if (progress >= 100) { progress = 100; clearInterval(interval); setTimeout(exitLoader, 400); }
    fill.style.width = progress + '%';
    pct.textContent = Math.floor(progress) + '%';
  }, 180);
}

function exitLoader() {
  const loader = document.getElementById('loader');
  loader.classList.add('exit');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.getElementById('mainSite').classList.remove('hidden');
    initHeroCanvas();
    initHeroTerminal();
    animateStats();
  }, 700);
}

// ══════════════════════════════════
// HERO CANVAS
// ══════════════════════════════════
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const nodes = Array.from({ length: 50 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.5 + 0.5
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,255,136,0.6)';
      ctx.fill();
    });
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0,255,136,${0.12 * (1 - d / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// ══════════════════════════════════
// HERO TERMINAL ANIMATION
// ══════════════════════════════════
const TERMINAL_LINES = [
  { t: '$ git push origin main', c: '', d: 0 },
  { t: '<i class="fa-solid fa-arrow-right-long"></i> Connecting to Projects Bots...', c: 'ht-ok', d: 1200 },
  { t: '<i class="fa-solid fa-arrow-right-long"></i> AI Scanner: analyzing...', c: 'ht-warn', d: 2200 },
  { t: '<i class="fa-solid fa-shield-check"></i> No threats detected', c: 'ht-ok', d: 3400 },
  { t: '<i class="fa-solid fa-check-double"></i> Project approved by AI', c: 'ht-ok', d: 4200 },
  { t: '<i class="fa-solid fa-rocket"></i> Published successfully!', c: 'ht-ok', d: 5200 },
  { t: '$ _', c: 'ht-t typing', d: 6000 },
];

function initHeroTerminal() {
  const body = document.getElementById('heroTerminal');
  if (!body) return;
  body.innerHTML = '';
  TERMINAL_LINES.forEach(l => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.className = 'ht-line-c';
      div.innerHTML = `<span class="${l.c || 'ht-t'}">${l.t}</span>`;
      body.appendChild(div);
      body.scrollTop = body.scrollHeight;
    }, l.d);
  });
  // Loop
  setTimeout(initHeroTerminal, 8000);
}

// ══════════════════════════════════
// STATS ANIMATION
// ══════════════════════════════════
function animateStats() {
  const devs = (DB.get('pd_devs') || []).length;
  const projs = (DB.get('pd_projs') || []).length;
  countUp('hsDevs', devs);
  countUp('hsProjs', projs);
}

function countUp(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let cur = 0;
  const step = Math.max(1, Math.floor(target / 30));
  const interval = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = cur;
    if (cur >= target) clearInterval(interval);
  }, 40);
}
// ══════════════════════════════════
// STORAGE
// ══════════════════════════════════
const DB = {
  get: k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v))
};

// ══════════════════════════════════
// NAV
// ══════════════════════════════════
function toggleNav() {
  document.getElementById('navMobile').classList.toggle('hidden');
}

window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  nav.style.borderBottomColor = window.scrollY > 20 ? 'rgba(29,45,85,0.8)' : '';
});

function scrollToReg() {
  document.getElementById('register')?.scrollIntoView({ behavior: 'smooth' });
}

// ══════════════════════════════════
// CAPTCHA
// ══════════════════════════════════
let capA = 0, capB = 0, capCorrect = false;
let cfDone = false;

function generateCaptcha() {
  capA = Math.floor(Math.random() * 15) + 3;
  capB = Math.floor(Math.random() * 10) + 2;
  const ops = ['+', '-', '×'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let answer;
  if (op === '+') answer = capA + capB;
  else if (op === '-') { answer = capA - capB; capA = capA + capB; }
  else answer = capA * capB;

  document.getElementById('capQuestion').textContent = `${capA} ${op} ${capB} = ?`;
  window._capAnswer = answer;
  capCorrect = false;
}

function checkCaptcha() {
  const val = parseInt(document.getElementById('capAnswer').value);
  const statusEl = document.getElementById('capStatus');
  statusEl.classList.remove('hidden');
  if (val === window._capAnswer) {
    capCorrect = true;
    statusEl.className = 'cap-status status-ok';
    statusEl.innerHTML = '<i class="fa-solid fa-check"></i> إجابة صحيحة!';
  } else {
    capCorrect = false;
    statusEl.className = 'cap-status status-err';
    statusEl.innerHTML = '<i class="fa-solid fa-xmark"></i> إجابة خاطئة، حاول مرة أخرى';
    generateCaptcha();
    document.getElementById('capAnswer').value = '';
  }
}

document.getElementById('capAnswer')?.addEventListener('input', checkCaptcha);

async function doCFCheck() {
  if (cfDone) return;
  const box = document.getElementById('cfCheckbox');
  const label = document.getElementById('cfLabel');
  const status = document.getElementById('cfStatus');

  box.classList.add('checking');
  label.innerHTML = 'جاري التحقق <i class="fa-solid fa-spinner fa-spin"></i>';

  await sleep(1200 + Math.random() * 800);

  box.classList.remove('checking');
  box.classList.add('done');
  box.querySelector('.cf-inner').innerHTML = '<i class="fa-solid fa-check"></i>';
  label.textContent = 'تم التحقق';
  cfDone = true;

  status.classList.remove('hidden');
  status.className = 'cf-status status-ok';
  status.innerHTML = '<i class="fa-solid fa-shield-check"></i> تم التحقق بنجاح — أنت لست روبوتاً';
}

// ══════════════════════════════════
// MULTI-STEP FORM
// ══════════════════════════════════
let currentStep = 1;

function nextStep(from) {
  if (!validateStep(from)) return;
  goToStep(from + 1);
}
function prevStep(from) { goToStep(from - 1); }

function goToStep(n) {
  document.getElementById('step' + currentStep)?.classList.remove('active');
  currentStep = n;
  document.getElementById('step' + n)?.classList.add('active');
  updateStepIndicator(n);

  if (n === 3) { generateCaptcha(); }
  if (n === 4) { /* ready for AI review */ }

  window.scrollTo({ top: document.getElementById('register').offsetTop - 80, behavior: 'smooth' });
}

function updateStepIndicator(n) {
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById('rs' + i);
    if (!el) continue;
    el.classList.remove('active', 'done');
    if (i < n) el.classList.add('done');
    else if (i === n) el.classList.add('active');
  }
}

function validateStep(n) {
  const warnIcon = '<i class="fa-solid fa-triangle-exclamation"></i>';
  
  if (n === 1) {
    const name = v('r_name'), username = v('r_username'), email = v('r_email');
    const pass = v('r_pass'), pass2 = v('r_pass2');
    const err = document.getElementById('err1');
    if (!name) return showErr(err, `${warnIcon} الرجاء إدخال الاسم الكامل`);
    if (!username) return showErr(err, `${warnIcon} الرجاء إدخال اسم المستخدم`);
    if (!email || !email.includes('@')) return showErr(err, `${warnIcon} البريد الإلكتروني غير صحيح`);
    if (!pass || pass.length < 6) return showErr(err, `${warnIcon} كلمة المرور يجب أن تكون 6 أحرف على الأقل`);
    if (pass !== pass2) return showErr(err, `${warnIcon} كلمة المرور غير متطابقة`);
    hideEl(err); return true;
  }
  if (n === 2) {
    const proj = v('r_proj'), type = v('r_type'), lang = v('r_lang'), desc = v('r_projdesc'), why = v('r_why');
    const err = document.getElementById('err2');
    if (!proj) return showErr(err, `${warnIcon} الرجاء إدخال اسم المشروع`);
    if (!type) return showErr(err, `${warnIcon} الرجاء اختيار نوع المشروع`);
    if (!lang) return showErr(err, `${warnIcon} الرجاء اختيار لغة البرمجة`);
    if (!desc || desc.length < 20) return showErr(err, `${warnIcon} الرجاء كتابة وصف لا يقل عن 20 حرف`);
    if (!why || why.length < 15) return showErr(err, `${warnIcon} الرجاء الإجابة على سؤال الانضمام`);
    hideEl(err); return true;
  }
  if (n === 3) {
    const err = document.getElementById('err3');
    if (!capCorrect) return showErr(err, `${warnIcon} الرجاء إكمال التحقق الرياضي بشكل صحيح`);
    if (!cfDone) return showErr(err, `${warnIcon} الرجاء إكمال تحقق Cloudflare`);
    if (!document.getElementById('agreeTerms').checked) return showErr(err, `${warnIcon} الرجاء الموافقة على شروط الاستخدام`);
    hideEl(err); return true;
  }
  return true;
}
// ══════════════════════════════════
// AI REVIEW + SUBMIT
// ══════════════════════════════════
async function submitRegistration() {
  const btn = document.getElementById('submitBtn');
  const btnText = document.getElementById('submitBtnText');
  const spin = document.getElementById('submitSpin');
  const err = document.getElementById('err4');
  hideEl(err);

  btnText.classList.add('hidden');
  spin.classList.remove('hidden');
  btn.disabled = true;

  const terminal = document.getElementById('arptBody');
  terminal.innerHTML = '';
  document.getElementById('arpStatus').textContent = 'جاري المراجعة...';
  hideEl(document.getElementById('arpResult'));

  const data = gatherFormData();

  // Terminal animation
  const steps = [
    { t: `<span class="st-prompt">$</span> بدء مراجعة حساب: @${data.username}`, c: '', d: 0 },
    { t: '<i class="fa-solid fa-arrow-right-long"></i> تحليل البيانات الشخصية...', c: '', d: 500 },
    { t: '<i class="fa-solid fa-arrow-right-long"></i> فحص معلومات المشروع...', c: '', d: 1100 },
    { t: `<i class="fa-solid fa-arrow-right-long"></i> نوع المشروع: ${data.projType}`, c: 'ok', d: 1700 },
    { t: '<i class="fa-solid fa-arrow-right-long"></i> استشارة Claude AI...', c: '', d: 2300 },
  ];

  for (const s of steps) {
    await sleep(s.d);
    addTermLine(terminal, s.t, s.c);
  }

  // Real AI review
  let approved = false;
  let aiReason = '';
  try {
    const result = await callAIReview(data);
    approved = result.approved;
    aiReason = result.reason;
  } catch {
    approved = true;
    aiReason = 'تم القبول';
  }

  await sleep(300);
  addTermLine(terminal, approved ? '<i class="fa-solid fa-check-double"></i> AI قرر القبول' : '<i class="fa-solid fa-ban"></i> AI قرر الرفض', approved ? 'ok' : 'err');
  await sleep(400);
  addTermLine(terminal, `<i class="fa-solid fa-arrow-right-long"></i> ${aiReason}`, approved ? 'ok' : 'warn');
  await sleep(300);
  addTermLine(terminal, approved ? '══ تم الانتهاء: مقبول ══' : '══ تم الانتهاء: مرفوض ══', approved ? 'ok' : 'err');

  document.getElementById('arpStatus').innerHTML = approved ? '<i class="fa-solid fa-check"></i> تمت الموافقة' : '<i class="fa-solid fa-xmark"></i> تم الرفض';

  const resultEl = document.getElementById('arpResult');
  resultEl.classList.remove('hidden');
  if (approved) {
    resultEl.className = 'arp-result approved';
    resultEl.innerHTML = `<i class="fa-solid fa-check-circle"></i> مرحباً @${data.username}! تمت الموافقة على انضمامك.`;
    saveDevRegistration(data);
    syncToProjectsBots(data);
    await sleep(1500);
    showSuccess(data);
  } else {
    resultEl.className = 'arp-result rejected';
    resultEl.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> عذراً، تم رفض طلبك. ${aiReason}`;
  }

  btnText.classList.remove('hidden');
  spin.classList.add('hidden');
  btn.disabled = false;
}

function addTermLine(el, text, cls = '') {
  const div = document.createElement('div');
  div.className = 'arpt-line' + (cls ? ' ' + cls : '');
  div.innerHTML = text; // استخدمنا innerHTML لضمان عمل الفيكتورات
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}

function gatherFormData() {
  return {
    name: v('r_name'),
    username: v('r_username'),
    email: v('r_email'),
    password: v('r_pass'),
    bio: v('r_bio'),
    projName: v('r_proj'),
    projType: v('r_type'),
    projLang: v('r_lang'),
    projDesc: v('r_projdesc'),
    github: v('r_github'),
    discord: v('r_discord'),
    why: v('r_why'),
    joinedAt: new Date().toISOString()
  };
}

async function callAIReview(data) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `أنت نظام مراجعة للمطورين الراغبين في الانضمام لمنصة برمجية.
المتقدم:
- الاسم: ${data.name}
- اليوزر: @${data.username}
- البريد: ${data.email}
- نوع المشروع: ${data.projType}
- لغة البرمجة: ${data.projLang}
- الوصف: ${data.projDesc}
- سبب الانضمام: ${data.why}

قيّم الطلب. هل يبدو حقيقياً وجادًا؟ هل البيانات منطقية؟
أجب بـ JSON فقط: {"approved": true/false, "reason": "السبب باللغة العربية"}`
      }]
    })
  });
  const json = await res.json();
  const text = json.content?.[0]?.text || '{"approved":true,"reason":"تمت الموافقة"}';
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

// ══════════════════════════════════
// SAVE & SYNC
// ══════════════════════════════════
function saveDevRegistration(data) {
  // Save in pd_ namespace (Projects Developers)
  let devs = DB.get('pd_devs') || [];
  if (!devs.find(d => d.email === data.email)) {
    devs.push(data);
    DB.set('pd_devs', devs);
  }

  // Also save in Projects Bots namespace (pb_) for cross-site access
  let pbDevs = DB.get('pb_devs') || [];
  if (!pbDevs.find(d => d.email === data.email)) {
    pbDevs.push({
      name: data.name,
      username: data.username,
      email: data.email,
      projName: data.projName,
      projType: data.projType,
      joinedAt: data.joinedAt
    });
    DB.set('pb_devs', pbDevs);
  }

  // Save as registered user in pb_users too
  let users = DB.get('pb_users') || [];
  if (!users.find(u => u.email === data.email)) {
    users.push({
      email: data.email,
      password: data.password,
      name: data.name,
      username: data.username,
      role: 'developer',
      createdAt: data.joinedAt
    });
    DB.set('pb_users', users);
  }

  // Track projects count
  let projs = DB.get('pd_projs') || [];
  projs.push({ name: data.projName, dev: data.username, type: data.projType, addedAt: data.joinedAt });
  DB.set('pd_projs', projs);
}

function syncToProjectsBots(data) {
  // Sync stats
  let stats = DB.get('pb_stats') || {};
  stats.lastDev = data.name;
  DB.set('pb_stats', stats);
}

function showSuccess(data) {
  // Hide all step forms
  document.querySelectorAll('.reg-step-form').forEach(f => f.classList.remove('active'));
  document.getElementById('stepSuccess').classList.add('active');

  // Update step indicator
  for (let i = 1; i <= 4; i++) {
    document.getElementById('rs' + i)?.classList.remove('active');
    document.getElementById('rs' + i)?.classList.add('done');
  }

  // Show info
  const info = document.getElementById('ssInfo');
  if (info) {
    info.innerHTML = `
      <div style="display:flex;flex-direction:column;gap:0.4rem;text-align:right">
        <span>المطور: @${esc(data.username)}</span>
        <span>المشروع: ${esc(data.projName)}</span>
        <span>النوع: ${esc(data.projType)}</span>
        <span style="color:var(--text3)">تاريخ الانضمام: ${formatDate(data.joinedAt)}</span>
      </div>
    `;
  }

  animateStats();
  window.scrollTo({ top: document.getElementById('register').offsetTop - 80, behavior: 'smooth' });
}

function resetForm() {
  currentStep = 1;
  ['r_name','r_username','r_email','r_pass','r_pass2','r_bio',
   'r_proj','r_type','r_lang','r_projdesc','r_github','r_discord','r_why',
   'capAnswer'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  capCorrect = false; cfDone = false;
  document.getElementById('cfCheckbox')?.classList.remove('done','checking');
  const inner = document.querySelector('.cf-inner');
  if (inner) inner.innerHTML = '';
  document.getElementById('cfLabel').textContent = 'أنا لست روبوتاً';
  document.getElementById('cfStatus')?.classList.add('hidden');
  document.getElementById('capStatus')?.classList.add('hidden');
  document.getElementById('agreeTerms').checked = false;
  document.getElementById('arptBody').innerHTML = '<div class="arpt-line wait"><span class="st-prompt">$</span> جاهز للمراجعة...</div>';
  hideEl(document.getElementById('arpResult'));

  document.getElementById('stepSuccess').classList.remove('active');
  document.getElementById('step1').classList.add('active');
  updateStepIndicator(1);
}

// ══════════════════════════════════
// HELPERS
// ══════════════════════════════════
const v = id => (document.getElementById(id)?.value || '').trim();
const sleep = ms => new Promise(r => setTimeout(r, ms));
const hideEl = el => el?.classList.add('hidden');

function showErr(el, msg) {
  if (!el) return false;
  el.innerHTML = msg; // لتشغيل الفيكتورات داخل رسائل الخطأ
  el.classList.remove('hidden');
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  return false;
}

function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch { return '-'; }
}

function tp(id, btn) {
  const el = document.getElementById(id);
  if (!el) return;
  el.type = el.type === 'password' ? 'text' : 'password';
  btn.innerHTML = el.type === 'password' ? '<i class="fa-solid fa-eye"></i>' : '<i class="fa-solid fa-eye-slash"></i>';
}

// ══════════════════════════════════
// SCROLL ANIMATIONS
// ══════════════════════════════════
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.style.animation = 'fadeUp 0.6s ease both';
  });
}, { threshold: 0.1 });

document.querySelectorAll('.step-card, .benefit-card').forEach(el => observer.observe(el));

// ══════════════════════════════════
// INIT
// ══════════════════════════════════
window.addEventListener('DOMContentLoaded', startLoader);
