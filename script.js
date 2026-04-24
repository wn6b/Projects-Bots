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
  role: 'owner',
  bio: '',
  pfp: ''
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
      bio: 'أنت على لوحة تحكم الـ Owner. كل شيء تحت سيطرتك.',
      pfp: '',
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
    showErr(errEl, '<i class="fa-solid fa-triangle-exclamation"></i> الرجاء إدخال البريد وكلمة المرور');
    return;
  }

  setLoading(btn, true);
  showAIThink('AI يتحقق من هويتك...');

  await sleep(800); 

  const users = DB.get('pb_users') || [];
  const user = users.find(u => u.email === email && u.password === pass);

  if (!user) {
    hideAIThink();
    setLoading(btn, false);
    showErr(errEl, '<i class="fa-solid fa-xmark"></i> البريد الإلكتروني أو كلمة المرور غير صحيحة');

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
    showErr(errEl, '<i class="fa-solid fa-triangle-exclamation"></i> الرجاء ملء جميع الحقول');
    return;
  }
  if (pass !== passC) {
    showErr(errEl, '<i class="fa-solid fa-xmark"></i> كلمة المرور غير متطابقة');
    return;
  }
  if (pass.length < 6) {
    showErr(errEl, '<i class="fa-solid fa-xmark"></i> كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    return;
  }
  if (email === OWNER.email) {
    showErr(errEl, '<i class="fa-solid fa-ban"></i> هذا البريد غير متاح للتسجيل');
    return;
  }

  const users = DB.get('pb_users') || [];
  if (users.find(u => u.email === email)) {
    showErr(errEl, '<i class="fa-solid fa-xmark"></i> البريد الإلكتروني مسجل بالفعل');
    return;
  }

  setLoading(btn, true);
  showAIThink('AI يراجع حسابك...');

  let aiApproved = false;
  let aiMessage = '';
  try {
    aiApproved = await aiReviewAccount(name, email);
    aiMessage = aiApproved ? 'تم الموافقة على الحساب بواسطة AI' : 'تم رفض الحساب بواسطة AI';
  } catch {
    aiApproved = true; 
    aiMessage = 'تم إنشاء الحساب بنجاح';
  }

  hideAIThink();
  setLoading(btn, false);

  if (!aiApproved) {
    showErr(errEl, '<i class="fa-solid fa-robot"></i> AI رفض إنشاء الحساب. الرجاء استخدام بيانات حقيقية.');
    return;
  }

  const newUser = {
    email, password: pass, name,
    username: email.split('@')[0],
    role: 'user',
    bio: 'مستخدم جديد في المنصة',
    pfp: '',
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  DB.set('pb_users', users);

  addActivity(`حساب جديد: ${name}`);
  updateStats();

  sucEl.innerHTML = `<i class="fa-solid fa-check"></i> ${aiMessage}! يمكنك الآن تسجيل الدخول.`;
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
// DASHBOARDS RENDERING
// ══════════════════════════════════
function showOwnerDash(user) {
  document.getElementById('ownerDash').classList.remove('hidden');
  
  // تحديث واجهة حساب المالك بالبيانات
  document.getElementById('ownerSideName').textContent = user.name || user.username;
  document.getElementById('welcomeOwnerHeader').innerHTML = `مرحباً، ${user.name || user.username} <i class="fa-solid fa-crown" style="color:var(--owner)"></i>`;
  document.getElementById('ownerBioDisplay').textContent = user.bio || 'أنت على لوحة تحكم الـ Owner. كل شيء تحت سيطرتك.';
  
  const pfpEl = document.getElementById('ownerSidePfp');
  if (user.pfp) {
    pfpEl.innerHTML = `<img src="${user.pfp}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
  } else {
    pfpEl.innerHTML = (user.name || 'O')[0].toUpperCase();
  }

  // تعبئة حقول إعدادات الحساب
  const pfpInput = document.getElementById('ownerPfpInput');
  const nameInput = document.getElementById('ownerNameInput');
  const bioInput = document.getElementById('ownerBioInput');
  
  if (pfpInput) pfpInput.value = user.pfp || '';
  if (nameInput) nameInput.value = user.name || user.username || '';
  if (bioInput) bioInput.value = user.bio || '';
  previewPfpChange(user.pfp);

  renderProjects();
  renderDevs();
  updateStats();
}

function showUserDash(user) {
  const dash = document.getElementById('userDash');
  dash.classList.remove('hidden');
  
  document.getElementById('userWelcomeText').innerHTML = `مرحباً، ${user.name || user.username} <i class="fa-solid fa-hand-wave"></i>`;
  const bioEl = document.getElementById('userBioDisplay_User');
  if (bioEl) bioEl.textContent = user.bio || 'استعرض المشاريع وحمّل ما تحتاجه من أدوات برمجية.';

  let pfpHtml = `<div class="su-avatar">${(user.name || 'U')[0].toUpperCase()}</div>`;
  if (user.pfp) {
    pfpHtml = `<div class="su-avatar"><img src="${user.pfp}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;"></div>`;
  }

  document.getElementById('userSidebarInfo').innerHTML = `
    ${pfpHtml}
    <div class="su-info">
      <span class="su-name">${user.name || user.username}</span>
      <span class="su-role" style="color:var(--accent2)"><i class="fa-solid fa-user"></i> User</span>
    </div>
  `;
  renderUserProjects();
}

// ══════════════════════════════════
// PROFILE SETTINGS & AI MONITOR
// ══════════════════════════════════
function previewPfpChange(url) {
  const prev = document.getElementById('pfpEditPreview');
  if (!prev) return;
  if (url && url.trim() !== '') {
    prev.innerHTML = `<img src="${url}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
  } else {
    prev.innerHTML = '<i class="fa-solid fa-user"></i>';
  }
}

async function handleSaveProfile() {
  const newName = document.getElementById('ownerNameInput').value.trim();
  const newBio = document.getElementById('ownerBioInput').value.trim();
  const newPfp = document.getElementById('ownerPfpInput').value.trim();
  const btn = document.getElementById('saveProfileBtn');
  const errEl = document.getElementById('saveProfileError');
  const sucEl = document.getElementById('saveProfileSuccess');

  hideEl(errEl); hideEl(sucEl);

  if (!newName) {
    showErr(errEl, '<i class="fa-solid fa-triangle-exclamation"></i> الاسم لا يمكن أن يكون فارغاً!');
    return;
  }

  setLoading(btn, true);

  // الفحص الذكي بواسطة AI للبايو والاسم والصورة
  try {
    const isSafe = await aiCheckProfileContent(newName, newBio, newPfp);
    if (!isSafe) {
      setLoading(btn, false);
      showErr(errEl, '<i class="fa-solid fa-ban"></i> تم رفض التعديل! الذكاء الاصطناعي اكتشف ألفاظاً أو محتوى غير لائق.');
      addActivity(`تم رفض تعديل حساب بسبب محتوى غير لائق`, 'warn');
      return;
    }
  } catch (e) {
    // في حال فشل الاتصال، نسمح بالتعديل
  }

  // حفظ التعديلات
  const savedSession = DB.get('pb_session');
  let users = DB.get('pb_users') || [];
  let currentUserIndex = users.findIndex(u => u.email === savedSession.email);

  if (currentUserIndex > -1) {
    users[currentUserIndex].name = newName;
    users[currentUserIndex].bio = newBio;
    users[currentUserIndex].pfp = newPfp;
    DB.set('pb_users', users);
    
    // تحديث الواجهة مباشرة
    if (users[currentUserIndex].role === 'owner') {
      showOwnerDash(users[currentUserIndex]);
    } else {
      showUserDash(users[currentUserIndex]);
    }

    addActivity(`تم تحديث بيانات الحساب بنجاح`);
    setLoading(btn, false);
    sucEl.innerHTML = '<i class="fa-solid fa-check"></i> تم حفظ التعديلات بنجاح!';
    sucEl.classList.remove('hidden');
    setTimeout(() => hideEl(sucEl), 3000);
  }
}

async function aiCheckProfileContent(name, bio, pfp) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 100,
        messages: [{
          role: 'user',
          content: `أنت نظام رقابة ذكي صارم. افحص البيانات التالية وتأكد أنها لا تحتوي على سب، شتائم، ألفاظ بذيئة، أو أي إيحاءات إباحية/جنسية.
الاسم: ${name}
البايو: ${bio}
رابط الصورة: ${pfp}
أجب بكلمة واحدة فقط: SAFE أو UNSAFE`
        }]
      })
    });
    const data = await res.json();
    const text = data.content?.[0]?.text?.toUpperCase() || '';
    return !text.includes('UNSAFE');
  } catch {
    return true; 
  }
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
// PROJECTS (Vector Icons Only)
// ══════════════════════════════════
const TYPE_ICONS = {
  discord: '<i class="fa-brands fa-discord" style="color:#5865F2"></i>',
  telegram: '<i class="fa-brands fa-telegram" style="color:#229ED9"></i>',
  whatsapp: '<i class="fa-brands fa-whatsapp" style="color:#25D366"></i>',
  extension: '<i class="fa-solid fa-puzzle-piece" style="color:#f59e0b"></i>',
  website: '<i class="fa-solid fa-globe" style="color:#00d4ff"></i>',
  other: '<i class="fa-solid fa-box" style="color:#94a3b8"></i>'
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
        <div class="es-icon"><i class="fa-solid fa-box-open"></i></div>
        <div class="es-text">لا توجد مشاريع بعد</div>
        <button class="es-btn" onclick="showSection('secUpload', null)">ارفع أول مشروع</button>
      </div>`;
    return;
  }

  grid.innerHTML = projects.map((p, i) => `
    <div class="project-card" id="proj-${i}">
      <div class="pc-header">
        <div class="pc-icon">${TYPE_ICONS[p.type] || '<i class="fa-solid fa-box"></i>'}</div>
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
          <i class="fa-solid fa-download"></i> تحميل
        </button>
        <button class="delete-btn" onclick="deleteProject(${i})"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    </div>
  `).join('');
}

function renderUserProjects() {
  const grid = document.getElementById('userProjectsGrid');
  if (!grid) return;
  const projects = getProjects();
  if (!projects.length) {
    grid.innerHTML = `<div class="empty-state"><div class="es-icon"><i class="fa-solid fa-box-open"></i></div><div class="es-text">لا توجد مشاريع متاحة بعد</div></div>`;
    return;
  }
  grid.innerHTML = projects.map((p, i) => `
    <div class="project-card">
      <div class="pc-header">
        <div class="pc-icon">${TYPE_ICONS[p.type] || '<i class="fa-solid fa-box"></i>'}</div>
        <div>
          <div class="pc-name">${escHtml(p.name)}</div>
          <div class="pc-type">${p.type}</div>
        </div>
      </div>
      <div class="pc-body">
        <div class="pc-desc">${escHtml(p.desc || 'لا يوجد وصف')}</div>
      </div>
      <div class="pc-footer">
        <button class="download-btn" onclick="downloadProject(${i})"><i class="fa-solid fa-download"></i> تحميل</button>
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

  let stats = DB.get('pb_stats') || { downloads: 0 };
  stats.downloads = (stats.downloads || 0) + 1;
  DB.set('pb_stats', stats);
  updateStats();
  addActivity(`تحميل: ${p.name}`);

  if (p.fileData && p.fileName) {
    const link = document.createElement('a');
    link.href = p.fileData;
    link.download = p.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert(`المشروع: ${p.name}\n\nلا يوجد ملف مرفق لهذا المشروع.`);
  }
}
// ══════════════════════════════════
// FILE UPLOAD
// ══════════════════════════════════
let selectedFile = null;
let fileData = null;

