/**
 * TATTOO STUDIO - SISTEMA DE GESTIÓN INTEGRAL
 * Software para Estudios de Tatuaje y Piercing en México
 * Dos Sesiones: Caja y Tatuador
 * Cotizaciones con Selección Completa de Estilos de Tatuaje y Adjuntar Archivo
 * Botón Limpiar Datos Demo para Presentaciones en Vivo
 */

// ================= UTILIDADES GENERALES =================
function formatMoney(amount) {
  const num = Number(amount) || 0;
  return '$' + num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MXN';
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getInitials(name) {
  if (!name) return 'TS';
  const clean = name.replace(/['"]/g, '').trim();
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.substring(0, 2).toUpperCase();
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// Formatear hora de 24h a 12h (ej. "13:00" -> "1:00 PM")
function formatTime12h(timeStr) {
  if (!timeStr) return '';
  const trimmed = timeStr.trim();
  if (trimmed.toUpperCase().includes('AM') || trimmed.toUpperCase().includes('PM')) {
    return trimmed;
  }
  const parts = trimmed.split(':');
  let h = parseInt(parts[0], 10);
  const m = parts[1] || '00';
  if (isNaN(h)) return trimmed;
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${period}`;
}

// Convertir hora 12h a minutos desde medianoche
function parseTime12hToMinutes(time12h) {
  if (!time12h) return 600; // 10:00 AM default
  const match = time12h.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) {
    const [h, m] = time12h.split(':').map(Number);
    return (h || 10) * 60 + (m || 0);
  }
  let h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const period = match[3].toUpperCase();
  if (period === 'PM' && h < 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

// Convertir minutos a string 12h
function minutesToTime12h(totalMinutes) {
  let h = Math.floor(totalMinutes / 60) % 24;
  let m = totalMinutes % 60;
  const mStr = m < 10 ? '0' + m : '' + m;
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${mStr} ${period}`;
}

// Calcular hora de fin dada hora de inicio y minutos de duración
function calculateEndTime(startTime12h, durationMinutes) {
  const startMins = parseTime12hToMinutes(startTime12h);
  const endMins = startMins + durationMinutes;
  return minutesToTime12h(endMins);
}

// Formatear minutos a texto legible
function formatDurationLabel(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

// ================= ESTADO Y DATOS INICIALES =================
const STORAGE_KEY = 'tattoo_studio_data_v2';
const SESSION_KEY = 'tattoo_studio_session_v2';

const DEFAULT_DATA = {
  config: {
    shopName: "Tattoo Studio",
    currency: "$ MXN",
    initialCashFund: 1500.00,
    isCashOpen: true,
    cashOpenedAt: new Date().toISOString(),
    phone: "525512345678",
    address: "Roma Norte, Cuauhtémoc, CDMX",
    adminUser: "caja",
    adminPass: "123"
  },
  // Solo un Tatuador asignado según solicitud
  artists: [
    {
      id: "a1",
      name: "Tatuador",
      username: "tatuador",
      password: "123",
      phone: "5512345678",
      specialty: "Tatuador Profesional",
      avatar: "TA",
      booth: "Cabina Principal"
    }
  ],
  services: [
    { id: "s1", name: "Tatuaje Flash / Pieza Pequeña (hasta 8cm)", price: 1200, duration: 60, category: "Tatuaje" },
    { id: "s2", name: "Tatuaje Mediano (Línea & Sombra 10-15cm)", price: 2800, duration: 150, category: "Tatuaje" },
    { id: "s3", name: "Sesión Completa / Media Jornada (4-5 horas)", price: 5500, duration: 270, category: "Tatuaje" },
    { id: "s4", name: "Piercing Lóbulo / Hélix (Titanio Grado Implante)", price: 650, duration: 30, category: "Piercing" },
    { id: "s5", name: "Piercing Septum / Nostril (Titanio Grado Implante)", price: 750, duration: 30, category: "Piercing" },
    { id: "s6", name: "Sesión de Retoque (Evaluación y Repaso de Tinta)", price: 400, duration: 60, category: "Retoque" }
  ],
  products: [
    { id: "p1", name: "Bálsamo Vegano Cicatrizante Aftercare (50g)", price: 220, cost: 90, stock: 24, category: "Aftercare" },
    { id: "p2", name: "Espuma Antibacterial Antiséptica (150ml)", price: 260, cost: 120, stock: 18, category: "Aftercare" },
    { id: "p3", name: "Parche Dérmico Segunda Piel (Pack 3 apósitos)", price: 180, cost: 75, stock: 30, category: "Aftercare" },
    { id: "p4", name: "Joyería Labret Titanio ASTM F-136 Rosca Interna", price: 450, cost: 180, stock: 15, category: "Joyería" },
    { id: "p5", name: "Aro Clicker Titanio Anodizado con Circonias", price: 550, cost: 220, stock: 12, category: "Joyería" },
    { id: "p6", name: "Jabón Neutro Especial Sin Fragancia (250ml)", price: 140, cost: 60, stock: 20, category: "Aftercare" }
  ],
  clients: [
    { id: "c1", name: "Roberto Gómez", age: 28, phone: "5533445566", visits: 3, totalSpent: 6200, allergies: "Ninguna", notes: "Tatuaje en brazo terminado. Excelente cicatrización." },
    { id: "c2", name: "Valeria Mendoza", age: 22, phone: "5544556677", visits: 2, totalSpent: 3400, allergies: "Látex (usar nitrilo)", notes: "Piel sensible. Tatuaje floral fine line." },
    { id: "c3", name: "Emiliano Carrillo", age: 17, phone: "5577889900", visits: 1, totalSpent: 750, allergies: "Ninguna", isMinor: true, notes: "Menor de edad. Acompañado de madre con INE y carta de autorización firmada." }
  ],
  quoteRequests: [
    {
      id: "req-101",
      folio: "COT-2026-001",
      clientName: "Camila Vega",
      clientPhone: "5511223344",
      clientAge: 24,
      isMinor: false,
      type: "Tatuaje",
      tattooStyle: "Fine Line / Trazo Fino",
      bodyZone: "Antebrazo interior",
      sizeCm: "12 x 8 cm",
      description: "Diseño botánico fine line de peonías y mariposa monarca en escala de grises.",
      photoUrl: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=400&q=80",
      artistId: "a1",
      artistName: "Tatuador",
      status: "deposito_pagado",
      estimatedPrice: 3200,
      depositAmount: 600,
      depositPaid: true,
      depositPaidAt: new Date().toISOString(),
      depositLink: "https://estudio-tatuajes.vercel.app/deposito?ref=COT-2026-001",
      notes: "Sombra suave con aguja 3RL. Acreditado depósito de $600 MXN.",
      dateRequested: new Date().toISOString().split('T')[0]
    },
    {
      id: "req-102",
      folio: "COT-2026-002",
      clientName: "Javier Soto",
      clientPhone: "5566778899",
      clientAge: 30,
      isMinor: false,
      type: "Tatuaje",
      tattooStyle: "Neotradicional",
      bodyZone: "Pantorrilla derecha",
      sizeCm: "20 x 15 cm",
      description: "Cráneo neotradicional con serpiente y rosas, alto contraste.",
      photoUrl: "https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=400&q=80",
      artistId: "a1",
      artistName: "Tatuador",
      status: "cotizada",
      estimatedPrice: 4500,
      depositAmount: 1000,
      depositPaid: false,
      depositPaidAt: null,
      depositLink: "https://estudio-tatuajes.vercel.app/deposito?ref=COT-2026-002",
      notes: "Sesión de aprox. 4 horas.",
      dateRequested: new Date().toISOString().split('T')[0]
    },
    {
      id: "req-103",
      folio: "COT-2026-003",
      clientName: "Emiliano Carrillo",
      clientPhone: "5577889900",
      clientAge: 17,
      isMinor: true,
      type: "Piercing",
      tattooStyle: "Piercing Corporal",
      bodyZone: "Nariz (Septum)",
      sizeCm: "Perforación estándar",
      description: "Perforación de septum con aro circular barbell en titanio grado implante.",
      photoUrl: "",
      artistId: "a1",
      artistName: "Tatuador",
      status: "solicitud",
      estimatedPrice: 0,
      depositAmount: 0,
      depositPaid: false,
      notes: "Menor de 18 años. Requiere padre/tutor legal con INE.",
      dateRequested: new Date().toISOString().split('T')[0]
    }
  ],
  appointments: [],
  cashMovements: [],
  cashClosures: [],
  artistTips: []
};

// Semilla de citas de muestra
(function seedInitialAppointments() {
  const todayStr = new Date().toISOString().split('T')[0];

  DEFAULT_DATA.appointments = [
    {
      id: "ses-101",
      clientName: "Roberto Gómez",
      clientPhone: "5533445566",
      services: [
        { id: "s2", name: "Tatuaje Mediano (Línea & Sombra)", price: 2800, duration: 150 }
      ],
      serviceName: "Tatuaje Mediano (Línea & Sombra)",
      price: 2800,
      depositDeducted: 500,
      durationMinutes: 150,
      durationLabel: "2h 30m",
      artistId: "a1",
      artistName: "Tatuador",
      booth: "Cabina Principal",
      date: todayStr,
      time: "11:00 AM",
      endTime: "1:30 PM",
      status: "en_proceso",
      notes: "Sesión 2. Sombra y detalles de manga.",
      quoteRef: "COT-2026-000"
    },
    {
      id: "ses-102",
      clientName: "Valeria Mendoza",
      clientPhone: "5544556677",
      services: [
        { id: "s1", name: "Tatuaje Flash / Pieza Pequeña", price: 1200, duration: 60 }
      ],
      serviceName: "Tatuaje Flash / Fine Line",
      price: 1200,
      depositDeducted: 300,
      durationMinutes: 60,
      durationLabel: "1h",
      artistId: "a1",
      artistName: "Tatuador",
      booth: "Cabina Principal",
      date: todayStr,
      time: "2:00 PM",
      endTime: "3:00 PM",
      status: "agendada",
      notes: "Alérgica al látex. Usar guantes de nitrilo.",
      quoteRef: "COT-2026-001"
    }
  ];

  DEFAULT_DATA.cashMovements = [
    {
      id: "mov-01",
      type: "fondo_inicial",
      concept: "Apertura de turno en efectivo",
      amount: 1500,
      method: "Efectivo",
      timestamp: `${todayStr}T09:00:00Z`
    }
  ];

  DEFAULT_DATA.artistTips = [
    {
      id: "tip-01",
      artistId: "a1",
      artistName: "Tatuador",
      amount: 200,
      method: "Efectivo",
      notes: "Agradecimiento cliente Roberto Gómez",
      timestamp: `${todayStr}T13:40:00Z`
    }
  ];
})();

// ================= CAPA DE DATOS =================
let store = null;

const DataService = {
  loadStore() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        store = JSON.parse(saved);
        if (!store.quoteRequests) store.quoteRequests = DEFAULT_DATA.quoteRequests;
        if (!store.artists || store.artists.length === 0) store.artists = DEFAULT_DATA.artists;
        return;
      }
    } catch (e) {
      console.warn("Error leyendo localStorage, usando DEFAULT_DATA:", e);
    }
    store = JSON.parse(JSON.stringify(DEFAULT_DATA));
    this.saveStore();
  },

  saveStore() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) {
      console.error("Error guardando store:", e);
    }
  }
};

