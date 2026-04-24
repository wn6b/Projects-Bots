/* ════════════════════════════════════════════
   Projects Bots — script.js
   by وائل | Wano (@wn6b)
   ════════════════════════════════════════════ */

'use strict';

// ══════════════════════════════════
// CONFIG — OWNER CREDENTIALS
// ══════════════════════════════════
const OWNER = {
  email: 'waylalyzydy51@gmail.com',
  password: 'f!2HgJv#)"E"y^i',
  name: 'وائل | Wano',
  username: 'wn6b',
  role: 'owner'
};

const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514';

// ══════════════════════════════════
// STORAGE HELPERS
// ══════════════════════════════════
const DB = {
  get: (k) => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  del: (k) => localStorage.removeItem(k)
};

// Ensure owner account always exists in users db
function initOwner() {
  let users = DB.get('pb_users') || [];
  const exists = users.find(u => u.email === OWNER.email);
  if (!exists) {
    users.push({
      email: OWNER.email,
      password: OWNER.password,
      name: OWNER.name,
      username: OWNER.username,
      role: 'owner',
      createdAt: new Date().toISOString()
    });
    DB.set('pb_users', users);
  }
}

// ══════════════════════════════════
// LOADER
// ══════════════════════════════════
const LOADER_STEPS = [
  'Initializing AI Core...',
  'Loading Neural Networks...',
  'Connecting to Cloud...',
  'Authenticating Services...',
  'Scanning Security Layers...',
  'Syncing Project Database...',
  'Calibrating AI Scanner...',
  'Ready ✓'
];