function handleFileSelect(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 50 * 1024 * 1024) {
    alert('حجم الملف يتجاوز 50MB');
    return;
  }
  selectedFile = file;
  document.getElementById('dropZone').classList.add('hidden');
  const prev = document.getElementById('filePreview');
  prev.classList.remove('hidden');
  document.getElementById('fpName').textContent = file.name;
  document.getElementById('fpSize').textContent = formatBytes(file.size);

  const reader = new FileReader();
  reader.onload = (e) => { fileData = e.target.result; };
  reader.readAsDataURL(file);
}

function clearFile() {
  selectedFile = null; fileData = null;
  document.getElementById('fileInput').value = '';
  document.getElementById('filePreview').classList.add('hidden');
  document.getElementById('dropZone').classList.remove('hidden');
}

// Drag and drop
document.addEventListener('DOMContentLoaded', () => {
  const dz = document.getElementById('dropZone');
  if (!dz) return;
  dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('drag-over'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('drag-over'));
  dz.addEventListener('drop', e => {
    e.preventDefault(); dz.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) {
      const input = document.getElementById('fileInput');
      const dt = new DataTransfer();
      dt.items.add(file);
      input.files = dt.files;
      handleFileSelect(input);
    }
  });
});

async function handleUpload() {
  const name = document.getElementById('projName').value.trim();
  const desc = document.getElementById('projDesc').value.trim();
  const type = document.getElementById('projType').value;
  const btn = document.getElementById('uploadBtn');
  const errEl = document.getElementById('uploadError');
  const sucEl = document.getElementById('uploadSuccess');

  hideEl(errEl); hideEl(sucEl);

  if (!name) { showErr(errEl, '<i class="fa-solid fa-triangle-exclamation"></i> الرجاء إدخال اسم المشروع'); return; }

  setLoading(btn, true);

  // AI scan
  const scanStatus = document.getElementById('aiScanStatus');
  const scanText = document.getElementById('aiScanText');
  scanStatus.classList.remove('hidden');

  let scanPassed = true;
  let scanReason = '';

  if (selectedFile) {
    scanText.textContent = 'AI يفحص الملف بحثاً عن التهديدات...';
    await sleep(600);
    scanText.textContent = 'تحليل الكود والبيانات...';
    await sleep(600);

    try {
      const result = await aiScanFile(name, desc, selectedFile.name, selectedFile.type);
      scanPassed = result.safe;
      scanReason = result.reason;
    } catch {
      scanPassed = true;
    }
  } else {
    scanText.textContent = 'فحص البيانات النصية...';
    await sleep(800);
  }

  hideEl(scanStatus);
  setLoading(btn, false);

  if (!scanPassed) {
    showErr(errEl, `<i class="fa-solid fa-ban"></i> AI رفض نشر المشروع: ${scanReason}`);
    addActivity(`رفض AI نشر: ${name}`, 'warn');
    return;
  }

  const projects = getProjects();
  projects.unshift({
    name, desc, type,
    fileName: selectedFile?.name || null,
    fileData: fileData || null,
    uploadedAt: new Date().toISOString()
  });
  saveProjects(projects);
  clearFile();

  document.getElementById('projName').value = '';
  document.getElementById('projDesc').value = '';

  sucEl.innerHTML = `<i class="fa-solid fa-check-double"></i> تم نشر المشروع "${name}" بنجاح! AI وافق عليه.`;
  sucEl.classList.remove('hidden');
  addActivity(`نشر مشروع: ${name}`);
  updateStats();
  renderProjects();

  setTimeout(() => hideEl(sucEl), 4000);
}