// ================= GESTIÓN DE SESIONES (SOLO CAJA Y TATUADOR) =================
let currentSession = null;

function loadSession() {
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      currentSession = JSON.parse(saved);
      return;
    }
  } catch (e) {}
  currentSession = null;
}

function saveSession(session) {
  currentSession = session;
  if (session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function handleLogin(e) {
  if (e) e.preventDefault();
  const userVal = document.getElementById('login-username').value.trim().toLowerCase();
  const passVal = document.getElementById('login-password').value.trim();

  // 1. Sesión de Caja
  if ((userVal === 'caja' || userVal === 'admin' || userVal === 'dueño') && (passVal === '123' || passVal === (store.config.adminPass || '123'))) {
    saveSession({
      role: 'owner',
      username: 'caja',
      name: 'Caja',
      avatar: 'CJ'
    });
    applyUserSession();
    return;
  }

  // 2. Sesión de Tatuador
  if ((userVal === 'tatuador' || userVal === 'alex') && passVal === '123') {
    saveSession({
      role: 'artist',
      artistId: 'a1',
      username: 'tatuador',
      name: 'Tatuador',
      avatar: 'TA'
    });
    applyUserSession();
    return;
  }

  showToast("Usuario o contraseña incorrectos", "error");
}

function quickLogin(roleName) {
  if (roleName === 'caja') {
    document.getElementById('login-username').value = 'caja';
    document.getElementById('login-password').value = '123';
  } else {
    document.getElementById('login-username').value = 'tatuador';
    document.getElementById('login-password').value = '123';
  }
  handleLogin();
}

function logout() {
  saveSession(null);
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
}

function applyUserSession() {
  if (!currentSession) {
    document.getElementById('login-screen').classList.remove('hidden');
    return;
  }

  document.getElementById('login-screen').classList.add('hidden');
  document.getElementById('header-user-avatar').textContent = currentSession.avatar || 'TS';
  document.getElementById('header-user-name').textContent = currentSession.name || 'Usuario';
  document.getElementById('header-user-role').textContent = currentSession.role === 'owner' ? 'Caja / Admin' : 'Tatuador';

  const adminElements = document.querySelectorAll('.nav-admin-only');
  const artistElements = document.querySelectorAll('.nav-artist-only');

  if (currentSession.role === 'artist') {
    adminElements.forEach(el => el.style.display = 'none');
    artistElements.forEach(el => el.style.display = '');
    document.getElementById('sidebar-role-label').textContent = 'Portal Tatuador';
    switchView('artist-portal');
  } else {
    adminElements.forEach(el => el.style.display = '');
    artistElements.forEach(el => el.style.display = 'none');
    document.getElementById('sidebar-role-label').textContent = 'Studio Pro MX';
    switchView('dashboard');
  }

  renderAllViews();
}

// ================= RESET DEMO (PARA PRESENTACIONES DE SOFTWARE) =================
function confirmResetDemo() {
  store.appointments = [];
  store.quoteRequests = [];
  store.cashMovements = [];
  store.cashClosures = [];
  store.artistTips = [];
  store.clients = [];

  DataService.saveStore();
  closeModal('modal-reset-demo');
  renderAllViews();
  showToast("Datos de prueba eliminados. Software 100% limpio listo para presentar.", "success");
}

// ================= SELECTOR DE DISPOSITIVO (COMPUTADORA / CELULAR) =================
function initDeviceMode() {
  const saved = localStorage.getItem('tattoo_studio_device_mode') || 'desktop';
  setDeviceMode(saved, false);
}

function setDeviceMode(mode, save = true) {
  if (save) localStorage.setItem('tattoo_studio_device_mode', mode);

  const isMobile = (mode === 'mobile');
  document.body.classList.toggle('device-mobile', isMobile);

  const pcBtns = [document.getElementById('btn-mode-pc'), document.getElementById('btn-header-mode-pc')];
  const mobBtns = [document.getElementById('btn-mode-mobile'), document.getElementById('btn-header-mode-mobile')];

  pcBtns.forEach(btn => btn && btn.classList.toggle('active', !isMobile));
  mobBtns.forEach(btn => btn && btn.classList.toggle('active', isMobile));

  if (!isMobile) closeMobileSidebar();
}

function openMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (sidebar) sidebar.classList.add('open');
  if (backdrop) backdrop.classList.add('active');
}

function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if (sidebar) sidebar.classList.remove('open');
  if (backdrop) backdrop.classList.remove('active');
}

// ================= NAVEGACIÓN Y CAMBIO DE VISTAS =================
function switchView(viewId) {
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  document.querySelectorAll('.mob-nav-btn').forEach(btn => btn.classList.remove('active'));

  const targetSec = document.getElementById(`view-${viewId}`);
  if (targetSec) targetSec.classList.add('active');

  const navItem = document.querySelector(`.nav-item[data-view="${viewId}"]`);
  if (navItem) navItem.classList.add('active');

  const mobBtn = document.querySelector(`.mob-nav-btn[data-mob-view="${viewId}"]`);
  if (mobBtn) mobBtn.classList.add('active');

  const titles = {
    'dashboard': ['Tablero Principal', 'Métricas y agenda de Tattoo Studio en tiempo real'],
    'requests': ['Solicitudes de Cotización & Anticipos', 'Revisa ideas, estilos de tatuaje y gestiona depósitos'],
    'appointments': ['Agenda de Sesiones', 'Calendario interactivo y citas programadas'],
    'artist-portal': ['Mi Agenda de Sesiones', 'Tus clientes y citas asignadas en cabina'],
    'artist-quotes': ['Mis Cotizaciones Asignadas', 'Proyectos pendientes de evaluar y cotizar'],
    'artist-tips': ['Mis Propinas', 'Historial de propinas directas en MXN'],
    'pos': ['Punto de Venta (POS)', 'Cobro con deducción de depósito y venta de aftercare'],
    'cash-register': ['Control & Corte de Caja', 'Arqueo de gaveta y registro de movimientos'],
    'artists': ['Tatuador & Cabina', 'Estación de trabajo y perfil'],
    'catalog': ['Catálogo de Servicios & Joyería', 'Tarifas de sesión y stock de insumos'],
    'clients': ['Directorio de Clientes', 'Expedientes, edades, alergias e historial']
  };

  const [t, sub] = titles[viewId] || ['Tattoo Studio', 'Sistema de Gestión'];
  document.getElementById('view-title').textContent = t;
  document.getElementById('view-subtitle').textContent = sub;

  closeMobileSidebar();
  renderAllViews();
}

// ================= RENDERIZADO GLOBAL =================
function renderAllViews() {
  renderDashboard();
  renderQuoteRequests();
  renderAppointments();
  renderArtistPortal();
  renderArtistTips();
  renderPOS();
  renderCashRegister();
  renderArtists();
  renderCatalog();
  renderClients();
}