function startLoader() {
  initOwner();
  const bar = document.getElementById('loaderBar');
  const status = document.getElementById('loaderStatus');

  // particles
  const pc = document.getElementById('loaderParticles');
  for (let i = 0; i < 18; i++) {
    const d = document.createElement('div');
    d.className = 'lp-dot';
    const size = Math.random() * 4 + 2;
    d.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random()*100}%;
      animation-duration:${Math.random()*6+5}s;
      animation-delay:${Math.random()*4}s;
      opacity:0.6;
    `;
    pc.appendChild(d);
  }

  let step = 0;
  const total = LOADER_STEPS.length;
  const interval = setInterval(() => {
    if (step >= total) {
      clearInterval(interval);
      setTimeout(exitLoader, 400);
      return;
    }
    const pct = Math.round(((step + 1) / total) * 100);
    bar.style.width = pct + '%';
    status.textContent = LOADER_STEPS[step];
    step++;
  }, 320);
}

function exitLoader() {
  const loader = document.getElementById('loader');
  loader.classList.add('exit');
  setTimeout(() => {
    loader.classList.add('hidden');
    checkAutoLogin();
  }, 600);
}

// ══════════════════════════════════
// AUTO-LOGIN CHECK
// ══════════════════════════════════
function checkAutoLogin() {
  const saved = DB.get('pb_session');
  if (saved && saved.email) {
    const users = DB.get('pb_users') || [];
    const user = users.find(u => u.email === saved.email);
    if (user) {
      loginUser(user, false);
      return;
    }
  }
  showAuthScreen();
}

function showAuthScreen() {
  document.getElementById('authScreen').classList.remove('hidden');
  initAuthCanvas();
  switchTab('login');
}

// ══════════════════════════════════
// AUTH CANVAS BACKGROUND
// ══════════════════════════════════
function initAuthCanvas() {
  const canvas = document.getElementById('authCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const nodes = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 2 + 1
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,212,255,0.5)';
      ctx.fill();
    });
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(0,132,255,${0.15 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ══════════════════════════════════
// TAB SWITCHING
// ══════════════════════════════════
function switchTab(tab) {
  const loginTab = document.getElementById('tabLogin');
  const regTab = document.getElementById('tabRegister');
  const slider = document.getElementById('tabSlider');
  const formLogin = document.getElementById('formLogin');
  const formReg = document.getElementById('formRegister');

  if (tab === 'login') {
    loginTab.classList.add('active');
    regTab.classList.remove('active');
    formLogin.classList.add('active');
    formReg.classList.remove('active');
    // Slider position: RTL layout — "تسجيل الدخول" is left side (right side in RTL)
    slider.style.right = '4px';
    slider.style.left = '50%';
    slider.style.width = 'calc(50% - 4px)';
  } else {
    regTab.classList.add('active');
    loginTab.classList.remove('active');
    formReg.classList.add('active');
    formLogin.classList.remove('active');
    slider.style.right = '50%';
    slider.style.left = '4px';
    slider.style.width = 'calc(50% - 4px)';
  }
}

// Init slider on load
document.addEventListener('DOMContentLoaded', () => {
  const slider = document.getElementById('tabSlider');
  if (slider) {
    slider.style.right = '4px';
    slider.style.left = '50%';
    slider.style.width = 'calc(50% - 4px)';
  }
});
// ══════════════════════════════════
// LOGIN
// ══════════════════════════════════
async function handleLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPass').value;
  const remember = document.getElementById('rememberMe').checked;
  const errEl = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');

  hideEl(errEl);

  if (!email || !pass) {
    showErr(errEl, '⚠️ الرجاء إدخال البريد وكلمة المرور');
    return;
  }

  setLoading(btn, true);
  showAIThink('AI يتحقق من هويتك...');

  await sleep(800); // simulate AI check

  const users = DB.get('pb_users') || [];
  const user = users.find(u => u.email === email && u.password === pass);

  if (!user) {
    hideAIThink();
    setLoading(btn, false);
    showErr(errEl, '❌ البريد الإلكتروني أو كلمة المرور غير صحيحة');

    // AI analysis
    showAIThink('AI يحلل محاولة الدخول...');
    await sleep(1000);
    hideAIThink();
    return;
  }

  if (remember) {
    DB.set('pb_session', { email: user.email, role: user.role });
  }

  hideAIThink();
  setLoading(btn, false);
  loginUser(user, true);
}

function loginUser(user, animate = true) {
  const authScreen = document.getElementById('authScreen');

  if (animate) {
    authScreen.style.opacity = '0';
    authScreen.style.transform = 'scale(0.96)';
    authScreen.style.transition = 'all 0.4s ease';
    setTimeout(() => authScreen.classList.add('hidden'), 400);
  } else {
    authScreen.classList.add('hidden');
  }

  addActivity(`تسجيل دخول: ${user.name || user.email}`);

  if (user.role === 'owner') {
    showOwnerDash(user);
  } else {
    showUserDash(user);
  }
}

// ══════════════════════════════════
// REGISTER
// ══════════════════════════════════
async function handleRegister() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass = document.getElementById('regPass').value;
  const passC = document.getElementById('regPassConfirm').value;
  const errEl = document.getElementById('registerError');
  const sucEl = document.getElementById('registerSuccess');
  const btn = document.getElementById('registerBtn');

  hideEl(errEl); hideEl(sucEl);

  if (!name || !email || !pass || !passC) {
    showErr(errEl, '⚠️ الرجاء ملء جميع الحقول');
    return;
  }
  if (pass !== passC) {
    showErr(errEl, '❌ كلمة المرور غير متطابقة');
    return;
  }
  if (pass.length < 6) {
    showErr(errEl, '❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    return;
  }
  if (email === OWNER.email) {
    showErr(errEl, '❌ هذا البريد غير متاح للتسجيل');
    return;
  }

  const users = DB.get('pb_users') || [];
  if (users.find(u => u.email === email)) {
    showErr(errEl, '❌ البريد الإلكتروني مسجل بالفعل');
    return;
  }

  setLoading(btn, true);
  showAIThink('AI يراجع حسابك...');

  // AI review via Anthropic API
  let aiApproved = false;
  let aiMessage = '';
  try {
    aiApproved = await aiReviewAccount(name, email);
    aiMessage = aiApproved ? 'تم الموافقة على الحساب بواسطة AI' : 'تم رفض الحساب بواسطة AI';
  } catch {
    aiApproved = true; // fallback allow
    aiMessage = 'تم إنشاء الحساب';
  }

  hideAIThink();
  setLoading(btn, false);

  if (!aiApproved) {
    showErr(errEl, '🤖 AI رفض إنشاء الحساب. الرجاء استخدام بيانات حقيقية.');
    return;
  }

  const newUser = {
    email, password: pass, name,
    username: email.split('@')[0],
    role: 'user',
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  DB.set('pb_users', users);

  addActivity(`حساب جديد: ${name}`);
  updateStats();

  sucEl.textContent = `✅ ${aiMessage}! يمكنك الآن تسجيل الدخول.`;
  sucEl.classList.remove('hidden');

  setTimeout(() => {
    switchTab('login');
    document.getElementById('loginEmail').value = email;
  }, 2000);
}

// ══════════════════════════════════
// AI ACCOUNT REVIEW (Anthropic API)
// ══════════════════════════════════
async function aiReviewAccount(name, email) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: `أنت نظام مراجعة حسابات لمنصة برمجية. راجع هذا الطلب وقرر الموافقة أو الرفض.
الاسم: ${name}
البريد: ${email}
أجب بكلمة واحدة فقط: APPROVE أو REJECT
إذا كانت البيانات تبدو حقيقية ومعقولة فوافق، إذا كانت spam أو مزيفة ارفض.`
        }]
      })
    });
    const data = await response.json();
    const text = data.content?.[0]?.text?.toUpperCase() || '';
    return text.includes('APPROVE');
  } catch {
    return true;
  }
}

// ══════════════════════════════════
// LOGOUT
// ══════════════════════════════════
function handleLogout() {
  DB.del('pb_session');
  document.getElementById('ownerDash').classList.add('hidden');
  document.getElementById('userDash').classList.add('hidden');
  const auth = document.getElementById('authScreen');
  auth.classList.remove('hidden');
  auth.style.opacity = '';
  auth.style.transform = '';
  auth.style.transition = '';
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPass').value = '';
  switchTab('login');
}

// ══════════════════════════════════
// OWNER DASHBOARD
// ══════════════════════════════════
function showOwnerDash(user) {
  document.getElementById('ownerDash').classList.remove('hidden');
  renderProjects();
  renderDevs();
  updateStats();
}

function showUserDash(user) {
  const dash = document.getElementById('userDash');
  dash.classList.remove('hidden');
  document.getElementById('userWelcomeText').textContent = `مرحباً، ${user.name || user.username} 👋`;
  document.getElementById('userSidebarInfo').innerHTML = `
    <div class="su-avatar">${(user.name || 'U')[0].toUpperCase()}</div>
    <div class="su-info">
      <span class="su-name">${user.name || user.username}</span>
      <span class="su-role" style="color:var(--accent2)">👤 User</span>
    </div>
  `;
  renderUserProjects();
}

// ══════════════════════════════════
// SECTION NAVIGATION
// ══════════════════════════════════
function showSection(id, el) {
  document.querySelectorAll('#ownerDash .dash-section').forEach(s => s.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
  document.querySelectorAll('#ownerDash .snav-item').forEach(a => a.classList.remove('active'));
  if (el) el.classList.add('active');

  const titles = {
    secHome: 'الرئيسية', secProjects: 'المشاريع',
    secDevelopers: 'المطورين', secUpload: 'رفع مشروع',
    secAI: 'AI Scanner', secSettings: 'الإعدادات'
  };
  document.getElementById('pageTitle').textContent = titles[id] || '';
  closeSidebar();
}

function showUserSection(id, el) {
  document.querySelectorAll('#userDash .dash-section').forEach(s => s.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
  document.querySelectorAll('#userDash .snav-item').forEach(a => a.classList.remove('active'));
  if (el) el.classList.add('active');

  const titles = { usecHome: 'الرئيسية', usecProjects: 'المشاريع', usecDev: 'Developers' };
  document.getElementById('userPageTitle').textContent = titles[id] || '';
  closeUserSidebar();
}

// ══════════════════════════════════
// SIDEBAR TOGGLE
// ══════════════════════════════════
function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}
function closeSidebar() {
  if (window.innerWidth <= 768) document.getElementById('sidebar').classList.remove('open');
}
function toggleUserSidebar() {
  document.getElementById('userSidebar').classList.toggle('open');
}
function closeUserSidebar() {
  if (window.innerWidth <= 768) document.getElementById('userSidebar').classList.remove('open');
}

// ══════════════════════════════════
// PROJECTS
// ══════════════════════════════════
const TYPE_ICONS = {
  discord: '🤖', telegram: '✈️', whatsapp: '💬',
  extension: '🧩', website: '🌐', other: '📦'
};

function getProjects() { return DB.get('pb_projects') || []; }
function saveProjects(p) { DB.set('pb_projects', p); }

function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;
  const projects = getProjects();
  document.getElementById('statProjects').textContent = projects.length;

  if (!projects.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="es-icon">📦</div>
        <div class="es-text">لا توجد مشاريع بعد</div>
        <button class="es-btn" onclick="showSection('secUpload', null)">ارفع أول مشروع</button>
      </div>`;
    return;
  }

  grid.innerHTML = projects.map((p, i) => `
    <div class="project-card" id="proj-${i}">
      <div class="pc-header">
        <div class="pc-icon">${TYPE_ICONS[p.type] || '📦'}</div>
        <div>
          <div class="pc-name">${escHtml(p.name)}</div>
          <div class="pc-type">${p.type}</div>
        </div>
      </div>
      <div class="pc-body">
        <div class="pc-desc">${escHtml(p.desc || 'لا يوجد وصف')}</div>
      </div>
      <div class="pc-footer">
        <button class="download-btn" onclick="downloadProject(${i})">
          ⬇️ تحميل
        </button>
        <button class="delete-btn" onclick="deleteProject(${i})">🗑</button>
      </div>
    </div>
  `).join('');
}