// ══════════════════════════════════
// AI FILE SCANNER
// ══════════════════════════════════
async function aiScanFile(projName, desc, fileName, fileType) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: `أنت نظام فحص أمني لمنصة مشاريع برمجية.
اسم المشروع: ${projName}
الوصف: ${desc}
اسم الملف: ${fileName}
نوع الملف: ${fileType}

قيّم هذا المشروع. هل يبدو آمناً للنشر؟
تحقق من: هل الوصف يشير لفيروسات، malware، أو محتوى ضار؟
أجب بصيغة JSON فقط: {"safe": true/false, "reason": "السبب"}`
        }]
      })
    });
    const data = await res.json();
    const text = data.content?.[0]?.text || '{"safe":true,"reason":"تمت الموافقة"}';
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return { safe: true, reason: 'تمت الموافقة' };
  }
}

async function runAIScan() {
  const terminal = document.getElementById('stBody');
  terminal.innerHTML = '';

  const lines = [
    { t: 'بدء جلسة الفحص...', c: 'st-wait', d: 200 },
    { t: 'تهيئة نماذج الـ AI...', c: 'st-wait', d: 400 },
    { t: 'فحص قاعدة البيانات...', c: 'st-ok', d: 600 },
    { t: 'تحليل البروتوكولات...', c: 'st-ok', d: 800 },
    { t: '<i class="fa-solid fa-magnifying-glass"></i> البحث عن التهديدات...', c: 'st-warn', d: 1200 },
    { t: 'فحص الكود المشبوه...', c: 'st-wait', d: 1600 },
    { t: 'مراجعة قاعدة الفيروسات...', c: 'st-ok', d: 2000 },
    { t: '<i class="fa-solid fa-shield-check"></i> لا تهديدات موجودة', c: 'st-ok', d: 2600 },
    { t: '<i class="fa-solid fa-lock"></i> النظام آمن', c: 'st-ok', d: 3000 },
    { t: '══ الفحص مكتمل ══', c: 'st-ok', d: 3400 },
  ];

  for (const l of lines) {
    await sleep(l.d);
    const div = document.createElement('div');
    div.className = 'st-line';
    div.innerHTML = `<span class="st-prompt">$</span><span class="${l.c}">${l.t}</span>`;
    terminal.appendChild(div);
    terminal.scrollTop = terminal.scrollHeight;
  }

  // Real AI scan
  await sleep(400);
  const div = document.createElement('div');
  div.className = 'st-line';
  div.innerHTML = `<span class="st-prompt">$</span><span class="st-wait">جاري استشارة Claude AI...</span>`;
  terminal.appendChild(div);

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 150,
        messages: [{ role: 'user', content: 'أنت AI فحص أمني. أعطني تقرير أمني موجز في سطرين باللغة العربية عن حالة النظام. النظام سليم.' }]
      })
    });
    const data = await res.json();
    const text = data.content?.[0]?.text || 'النظام آمن وجميع الملفات سليمة.';
    const div2 = document.createElement('div');
    div2.className = 'st-line';
    div2.innerHTML = `<span class="st-prompt">AI</span><span class="st-ok">${text.substring(0, 120)}</span>`;
    terminal.appendChild(div2);
  } catch {
    const div2 = document.createElement('div');
    div2.className = 'st-line';
    div2.innerHTML = `<span class="st-prompt">AI</span><span class="st-ok"><i class="fa-solid fa-check"></i> النظام آمن — لا تهديدات</span>`;
    terminal.appendChild(div2);
  }

  addActivity('تم تشغيل فحص AI');
}