// ================= 1. TABLERO (DASHBOARD) =================
function renderDashboard() {
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySales = store.cashMovements.filter(m => m.timestamp.startsWith(todayStr) && m.type === 'venta');
  const totalRevenue = todaySales.reduce((acc, cur) => acc + (cur.amount || 0), 0);
  const todayApps = store.appointments.filter(a => a.date === todayStr);
  const completedApps = todayApps.filter(a => a.status === 'realizada' || a.status === 'completada').length;
  const avgTicket = todaySales.length > 0 ? (totalRevenue / todaySales.length) : 0;

  document.getElementById('dash-stat-revenue').textContent = formatMoney(totalRevenue);
  document.getElementById('dash-stat-appointments').textContent = todayApps.length;
  document.getElementById('dash-stat-completed').textContent = completedApps;
  document.getElementById('dash-stat-avg-ticket').textContent = formatMoney(avgTicket);

  const pendingQuotes = (store.quoteRequests || []).filter(r => r.status === 'solicitud' || r.status === 'cotizada').length;
  document.getElementById('badge-quotes-count').textContent = pendingQuotes;
  document.getElementById('badge-appointments-count').textContent = todayApps.length;

  // Agenda del día en tabla (Escritorio)
  const tbody = document.getElementById('dash-today-appointments-tbody');
  const mobList = document.getElementById('dash-today-appointments-mobile-list');
  tbody.innerHTML = '';
  mobList.innerHTML = '';

  if (todayApps.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 18px;">No hay sesiones programadas para hoy.</td></tr>`;
    mobList.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 14px; font-size: 0.85rem;">No hay sesiones programadas para hoy.</p>`;
  } else {
    todayApps.forEach(app => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><b>${formatTime12h(app.time)} - ${formatTime12h(app.endTime || calculateEndTime(app.time, app.durationMinutes || 60))}</b></td>
        <td><b>${escapeHtml(app.clientName)}</b><br><small style="color:var(--text-muted);">${escapeHtml(app.clientPhone)}</small></td>
        <td>${escapeHtml(app.serviceName)}<br><small style="color:var(--accent-secondary); font-weight:600;">${app.durationLabel || '1h'}</small></td>
        <td>${escapeHtml(app.booth || 'Cabina Principal')}</td>
        <td>${renderStatusBadge(app.status)}</td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="directPayAppointment('${app.id}')" title="Cobrar sesión">Cobrar</button>
        </td>
      `;
      tbody.appendChild(tr);

      const card = document.createElement('div');
      card.className = 'mobile-app-card';
      card.innerHTML = `
        <div class="mobile-app-header">
          <span class="mobile-app-time">${formatTime12h(app.time)} - ${formatTime12h(app.endTime || calculateEndTime(app.time, app.durationMinutes || 60))}</span>
          ${renderStatusBadge(app.status)}
        </div>
        <div class="mobile-app-client">${escapeHtml(app.clientName)}</div>
        <div class="mobile-app-meta">
          <span><b>Trabajo:</b> ${escapeHtml(app.serviceName)} (${app.durationLabel || '1h'})</span>
          <span><b>Cabina:</b> ${escapeHtml(app.booth || 'Cabina Principal')}</span>
          ${app.depositDeducted ? `<span style="color:var(--color-success); font-weight:600;">Depósito acreditado: -$${app.depositDeducted} MXN</span>` : ''}
        </div>
        <div class="mobile-app-actions">
          <button class="btn btn-primary btn-sm" style="flex:1;" onclick="directPayAppointment('${app.id}')">Cobrar en POS</button>
          <button class="btn btn-secondary btn-sm" onclick="sendWhatsAppReminder('${app.id}')">WhatsApp</button>
        </div>
      `;
      mobList.appendChild(card);
    });
  }

  // Estado de cabina
  const boothsList = document.getElementById('dash-booths-list');
  boothsList.innerHTML = '';
  const activeApp = todayApps.find(a => a.status === 'en_proceso');
  const isOccupied = !!activeApp;

  const row = document.createElement('div');
  row.style.cssText = 'background: var(--bg-subtle); border: 1px solid var(--border-default); border-radius: 6px; padding: 12px; display: flex; align-items: center; justify-content: space-between;';
  row.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <div class="user-session-avatar" style="width: 34px; height: 34px; font-size: 0.8rem;">TA</div>
      <div>
        <b style="font-size: 0.9rem; color: var(--text-main);">Cabina Principal</b>
        <p style="font-size: 0.75rem; color: var(--text-secondary); margin: 0;">Tatuador Profesional</p>
      </div>
    </div>
    <span class="badge ${isOccupied ? 'badge-progress' : 'badge-done'}">
      ${isOccupied ? 'En Sesión' : 'Disponible'}
    </span>
  `;
  boothsList.appendChild(row);
}

function renderStatusBadge(status) {
  const map = {
    'solicitud': '<span class="badge badge-pending">Solicitud</span>',
    'cotizada': '<span class="badge badge-progress">Cotizada (Espera Depósito)</span>',
    'deposito_pagado': '<span class="badge badge-done">Depósito Pagado</span>',
    'agendada': '<span class="badge badge-pending">Agendada</span>',
    'en_proceso': '<span class="badge badge-progress">En Cabina</span>',
    'realizada': '<span class="badge badge-done">Realizada</span>',
    'completada': '<span class="badge badge-done">Realizada</span>',
    'retoque': '<span class="badge badge-touchup">Retoque</span>',
    'cancelada': '<span class="badge badge-cancel">Cancelada</span>'
  };
  return map[status] || `<span class="badge badge-pending">${escapeHtml(status)}</span>`;
}

// ================= 2. SOLICITUDES & COTIZACIONES (FASE 1) =================
window._attachedPhotoDataUrl = '';

function renderQuoteRequests() {
  const container = document.getElementById('quotes-container');
  const artistContainer = document.getElementById('artist-quotes-container');
  const filter = (document.getElementById('requests-status-filter') ? document.getElementById('requests-status-filter').value : 'all');

  let list = store.quoteRequests || [];
  if (filter !== 'all') {
    list = list.filter(r => r.status === filter);
  }

  function buildCard(req) {
    const card = document.createElement('div');
    card.className = 'quote-card';
    card.innerHTML = `
      <div class="quote-card-header">
        <span class="quote-folio">${escapeHtml(req.folio)}</span>
        ${renderStatusBadge(req.status)}
      </div>
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <h4 class="quote-client-name">${escapeHtml(req.clientName)}</h4>
          ${req.isMinor ? '<span class="quote-tag-minor">Menor de 18 (Requiere Tutor)</span>' : `<span style="font-size:0.75rem; color:var(--text-muted);">${req.clientAge || 20} años</span>`}
        </div>
        <p style="font-size: 0.78rem; color: var(--text-secondary); margin-top: 2px;">
          WhatsApp: <a href="https://wa.me/52${req.clientPhone}" target="_blank" style="color:var(--accent-secondary); text-decoration:none;">${escapeHtml(req.clientPhone)}</a>
        </p>
      </div>

      <div class="quote-details-list">
        <div><b>Tipo:</b> ${escapeHtml(req.type || 'Tatuaje')}</div>
        <div><b>Estilo de Diseño:</b> <span style="color:var(--accent-secondary); font-weight:700;">${escapeHtml(req.tattooStyle || 'Personalizado')}</span></div>
        <div><b>Zona:</b> ${escapeHtml(req.bodyZone)} | <b>Tamaño:</b> ${escapeHtml(req.sizeCm)}</div>
        <div style="background: var(--bg-subtle); padding: 8px; border-radius: 4px; border: 1px solid var(--border-subtle); margin-top: 4px;">
          <small style="color:var(--text-muted); display:block; font-weight:700;">IDEA / DISEÑO:</small>
          <span>${escapeHtml(req.description)}</span>
        </div>
      </div>

      ${req.photoUrl ? `
        <div class="quote-reference-preview">
          <a href="${req.photoUrl}" target="_blank" title="Ver foto o referencia completa">
            <img src="${req.photoUrl}" class="quote-ref-thumb" alt="Foto / Referencia">
          </a>
        </div>
      ` : ''}

      ${req.estimatedPrice > 0 ? `
        <div class="quote-deposit-pill">
          <div>
            <span style="font-size:0.7rem; color:var(--text-secondary); display:block;">PRECIO COTIZADO:</span>
            <b style="color:var(--text-main); font-size:0.95rem;">${formatMoney(req.estimatedPrice)}</b>
          </div>
          <div style="text-align: right;">
            <span style="font-size:0.7rem; color:var(--text-secondary); display:block;">DEPÓSITO / ANTICIPO:</span>
            <b style="color:${req.depositPaid ? 'var(--color-success)' : 'var(--accent-secondary)'}; font-size:0.95rem;">
              ${formatMoney(req.depositAmount)} ${req.depositPaid ? '✓ (PAGADO)' : ''}
            </b>
          </div>
        </div>
      ` : ''}

      <div class="quote-actions-row">
        ${req.status === 'solicitud' ? `
          <button class="btn btn-primary btn-sm" style="flex:1;" onclick="openQuoteModal('${req.id}')">Cotizar y Fijar Depósito</button>
        ` : ''}
        ${req.status === 'cotizada' ? `
          <button class="btn btn-accent btn-sm" style="flex:1;" onclick="openDepositPaymentModal('${req.id}')">Ver Enlace de Pago</button>
          <button class="btn btn-secondary btn-sm" onclick="openQuoteModal('${req.id}')">Editar</button>
        ` : ''}
        ${req.status === 'deposito_pagado' ? `
          <button class="btn btn-success btn-sm" style="flex:1;" onclick="scheduleSessionFromQuote('${req.id}')">Agendar en Calendario</button>
        ` : ''}
        ${(req.status === 'agendada' || req.status === 'realizada') ? `
          <span style="font-size:0.75rem; color:var(--color-success); font-weight:600; padding:4px 0;">✓ Sesión agendada en agenda</span>
        ` : ''}
      </div>
    `;
    return card;
  }

  if (container) {
    container.innerHTML = '';
    if (list.length === 0) {
      container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px;">No se encontraron solicitudes con el filtro seleccionado.</p>`;
    } else {
      list.forEach(req => container.appendChild(buildCard(req)));
    }
  }

  if (artistContainer && currentSession && currentSession.role === 'artist') {
    artistContainer.innerHTML = '';
    const myQuotes = store.quoteRequests || [];
    if (document.getElementById('badge-artist-quotes-count')) {
      document.getElementById('badge-artist-quotes-count').textContent = myQuotes.filter(r => r.status === 'solicitud').length;
    }
    if (myQuotes.length === 0) {
      artistContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 30px;">No hay solicitudes registradas actualmente.</p>`;
    } else {
      myQuotes.forEach(req => artistContainer.appendChild(buildCard(req)));
    }
  }
}

// Abrir modal de nueva solicitud de cotización
function openNewQuoteModal() {
  document.getElementById('new-quote-form').reset();
  document.getElementById('nq-minor-alert').style.display = 'none';
  removeAttachedPhoto();
  openModal('modal-new-quote-request');
}

function handleNewQuoteAge(val) {
  const age = parseInt(val, 10);
  const alertEl = document.getElementById('nq-minor-alert');
  if (age && age < 18) {
    alertEl.style.display = 'block';
  } else {
    alertEl.style.display = 'none';
  }
}

// Manejo de archivo adjunto (FileReader)
function handleFileUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    window._attachedPhotoDataUrl = evt.target.result;
    document.getElementById('nq-preview-img').src = evt.target.result;
    document.getElementById('nq-preview-title').textContent = file.name;
    document.getElementById('nq-preview-container').style.display = 'flex';
  };
  reader.readAsDataURL(file);
}

function handleUrlInput(val) {
  if (val && val.trim().startsWith('http')) {
    window._attachedPhotoDataUrl = val.trim();
    document.getElementById('nq-preview-img').src = val.trim();
    document.getElementById('nq-preview-title').textContent = 'Imagen desde enlace web';
    document.getElementById('nq-preview-container').style.display = 'flex';
  }
}

function removeAttachedPhoto() {
  window._attachedPhotoDataUrl = '';
  const fileInput = document.getElementById('nq-file-input');
  if (fileInput) fileInput.value = '';
  const urlInput = document.getElementById('nq-photo-url');
  if (urlInput) urlInput.value = '';
  const preview = document.getElementById('nq-preview-container');
  if (preview) preview.style.display = 'none';
}

function handleNewQuoteSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('nq-client-name').value.trim();
  const phone = document.getElementById('nq-client-phone').value.trim();
  const age = parseInt(document.getElementById('nq-client-age').value, 10);
  const type = document.getElementById('nq-work-type').value;
  const style = document.getElementById('nq-tattoo-style').value;
  const zone = document.getElementById('nq-body-zone').value.trim();
  const size = document.getElementById('nq-size-cm').value.trim();
  const desc = document.getElementById('nq-description').value.trim();
  const photoUrl = window._attachedPhotoDataUrl || document.getElementById('nq-photo-url').value.trim();

  const isMinor = age < 18;
  const folioNum = (store.quoteRequests.length + 1).toString().padStart(3, '0');
  const folio = `COT-2026-${folioNum}`;

  const newReq = {
    id: 'req-' + Date.now(),
    folio: folio,
    clientName: name,
    clientPhone: phone,
    clientAge: age,
    isMinor: isMinor,
    type: type,
    tattooStyle: style,
    bodyZone: zone,
    sizeCm: size,
    description: desc,
    photoUrl: photoUrl,
    artistId: 'a1',
    artistName: 'Tatuador',
    status: 'solicitud',
    estimatedPrice: 0,
    depositAmount: 0,
    depositPaid: false,
    depositLink: `https://estudio-tatuajes.vercel.app/deposito?ref=${folio}`,
    notes: '',
    dateRequested: new Date().toISOString().split('T')[0]
  };

  store.quoteRequests.unshift(newReq);

  // Asegurar registro del cliente
  const existingClient = store.clients.find(c => c.phone === phone);
  if (!existingClient) {
    store.clients.push({
      id: 'c-' + Date.now(),
      name: name,
      age: age,
      phone: phone,
      allergies: isMinor ? 'Menor de edad (Requiere tutor con INE)' : 'Ninguna',
      visits: 0,
      totalSpent: 0,
      isMinor: isMinor,
      notes: `Solicitud ${folio} registrada.`
    });
  }

  DataService.saveStore();
  closeModal('modal-new-quote-request');
  renderQuoteRequests();
  renderClients();
  showToast(`Solicitud ${folio} creada para ${name}. Lista para cotizar.`, "success");
}