function renderUserProjects() {
  const grid = document.getElementById('userProjectsGrid');
  if (!grid) return;
  const projects = getProjects();
  if (!projects.length) {
    grid.innerHTML = `<div class="empty-state"><div class="es-icon">📦</div><div class="es-text">لا توجد مشاريع متاحة بعد</div></div>`;
    return;
  }
  grid.innerHTML = projects.map((p, i) => `
    <div class="project-card">
      <div class="pc-header">
        <div class="pc-icon">${TYPE_ICONS[p.type] || '📦'}</div>
        <div>
          <div class="pc-name">${escHtml(p.name)}</div>
          <div class="pc-type">${p.type}</div>
        </div>
      </div>
      <div class="pc-body">
        <div class="pc-desc">${escHtml(p.desc || 'لا يوجد وصف')}</div>
      </div>
      <div class="pc-footer">
        <button class="download-btn" onclick="downloadProject(${i})">⬇️ تحميل</button>
      </div>
    </div>
  `).join('');
}

function deleteProject(i) {
  if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;
  const projects = getProjects();
  projects.splice(i, 1);
  saveProjects(projects);
  renderProjects();
  addActivity('تم حذف مشروع');
  updateStats();
}

function downloadProject(i) {
  const projects = getProjects();
  const p = projects[i];
  if (!p) return;

  // Increment download counter
  let stats = DB.get('pb_stats') || { downloads: 0 };
  stats.downloads = (stats.downloads || 0) + 1;
  DB.set('pb_stats', stats);
  updateStats();
  addActivity(`تحميل: ${p.name}`);

  if (p.fileData && p.fileName) {
    // Real file download
    const link = document.createElement('a');
    link.href = p.fileData;
    link.download = p.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert(`📦 المشروع: ${p.name}\n\nلا يوجد ملف مرفق لهذا المشروع.`);
  }
}