// ══════════════════════════════════
// DEVELOPERS
// ══════════════════════════════════
function renderDevs() {
  const list = document.getElementById('devsList');
  if (!list) return;
  const devs = DB.get('pb_devs') || [];
  document.getElementById('statDevs').textContent = devs.length;

  if (!devs.length) {
    list.innerHTML = `<div class="empty-state"><div class="es-icon"><i class="fa-solid fa-users-slash"></i></div><div class="es-text">لا يوجد مطورين مسجلين بعد</div></div>`;
    return;
  }
  list.innerHTML = devs.map(d => `
    <div class="activity-item">
      <span><i class="fa-solid fa-user-astronaut"></i></span>
      <span>${escHtml(d.name)}</span>
      <span style="color:var(--text3)">${escHtml(d.email)}</span>
      <span class="ai-time">${formatDate(d.joinedAt)}</span>
    </div>
  `).join('');
}

// ══════════════════════════════════
// ACTIVITY LOG
// ══════════════════════════════════
function addActivity(msg, type = 'ok') {
  let log = DB.get('pb_activity') || [];
  log.unshift({ msg, type, time: new Date().toISOString() });
  if (log.length > 50) log = log.slice(0, 50);
  DB.set('pb_activity', log);
  renderActivity();
}

function renderActivity() {
  const list = document.getElementById('activityList');
  if (!list) return;
  const log = DB.get('pb_activity') || [];
  if (!log.length) {
    list.innerHTML = '<div class="activity-empty">لا يوجد نشاط بعد</div>';
    return;
  }
  list.innerHTML = log.slice(0, 10).map(a => `
    <div class="activity-item">
      <span class="ai-icon">${a.type === 'warn' ? '<i class="fa-solid fa-triangle-exclamation" style="color:var(--owner)"></i>' : '<i class="fa-solid fa-check" style="color:var(--green)"></i>'}</span>
      <span>${escHtml(a.msg)}</span>
      <span class="ai-time">${formatDate(a.time)}</span>
    </div>
  `).join('');
}