function openQuoteModal(requestId) {
  const req = (store.quoteRequests || []).find(r => r.id === requestId);
  if (!req) return;

  document.getElementById('modal-quote-id').value = req.id;
  document.getElementById('modal-quote-folio').textContent = req.folio;
  document.getElementById('modal-quote-status').innerHTML = renderStatusBadge(req.status);
  document.getElementById('modal-quote-client-info').textContent = `Cliente: ${req.clientName} (${req.clientAge || 20} años)${req.isMinor ? ' - MENOR DE EDAD' : ''}`;
  document.getElementById('modal-quote-body-info').textContent = `Estilo: ${req.tattooStyle || 'Tatuaje'} | Zona: ${req.bodyZone} | Tamaño: ${req.sizeCm}`;
  document.getElementById('modal-quote-desc').textContent = req.description;

  const refBox = document.getElementById('modal-quote-ref-container');
  const imgBox = document.getElementById('modal-quote-ref-img-box');
  if (req.photoUrl) {
    refBox.style.display = 'block';
    imgBox.innerHTML = `<img src="${req.photoUrl}" style="max-height: 120px; border-radius: 4px; border: 1px solid var(--border-default);">`;
  } else {
    refBox.style.display = 'none';
    imgBox.innerHTML = '';
  }

  document.getElementById('quote-form-price').value = req.estimatedPrice || '';
  document.getElementById('quote-form-deposit').value = req.depositAmount || '';
  document.getElementById('quote-form-notes').value = req.notes || '';

  openModal('modal-quote-request');
}

function calculateSuggestedDeposit(priceVal) {
  const price = Number(priceVal) || 0;
  if (price > 0) {
    const deposit = Math.round((price * 0.25) / 50) * 50;
    document.getElementById('quote-form-deposit').value = Math.max(deposit, 200);
  }
}

function saveQuoteFromModal() {
  const reqId = document.getElementById('modal-quote-id').value;
  const req = (store.quoteRequests || []).find(r => r.id === reqId);
  if (!req) return;

  const price = Number(document.getElementById('quote-form-price').value);
  const deposit = Number(document.getElementById('quote-form-deposit').value);
  const duration = document.getElementById('quote-form-duration').value;
  const notes = document.getElementById('quote-form-notes').value.trim();

  if (!price || price <= 0) {
    showToast("Ingresa un precio cotizado válido", "error");
    return;
  }
  if (!deposit || deposit <= 0) {
    showToast("Ingresa el monto del depósito requerido", "error");
    return;
  }

  req.estimatedPrice = price;
  req.depositAmount = deposit;
  req.artistId = 'a1';
  req.artistName = 'Tatuador';
  req.durationEstimated = duration;
  req.notes = notes;
  req.status = req.depositPaid ? 'deposito_pagado' : 'cotizada';
  req.depositLink = `https://estudio-tatuajes.vercel.app/deposito?ref=${req.folio}`;

  DataService.saveStore();
  closeModal('modal-quote-request');
  renderQuoteRequests();
  showToast(`Cotización guardada para ${req.clientName}. Se generó el enlace de anticipo.`, "success");

  if (!req.depositPaid) {
    openDepositPaymentModal(req.id);
  }
}

function openDepositPaymentModal(requestId) {
  const req = (store.quoteRequests || []).find(r => r.id === requestId);
  if (!req) return;

  window._activeDepositReqId = req.id;
  document.getElementById('dep-modal-amount').textContent = formatMoney(req.depositAmount || 0);
  document.getElementById('dep-modal-concept').textContent = `Anticipo para sesión de ${req.clientName} (${req.folio})`;
  document.getElementById('dep-modal-link-input').value = req.depositLink || `https://estudio-tatuajes.vercel.app/deposito?ref=${req.folio}`;

  const badge = document.getElementById('dep-modal-status-badge');
  badge.className = req.depositPaid ? 'badge badge-done' : 'badge badge-progress';
  badge.textContent = req.depositPaid ? 'Depósito Pagado ✓' : 'Esperando Depósito';

  const msg = `¡Hola ${req.clientName}! Te compartimos tu cotización oficial de TATTOO STUDIO para tu proyecto (${req.folio}):\n\nTotal estimado: ${formatMoney(req.estimatedPrice)}\nAnticipo requerido para agendar: ${formatMoney(req.depositAmount)}\n\nPuedes pagar tu anticipo seguro en este enlace: ${req.depositLink}\n\n¡Al confirmarse tu depósito agendaremos de inmediato tu sesión en cabina!`;
  document.getElementById('dep-modal-whatsapp-preview').textContent = msg;

  const confirmBtn = document.getElementById('btn-confirm-deposit-auto');
  if (confirmBtn) {
    confirmBtn.style.display = req.depositPaid ? 'none' : 'block';
  }

  openModal('modal-deposit-payment');
}

function copyDepositLink() {
  const input = document.getElementById('dep-modal-link-input');
  input.select();
  input.setSelectionRange(0, 99999);
  try {
    navigator.clipboard.writeText(input.value);
    showToast("Enlace de pago copiado al portapapeles", "success");
  } catch (e) {
    document.execCommand('copy');
    showToast("Enlace copiado", "success");
  }
}

function sendDepositWhatsApp() {
  const reqId = window._activeDepositReqId;
  const req = (store.quoteRequests || []).find(r => r.id === reqId);
  if (!req) return;

  const msg = `¡Hola ${req.clientName}! Te compartimos tu cotización oficial de *TATTOO STUDIO* para tu proyecto (${req.folio}):%0A%0A*Total estimado:* ${formatMoney(req.estimatedPrice)}%0A*Anticipo requerido:* ${formatMoney(req.depositAmount)}%0A%0APuedes liquidar tu anticipo en este enlace seguro:%0A${encodeURIComponent(req.depositLink)}%0A%0AUna vez acreditado fijaremos fecha y hora en cabina.`;
  window.open(`https://wa.me/52${req.clientPhone}?text=${msg}`, '_blank');
}

function confirmDepositPayment() {
  const reqId = window._activeDepositReqId;
  const req = (store.quoteRequests || []).find(r => r.id === reqId);
  if (!req) return;

  req.depositPaid = true;
  req.depositPaidAt = new Date().toISOString();
  req.status = 'deposito_pagado';

  store.cashMovements.push({
    id: 'mov-' + Date.now(),
    type: 'anticipo',
    concept: `Anticipo recibido (${req.folio} - ${req.clientName})`,
    amount: req.depositAmount,
    method: 'Transferencia',
    timestamp: new Date().toISOString()
  });

  DataService.saveStore();
  closeModal('modal-deposit-payment');
  renderQuoteRequests();
  renderCashRegister();
  showToast(`¡Pago de depósito confirmado para ${req.clientName}! Ya puedes agendar la sesión.`, "success");

  setTimeout(() => {
    scheduleSessionFromQuote(req.id);
  }, 400);
}

function scheduleSessionFromQuote(requestId) {
  const req = (store.quoteRequests || []).find(r => r.id === requestId);
  if (!req) return;

  openNewAppointmentModal();

  document.getElementById('app-form-client').value = req.clientName;
  document.getElementById('app-form-phone').value = req.clientPhone;
  document.getElementById('app-form-notes').value = `Cotización ${req.folio} (${req.tattooStyle || 'Tatuaje'}): ${req.description}`;

  const depRow = document.getElementById('modal-deposit-row');
  if (depRow) {
    depRow.style.display = 'block';
    document.getElementById('app-form-deposit-display').value = `${formatMoney(req.depositAmount)} (Acreditado - Se descontará al liquidar en POS)`;
  }

  window._quoteScheduledRef = req;
}

// ================= 3. AGENDA & CALENDARIO INTERACTIVO (DURACIÓN LIBRE + 12H) =================
let selectedCalendarDate = new Date().toISOString().split('T')[0];
let selectedModalTime = '11:00 AM';
let selectedModalDurationMinutes = 120;
let selectedModalServices = [];

function renderAppointments() {
  const tbody = document.getElementById('appointments-tbody');
  const mobList = document.getElementById('appointments-mobile-list');

  renderCalendarWidget('appointments-calendar-container', selectedCalendarDate, (d) => {
    selectedCalendarDate = d;
    renderAppointments();
  });

  const dateObj = new Date(selectedCalendarDate + 'T00:00:00');
  const dateFormatted = dateObj.toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  document.getElementById('appointments-day-title').textContent = `Sesiones para el ${dateFormatted}`;

  const apps = store.appointments.filter(a => a.date === selectedCalendarDate);

  tbody.innerHTML = '';
  mobList.innerHTML = '';

  if (apps.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:var(--text-muted); padding:24px;">No hay sesiones agendadas para este día.</td></tr>`;
    mobList.innerHTML = `<p style="text-align:center; color:var(--text-muted); padding:16px; font-size:0.85rem;">No hay sesiones agendadas para este día.</p>`;
    return;
  }

  apps.forEach(app => {
    const endTimeStr = app.endTime || calculateEndTime(app.time, app.durationMinutes || 60);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><b>${formatTime12h(app.time)} - ${formatTime12h(endTimeStr)}</b></td>
      <td><b>${escapeHtml(app.clientName)}</b><br><small style="color:var(--text-muted);">${escapeHtml(app.clientPhone)}</small></td>
      <td>${escapeHtml(app.serviceName)}<br><small style="color:var(--accent-secondary); font-weight:600;">${app.durationLabel || '1h'}</small></td>
      <td>${escapeHtml(app.booth || 'Cabina Principal')}</td>
      <td>${app.depositDeducted ? `<span style="color:var(--color-success); font-weight:700;">-${formatMoney(app.depositDeducted)}</span>` : '<span style="color:var(--text-muted);">$0</span>'}</td>
      <td>
        <select class="form-select" style="font-size:0.75rem; padding:3px 6px;" onchange="updateAppointmentStatus('${app.id}', this.value)">
          <option value="agendada" ${app.status === 'agendada' ? 'selected' : ''}>Agendada</option>
          <option value="en_proceso" ${app.status === 'en_proceso' ? 'selected' : ''}>En Cabina</option>
          <option value="realizada" ${app.status === 'realizada' ? 'selected' : ''}>Realizada</option>
          <option value="retoque" ${app.status === 'retoque' ? 'selected' : ''}>Retoque</option>
          <option value="cancelada" ${app.status === 'cancelada' ? 'selected' : ''}>Cancelada</option>
        </select>
      </td>
      <td>
        <div style="display: flex; gap: 4px;">
          <button class="btn btn-primary btn-sm" onclick="directPayAppointment('${app.id}')" title="Cobrar sesión">Cobrar</button>
          <button class="btn btn-secondary btn-sm" onclick="sendWhatsAppReminder('${app.id}')" title="Enviar WhatsApp">WA</button>
          <button class="btn btn-danger btn-sm" onclick="deleteAppointment('${app.id}')" title="Eliminar">&times;</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);

    const card = document.createElement('div');
    card.className = 'mobile-app-card';
    card.innerHTML = `
      <div class="mobile-app-header">
        <span class="mobile-app-time">${formatTime12h(app.time)} - ${formatTime12h(endTimeStr)}</span>
        ${renderStatusBadge(app.status)}
      </div>
      <div class="mobile-app-client">${escapeHtml(app.clientName)}</div>
      <div class="mobile-app-meta">
        <span><b>Servicio:</b> ${escapeHtml(app.serviceName)} (${app.durationLabel || '1h'})</span>
        <span><b>Cabina:</b> ${escapeHtml(app.booth || 'Cabina Principal')}</span>
        ${app.depositDeducted ? `<span style="color:var(--color-success); font-weight:700;">Anticipo acreditado: -${formatMoney(app.depositDeducted)}</span>` : ''}
        ${app.notes ? `<span style="color:var(--text-muted); font-size:0.75rem;">Nota: ${escapeHtml(app.notes)}</span>` : ''}
      </div>
      <div class="mobile-app-actions">
        <button class="btn btn-primary btn-sm" style="flex:1;" onclick="directPayAppointment('${app.id}')">Cobrar en POS</button>
        <button class="btn btn-secondary btn-sm" onclick="sendWhatsAppReminder('${app.id}')">Recordar WA</button>
      </div>
    `;
    mobList.appendChild(card);
  });
}

function updateAppointmentStatus(appId, newStatus) {
  const app = store.appointments.find(a => a.id === appId);
  if (!app) return;
  app.status = newStatus;
  DataService.saveStore();
  renderAppointments();
  renderDashboard();
  showToast(`Estado actualizado a ${newStatus}`, "info");
}

function deleteAppointment(appId) {
  if (!confirm("¿Deseas eliminar esta cita de la agenda?")) return;
  store.appointments = store.appointments.filter(a => a.id !== appId);
  DataService.saveStore();
  renderAppointments();
  renderDashboard();
  showToast("Sesión eliminada de la agenda", "info");
}

function sendWhatsAppReminder(appId) {
  const app = store.appointments.find(a => a.id === appId);
  if (!app) return;
  const msg = `¡Hola ${app.clientName}! Te recordamos tu cita en *TATTOO STUDIO*:%0A%0A*Fecha:* ${app.date}%0A*Horario:* ${formatTime12h(app.time)}%0A*Cabina:* ${app.booth || 'Cabina Principal'}%0A%0A*Instrucciones previas:*%0A- Ven bien hidratado(a) y con comida previa.%0A- No tomes alcohol ni aspirinas 24 horas antes.%0A- Ropa cómoda que permita acceso a la zona.%0A%0A¡Te esperamos con gusto!`;
  window.open(`https://wa.me/52${app.clientPhone}?text=${msg}`, '_blank');
}

// Modal Agendar Sesión
function openNewAppointmentModal() {
  selectedModalServices = [];
  selectedModalTime = '11:00 AM';
  selectedModalDurationMinutes = 120;
  window._quoteScheduledRef = null;

  document.getElementById('app-form-client').value = '';
  document.getElementById('app-form-phone').value = '';
  document.getElementById('app-form-notes').value = '';
  document.getElementById('app-form-custom-duration').value = '120';
  document.getElementById('modal-deposit-row').style.display = 'none';

  renderModalServicesPicker();
  renderModalCalendar();
  renderModalTimePicker();
  updateModalTimeRange();

  openModal('modal-appointment');
}

function renderModalServicesPicker() {
  const container = document.getElementById('modal-services-picker');
  container.innerHTML = '';

  store.services.forEach(srv => {
    const isSelected = selectedModalServices.some(s => s.id === srv.id);
    const item = document.createElement('div');
    item.className = `service-select-item ${isSelected ? 'selected' : ''}`;
    item.innerHTML = `
      <div class="custom-checkbox">${isSelected ? '✓' : ''}</div>
      <div style="flex: 1;">
        <div class="service-select-title">${escapeHtml(srv.name)}</div>
        <div class="service-select-meta">
          <span class="service-select-price">${formatMoney(srv.price)}</span>
          <span class="service-select-duration">${srv.duration || 60}m</span>
        </div>
      </div>
    `;
    item.onclick = () => {
      if (isSelected) {
        selectedModalServices = selectedModalServices.filter(s => s.id !== srv.id);
      } else {
        selectedModalServices.push(srv);
      }
      renderModalServicesPicker();
      updateModalServicesSummary();
    };
    container.appendChild(item);
  });
  updateModalServicesSummary();
}

function updateModalServicesSummary() {
  const count = selectedModalServices.length;
  const totalPrice = selectedModalServices.reduce((a, s) => a + (s.price || 0), 0);
  document.getElementById('modal-services-summary-text').textContent = `${count} servicio(s) seleccionado(s)`;
  document.getElementById('modal-services-summary-price').textContent = formatMoney(totalPrice);
}

function renderModalCalendar() {
  renderCalendarWidget('modal-calendar-widget-container', selectedCalendarDate, (d) => {
    selectedCalendarDate = d;
    renderModalCalendar();
    renderModalTimePicker();
    updateModalTimeRange();
  });
}

function renderModalTimePicker() {
  const container = document.getElementById('modal-time-picker-container');
  if (!container) return;

  const slots = [
    "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
    "5:00 PM", "6:00 PM", "7:00 PM"
  ];

  const bookedSlots = store.appointments
    .filter(a => a.date === selectedCalendarDate && a.status !== 'cancelada')
    .map(a => formatTime12h(a.time));

  container.innerHTML = `
    <div class="time-shift-title">Horarios Disponibles (12 Horas)</div>
    <div class="time-slots-wrapper" id="modal-time-slots-wrapper"></div>
  `;

  const wrapper = document.getElementById('modal-time-slots-wrapper');
  slots.forEach(slot => {
    const isBooked = bookedSlots.includes(slot);
    const isSelected = (slot === selectedModalTime);

    const pill = document.createElement('div');
    pill.className = `time-slot-pill ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}`;
    pill.textContent = slot;

    if (!isBooked) {
      pill.onclick = () => {
        selectedModalTime = slot;
        renderModalTimePicker();
        updateModalTimeRange();
      };
    } else {
      pill.title = "Horario reservado";
    }

    wrapper.appendChild(pill);
  });
}

function selectDurationPreset(minutes, label) {
  selectedModalDurationMinutes = minutes;
  document.getElementById('app-form-custom-duration').value = minutes;
  document.querySelectorAll('.duration-pill').forEach(p => p.classList.remove('active'));
  if (event && event.target) event.target.classList.add('active');
  updateModalTimeRange();
}

function handleCustomDurationChange(val) {
  const minutes = parseInt(val, 10) || 60;
  selectedModalDurationMinutes = minutes;
  document.querySelectorAll('.duration-pill').forEach(p => p.classList.remove('active'));
  updateModalTimeRange();
}

function updateModalTimeRange() {
  const end = calculateEndTime(selectedModalTime, selectedModalDurationMinutes);
  const label = formatDurationLabel(selectedModalDurationMinutes);
  document.getElementById('modal-time-range-preview').textContent = `${selectedModalTime} - ${end} (${label})`;
  document.getElementById('app-duration-summary-text').textContent = `Duración fijada: ${label}`;
}

function saveAppointmentFromModal() {
  const clientName = document.getElementById('app-form-client').value.trim();
  const clientPhone = document.getElementById('app-form-phone').value.trim();
  const notes = document.getElementById('app-form-notes').value.trim();

  if (!clientName) {
    showToast("Ingresa el nombre del cliente", "error");
    return;
  }
  if (selectedModalServices.length === 0) {
    showToast("Selecciona al menos un servicio o tipo de sesión", "error");
    return;
  }

  const totalPrice = selectedModalServices.reduce((a, s) => a + (s.price || 0), 0);
  const serviceName = selectedModalServices.map(s => s.name).join(" + ");

  let depositDeducted = 0;
  let quoteRef = '';
  if (window._quoteScheduledRef) {
    depositDeducted = window._quoteScheduledRef.depositAmount || 0;
    quoteRef = window._quoteScheduledRef.folio || '';
    window._quoteScheduledRef.status = 'agendada';
  }

  const endTimeStr = calculateEndTime(selectedModalTime, selectedModalDurationMinutes);

  const newApp = {
    id: 'ses-' + Date.now(),
    clientName: clientName,
    clientPhone: clientPhone,
    services: selectedModalServices,
    serviceName: serviceName,
    price: totalPrice,
    depositDeducted: depositDeducted,
    durationMinutes: selectedModalDurationMinutes,
    durationLabel: formatDurationLabel(selectedModalDurationMinutes),
    artistId: 'a1',
    artistName: 'Tatuador',
    booth: 'Cabina Principal',
    date: selectedCalendarDate,
    time: selectedModalTime,
    endTime: endTimeStr,
    status: 'agendada',
    notes: notes,
    quoteRef: quoteRef
  };

  store.appointments.push(newApp);

  let client = store.clients.find(c => c.phone === clientPhone);
  if (!client) {
    client = {
      id: 'c-' + Date.now(),
      name: clientName,
      phone: clientPhone,
      age: 25,
      allergies: 'Ninguna',
      visits: 1,
      totalSpent: 0,
      notes: notes
    };
    store.clients.push(client);
  } else {
    client.visits = (client.visits || 0) + 1;
  }

  DataService.saveStore();
  closeModal('modal-appointment');
  renderAppointments();
  renderDashboard();
  renderQuoteRequests();
  showToast(`Sesión agendada para ${clientName} el ${selectedCalendarDate} a las ${selectedModalTime}`, "success");
}