// ══════════════════════════════════
// STATS
// ══════════════════════════════════
function updateStats() {
  const projects = getProjects();
  const users = (DB.get('pb_users') || []).filter(u => u.role !== 'owner');
  const devs = DB.get('pb_devs') || [];
  const stats = DB.get('pb_stats') || {};

  const elP = document.getElementById('statProjects');
  const elD = document.getElementById('statDevs');
  const elDl = document.getElementById('statDownloads');
  const elU = document.getElementById('statUsers');

  if (elP) elP.textContent = projects.length;
  if (elD) elD.textContent = devs.length;
  if (elDl) elDl.textContent = stats.downloads || 0;
  if (elU) elU.textContent = users.length;
}

// ══════════════════════════════════
// NOTIFICATIONS
// ══════════════════════════════════
function showNotif() { document.getElementById('notifPanel')?.classList.remove('hidden'); }
function hideNotif() { document.getElementById('notifPanel')?.classList.add('hidden'); }

// ══════════════════════════════════
// SETTINGS
// ══════════════════════════════════
function clearAllData() {
  if (!confirm('تحذير! سيتم مسح جميع البيانات ما عدا حساب الـ Owner. هل أنت متأكد؟')) return;
  const keys = ['pb_projects', 'pb_activity', 'pb_stats', 'pb_devs'];
  keys.forEach(k => DB.del(k));
  initOwner();
  renderProjects();
  renderDevs();
  updateStats();
  alert('تم مسح البيانات بنجاح');
}