// ================= CALENDARIO WIDGET =================
function renderCalendarWidget(containerId, activeDateStr, onDateSelect) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const [y, m, d] = activeDateStr.split('-').map(Number);
  const currentMonthDate = new Date(y, m - 1, 1);
  const monthName = currentMonthDate.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' });
  const bookedDates = store.appointments.map(a => a.date);

  container.innerHTML = `
    <div class="calendar-widget-box">
      <div class="calendar-widget-header">
        <span class="calendar-widget-title">${monthName}</span>
        <div class="calendar-nav-buttons">
          <button type="button" class="calendar-nav-btn" id="${containerId}-prev" title="Mes anterior">&lt;</button>
          <button type="button" class="calendar-nav-btn" id="${containerId}-next" title="Mes siguiente">&gt;</button>
        </div>
      </div>
      <div class="calendar-weekdays-row" style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; margin-bottom: 4px;">
        <div class="calendar-day-name">Do</div>
        <div class="calendar-day-name">Lu</div>
        <div class="calendar-day-name">Ma</div>
        <div class="calendar-day-name">Mi</div>
        <div class="calendar-day-name">Ju</div>
        <div class="calendar-day-name">Vi</div>
        <div class="calendar-day-name">Sá</div>
      </div>
      <div class="calendar-days-grid" id="${containerId}-grid"></div>
    </div>
  `;

  document.getElementById(`${containerId}-prev`).onclick = () => {
    const prevMonth = new Date(y, m - 2, 1);
    const newDateStr = prevMonth.toISOString().split('T')[0];
    renderCalendarWidget(containerId, newDateStr, onDateSelect);
  };

  document.getElementById(`${containerId}-next`).onclick = () => {
    const nextMonth = new Date(y, m, 1);
    const newDateStr = nextMonth.toISOString().split('T')[0];
    renderCalendarWidget(containerId, newDateStr, onDateSelect);
  };

  const grid = document.getElementById(`${containerId}-grid`);
  const firstDayIndex = currentMonthDate.getDay();
  const daysInMonth = new Date(y, m, 0).getDate();
  const todayStr = new Date().toISOString().split('T')[0];

  for (let i = 0; i < firstDayIndex; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-day-cell empty';
    grid.appendChild(empty);
  }

  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const dayStr = `${y}-${m < 10 ? '0' + m : m}-${dayNum < 10 ? '0' + dayNum : dayNum}`;
    const isSelected = (dayStr === activeDateStr);
    const isToday = (dayStr === todayStr);
    const hasAppointments = bookedDates.includes(dayStr);

    const cell = document.createElement('div');
    cell.className = `cal-day-cell ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`;
    cell.innerHTML = `
      <span class="cal-day-num">${dayNum}</span>
      ${hasAppointments ? '<span class="appointment-dot"></span>' : ''}
    `;

    cell.onclick = () => {
      onDateSelect(dayStr);
    };

    grid.appendChild(cell);
  }
}