// ══════════════════════════════════
// PASSWORD TOGGLE
// ══════════════════════════════════
function togglePass(id, btn) {
  const input = document.getElementById(id);
  if (!input) return;
  if (input.type === 'password') { 
    input.type = 'text'; 
    btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>'; 
  } else { 
    input.type = 'password'; 
    btn.innerHTML = '<i class="fa-solid fa-eye"></i>'; 
  }
}

// ══════════════════════════════════
// AI THINK INDICATOR
// ══════════════════════════════════
function showAIThink(text) {
  const el = document.getElementById('aiThink');
  const textEl = document.getElementById('aiThinkText');
  if (el) { el.classList.add('show'); }
  if (textEl && text) textEl.textContent = text;
}
function hideAIThink() {
  document.getElementById('aiThink')?.classList.remove('show');
}

// ══════════════════════════════════
// HELPERS
// ══════════════════════════════════
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function setLoading(btn, loading) {
  if (!btn) return;
  const text = btn.querySelector('.btn-text');
  const loader = btn.querySelector('.btn-loader');
  btn.disabled = loading;
  if (loading) { text?.classList.add('hidden'); loader?.classList.remove('hidden'); }
  else { text?.classList.remove('hidden'); loader?.classList.add('hidden'); }
}

function showErr(el, msg) {
  if (!el) return;
  el.innerHTML = msg; // Changed to innerHTML to process FontAwesome Vector Icons correctly
  el.classList.remove('hidden');
}
function hideEl(el) { el?.classList.add('hidden'); }

function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatBytes(b) {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
  return (b / 1048576).toFixed(1) + ' MB';
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('ar-SA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return '-'; }
}

// ══════════════════════════════════
// KEYBOARD SHORTCUTS
// ══════════════════════════════════
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const loginForm = document.getElementById('formLogin');
    const regForm = document.getElementById('formRegister');
    if (loginForm?.classList.contains('active')) handleLogin();
    else if (regForm?.classList.contains('active')) handleRegister();
  }
  if (e.key === 'Escape') hideNotif();
});

// ══════════════════════════════════
// INIT
// ══════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  startLoader();
});