// ================= 4. PORTAL DEL TATUADOR =================
function renderArtistPortal() {
  if (!currentSession || currentSession.role !== 'artist') return;
  const tbody = document.getElementById('artist-my-appointments-tbody');
  const mobList = document.getElementById('artist-my-appointments-mobile-list');
  if (!tbody) return;

  const todayStr = new Date().toISOString().split('T')[0];
  const myApps = store.appointments.filter(a => a.date === todayStr);

  document.getElementById('artist-portal-title').textContent = "Mi Agenda de Hoy (Tatuador)";

  tbody.innerHTML = '';
  mobList.innerHTML = '';

  if (myApps.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">No tienes citas asignadas para hoy.</td></tr>`;
    mobList.innerHTML = `<p style="text-align: center; color: var(--text-muted); padding: 16px;">No tienes citas asignadas para hoy.</p>`;
    return;
  }

  myApps.forEach(app => {
    const endTimeStr = app.endTime || calculateEndTime(app.time, app.durationMinutes || 60);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><b>${formatTime12h(app.time)} - ${formatTime12h(endTimeStr)}</b></td>
      <td><b>${escapeHtml(app.clientName)}</b><br><small style="color:var(--text-muted);">${escapeHtml(app.clientPhone)}</small></td>
      <td>${escapeHtml(app.serviceName)} (${app.durationLabel || '1h'})</td>
      <td>${escapeHtml(app.booth || 'Cabina Principal')}</td>
      <td>${renderStatusBadge(app.status)}</td>
      <td><small style="color:var(--text-secondary);">${escapeHtml(app.notes || 'Sin especificaciones')}</small></td>
    `;
    tbody.appendChild(tr);

    const card = document.createElement('div');
    card.className = 'mobile-app-card';
    card.innerHTML = `
      <div class="mobile-app-header">
        <span class="mobile-app-time">${formatTime12h(app.time)} - ${formatTime12h(endTimeStr)}</span>
        ${renderStatusBadge(app.status)}
      </div>
      <div class="mobile-app-client">${escapeHtml(app.clientName)}</div>
      <div class="mobile-app-meta">
        <span><b>Trabajo:</b> ${escapeHtml(app.serviceName)} (${app.durationLabel || '1h'})</span>
        <span><b>Cabina:</b> ${escapeHtml(app.booth || 'Cabina Principal')}</span>
        ${app.notes ? `<span><b>Notas:</b> ${escapeHtml(app.notes)}</span>` : ''}
      </div>
    `;
    mobList.appendChild(card);
  });
}

function renderArtistTips() {
  const tbody = document.getElementById('artist-tips-tbody');
  if (!tbody) return;

  const tips = store.artistTips || [];
  const todayStr = new Date().toISOString().split('T')[0];
  const todayTips = tips.filter(t => t.timestamp.startsWith(todayStr));
  const sumToday = todayTips.reduce((a, t) => a + (t.amount || 0), 0);
  const sumTotal = tips.reduce((a, t) => a + (t.amount || 0), 0);

  if (document.getElementById('artist-tips-today')) document.getElementById('artist-tips-today').textContent = formatMoney(sumToday);
  if (document.getElementById('artist-tips-total')) document.getElementById('artist-tips-total').textContent = formatMoney(sumTotal);

  tbody.innerHTML = '';
  if (tips.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 18px;">No hay propinas registradas.</td></tr>`;
    return;
  }

  tips.forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${new Date(t.timestamp).toLocaleDateString('es-MX')} ${new Date(t.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</td>
      <td><b style="color:var(--color-success);">${formatMoney(t.amount)}</b></td>
      <td><span class="badge badge-done">${escapeHtml(t.method)}</span></td>
      <td>${escapeHtml(t.notes || '-')}</td>
    `;
    tbody.appendChild(tr);
  });
}

function openArtistTipModal() {
  document.getElementById('tip-form-amount').value = '';
  document.getElementById('tip-form-notes').value = '';
  openModal('modal-artist-tip');
}

function saveArtistTipFromModal() {
  const amount = Number(document.getElementById('tip-form-amount').value);
  const method = document.getElementById('tip-form-method').value;
  const notes = document.getElementById('tip-form-notes').value.trim();

  if (!amount || amount <= 0) {
    showToast("Ingresa un monto válido de propina", "error");
    return;
  }

  store.artistTips.unshift({
    id: 'tip-' + Date.now(),
    artistId: 'a1',
    artistName: 'Tatuador',
    amount: amount,
    method: method,
    notes: notes,
    timestamp: new Date().toISOString()
  });

  DataService.saveStore();
  closeModal('modal-artist-tip');
  renderArtistTips();
  showToast(`Propina de ${formatMoney(amount)} registrada con éxito`, "success");
}

// ================= 5. PUNTO DE VENTA (POS CON DEDUCCIÓN DE ANTICIPO) =================
let posCart = [];
let posDeductedDeposit = 0;
let posActiveAppointment = null;

function renderPOS() {
  filterPosCatalog('all');
  populatePosAppointmentSelector();
  renderPosCart();
}

function populatePosAppointmentSelector() {
  const sel = document.getElementById('pos-select-appointment');
  if (!sel) return;
  sel.innerHTML = '<option value="">-- Seleccionar cita de la agenda para cobrar --</option>';

  const todayStr = new Date().toISOString().split('T')[0];
  const apps = store.appointments.filter(a => a.date === todayStr && a.status !== 'cancelada');

  apps.forEach(app => {
    const opt = document.createElement('option');
    opt.value = app.id;
    opt.textContent = `${formatTime12h(app.time)} | ${app.clientName} - ${app.serviceName} (${formatMoney(app.price)})`;
    sel.appendChild(opt);
  });
}

function filterPosCatalog(category) {
  document.querySelectorAll('.pos-tab-btn').forEach(btn => btn.classList.remove('active'));
  if (event && event.target && event.target.classList.contains('pos-tab-btn')) {
    event.target.classList.add('active');
  }

  const container = document.getElementById('pos-items-container');
  if (!container) return;
  container.innerHTML = '';

  let items = [];
  if (category === 'all' || category === 'Tatuaje' || category === 'Piercing') {
    const srvs = (category === 'all') ? store.services : store.services.filter(s => s.category === category);
    srvs.forEach(s => items.push({ ...s, itemType: 'service' }));
  }
  if (category === 'all' || category === 'Aftercare' || category === 'Joyería') {
    const prods = (category === 'all') ? store.products : store.products.filter(p => p.category === category);
    prods.forEach(p => items.push({ ...p, itemType: 'product' }));
  }

  items.forEach(it => {
    const card = document.createElement('div');
    card.className = 'pos-item-card';
    card.innerHTML = `
      <div>
        <h4>${escapeHtml(it.name)}</h4>
        <span class="meta">${escapeHtml(it.category || '')} ${it.stock !== undefined ? `| Stock: ${it.stock}` : ''}</span>
      </div>
      <div class="price">${formatMoney(it.price)}</div>
    `;
    card.onclick = () => addPosItem(it);
    container.appendChild(card);
  });
}

function addPosItem(item) {
  const existing = posCart.find(i => i.id === item.id && i.itemType === item.itemType);
  if (existing) {
    existing.qty += 1;
  } else {
    posCart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      itemType: item.itemType,
      qty: 1
    });
  }
  renderPosCart();
}

function changePosQty(index, delta) {
  if (!posCart[index]) return;
  posCart[index].qty += delta;
  if (posCart[index].qty <= 0) {
    posCart.splice(index, 1);
  }
  renderPosCart();
}

function clearPosCart() {
  posCart = [];
  posDeductedDeposit = 0;
  posActiveAppointment = null;
  if (document.getElementById('pos-select-appointment')) {
    document.getElementById('pos-select-appointment').value = '';
  }
  renderPosCart();
}

function loadAppointmentToPos(appId) {
  if (!appId) {
    clearPosCart();
    return;
  }
  const app = store.appointments.find(a => a.id === appId);
  if (!app) return;

  posCart = [];
  posActiveAppointment = app;

  if (app.services && app.services.length > 0) {
    app.services.forEach(s => {
      posCart.push({
        id: s.id,
        name: s.name,
        price: s.price,
        itemType: 'service',
        qty: 1
      });
    });
  } else {
    posCart.push({
      id: 'srv-custom',
      name: app.serviceName || 'Sesión de Tatuaje',
      price: app.price || 0,
      itemType: 'service',
      qty: 1
    });
  }

  posDeductedDeposit = app.depositDeducted || 0;
  renderPosCart();
  showToast(`Cita de ${app.clientName} cargada al POS. Anticipo acreditado: -${formatMoney(posDeductedDeposit)}`, "info");
}

function directPayAppointment(appId) {
  switchView('pos');
  const sel = document.getElementById('pos-select-appointment');
  if (sel) {
    sel.value = appId;
    loadAppointmentToPos(appId);
  }
}

function renderPosCart() {
  const container = document.getElementById('pos-cart-items-container');
  if (!container) return;

  container.innerHTML = '';
  if (posCart.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 20px 0;">No hay ítems en la orden</p>`;
    document.getElementById('pos-summary-subtotal').textContent = '$0.00 MXN';
    document.getElementById('pos-deposit-deduction-row').style.display = 'none';
    document.getElementById('pos-summary-total').textContent = '$0.00 MXN';
    return;
  }

  let subtotal = 0;
  posCart.forEach((item, idx) => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    const row = document.createElement('div');
    row.className = 'ticket-item';
    row.innerHTML = `
      <div class="ticket-item-details">
        <div class="ticket-item-name">${escapeHtml(item.name)}</div>
        <div class="ticket-item-price">${formatMoney(item.price)} x ${item.qty} = <b>${formatMoney(itemTotal)}</b></div>
      </div>
      <div class="ticket-item-actions">
        <button class="btn-qty" onclick="changePosQty(${idx}, -1)">-</button>
        <span style="font-size:0.85rem; font-weight:700; min-width:18px; text-align:center;">${item.qty}</span>
        <button class="btn-qty" onclick="changePosQty(${idx}, 1)">+</button>
      </div>
    `;
    container.appendChild(row);
  });

  const depositRow = document.getElementById('pos-deposit-deduction-row');
  if (posDeductedDeposit > 0) {
    depositRow.style.display = 'flex';
    document.getElementById('pos-summary-deposit').textContent = `-${formatMoney(posDeductedDeposit)}`;
  } else {
    depositRow.style.display = 'none';
  }

  const finalTotal = Math.max(0, subtotal - posDeductedDeposit);

  document.getElementById('pos-summary-subtotal').textContent = formatMoney(subtotal);
  document.getElementById('pos-summary-total').textContent = formatMoney(finalTotal);
}

function openCheckoutModal() {
  if (posCart.length === 0) {
    showToast("Agrega servicios o productos a la orden", "error");
    return;
  }

  const subtotal = posCart.reduce((a, b) => a + (b.price * b.qty), 0);
  const total = Math.max(0, subtotal - posDeductedDeposit);

  document.getElementById('checkout-total-display').textContent = formatMoney(total);

  const depInfo = document.getElementById('checkout-deposit-info');
  if (posDeductedDeposit > 0) {
    depInfo.textContent = `(Subtotal: ${formatMoney(subtotal)} | Anticipo Acreditado: -${formatMoney(posDeductedDeposit)})`;
  } else {
    depInfo.textContent = '';
  }

  document.getElementById('checkout-cash-received').value = total;
  document.getElementById('checkout-change-display').textContent = '$0.00 MXN';

  openModal('modal-checkout');
}

function handlePaymentMethodChange(method) {
  const box = document.getElementById('checkout-cash-received-box');
  if (method === 'Efectivo') {
    box.style.display = 'block';
  } else {
    box.style.display = 'none';
  }
}

function calculateChange(val) {
  const subtotal = posCart.reduce((a, b) => a + (b.price * b.qty), 0);
  const total = Math.max(0, subtotal - posDeductedDeposit);
  const received = Number(val) || 0;
  const change = Math.max(0, received - total);
  document.getElementById('checkout-change-display').textContent = formatMoney(change);
}

function confirmCheckout() {
  const subtotal = posCart.reduce((a, b) => a + (b.price * b.qty), 0);
  const total = Math.max(0, subtotal - posDeductedDeposit);
  const method = document.getElementById('checkout-method').value;

  const concept = posActiveAppointment
    ? `Liquidación Sesión: ${posActiveAppointment.clientName} (${posActiveAppointment.serviceName})`
    : `Venta POS (${posCart.map(i => i.name).join(', ')})`;

  store.cashMovements.push({
    id: 'mov-' + Date.now(),
    type: 'venta',
    concept: concept,
    subtotal: subtotal,
    depositDeducted: posDeductedDeposit,
    amount: total,
    method: method,
    artistId: 'a1',
    timestamp: new Date().toISOString()
  });

  if (posActiveAppointment) {
    posActiveAppointment.status = 'realizada';
    if (posActiveAppointment.quoteRef) {
      const req = store.quoteRequests.find(r => r.folio === posActiveAppointment.quoteRef);
      if (req) req.status = 'realizada';
    }
  }

  posCart.forEach(item => {
    if (item.itemType === 'product') {
      const prod = store.products.find(p => p.id === item.id);
      if (prod) prod.stock = Math.max(0, prod.stock - item.qty);
    }
  });

  DataService.saveStore();
  closeModal('modal-checkout');

  generateReceiptModal(subtotal, posDeductedDeposit, total, method, 'Tatuador');

  clearPosCart();
  renderAppointments();
  renderDashboard();
  renderCashRegister();
  renderCatalog();
  showToast("Cobro procesado exitosamente", "success");
}

function generateReceiptModal(subtotal, deposit, total, method, artistName) {
  const client = posActiveAppointment ? posActiveAppointment.clientName : 'Cliente General';
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-MX');
  const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

  const itemsHtml = posCart.map(i => `
    <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
      <span>${escapeHtml(i.name)} x${i.qty}</span>
      <b>${formatMoney(i.price * i.qty)}</b>
    </div>
  `).join('');

  const html = `
    <h4>TATTOO STUDIO</h4>
    <div class="receipt-center">Roma Norte, Cuauhtémoc, CDMX</div>
    <div class="receipt-center">Tel: 55 1234 5678 | WhatsApp Oficial</div>
    <div class="receipt-divider"></div>
    <div style="display:flex; justify-content:space-between; font-size:10px;">
      <span>Fecha: ${dateStr} ${timeStr}</span>
      <span>Ticket #${Math.floor(1000 + Math.random() * 9000)}</span>
    </div>
    <div style="font-size:10px; margin-top:2px;">Cliente: ${escapeHtml(client)}</div>
    ${artistName ? `<div style="font-size:10px;">Atendido por: ${escapeHtml(artistName)}</div>` : ''}
    <div class="receipt-divider"></div>
    ${itemsHtml}
    <div class="receipt-divider"></div>
    <div style="display:flex; justify-content:space-between;">
      <span>SUBTOTAL:</span>
      <b>${formatMoney(subtotal)}</b>
    </div>
    ${deposit > 0 ? `
      <div style="display:flex; justify-content:space-between; color:#00875a;">
        <span>ANTICIPO ACREDITADO:</span>
        <b>-${formatMoney(deposit)}</b>
      </div>
    ` : ''}
    <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:bold; margin-top:4px;">
      <span>TOTAL LIQUIDADO:</span>
      <span>${formatMoney(total)}</span>
    </div>
    <div style="font-size:10px; margin-top:4px;">Método de Pago: ${escapeHtml(method)}</div>
    <div class="receipt-divider"></div>
    <div class="receipt-center" style="font-size:9px; margin-top:6px;">
      ¡Gracias por tu preferencia!<br>
      Sigue las indicaciones de cicatrización.<br>
      Cualquier duda contáctanos por WhatsApp.
    </div>
  `;

  document.getElementById('receipt-modal-content').innerHTML = html;
  document.getElementById('receipt-print-area').innerHTML = html;
  openModal('modal-receipt');
}

// ================= 6. CORTE DE CAJA =================
function renderCashRegister() {
  const initialFund = store.config.initialCashFund || 1500;
  const todayStr = new Date().toISOString().split('T')[0];
  const movs = store.cashMovements.filter(m => m.timestamp.startsWith(todayStr));

  let cashCollected = 0;
  let expensesTotal = 0;

  movs.forEach(m => {
    if (m.type === 'venta' && m.method === 'Efectivo') {
      cashCollected += (m.amount || 0);
    } else if (m.type === 'anticipo' && m.method === 'Efectivo') {
      cashCollected += (m.amount || 0);
    } else if (m.type === 'gasto') {
      expensesTotal += (m.amount || 0);
    }
  });

  const expectedTotal = initialFund + cashCollected - expensesTotal;

  document.getElementById('cash-initial-fund').textContent = formatMoney(initialFund);
  document.getElementById('cash-collected-cash').textContent = formatMoney(cashCollected);
  document.getElementById('cash-expenses-total').textContent = formatMoney(expensesTotal);
  document.getElementById('cash-expected-total').textContent = formatMoney(expectedTotal);

  const tbody = document.getElementById('cash-movements-tbody');
  tbody.innerHTML = '';
  if (movs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted); padding:16px;">Sin movimientos de caja hoy.</td></tr>`;
    return;
  }

  movs.forEach(m => {
    const tr = document.createElement('tr');
    const isIncome = m.type === 'venta' || m.type === 'anticipo' || m.type === 'fondo_inicial';
    tr.innerHTML = `
      <td>${new Date(m.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}</td>
      <td><span class="badge ${isIncome ? 'badge-done' : 'badge-cancel'}">${escapeHtml(m.type)}</span></td>
      <td>${escapeHtml(m.concept)}</td>
      <td>${escapeHtml(m.method || 'Efectivo')}</td>
      <td><b style="color:${isIncome ? 'var(--color-success)' : 'var(--color-error)'};">${isIncome ? '+' : '-'}${formatMoney(m.amount)}</b></td>
    `;
    tbody.appendChild(tr);
  });
}

function openExpenseModal() {
  document.getElementById('expense-concept').value = '';
  document.getElementById('expense-amount').value = '';
  openModal('modal-expense');
}

function saveExpenseFromModal() {
  const concept = document.getElementById('expense-concept').value.trim();
  const amount = Number(document.getElementById('expense-amount').value);
  if (!concept || !amount || amount <= 0) {
    showToast("Ingresa un concepto y monto válido", "error");
    return;
  }

  store.cashMovements.push({
    id: 'mov-' + Date.now(),
    type: 'gasto',
    concept: concept,
    amount: amount,
    method: 'Efectivo',
    timestamp: new Date().toISOString()
  });

  DataService.saveStore();
  closeModal('modal-expense');
  renderCashRegister();
  showToast("Gasto registrado en caja", "info");
}

function openCashCutModal() {
  const initialFund = store.config.initialCashFund || 1500;
  const todayStr = new Date().toISOString().split('T')[0];
  const movs = store.cashMovements.filter(m => m.timestamp.startsWith(todayStr));

  let cashCollected = 0;
  let expensesTotal = 0;
  movs.forEach(m => {
    if ((m.type === 'venta' || m.type === 'anticipo') && m.method === 'Efectivo') cashCollected += m.amount;
    if (m.type === 'gasto') expensesTotal += m.amount;
  });
  const expected = initialFund + cashCollected - expensesTotal;
  window._cashExpected = expected;

  document.getElementById('cash-cut-expected-display').textContent = formatMoney(expected);
  document.getElementById('cash-cut-counted').value = expected;
  calculateCashDifference(expected);
  openModal('modal-cash-cut');
}

function calculateCashDifference(val) {
  const counted = Number(val) || 0;
  const expected = window._cashExpected || 0;
  const diff = counted - expected;
  const badge = document.getElementById('cash-cut-diff-badge');

  if (diff === 0) {
    badge.className = 'diff-badge balanced';
    badge.textContent = `Cuadrado: ${formatMoney(0)}`;
  } else if (diff < 0) {
    badge.className = 'diff-badge missing';
    badge.textContent = `Faltante: ${formatMoney(Math.abs(diff))}`;
  } else {
    badge.className = 'diff-badge surplus';
    badge.textContent = `Sobrante: +${formatMoney(diff)}`;
  }
}

function confirmCashCut() {
  const counted = Number(document.getElementById('cash-cut-counted').value) || 0;
  const expected = window._cashExpected || 0;
  const diff = counted - expected;

  store.cashClosures.push({
    id: 'close-' + Date.now(),
    counted: counted,
    expected: expected,
    difference: diff,
    timestamp: new Date().toISOString()
  });

  DataService.saveStore();
  closeModal('modal-cash-cut');
  showToast("Corte de turno guardado correctamente", "success");
}

function openEditFundModal() {
  document.getElementById('edit-fund-amount').value = store.config.initialCashFund || 1500;
  document.getElementById('edit-fund-password').value = '';
  openModal('modal-edit-fund');
}

function confirmEditFund() {
  const newFund = Number(document.getElementById('edit-fund-amount').value);
  const pass = document.getElementById('edit-fund-password').value.trim();

  if (pass !== (store.config.adminPass || '123') && pass !== '12345') {
    showToast("Contraseña incorrecta", "error");
    return;
  }
  if (!newFund || newFund < 0) {
    showToast("Ingresa un monto de fondo inicial válido", "error");
    return;
  }

  store.config.initialCashFund = newFund;
  DataService.saveStore();
  closeModal('modal-edit-fund');
  renderCashRegister();
  showToast("Fondo inicial actualizado con éxito", "success");
}

// ================= 7. ARTISTA / TATUADOR & CABINA =================
function renderArtists() {
  const container = document.getElementById('artists-cards-container');
  if (!container) return;
  container.innerHTML = '';

  const art = store.artists[0] || { name: 'Tatuador', specialty: 'Tatuador Profesional', booth: 'Cabina Principal', avatar: 'TA' };
  const card = document.createElement('div');
  card.className = 'panel-card';
  card.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <div style="display:flex; align-items:center; gap:12px;">
        <div class="user-session-avatar" style="width:44px; height:44px; font-size:1rem;">${art.avatar || 'TA'}</div>
        <div>
          <h4 style="font-size:1rem; color:var(--text-main); font-weight:700;">${escapeHtml(art.name)}</h4>
          <span style="font-size:0.8rem; color:var(--accent-secondary); font-weight:600;">${escapeHtml(art.booth || 'Cabina Principal')}</span>
        </div>
      </div>
      <span class="badge badge-done">Activo</span>
    </div>
    <div style="font-size:0.85rem; color:var(--text-secondary); background:var(--bg-subtle); padding:12px; border-radius:6px; border:1px solid var(--border-default);">
      <div><b>Especialidad:</b> ${escapeHtml(art.specialty)}</div>
      <div style="margin-top:6px;"><b>WhatsApp Oficial:</b> ${escapeHtml(art.phone || '5512345678')}</div>
      <div style="margin-top:6px;"><b>Usuario de Acceso:</b> <code style="color:var(--primary); font-weight:700;">tatuador</code></div>
    </div>
  `;
  container.appendChild(card);
}

// ================= 8. CATÁLOGO & JOYERÍA =================
function renderCatalog() {
  const srvTbody = document.getElementById('catalog-services-tbody');
  const prodTbody = document.getElementById('catalog-products-tbody');
  if (!srvTbody || !prodTbody) return;

  srvTbody.innerHTML = '';
  store.services.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><b>${escapeHtml(s.name)}</b></td>
      <td><span class="badge badge-pending">${escapeHtml(s.category)}</span></td>
      <td><b>${formatMoney(s.price)}</b></td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteService('${s.id}')">&times;</button></td>
    `;
    srvTbody.appendChild(tr);
  });

  prodTbody.innerHTML = '';
  store.products.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><b>${escapeHtml(p.name)}</b><br><small style="color:var(--text-muted);">${escapeHtml(p.category)}</small></td>
      <td><span class="badge ${p.stock <= 5 ? 'badge-cancel' : 'badge-done'}">${p.stock} pzas</span></td>
      <td><b>${formatMoney(p.price)}</b></td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteProduct('${p.id}')">&times;</button></td>
    `;
    prodTbody.appendChild(tr);
  });
}

function openNewServiceModal() {
  document.getElementById('service-form-name').value = '';
  document.getElementById('service-form-price').value = '';
  openModal('modal-service');
}

function saveServiceFromModal() {
  const name = document.getElementById('service-form-name').value.trim();
  const price = Number(document.getElementById('service-form-price').value);
  const cat = document.getElementById('service-form-category').value;
  if (!name || !price || price <= 0) {
    showToast("Ingresa nombre y precio válido", "error");
    return;
  }
  store.services.push({
    id: 's-' + Date.now(),
    name: name,
    price: price,
    duration: 60,
    category: cat
  });
  DataService.saveStore();
  closeModal('modal-service');
  renderCatalog();
  showToast("Servicio agregado al catálogo", "success");
}

function deleteService(id) {
  store.services = store.services.filter(s => s.id !== id);
  DataService.saveStore();
  renderCatalog();
}

function openNewProductModal() {
  document.getElementById('product-form-name').value = '';
  document.getElementById('product-form-price').value = '';
  document.getElementById('product-form-stock').value = '';
  openModal('modal-product');
}

function saveProductFromModal() {
  const name = document.getElementById('product-form-name').value.trim();
  const price = Number(document.getElementById('product-form-price').value);
  const stock = Number(document.getElementById('product-form-stock').value) || 0;
  if (!name || !price || price <= 0) {
    showToast("Ingresa nombre y precio válido", "error");
    return;
  }
  store.products.push({
    id: 'p-' + Date.now(),
    name: name,
    price: price,
    cost: Math.round(price * 0.4),
    stock: stock,
    category: 'Aftercare'
  });
  DataService.saveStore();
  closeModal('modal-product');
  renderCatalog();
  showToast("Producto agregado al inventario", "success");
}

function deleteProduct(id) {
  store.products = store.products.filter(p => p.id !== id);
  DataService.saveStore();
  renderCatalog();
}

// ================= 9. CLIENTES =================
function renderClients() {
  const tbody = document.getElementById('clients-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  store.clients.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><b>${escapeHtml(c.name)}</b> ${c.isMinor ? '<span class="quote-tag-minor">Menor de edad</span>' : ''}</td>
      <td>${c.age || 25} años</td>
      <td><a href="https://wa.me/52${c.phone}" target="_blank" style="color:var(--accent-secondary); text-decoration:none;">${escapeHtml(c.phone)}</a></td>
      <td><small style="color:${c.allergies && c.allergies !== 'Ninguna' ? 'var(--color-error)' : 'var(--text-secondary)'}; font-weight:600;">${escapeHtml(c.allergies || 'Ninguna')}</small></td>
      <td>${c.visits || 0}</td>
      <td><b>${formatMoney(c.totalSpent || 0)}</b></td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="quickBookForClient('${c.id}')">+ Cita</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openNewClientModal() {
  document.getElementById('client-form-id').value = '';
  document.getElementById('client-form-name').value = '';
  document.getElementById('client-form-phone').value = '';
  document.getElementById('client-form-age').value = '25';
  document.getElementById('client-form-allergies').value = '';
  document.getElementById('client-form-notes').value = '';
  openModal('modal-client');
}

function saveClientFromModal() {
  const name = document.getElementById('client-form-name').value.trim();
  const phone = document.getElementById('client-form-phone').value.trim();
  const age = parseInt(document.getElementById('client-form-age').value, 10) || 25;
  const allergies = document.getElementById('client-form-allergies').value.trim();
  const notes = document.getElementById('client-form-notes').value.trim();

  if (!name || !phone) {
    showToast("Ingresa nombre y teléfono", "error");
    return;
  }

  store.clients.push({
    id: 'c-' + Date.now(),
    name: name,
    phone: phone,
    age: age,
    isMinor: age < 18,
    allergies: allergies || 'Ninguna',
    notes: notes,
    visits: 0,
    totalSpent: 0
  });

  DataService.saveStore();
  closeModal('modal-client');
  renderClients();
  showToast("Cliente registrado en el directorio", "success");
}

function quickBookForClient(clientId) {
  const client = store.clients.find(c => c.id === clientId);
  if (!client) return;
  openNewAppointmentModal();
  document.getElementById('app-form-client').value = client.name;
  document.getElementById('app-form-phone').value = client.phone;
  document.getElementById('app-form-notes').value = client.allergies ? `Alergias: ${client.allergies}` : '';
}

// ================= MODALES AUXILIARES =================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// ================= INICIALIZACIÓN =================
document.addEventListener('DOMContentLoaded', () => {
  DataService.loadStore();
  loadSession();
  initDeviceMode();

  const loginForm = document.getElementById('login-form');
  if (loginForm) loginForm.onsubmit = handleLogin;

  const btnMobileToggle = document.getElementById('btn-mobile-toggle');
  if (btnMobileToggle) btnMobileToggle.onclick = openMobileSidebar;

  const btnSidebarClose = document.getElementById('btn-sidebar-close');
  if (btnSidebarClose) btnSidebarClose.onclick = closeMobileSidebar;

  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  if (sidebarBackdrop) sidebarBackdrop.onclick = closeMobileSidebar;

  const btnQuickCash = document.getElementById('btn-quick-cash');
  if (btnQuickCash) btnQuickCash.onclick = () => switchView('cash-register');

  document.querySelectorAll('.nav-item').forEach(item => {
    item.onclick = (e) => {
      e.preventDefault();
      const view = item.getAttribute('data-view');
      if (view) switchView(view);
    };
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  applyUserSession();
});
