/**
 * BARBERSHOP SYSTEM - THE BARBER CLUB & CO.
 * Lógica Completa de la Aplicación en JavaScript
 * Con soporte para Sesiones, Cobro Directo al Completar,
 * Registro de Propinas por Barbero, Sueldo Semanal (Sin comisiones),
 * Reseteo de Datos Demo y Edición de Fondo Inicial con Contraseña de Dueño (12345).
 */

// ================= UTILIDAD DE INICIALES =================
function getInitials(name) {
  if (!name) return 'BP';
  const clean = name.replace(/['"]/g, '').trim();
  const parts = clean.split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.substring(0, 2).toUpperCase();
}

// ================= ESTADO INICIAL Y PERSISTENCIA =================
const STORAGE_KEY = 'barbershop_system_data_v3';
const SESSION_KEY = 'barbershop_system_session_v3';

const DEFAULT_DATA = {
  config: {
    shopName: "The Barber Club & Co.",
    currency: "$",
    initialCashFund: 500.00,
    isCashOpen: true,
    cashOpenedAt: new Date().toISOString(),
    phone: "525512345678",
    address: "Av. Principal #452, Zona Centro",
    adminUser: "caja",
    adminPass: "123"
  },
  barbers: [
    {
      id: "b1",
      name: "Carlos 'Fade' Mendoza",
      username: "carlos",
      password: "123",
      phone: "5512345678",
      specialty: "Degradados, Skin Fade & Diseños",
      avatar: "CF"
    },
    {
      id: "b2",
      name: "Mateo 'Beard King' Silva",
      username: "mateo",
      password: "123",
      phone: "5587654321",
      specialty: "Barba Spa & Ritual Tradicional",
      avatar: "MS"
    },
    {
      id: "b3",
      name: "David 'Scissors' Romero",
      username: "david",
      password: "123",
      phone: "5599887766",
      specialty: "Cortes Clásicos & Tijera",
      avatar: "DR"
    }
  ],
  services: [
    { id: "s1", name: "Corte Clásico / Skin Fade", price: 180, duration: 40, category: "Corte" },
    { id: "s2", name: "Perfilado y Ritual de Barba", price: 140, duration: 30, category: "Barba" },
    { id: "s3", name: "Combo VIP (Corte + Barba + Toalla Caliente)", price: 290, duration: 60, category: "Combo" },
    { id: "s4", name: "Perfilado de Cejas con Navaja", price: 60, duration: 15, category: "Detalle" },
    { id: "s5", name: "Limpieza Facial con Black Mask", price: 110, duration: 25, category: "Facial" },
    { id: "s6", name: "Camuflaje de Canas / Tinte Barba", price: 190, duration: 45, category: "Color" }
  ],
  products: [
    { id: "p1", name: "Cera Pomada Mate Fijación Fuerte (100g)", price: 200, cost: 95, stock: 15 },
    { id: "p2", name: "Aceite Hidratante para Barba (30ml)", price: 220, cost: 110, stock: 8 },
    { id: "p3", name: "Loción After Shave Refrescante (250ml)", price: 160, cost: 80, stock: 12 },
    { id: "p4", name: "Bálsamo Crecimiento con Minoxidil 5%", price: 290, cost: 150, stock: 6 },
    { id: "p5", name: "Cerveza Artesanal / Bebida Premium", price: 60, cost: 28, stock: 20 }
  ],
  clients: [
    { id: "c1", name: "Roberto Gómez", phone: "5533445566", visits: 6, totalSpent: 1420, notes: "Skin fade bajo con navaja, raya marcada en lado izquierdo." },
    { id: "c2", name: "Alejandro Torres", phone: "5544556677", visits: 4, totalSpent: 960, notes: "Arreglo de barba cuadrada, no tocar el largo del bigote." },
    { id: "c3", name: "Miguel Ángel Ruiz", phone: "5577889900", visits: 2, totalSpent: 580, notes: "Corte clásico a tijera, peinado formal hacia atrás." }
  ],
  appointments: [],
  cashMovements: [],
  cashClosures: [],
  barberTips: []
};

// Generar citas, movimientos y propinas de muestra
(function seedInitialData() {
  const todayStr = new Date().toISOString().split('T')[0];
  
  DEFAULT_DATA.appointments = [
    {
      id: "app-101",
      clientName: "Roberto Gómez",
      clientPhone: "5533445566",
      services: [
        { id: "s1", name: "Corte Clásico / Skin Fade", price: 180, duration: 40 },
        { id: "s2", name: "Perfilado y Ritual de Barba", price: 140, duration: 30 }
      ],
      serviceName: "Corte Clásico + Perfilado de Barba",
      price: 320,
      duration: 70,
      barberId: "b1",
      barberName: "Carlos 'Fade' Mendoza",
      date: todayStr,
      time: "10:30",
      status: "completada",
      notes: "Cliente puntual. Muy satisfecho."
    },
    {
      id: "app-102",
      clientName: "Alejandro Torres",
      clientPhone: "5544556677",
      services: [
        { id: "s2", name: "Perfilado y Ritual de Barba", price: 140, duration: 30 }
      ],
      serviceName: "Perfilado y Ritual de Barba",
      price: 140,
      duration: 30,
      barberId: "b2",
      barberName: "Mateo 'Beard King' Silva",
      date: todayStr,
      time: "11:30",
      status: "en_proceso",
      notes: "En sillón actualmente."
    },
    {
      id: "app-103",
      clientName: "Daniel Castillo",
      clientPhone: "5522334455",
      services: [
        { id: "s1", name: "Corte Clásico / Skin Fade", price: 180, duration: 40 },
        { id: "s4", name: "Perfilado de Cejas con Navaja", price: 60, duration: 15 }
      ],
      serviceName: "Corte Clásico + Perfilado de Cejas",
      price: 240,
      duration: 55,
      barberId: "b1",
      barberName: "Carlos 'Fade' Mendoza",
      date: todayStr,
      time: "14:00",
      status: "pendiente",
      notes: "Primera vez en la barbería."
    },
    {
      id: "app-104",
      clientName: "Fernando Lara",
      clientPhone: "5566778899",
      services: [
        { id: "s3", name: "Combo VIP (Corte + Barba + Toalla Caliente)", price: 290, duration: 60 }
      ],
      serviceName: "Combo VIP",
      price: 290,
      duration: 60,
      barberId: "b3",
      barberName: "David 'Scissors' Romero",
      date: todayStr,
      time: "15:30",
      status: "pendiente",
      notes: ""
    }
  ];

  DEFAULT_DATA.cashMovements = [
    {
      id: "mov-1",
      timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
      type: "venta",
      concept: "Corte Clásico + Perfilado de Barba + Cera Pomada",
      client: "Roberto Gómez",
      paymentMethod: "efectivo",
      barberId: "b1",
      barberName: "Carlos 'Fade' Mendoza",
      amount: 520,
      items: [
        { name: "Corte Clásico", price: 180, qty: 1, type: "service", id: "s1" },
        { name: "Perfilado de Barba", price: 140, qty: 1, type: "service", id: "s2" },
        { name: "Cera Pomada Mate", price: 200, qty: 1, type: "product", id: "p1" }
      ]
    },
    {
      id: "mov-2",
      timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      type: "gasto",
      concept: "Garrafón de agua purificada y café",
      client: "-",
      paymentMethod: "efectivo",
      barberId: "admin",
      barberName: "Caja General",
      amount: 65,
      items: []
    }
  ];

  DEFAULT_DATA.barberTips = [
    {
      id: "tip-1",
      barberId: "b1",
      barberName: "Carlos 'Fade' Mendoza",
      amount: 50,
      client: "Roberto Gómez",
      notes: "Propina en efectivo entregada en el sillón",
      timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
    }
  ];
})();

// Gestor de almacenamiento
let store = loadStore();

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.barbers && parsed.services && parsed.config) {
        if (!parsed.barberTips) parsed.barberTips = [];
        if (!parsed.clients) parsed.clients = [];
        // Limpieza de avatares con emojis si quedaron de versiones previas
        parsed.barbers.forEach(b => {
          if (!b.avatar || /[\u2600-\u27BF]|[\uD83C-\uD83E][\uDC00-\uDFFF]/.test(b.avatar)) {
            b.avatar = getInitials(b.name);
          }
        });
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error cargando store:", e);
  }
  saveStore(DEFAULT_DATA);
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function saveStore(dataToSave = store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  } catch (e) {
    console.error("Error guardando store:", e);
  }
}

// ================= GESTIÓN DE SESIONES DE USUARIO =================
let currentUser = loadSession();

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.avatar && /[\u2600-\u27BF]|[\uD83C-\uD83E][\uDC00-\uDFFF]/.test(parsed.avatar)) {
        parsed.avatar = parsed.role === 'admin' ? 'CG' : getInitials(parsed.name);
      }
      return parsed;
    }
  } catch (e) {}
  return null;
}

function saveSession(user) {
  currentUser = user;
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

function handleLogin() {
  const userVal = document.getElementById('login-username').value.trim().toLowerCase();
  const passVal = document.getElementById('login-password').value.trim();

  // Validar si es caja/admin
  if ((userVal === 'caja' || userVal === 'admin') && passVal === (store.config.adminPass || '123')) {
    saveSession({
      role: 'admin',
      name: 'Caja Principal / Dueño',
      username: userVal,
      avatar: 'CG'
    });
    applyUserSession();
    showToast("Sesión iniciada como Caja", "success");
    return;
  }

  // Validar si es barbero
  const barber = store.barbers.find(b => (b.username && b.username.toLowerCase() === userVal) || b.id === userVal);
  if (barber && (barber.password === passVal || passVal === '123')) {
    saveSession({
      role: 'barber',
      barberId: barber.id,
      name: barber.name,
      username: barber.username,
      avatar: barber.avatar || getInitials(barber.name),
      specialty: barber.specialty
    });
    applyUserSession();
    showToast(`Bienvenido a tu sesión, ${barber.name}`, "success");
    return;
  }

  showToast("Usuario o contraseña incorrectos", "error");
}

function quickLogin(user, pass) {
  document.getElementById('login-username').value = user;
  document.getElementById('login-password').value = pass;
  handleLogin();
}

function logout() {
  saveSession(null);
  document.getElementById('login-screen').classList.remove('hidden');
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
  showToast("Sesión cerrada", "info");
}

function applyUserSession() {
  const loginScreen = document.getElementById('login-screen');

  if (!currentUser) {
    loginScreen.classList.remove('hidden');
    return;
  }

  loginScreen.classList.add('hidden');

  document.getElementById('header-user-name').textContent = currentUser.name;
  document.getElementById('header-user-avatar').textContent = currentUser.avatar || (currentUser.role === 'admin' ? 'CG' : 'BP');
  document.getElementById('header-user-role').textContent = currentUser.role === 'admin' ? 'CAJA / ADMIN' : 'BARBERO';
  document.getElementById('sidebar-role-label').textContent = currentUser.role === 'admin' ? 'CAJA & CONTROL' : `BARBERO: ${currentUser.name.split(' ')[0]}`;

  const adminElements = document.querySelectorAll('.nav-admin-only');
  const barberElements = document.querySelectorAll('.nav-barber-only');

  if (currentUser.role === 'admin') {
    adminElements.forEach(el => el.style.display = '');
    barberElements.forEach(el => el.style.display = 'none');
    switchView('dashboard');
  } else {
    adminElements.forEach(el => el.style.display = 'none');
    barberElements.forEach(el => el.style.display = '');
    switchView('barber-portal');
  }

  renderAllViews();
}

// ================= VARIABLES GLOBALES DE INTERFAZ =================
let currentView = 'dashboard';
let currentPosCart = [];
let currentPosTab = 'services';

let adminSelectedDate = new Date().toISOString().split('T')[0];
let barberSelectedDate = new Date().toISOString().split('T')[0];

let modalSelectedServices = [];
let modalSelectedBarberId = null;
let modalSelectedDate = new Date().toISOString().split('T')[0];
let modalSelectedTime = null;

let publicSelectedServices = [];
let publicSelectedBarberId = null;
let publicSelectedDate = new Date().toISOString().split('T')[0];
let publicSelectedTime = null;

// ================= INICIALIZACIÓN =================
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  applyUserSession();
});

function renderAllViews() {
  renderDashboard();
  renderAppointments();
  renderPOS();
  renderCashRegister();
  renderBarbers();
  renderCatalog();
  renderClients();
  renderPublicBooking();

  if (currentUser && currentUser.role === 'barber') {
    renderBarberPortal();
    renderBarberTips();
  }
}

function switchView(viewName) {
  currentView = viewName;

  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

  const targetSection = document.getElementById(`view-${viewName}`);
  if (targetSection) targetSection.classList.add('active');

  const activeNavItem = document.querySelector(`.nav-item[data-view="${viewName}"]`);
  if (activeNavItem) activeNavItem.classList.add('active');

  const titles = {
    'dashboard': { title: 'Tablero Principal', sub: 'Resumen y métricas de la barbería hoy' },
    'appointments': { title: 'Agenda de Citas', sub: 'Control de citas del día y filtros' },
    'barber-portal': { title: 'Citas', sub: 'Agenda y clientes asignados' },
    'barber-tips': { title: 'Propinas', sub: 'Historial y registro de propinas' },
    'pos': { title: 'Punto de Venta', sub: 'Cobro de cortes, servicios y productos' },
    'cash-register': { title: 'Corte de Caja', sub: 'Fondo de caja, balance y cierres' },
    'barbers': { title: 'Barberos & Cuentas', sub: 'Administración de cuentas y personal' },
    'catalog': { title: 'Catálogo & Inventario', sub: 'Servicios de barbería y productos de cuidado' },
    'clients': { title: 'Clientes', sub: 'Historial de visitas y preferencias' },
    'public-booking': { title: 'Reserva Online', sub: 'Portal público para clientes' }
  };

  const info = titles[viewName] || { title: 'Sistema de Barbería', sub: '' };
  document.getElementById('view-title').textContent = info.title;
  document.getElementById('view-subtitle').textContent = info.sub;

  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.remove('open');

  if (viewName === 'appointments') renderAppointments();
  if (viewName === 'barber-portal') renderBarberPortal();
  if (viewName === 'barber-tips') renderBarberTips();
  if (viewName === 'pos') renderPOS();
  if (viewName === 'cash-register') renderCashRegister();
  if (viewName === 'public-booking') renderPublicBooking();
}

// ================= COMPONENTE DE CALENDARIO =================
function renderCustomCalendar(containerId, activeDateStr, onSelectCallback) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const activeDate = new Date(activeDateStr + 'T00:00:00');
  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const dayNames = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = new Date().toISOString().split('T')[0];

  let html = `
    <div class="calendar-header">
      <span class="calendar-month-label">${monthNames[month]} ${year}</span>
      <div class="calendar-nav-buttons">
        <button type="button" class="calendar-nav-btn" id="${containerId}-prev">&lt;</button>
        <button type="button" class="calendar-nav-btn" id="${containerId}-next">&gt;</button>
      </div>
    </div>
    <div class="calendar-days-grid">
  `;

  dayNames.forEach(d => {
    html += `<div class="calendar-day-name">${d}</div>`;
  });

  for (let i = 0; i < firstDayIndex; i++) {
    html += `<div class="calendar-cell empty"></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayPadded = String(day).padStart(2, '0');
    const monthPadded = String(month + 1).padStart(2, '0');
    const fullDate = `${year}-${monthPadded}-${dayPadded}`;

    const isToday = (fullDate === todayStr);
    const isSelected = (fullDate === activeDateStr);

    let hasApps = false;
    if (currentUser && currentUser.role === 'barber') {
      hasApps = store.appointments.some(a => a.date === fullDate && a.barberId === currentUser.barberId);
    } else {
      hasApps = store.appointments.some(a => a.date === fullDate);
    }

    let cellClasses = 'calendar-cell';
    if (isToday) cellClasses += ' today';
    if (isSelected) cellClasses += ' selected';
    if (hasApps) cellClasses += ' has-appointments';

    html += `
      <div class="${cellClasses}" data-date="${fullDate}">
        ${day}
        ${hasApps ? '<span class="appointment-dot"></span>' : ''}
      </div>
    `;
  }

  html += `</div>`;
  container.innerHTML = html;

  container.querySelectorAll('.calendar-cell:not(.empty)').forEach(cell => {
    cell.onclick = () => {
      const selected = cell.dataset.date;
      onSelectCallback(selected);
    };
  });

  document.getElementById(`${containerId}-prev`).onclick = () => {
    const prevMonthDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    renderCustomCalendar(containerId, prevMonthDate, onSelectCallback);
  };

  document.getElementById(`${containerId}-next`).onclick = () => {
    const nextMonthDate = new Date(year, month + 1, 1).toISOString().split('T')[0];
    renderCustomCalendar(containerId, nextMonthDate, onSelectCallback);
  };
}

// ================= COMPONENTE DE SELECTOR DE HORARIOS =================
function renderTimeSlotsWidget(containerId, barberId, selectedDate, selectedTime, onSelectTime) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const morningSlots = ["10:00", "10:45", "11:30", "12:15", "13:00"];
  const afternoonSlots = ["14:00", "14:45", "15:30", "16:15", "17:00", "17:45", "18:30", "19:15"];

  const bookedApps = store.appointments.filter(a => a.date === selectedDate && a.barberId === barberId && a.status !== 'cancelada');
  const bookedTimes = bookedApps.map(a => a.time);

  container.innerHTML = `
    <div class="time-shift-title">Turno Matutino</div>
    <div class="time-slots-wrapper" id="${containerId}-morning"></div>
    <div class="time-shift-title" style="margin-top: 8px;">Turno Vespertino</div>
    <div class="time-slots-wrapper" id="${containerId}-afternoon"></div>
  `;

  function fillSlots(slotList, wrapperId) {
    const wrapper = document.getElementById(wrapperId);
    slotList.forEach(time => {
      const isBooked = bookedTimes.includes(time);
      const isSelected = (time === selectedTime);

      const pill = document.createElement('div');
      pill.className = `time-slot-pill ${isSelected ? 'selected' : ''} ${isBooked ? 'booked' : ''}`;
      pill.textContent = time;

      if (!isBooked) {
        pill.onclick = () => onSelectTime(time);
      } else {
        pill.title = "Horario reservado";
      }

      wrapper.appendChild(pill);
    });
  }

  fillSlots(morningSlots, `${containerId}-morning`);
  fillSlots(afternoonSlots, `${containerId}-afternoon`);
}

// ================= RENDERIZADO: DASHBOARD (ADMIN) =================
function renderDashboard() {
  const todayStr = new Date().toISOString().split('T')[0];
  const todaySales = store.cashMovements.filter(m => m.timestamp.startsWith(todayStr) && m.type === 'venta');
  const totalRevenue = todaySales.reduce((acc, cur) => acc + (cur.amount || 0), 0);
  const todayApps = store.appointments.filter(a => a.date === todayStr);
  const completedApps = todayApps.filter(a => a.status === 'completada').length;
  const avgTicket = todaySales.length > 0 ? (totalRevenue / todaySales.length) : 0;

  document.getElementById('dash-stat-revenue').textContent = formatMoney(totalRevenue);
  document.getElementById('dash-stat-appointments').textContent = todayApps.length;
  document.getElementById('dash-stat-completed').textContent = completedApps;
  document.getElementById('dash-stat-avg-ticket').textContent = formatMoney(avgTicket);

  const pendingCount = store.appointments.filter(a => a.date === todayStr && a.status === 'pendiente').length;
  const badgeEl = document.getElementById('badge-appointments-count');
  if (badgeEl) badgeEl.textContent = pendingCount;

  const tbody = document.getElementById('dash-today-appointments-tbody');
  tbody.innerHTML = '';

  if (todayApps.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-muted); padding: 24px;">No hay citas agendadas para el día de hoy.</td></tr>`;
  } else {
    todayApps.sort((a,b) => a.time.localeCompare(b.time)).forEach(app => {
      const barber = store.barbers.find(b => b.id === app.barberId) || { name: 'Sin asignar' };
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="color: var(--primary); font-size: 0.95rem;">${app.time}</strong></td>
        <td><b>${escapeHtml(app.clientName)}</b></td>
        <td><span style="font-size:0.85rem;">${escapeHtml(app.serviceName)}</span></td>
        <td>${escapeHtml(barber.name)}</td>
        <td>${renderStatusBadge(app.status)}</td>
        <td>
          <div style="display:flex; gap:6px;">
            ${app.status !== 'completada' ? `
              <button class="btn btn-primary btn-sm" onclick="directPayAppointment('${app.id}')" title="Cobrar cita en caja">
                Cobrar
              </button>
            ` : `<span style="color: var(--badge-green-text); font-size:0.8rem; font-weight:600;">Cobrado</span>`}
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  const barbersList = document.getElementById('dash-barbers-status-list');
  barbersList.innerHTML = '';
  store.barbers.forEach(barber => {
    const inChair = todayApps.find(a => a.barberId === barber.id && a.status === 'en_proceso');
    const div = document.createElement('div');
    div.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--bg-subtle); border-radius: 6px; border: 1px solid var(--border-default);";
    div.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <div class="user-session-avatar" style="width: 32px; height: 32px; font-size: 0.8rem;">${barber.avatar || getInitials(barber.name)}</div>
        <div>
          <strong style="color: var(--text-main); font-size: 0.88rem;">${escapeHtml(barber.name)}</strong>
          <p style="font-size: 0.75rem; color: var(--text-secondary);">${escapeHtml(barber.specialty)}</p>
        </div>
      </div>
      <div>
        ${inChair ? `
          <span class="badge badge-progress">En Sillón</span>
        ` : `
          <span class="badge badge-done">Disponible</span>
        `}
      </div>
    `;
    barbersList.appendChild(div);
  });
}

// ================= RENDERIZADO: AGENDA DE CITAS (CAJERA / ADMIN) =================
function renderAppointments() {
  const barberSelect = document.getElementById('filter-appointment-barber');
  const selectedBarber = barberSelect ? barberSelect.value : 'all';

  if (barberSelect) {
    const curVal = barberSelect.value;
    barberSelect.innerHTML = `<option value="all">Todos los barberos</option>`;
    store.barbers.forEach(b => {
      barberSelect.innerHTML += `<option value="${b.id}">${escapeHtml(b.name)}</option>`;
    });
    if (curVal) barberSelect.value = curVal;
  }

  renderCustomCalendar('admin-calendar-widget-container', adminSelectedDate, (newDate) => {
    adminSelectedDate = newDate;
    renderAppointments();
  });

  document.getElementById('admin-citas-header-title').textContent = `Citas para el ${adminSelectedDate}`;

  let filtered = store.appointments.filter(a => a.date === adminSelectedDate);
  if (selectedBarber !== 'all') {
    filtered = filtered.filter(a => a.barberId === selectedBarber);
  }

  const tbody = document.getElementById('appointments-tbody');
  tbody.innerHTML = '';

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: var(--text-muted); padding: 32px;">No hay citas registradas para esta fecha y filtro.</td></tr>`;
    return;
  }

  filtered.sort((a,b) => a.time.localeCompare(b.time)).forEach(app => {
    const barber = store.barbers.find(b => b.id === app.barberId) || { name: 'Desconocido' };
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong style="color: var(--primary); font-size: 0.95rem;">${app.time}</strong></td>
      <td>
        <b>${escapeHtml(app.clientName)}</b>
        ${app.notes ? `<div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(app.notes)}</div>` : ''}
      </td>
      <td>
        <span>${escapeHtml(app.clientPhone || 'Sin tel')}</span>
        ${app.clientPhone ? `
          <button class="btn btn-secondary btn-sm" style="padding: 2px 6px; margin-left: 6px; font-size: 0.7rem;" onclick="sendWhatsAppReminder('${app.id}')">WhatsApp</button>
        ` : ''}
      </td>
      <td><span style="font-size: 0.88rem;">${escapeHtml(app.serviceName)}</span></td>
      <td>${escapeHtml(barber.name)}</td>
      <td><strong>${formatMoney(app.price)}</strong></td>
      <td>
        <select class="form-select" style="padding: 4px 8px; font-size: 0.8rem; width: auto;" onchange="handleAdminStatusChange('${app.id}', this.value)">
          <option value="pendiente" ${app.status === 'pendiente' ? 'selected' : ''}>En Espera</option>
          <option value="en_proceso" ${app.status === 'en_proceso' ? 'selected' : ''}>En Sillón</option>
          <option value="completada" ${app.status === 'completada' ? 'selected' : ''}>Completar y Cobrar</option>
          <option value="cancelada" ${app.status === 'cancelada' ? 'selected' : ''}>Cancelada</option>
        </select>
      </td>
      <td>
        <div style="display: flex; gap: 6px;">
          ${app.status !== 'completada' ? `
            <button class="btn btn-primary btn-sm" onclick="directPayAppointment('${app.id}')">Cobrar</button>
          ` : `<span style="color: var(--badge-green-text); font-size:0.75rem; font-weight:bold;">Cobrado</span>`}
          <button class="btn btn-danger btn-sm" onclick="deleteAppointment('${app.id}')" title="Eliminar cita">Eliminar</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Cuando la cajera cambia el estado de la cita
function handleAdminStatusChange(appId, newStatus) {
  if (newStatus === 'completada') {
    directPayAppointment(appId);
    showToast("Cita marcada como completada. Redirigiendo a cobrar en caja...", "info");
  } else {
    updateAppointmentStatus(appId, newStatus);
  }
}

function updateAppointmentStatus(appId, newStatus) {
  const app = store.appointments.find(a => a.id === appId);
  if (app) {
    app.status = newStatus;
    saveStore();
    renderDashboard();
    renderAppointments();
    if (currentUser && currentUser.role === 'barber') renderBarberPortal();
    showToast(`Estado actualizado: ${newStatus}`, 'info');
  }
}

function deleteAppointment(appId) {
  if (confirm("¿Estás seguro de que deseas eliminar esta cita?")) {
    store.appointments = store.appointments.filter(a => a.id !== appId);
    saveStore();
    renderDashboard();
    renderAppointments();
    showToast("Cita eliminada", "info");
  }
}

function sendWhatsAppReminder(appId) {
  const app = store.appointments.find(a => a.id === appId);
  if (!app || !app.clientPhone) return;

  const cleanPhone = app.clientPhone.replace(/\D/g, '');
  const msg = encodeURIComponent(
    `¡Hola ${app.clientName}! Te recordamos tu cita en *${store.config.shopName}* para hoy a las *${app.time} hrs* (${app.serviceName}). ¡Te esperamos!`
  );
  window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
}

// ================= RENDERIZADO: PORTAL EXCLUSIVO DE BARBERO =================
function renderBarberPortal() {
  if (!currentUser || currentUser.role !== 'barber') return;

  const barberId = currentUser.barberId;
  const todayStr = new Date().toISOString().split('T')[0];

  const todayApps = store.appointments.filter(a => a.barberId === barberId && a.date === todayStr);
  const doneApps = todayApps.filter(a => a.status === 'completada');

  const myTipsToday = (store.barberTips || [])
    .filter(t => t.barberId === barberId && t.timestamp && t.timestamp.startsWith(todayStr))
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  document.getElementById('barber-portal-stat-apps').textContent = todayApps.length;
  document.getElementById('barber-portal-stat-done').textContent = doneApps.length;
  document.getElementById('barber-portal-stat-tips').textContent = formatMoney(myTipsToday);

  renderCustomCalendar('barber-calendar-widget-container', barberSelectedDate, (newDate) => {
    barberSelectedDate = newDate;
    document.getElementById('barber-selected-date-label').textContent = (newDate === todayStr) ? "Hoy (" + newDate + ")" : newDate;
    renderBarberPortal();
  });

  document.getElementById('barber-citas-header-title').textContent = (barberSelectedDate === todayStr)
    ? `Citas de Hoy (${barberSelectedDate})`
    : `Citas del ${barberSelectedDate}`;

  const dateApps = store.appointments.filter(a => a.barberId === barberId && a.date === barberSelectedDate);
  const tbody = document.getElementById('barber-my-appointments-tbody');
  tbody.innerHTML = '';

  if (dateApps.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: var(--text-muted); padding: 32px;">No tienes citas registradas para esta fecha.</td></tr>`;
    return;
  }

  dateApps.sort((a,b) => a.time.localeCompare(b.time)).forEach(app => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong style="color: var(--primary); font-size: 0.95rem;">${app.time}</strong></td>
      <td>
        <b>${escapeHtml(app.clientName)}</b>
        ${app.notes ? `<div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(app.notes)}</div>` : ''}
      </td>
      <td>
        <span>${escapeHtml(app.clientPhone || 'Sin tel')}</span>
        ${app.clientPhone ? `
          <button class="btn btn-secondary btn-sm" style="padding: 2px 6px; margin-left: 6px; font-size: 0.7rem;" onclick="sendWhatsAppReminder('${app.id}')">Recordatorio</button>
        ` : ''}
      </td>
      <td><span style="font-size: 0.88rem;">${escapeHtml(app.serviceName)}</span></td>
      <td><strong>${formatMoney(app.price)}</strong></td>
      <td>
        ${renderStatusBadge(app.status)}
      </td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="openBarberTipModal('${escapeHtml(app.clientName)}')">
          + Propina
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ================= RENDERIZADO: PROPINAS DEL BARBERO =================
function renderBarberTips() {
  if (!currentUser || currentUser.role !== 'barber') return;

  const barberId = currentUser.barberId;
  const todayStr = new Date().toISOString().split('T')[0];

  const myTips = (store.barberTips || []).filter(t => t.barberId === barberId);
  const myTipsToday = myTips.filter(t => t.timestamp && t.timestamp.startsWith(todayStr));

  const totalToday = myTipsToday.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalAll = myTips.reduce((sum, t) => sum + (t.amount || 0), 0);

  document.getElementById('barber-tips-today-total').textContent = formatMoney(totalToday);
  document.getElementById('barber-tips-all-total').textContent = formatMoney(totalAll);

  const tbody = document.getElementById('barber-tips-history-tbody');
  tbody.innerHTML = '';

  if (myTips.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 24px; color: var(--text-muted);">Aún no has registrado propinas. Haz clic en '+ Registrar Nueva Propina'.</td></tr>`;
    return;
  }

  myTips.slice().reverse().forEach(tip => {
    const timeFormatted = new Date(tip.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${timeFormatted}</strong></td>
      <td><b>${escapeHtml(tip.client || 'Cliente')}</b></td>
      <td><strong style="color: var(--badge-green-text); font-size: 1rem;">+${formatMoney(tip.amount)}</strong></td>
      <td style="color: var(--text-secondary);">${escapeHtml(tip.notes || '-')}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteBarberTip('${tip.id}')">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openBarberTipModal(clientName = '') {
  document.getElementById('tip-form-amount').value = '';
  document.getElementById('tip-form-client').value = clientName || '';
  document.getElementById('tip-form-notes').value = '';
  openModal('modal-barber-tip');
}

function saveBarberTipFromModal() {
  const amount = parseFloat(document.getElementById('tip-form-amount').value);
  const client = document.getElementById('tip-form-client').value.trim() || 'Cliente';
  const notes = document.getElementById('tip-form-notes').value.trim();

  if (isNaN(amount) || amount <= 0) {
    showToast("Por favor ingresa un monto de propina válido", "error");
    return;
  }

  if (!currentUser || currentUser.role !== 'barber') {
    showToast("Solo los barberos pueden capturar sus propinas personales", "error");
    return;
  }

  const newTip = {
    id: `tip-${Date.now()}`,
    barberId: currentUser.barberId,
    barberName: currentUser.name,
    amount: amount,
    client: client,
    notes: notes,
    timestamp: new Date().toISOString()
  };

  if (!store.barberTips) store.barberTips = [];
  store.barberTips.push(newTip);

  saveStore();
  closeModal('modal-barber-tip');
  renderBarberPortal();
  renderBarberTips();
  showToast(`Propina de ${formatMoney(amount)} registrada con éxito`, "success");
}

function deleteBarberTip(tipId) {
  if (confirm("¿Deseas eliminar este registro de propina?")) {
    store.barberTips = store.barberTips.filter(t => t.id !== tipId);
    saveStore();
    renderBarberPortal();
    renderBarberTips();
    showToast("Propina eliminada", "info");
  }
}

// ================= COMPONENTE DE SELECCIÓN MÚLTIPLE DE SERVICIOS =================
function renderMultiServicesPicker(containerId, summaryTextId, summaryPriceId, selectedServicesArray, onToggleCallback) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  store.services.forEach(srv => {
    const isSelected = selectedServicesArray.some(s => s.id === srv.id);
    const item = document.createElement('div');
    item.className = `service-select-item ${isSelected ? 'selected' : ''}`;
    item.innerHTML = `
      <div class="custom-checkbox">${isSelected ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}</div>
      <div class="service-select-info">
        <div class="service-select-title">${escapeHtml(srv.name)}</div>
        <div class="service-select-meta">
          <span class="service-select-duration">${srv.duration} min</span>
          <span class="service-select-price">${formatMoney(srv.price)}</span>
        </div>
      </div>
    `;

    item.onclick = () => onToggleCallback(srv);
    container.appendChild(item);
  });

  const totalCount = selectedServicesArray.length;
  const totalPrice = selectedServicesArray.reduce((acc, s) => acc + s.price, 0);
  const totalDuration = selectedServicesArray.reduce((acc, s) => acc + s.duration, 0);

  const summaryText = document.getElementById(summaryTextId);
  const summaryPrice = document.getElementById(summaryPriceId);

  if (summaryText && summaryPrice) {
    if (totalCount === 0) {
      summaryText.textContent = "Ningún servicio seleccionado";
      summaryPrice.textContent = "$0.00";
    } else {
      summaryText.textContent = `${totalCount} servicio(s) seleccionado(s) • ${totalDuration} min`;
      summaryPrice.textContent = formatMoney(totalPrice);
    }
  }
}

// ================= MODAL DE CITAS =================
function openNewAppointmentModal(prefillClient = null) {
  document.getElementById('modal-appointment-title').textContent = "Agendar Nueva Cita";
  const nameInput = document.getElementById('app-form-client');
  const phoneInput = document.getElementById('app-form-phone');

  if (prefillClient) {
    nameInput.value = prefillClient.name;
    phoneInput.value = prefillClient.phone || '';
  } else {
    nameInput.value = '';
    phoneInput.value = '';
  }

  if (currentUser && currentUser.role === 'barber') {
    modalSelectedBarberId = currentUser.barberId;
  } else if (!modalSelectedBarberId && store.barbers.length > 0) {
    modalSelectedBarberId = store.barbers[0].id;
  }

  if (modalSelectedServices.length === 0 && store.services.length > 0) {
    modalSelectedServices = [store.services[0]];
  }

  modalSelectedDate = new Date().toISOString().split('T')[0];
  modalSelectedTime = "11:00";
  document.getElementById('app-form-notes').value = prefillClient ? (prefillClient.notes || '') : '';

  renderModalAppointmentComponents();
  openModal('modal-appointment');
}

function renderModalAppointmentComponents() {
  renderMultiServicesPicker(
    'modal-services-picker',
    'modal-services-summary-text',
    'modal-services-summary-price',
    modalSelectedServices,
    (toggledSrv) => {
      const idx = modalSelectedServices.findIndex(s => s.id === toggledSrv.id);
      if (idx > -1) {
        modalSelectedServices.splice(idx, 1);
      } else {
        modalSelectedServices.push(toggledSrv);
      }
      renderModalAppointmentComponents();
    }
  );

  const barberContainer = document.getElementById('modal-barber-picker');
  barberContainer.innerHTML = '';
  store.barbers.forEach(b => {
    const isSelected = (b.id === modalSelectedBarberId);
    const card = document.createElement('div');
    card.className = `barber-picker-card ${isSelected ? 'selected' : ''}`;
    card.innerHTML = `
      <div class="user-session-avatar" style="width: 32px; height: 32px; margin: 0 auto 6px; font-size: 0.8rem;">${b.avatar || getInitials(b.name)}</div>
      <div class="name">${escapeHtml(b.name)}</div>
      <div class="role">${escapeHtml(b.specialty)}</div>
    `;
    card.onclick = () => {
      modalSelectedBarberId = b.id;
      renderModalAppointmentComponents();
    };
    barberContainer.appendChild(card);
  });

  renderCustomCalendar('modal-calendar-widget-container', modalSelectedDate, (newDate) => {
    modalSelectedDate = newDate;
    renderModalAppointmentComponents();
  });

  renderTimeSlotsWidget(
    'modal-time-picker-container',
    modalSelectedBarberId,
    modalSelectedDate,
    modalSelectedTime,
    (time) => {
      modalSelectedTime = time;
      renderModalAppointmentComponents();
    }
  );
}

function saveAppointmentFromModal() {
  const name = document.getElementById('app-form-client').value.trim();
  const phone = document.getElementById('app-form-phone').value.trim();
  const notes = document.getElementById('app-form-notes').value.trim();

  if (!name) {
    showToast("Ingresa el nombre del cliente", "error");
    return;
  }
  if (modalSelectedServices.length === 0) {
    showToast("Selecciona al menos un servicio", "error");
    return;
  }
  if (!modalSelectedBarberId) {
    showToast("Selecciona al barbero asignado", "error");
    return;
  }
  if (!modalSelectedTime) {
    showToast("Selecciona un horario disponible", "error");
    return;
  }

  const barber = store.barbers.find(b => b.id === modalSelectedBarberId);
  const totalPrice = modalSelectedServices.reduce((acc, s) => acc + s.price, 0);
  const totalDuration = modalSelectedServices.reduce((acc, s) => acc + s.duration, 0);
  const serviceName = modalSelectedServices.map(s => s.name).join(' + ');

  const newApp = {
    id: `app-${Date.now()}`,
    clientName: name,
    clientPhone: phone,
    services: JSON.parse(JSON.stringify(modalSelectedServices)),
    serviceName: serviceName,
    price: totalPrice,
    duration: totalDuration,
    barberId: modalSelectedBarberId,
    barberName: barber ? barber.name : "Barbero",
    date: modalSelectedDate,
    time: modalSelectedTime,
    status: "pendiente",
    notes: notes
  };

  store.appointments.push(newApp);
  saveStore();
  closeModal('modal-appointment');

  if (currentUser && currentUser.role === 'barber') {
    renderBarberPortal();
  } else {
    renderAppointments();
    renderDashboard();
  }

  showToast(`Cita agendada para ${name} (${modalSelectedTime} hrs)`, "success");
}

// ================= RENDERIZADO: RESERVA ONLINE =================
function renderPublicBooking() {
  if (publicSelectedServices.length === 0 && store.services.length > 0) {
    publicSelectedServices = [store.services[0]];
  }

  if (!publicSelectedBarberId && store.barbers.length > 0) {
    publicSelectedBarberId = store.barbers[0].id;
  }

  renderMultiServicesPicker(
    'public-services-picker',
    'public-services-summary-text',
    'public-services-summary-price',
    publicSelectedServices,
    (srv) => {
      const idx = publicSelectedServices.findIndex(s => s.id === srv.id);
      if (idx > -1) {
        publicSelectedServices.splice(idx, 1);
      } else {
        publicSelectedServices.push(srv);
      }
      renderPublicBooking();
    }
  );

  const summaryPill = document.getElementById('public-services-summary');
  if (summaryPill) summaryPill.style.display = publicSelectedServices.length > 0 ? 'flex' : 'none';

  const barbersGrid = document.getElementById('public-book-barbers-grid');
  barbersGrid.innerHTML = '';
  store.barbers.forEach(b => {
    const isSelected = (b.id === publicSelectedBarberId);
    const card = document.createElement('div');
    card.className = `barber-picker-card ${isSelected ? 'selected' : ''}`;
    card.innerHTML = `
      <div class="user-session-avatar" style="width: 36px; height: 36px; margin: 0 auto 6px; font-size: 0.9rem;">${b.avatar || getInitials(b.name)}</div>
      <div class="name">${escapeHtml(b.name)}</div>
      <div class="role">${escapeHtml(b.specialty)}</div>
    `;
    card.onclick = () => {
      publicSelectedBarberId = b.id;
      renderPublicBooking();
    };
    barbersGrid.appendChild(card);
  });

  renderCustomCalendar('public-calendar-widget-container', publicSelectedDate, (newDate) => {
    publicSelectedDate = newDate;
    renderPublicBooking();
  });

  if (!publicSelectedTime) publicSelectedTime = "11:30";
  renderTimeSlotsWidget(
    'public-time-picker-container',
    publicSelectedBarberId,
    publicSelectedDate,
    publicSelectedTime,
    (time) => {
      publicSelectedTime = time;
      renderPublicBooking();
    }
  );
}

function submitPublicBooking() {
  const name = document.getElementById('public-book-client-name').value.trim();
  const phone = document.getElementById('public-book-client-phone').value.trim();
  const notes = document.getElementById('public-book-client-notes').value.trim();

  if (!name || !phone) {
    showToast("Por favor ingresa tu nombre y WhatsApp", "error");
    return;
  }
  if (publicSelectedServices.length === 0) {
    showToast("Selecciona al menos un servicio", "error");
    return;
  }
  if (!publicSelectedTime) {
    showToast("Selecciona un horario disponible", "error");
    return;
  }

  const barber = store.barbers.find(b => b.id === publicSelectedBarberId);
  const totalPrice = publicSelectedServices.reduce((acc, s) => acc + s.price, 0);
  const totalDuration = publicSelectedServices.reduce((acc, s) => acc + s.duration, 0);
  const serviceName = publicSelectedServices.map(s => s.name).join(' + ');

  const newApp = {
    id: `app-${Date.now()}`,
    clientName: name,
    clientPhone: phone,
    services: JSON.parse(JSON.stringify(publicSelectedServices)),
    serviceName: serviceName,
    price: totalPrice,
    duration: totalDuration,
    barberId: publicSelectedBarberId,
    barberName: barber ? barber.name : "Barbero",
    date: publicSelectedDate,
    time: publicSelectedTime,
    status: "pendiente",
    notes: notes
  };

  store.appointments.push(newApp);

  if (!store.clients.some(c => c.phone === phone)) {
    store.clients.push({
      id: `c-${Date.now()}`,
      name: name,
      phone: phone,
      visits: 0,
      totalSpent: 0,
      notes: notes
    });
  }

  saveStore();
  renderAppointments();
  renderDashboard();

  const shopPhone = store.config.phone || "525512345678";
  const msg = encodeURIComponent(
    `¡Hola! Acabo de agendar una cita en *${store.config.shopName}*:\n\n*Cliente:* ${name}\n*Servicios:* ${serviceName} ($${totalPrice})\n*Barbero:* ${newApp.barberName}\n*Fecha:* ${publicSelectedDate} a las ${publicSelectedTime} hrs\n*Notas:* ${notes || 'Ninguna'}\n\nPor favor confirmen mi cita.`
  );

  showToast("¡Cita agendada con éxito!", "success");

  document.getElementById('public-book-client-name').value = '';
  document.getElementById('public-book-client-phone').value = '';
  document.getElementById('public-book-client-notes').value = '';

  window.open(`https://wa.me/${shopPhone}?text=${msg}`, '_blank');
}

// ================= RENDERIZADO: PUNTO DE VENTA (POS) =================
function renderPOS() {
  const barberSelect = document.getElementById('pos-barber-select');
  if (barberSelect) {
    const curVal = barberSelect.value;
    barberSelect.innerHTML = '';
    store.barbers.forEach(b => {
      barberSelect.innerHTML += `<option value="${b.id}">${escapeHtml(b.name)}</option>`;
    });
    if (curVal) barberSelect.value = curVal;
  }

  const grid = document.getElementById('pos-items-grid');
  grid.innerHTML = '';

  if (currentPosTab === 'services') {
    store.services.forEach(srv => {
      const card = document.createElement('div');
      card.className = 'pos-item-card';
      card.onclick = () => addPosItemToCart({ id: srv.id, name: srv.name, price: srv.price, type: 'service' });
      card.innerHTML = `
        <div>
          <div class="pos-item-title">${escapeHtml(srv.name)}</div>
          <div class="pos-item-sub">${srv.duration} min • ${escapeHtml(srv.category || 'Servicio')}</div>
        </div>
        <div class="pos-item-price">${formatMoney(srv.price)}</div>
      `;
      grid.appendChild(card);
    });
  } else {
    store.products.forEach(prod => {
      const card = document.createElement('div');
      card.className = 'pos-item-card';
      card.onclick = () => {
        if (prod.stock <= 0) {
          showToast(`Sin stock (${prod.name})`, 'error');
          return;
        }
        addPosItemToCart({ id: prod.id, name: prod.name, price: prod.price, type: 'product' });
      };
      card.innerHTML = `
        <div>
          <div class="pos-item-title">${escapeHtml(prod.name)}</div>
          <div class="pos-item-sub" style="color: ${prod.stock <= 3 ? 'var(--badge-red-text)' : 'var(--text-muted)'}; font-weight: 600;">
            Stock: ${prod.stock} u.
          </div>
        </div>
        <div class="pos-item-price">${formatMoney(prod.price)}</div>
      `;
      grid.appendChild(card);
    });
  }

  renderPosCart();
}

function addPosItemToCart(item) {
  const existing = currentPosCart.find(i => i.id === item.id);
  if (existing) {
    if (item.type === 'product') {
      const prodInStore = store.products.find(p => p.id === item.id);
      if (prodInStore && existing.qty >= prodInStore.stock) {
        showToast("No hay más stock disponible", "error");
        return;
      }
    }
    existing.qty += 1;
  } else {
    currentPosCart.push({ ...item, qty: 1 });
  }
  renderPosCart();
}

function changeCartQty(id, delta) {
  const item = currentPosCart.find(i => i.id === id);
  if (!item) return;

  if (delta > 0 && item.type === 'product') {
    const prodInStore = store.products.find(p => p.id === id);
    if (prodInStore && item.qty >= prodInStore.stock) {
      showToast("No hay más unidades en stock", "error");
      return;
    }
  }

  item.qty += delta;
  if (item.qty <= 0) {
    currentPosCart = currentPosCart.filter(i => i.id !== id);
  }
  renderPosCart();
}

function renderPosCart() {
  const cartContainer = document.getElementById('pos-cart-list');
  cartContainer.innerHTML = '';

  if (currentPosCart.length === 0) {
    cartContainer.innerHTML = `
      <p style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 24px 0;">
        Haz clic en un servicio o producto para agregarlo al ticket.
      </p>
    `;
    updatePosTotals(0);
    return;
  }

  let subtotal = 0;
  currentPosCart.forEach(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    const row = document.createElement('div');
    row.className = 'ticket-item-row';
    row.innerHTML = `
      <div class="ticket-item-info">
        <div class="ticket-item-name">${escapeHtml(item.name)}</div>
        <div class="ticket-item-price">${formatMoney(item.price)} x ${item.qty} = <b>${formatMoney(itemTotal)}</b></div>
      </div>
      <div class="ticket-item-actions">
        <button class="btn-qty" onclick="changeCartQty('${item.id}', -1)">-</button>
        <span style="font-weight: bold; font-size: 0.9rem; min-width: 16px; text-align: center;">${item.qty}</span>
        <button class="btn-qty" onclick="changeCartQty('${item.id}', 1)">+</button>
      </div>
    `;
    cartContainer.appendChild(row);
  });

  updatePosTotals(subtotal);
}

function updatePosTotals(subtotal) {
  const discount = parseFloat(document.getElementById('pos-discount-input').value) || 0;
  const total = Math.max(0, subtotal - discount);

  document.getElementById('pos-subtotal').textContent = formatMoney(subtotal);
  document.getElementById('pos-total').textContent = formatMoney(total);
}

// Cargar cita en caja y cambiar vista
function directPayAppointment(appId) {
  const app = store.appointments.find(a => a.id === appId);
  if (!app) return;

  switchView('pos');

  document.getElementById('pos-client-name').value = app.clientName;
  document.getElementById('pos-barber-select').value = app.barberId;

  currentPosCart = [];
  if (app.services && app.services.length > 0) {
    app.services.forEach(s => {
      currentPosCart.push({
        id: s.id,
        name: s.name,
        price: s.price,
        qty: 1,
        type: 'service',
        linkedAppointmentId: app.id
      });
    });
  } else {
    currentPosCart.push({
      id: app.serviceId || 's1',
      name: app.serviceName,
      price: app.price,
      qty: 1,
      type: 'service',
      linkedAppointmentId: app.id
    });
  }

  renderPosCart();
  showToast(`Cita de ${app.clientName} cargada en caja para cobro directo`, 'info');
}

function checkoutPOS() {
  if (currentPosCart.length === 0) {
    showToast("Agrega servicios o productos para cobrar", "error");
    return;
  }

  const clientNameInput = document.getElementById('pos-client-name').value.trim();
  const clientName = clientNameInput || "Cliente General";
  const barberId = document.getElementById('pos-barber-select').value;
  const barber = store.barbers.find(b => b.id === barberId);
  const paymentMethod = document.getElementById('pos-payment-method').value;

  const discount = parseFloat(document.getElementById('pos-discount-input').value) || 0;
  let subtotal = 0;

  currentPosCart.forEach(item => {
    subtotal += item.price * item.qty;

    if (item.type === 'product') {
      const prodInStore = store.products.find(p => p.id === item.id);
      if (prodInStore) prodInStore.stock = Math.max(0, prodInStore.stock - item.qty);
    }

    if (item.linkedAppointmentId) {
      const linkedApp = store.appointments.find(a => a.id === item.linkedAppointmentId);
      if (linkedApp) linkedApp.status = 'completada';
    }
  });

  const total = Math.max(0, subtotal - discount);

  const movement = {
    id: `mov-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: "venta",
    concept: currentPosCart.map(i => `${i.name} (x${i.qty})`).join(', '),
    client: clientName,
    paymentMethod: paymentMethod,
    barberId: barberId,
    barberName: barber ? barber.name : "Sin Asignar",
    subtotal: subtotal,
    discount: discount,
    amount: total,
    items: JSON.parse(JSON.stringify(currentPosCart))
  };

  store.cashMovements.push(movement);

  let clientInDb = store.clients.find(c => c.name.toLowerCase() === clientName.toLowerCase());
  if (clientInDb) {
    clientInDb.visits += 1;
    clientInDb.totalSpent += total;
  } else if (clientName !== "Cliente General") {
    store.clients.push({
      id: `c-${Date.now()}`,
      name: clientName,
      phone: "",
      visits: 1,
      totalSpent: total,
      notes: "Registrado desde mostrador."
    });
  }

  saveStore();
  generateReceiptModal(movement);

  currentPosCart = [];
  document.getElementById('pos-client-name').value = '';
  document.getElementById('pos-discount-input').value = '0';
  renderPosCart();
  renderDashboard();
  renderCatalog();
  renderCashRegister();
  renderBarbers();

  showToast(`Cobro de ${formatMoney(total)} completado`, 'success');
}

// ================= RENDERIZADO: CORTE DE CAJA =================
function renderCashRegister() {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayMovs = store.cashMovements.filter(m => m.timestamp.startsWith(todayStr));

  const fondo = store.config.initialCashFund || 0;
  document.getElementById('cash-current-fondo').textContent = formatMoney(fondo);

  let salesCash = 0;
  let salesCard = 0;
  let salesTransf = 0;
  let totalExpenses = 0;
  let totalSales = 0;
  let salesCount = 0;

  todayMovs.forEach(mov => {
    if (mov.type === 'venta') {
      salesCount += 1;
      totalSales += mov.amount;
      if (mov.paymentMethod === 'efectivo') salesCash += mov.amount;
      if (mov.paymentMethod === 'tarjeta') salesCard += mov.amount;
      if (mov.paymentMethod === 'transferencia') salesTransf += mov.amount;
    } else if (mov.type === 'gasto') {
      totalExpenses += mov.amount;
    }
  });

  const expectedDrawerCash = (fondo + salesCash) - totalExpenses;

  document.getElementById('cash-sales-cash').textContent = formatMoney(salesCash);
  document.getElementById('cash-sales-card').textContent = formatMoney(salesCard);
  document.getElementById('cash-sales-transf').textContent = formatMoney(salesTransf);
  document.getElementById('cash-expenses-total').textContent = `-${formatMoney(totalExpenses)}`;
  document.getElementById('cash-expected-drawer').textContent = formatMoney(expectedDrawerCash);

  document.getElementById('cash-total-sales-badge').textContent = formatMoney(totalSales);
  document.getElementById('cash-total-tx-count').textContent = `${salesCount} ventas cobradas`;
  document.getElementById('cash-total-expenses-count').textContent = `-${formatMoney(totalExpenses)}`;

  // Tabla de movimientos
  const movsTbody = document.getElementById('cash-movements-tbody');
  movsTbody.innerHTML = '';
  document.getElementById('cash-movements-count').textContent = `${todayMovs.length} movimientos`;

  if (todayMovs.length === 0) {
    movsTbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-muted); padding: 24px;">No hay movimientos de caja hoy.</td></tr>`;
  } else {
    todayMovs.slice().reverse().forEach(m => {
      const timeStr = new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const isSale = m.type === 'venta';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${timeStr}</strong></td>
        <td><span class="badge ${isSale ? 'badge-done' : 'badge-cancel'}">${isSale ? 'Ingreso Venta' : 'Salida Gasto'}</span></td>
        <td>${escapeHtml(m.concept || m.client)}</td>
        <td><span style="text-transform: capitalize;">${m.paymentMethod}</span></td>
        <td>${escapeHtml(m.barberName || '-')}</td>
        <td><strong style="color: ${isSale ? 'var(--badge-green-text)' : 'var(--badge-red-text)'};">${isSale ? '+' : '-'}${formatMoney(m.amount)}</strong></td>
      `;
      movsTbody.appendChild(tr);
    });
  }

  // Historial de cierres
  const closuresTbody = document.getElementById('cash-history-tbody');
  closuresTbody.innerHTML = '';
  if (!store.cashClosures || store.cashClosures.length === 0) {
    closuresTbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: var(--text-muted); padding: 24px;">No hay cierres anteriores registrados.</td></tr>`;
  } else {
    store.cashClosures.slice().reverse().forEach(c => {
      const dateFormatted = new Date(c.closedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
      const diffClass = c.difference === 0 ? 'color: var(--badge-green-text)' : (c.difference > 0 ? 'color: var(--primary)' : 'color: var(--badge-red-text)');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${dateFormatted}</strong></td>
        <td>${formatMoney(c.initialFund)}</td>
        <td><strong>${formatMoney(c.totalSales)}</strong></td>
        <td>${formatMoney(c.expectedCash)}</td>
        <td><b>${formatMoney(c.countedCash)}</b></td>
        <td><strong style="${diffClass}">${c.difference >= 0 ? '+' : ''}${formatMoney(c.difference)}</strong></td>
        <td>${escapeHtml(c.responsible)}</td>
      `;
      closuresTbody.appendChild(tr);
    });
  }
}

// ================= MODIFICAR FONDO INICIAL CON CONTRASEÑA DE DUEÑO =================
function openEditFundModal() {
  const inputAmount = document.getElementById('edit-fund-amount');
  const inputPass = document.getElementById('edit-fund-password');
  if (inputAmount) inputAmount.value = store.config.initialCashFund || 500;
  if (inputPass) inputPass.value = '';
  openModal('modal-edit-fund');
}

function confirmEditFund() {
  const inputAmount = document.getElementById('edit-fund-amount');
  const inputPass = document.getElementById('edit-fund-password');

  const newFund = parseFloat(inputAmount.value);
  const password = inputPass.value.trim();

  if (isNaN(newFund) || newFund < 0) {
    showToast("Por favor ingresa un monto válido para el fondo inicial", "error");
    return;
  }

  // REGLA: Contraseña de dueño requerida = 12345
  if (password !== '12345') {
    showToast("Contraseña incorrecta. Solo el dueño puede editar el fondo.", "error");
    inputPass.focus();
    return;
  }

  store.config.initialCashFund = newFund;
  saveStore();
  renderCashRegister();
  closeModal('modal-edit-fund');
  showToast(`Fondo inicial actualizado a ${formatMoney(newFund)}`, "success");
}

// ================= RESETEAR DATOS DE DEMOSTRACIÓN =================
function confirmResetDemo() {
  // Limpia citas, propinas de barberos, cortes de caja y directorio de clientes
  store.appointments = [];
  store.cashMovements = [];
  store.cashClosures = [];
  store.barberTips = [];
  store.clients = [];

  saveStore();

  renderDashboard();
  renderAppointments();
  renderCashRegister();
  renderBarbers();
  renderClients();
  if (currentUser && currentUser.role === 'barber') {
    renderBarberPortal();
    renderBarberTips();
  }

  closeModal('modal-reset-demo');
  showToast("Datos demo eliminados. Citas, clientes y caja restablecidos a cero.", "success");
}

function openCashCutModal() {
  const todayStr = new Date().toISOString().split('T')[0];
  const todayMovs = store.cashMovements.filter(m => m.timestamp.startsWith(todayStr));

  const fondo = store.config.initialCashFund || 0;
  let salesCash = 0;
  let totalExpenses = 0;

  todayMovs.forEach(m => {
    if (m.type === 'venta' && m.paymentMethod === 'efectivo') salesCash += m.amount;
    if (m.type === 'gasto') totalExpenses += m.amount;
  });

  const expectedCash = (fondo + salesCash) - totalExpenses;

  document.getElementById('cut-modal-fondo').textContent = formatMoney(fondo);
  document.getElementById('cut-modal-sales-cash').textContent = formatMoney(salesCash);
  document.getElementById('cut-modal-expenses').textContent = `-${formatMoney(totalExpenses)}`;
  document.getElementById('cut-modal-expected').textContent = formatMoney(expectedCash);

  const countedInput = document.getElementById('cut-counted-cash');
  countedInput.value = '';
  document.getElementById('cut-diff-badge').style.display = 'none';

  countedInput.oninput = () => {
    const counted = parseFloat(countedInput.value) || 0;
    const diff = counted - expectedCash;
    const badge = document.getElementById('cut-diff-badge');
    badge.style.display = 'block';

    if (Math.abs(diff) < 0.01) {
      badge.className = 'diff-badge balanced';
      badge.textContent = `Diferencia: $0.00 (Caja Cuadrada)`;
    } else if (diff > 0) {
      badge.className = 'diff-badge surplus';
      badge.textContent = `Sobrante: +${formatMoney(diff)} (Efectivo extra en cajón)`;
    } else {
      badge.className = 'diff-badge missing';
      badge.textContent = `Faltante: -${formatMoney(Math.abs(diff))} (Falta efectivo)`;
    }
  };

  openModal('modal-cashcut');
}

function confirmCashCut() {
  const countedInput = document.getElementById('cut-counted-cash');
  if (countedInput.value.trim() === '') {
    showToast("Ingresa la cantidad contada", "error");
    return;
  }

  const counted = parseFloat(countedInput.value) || 0;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayMovs = store.cashMovements.filter(m => m.timestamp.startsWith(todayStr));

  const fondo = store.config.initialCashFund || 0;
  let totalSales = 0;
  let salesCash = 0;
  let totalExpenses = 0;

  todayMovs.forEach(m => {
    if (m.type === 'venta') {
      totalSales += m.amount;
      if (m.paymentMethod === 'efectivo') salesCash += m.amount;
    } else if (m.type === 'gasto') {
      totalExpenses += m.amount;
    }
  });

  const expectedCash = (fondo + salesCash) - totalExpenses;
  const difference = counted - expectedCash;

  const closure = {
    id: `cut-${Date.now()}`,
    closedAt: new Date().toISOString(),
    responsible: document.getElementById('cut-responsible').value || 'Administrador',
    notes: document.getElementById('cut-notes').value || '',
    initialFund: fondo,
    totalSales: totalSales,
    salesCash: salesCash,
    expenses: totalExpenses,
    expectedCash: expectedCash,
    countedCash: counted,
    difference: difference
  };

  if (!store.cashClosures) store.cashClosures = [];
  store.cashClosures.push(closure);

  saveStore();
  closeModal('modal-cashcut');
  renderCashRegister();
  showToast("Cierre de caja registrado exitosamente", "success");
  generateCashCutPrint(closure);
}

// ================= RENDERIZADO: BARBEROS & CUENTAS =================
function renderBarbers() {
  const container = document.getElementById('barbers-cards-container');
  container.innerHTML = '';

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMovs = store.cashMovements.filter(m => m.timestamp.startsWith(todayStr) && m.type === 'venta');

  store.barbers.forEach(barber => {
    let servicesCount = 0;
    let totalGenerated = 0;

    todayMovs.forEach(mov => {
      if (mov.barberId === barber.id) {
        totalGenerated += mov.amount;
        servicesCount += 1;
      }
    });

    const card = document.createElement('div');
    card.className = 'panel-card';
    card.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 700;">
            ${barber.avatar || getInitials(barber.name)}
          </div>
          <div>
            <h4 style="font-size: 1rem; color: var(--text-main); font-weight: 700;">${escapeHtml(barber.name)}</h4>
            <span style="font-size: 0.8rem; color: var(--primary); font-weight: 600;">${escapeHtml(barber.specialty)}</span>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="editBarber('${barber.id}')" title="Editar">Editar</button>
      </div>

      <div style="background-color: var(--bg-subtle); border-radius: 6px; padding: 12px; display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem; border: 1px solid var(--border-default);">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 6px;">
          <span style="color: var(--text-secondary);">Cuenta de acceso:</span>
          <b style="color: var(--primary);">Usuario: ${escapeHtml(barber.username || barber.id)}</b>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-secondary);">Cortes Atendidos Hoy:</span>
          <b style="color: var(--text-main);">${servicesCount}</b>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-secondary);">Total Facturado en Sillón:</span>
          <b style="color: var(--text-main);">${formatMoney(totalGenerated)}</b>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function editBarber(barberId) {
  const barber = store.barbers.find(b => b.id === barberId);
  if (!barber) return;

  document.getElementById('modal-barber-title').textContent = "Editar Barbero & Cuenta";
  document.getElementById('barber-form-name').value = barber.name;
  document.getElementById('barber-form-phone').value = barber.phone || '';
  document.getElementById('barber-form-specialty').value = barber.specialty || '';
  document.getElementById('barber-form-username').value = barber.username || '';
  document.getElementById('barber-form-password').value = barber.password || '';

  document.getElementById('btn-save-barber').dataset.editId = barberId;
  openModal('modal-barber');
}

function saveBarberFromModal() {
  const name = document.getElementById('barber-form-name').value.trim();
  const phone = document.getElementById('barber-form-phone').value.trim();
  const specialty = document.getElementById('barber-form-specialty').value.trim();
  const username = document.getElementById('barber-form-username').value.trim().toLowerCase();
  const password = document.getElementById('barber-form-password').value.trim();

  if (!name) {
    showToast("El nombre del barbero es obligatorio", "error");
    return;
  }

  const editId = document.getElementById('btn-save-barber').dataset.editId;

  if (editId) {
    const existing = store.barbers.find(b => b.id === editId);
    if (existing) {
      existing.name = name;
      existing.phone = phone;
      existing.specialty = specialty;
      existing.username = username || existing.username;
      existing.password = password || existing.password;
      existing.avatar = getInitials(name);
    }
    delete document.getElementById('btn-save-barber').dataset.editId;
    showToast("Barbero actualizado con éxito", "success");
  } else {
    store.barbers.push({
      id: `b-${Date.now()}`,
      name: name,
      phone: phone,
      specialty: specialty || "Barbero Profesional",
      username: username || name.split(' ')[0].toLowerCase(),
      password: password || '123',
      avatar: getInitials(name)
    });
    showToast("Barbero registrado con éxito", "success");
  }

  saveStore();
  closeModal('modal-barber');
  renderBarbers();
  renderPOS();
}

// ================= RENDERIZADO: CATÁLOGO =================
function renderCatalog() {
  const srvTbody = document.getElementById('services-tbody');
  srvTbody.innerHTML = '';
  store.services.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <b>${escapeHtml(s.name)}</b>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(s.category || 'General')}</div>
      </td>
      <td>${s.duration} min</td>
      <td><strong style="color: var(--primary); font-size: 0.95rem;">${formatMoney(s.price)}</strong></td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteService('${s.id}')">Eliminar</button></td>
    `;
    srvTbody.appendChild(tr);
  });

  const prodTbody = document.getElementById('products-tbody');
  prodTbody.innerHTML = '';
  store.products.forEach(p => {
    const isLow = p.stock <= 3;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><b>${escapeHtml(p.name)}</b></td>
      <td><span class="badge ${isLow ? 'badge-cancel' : 'badge-done'}">${p.stock} unid. ${isLow ? 'Stock Bajo' : ''}</span></td>
      <td style="color: var(--text-secondary);">${formatMoney(p.cost)}</td>
      <td><strong style="color: var(--primary);">${formatMoney(p.price)}</strong></td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteProduct('${p.id}')">Eliminar</button></td>
    `;
    prodTbody.appendChild(tr);
  });
}

function deleteService(srvId) {
  if (confirm("¿Eliminar este servicio?")) {
    store.services = store.services.filter(s => s.id !== srvId);
    saveStore();
    renderCatalog();
    renderPOS();
    showToast("Servicio eliminado", "info");
  }
}

function deleteProduct(prodId) {
  if (confirm("¿Eliminar este producto?")) {
    store.products = store.products.filter(p => p.id !== prodId);
    saveStore();
    renderCatalog();
    renderPOS();
    showToast("Producto eliminado", "info");
  }
}

// ================= RENDERIZADO: CLIENTES =================
function renderClients() {
  const tbody = document.getElementById('clients-tbody');
  const search = (document.getElementById('filter-clients-search').value || '').toLowerCase();
  tbody.innerHTML = '';

  let list = store.clients;
  if (search) {
    list = list.filter(c => c.name.toLowerCase().includes(search) || (c.phone && c.phone.includes(search)));
  }

  if (list.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-muted); padding: 24px;">No se encontraron clientes.</td></tr>`;
    return;
  }

  list.forEach(c => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong style="color: var(--text-main);">${escapeHtml(c.name)}</strong></td>
      <td>${escapeHtml(c.phone || 'Sin registrar')}</td>
      <td><b>${c.visits}</b> visitas</td>
      <td><strong style="color: var(--primary);">${formatMoney(c.totalSpent)}</strong></td>
      <td style="font-size: 0.8rem; color: var(--text-secondary); max-width: 250px;">${escapeHtml(c.notes || '-')}</td>
      <td><button class="btn btn-secondary btn-sm" onclick="quickBookForClient('${c.id}')">Agendar</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function quickBookForClient(clientId) {
  const client = store.clients.find(c => c.id === clientId);
  if (!client) return;
  openNewAppointmentModal(client);
}

// ================= MODALES Y FORMULARIOS =================
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('active');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.remove('active');
}

function saveExpenseFromModal() {
  const concept = document.getElementById('expense-concept').value.trim();
  const amount = parseFloat(document.getElementById('expense-amount').value);
  const barber = document.getElementById('expense-barber').value;

  if (!concept || isNaN(amount) || amount <= 0) {
    showToast("Concepto y monto válido requeridos", "error");
    return;
  }

  store.cashMovements.push({
    id: `mov-${Date.now()}`,
    timestamp: new Date().toISOString(),
    type: "gasto",
    concept: concept,
    client: "-",
    paymentMethod: "efectivo",
    barberId: "admin",
    barberName: barber,
    amount: amount,
    items: []
  });

  saveStore();
  closeModal('modal-expense');
  renderCashRegister();
  showToast("Gasto registrado en caja", "info");
}

function saveServiceFromModal() {
  const name = document.getElementById('service-form-name').value.trim();
  const price = parseFloat(document.getElementById('service-form-price').value);
  const duration = parseInt(document.getElementById('service-form-duration').value) || 30;

  if (!name || isNaN(price) || price < 0) {
    showToast("Ingresa nombre y precio válido", "error");
    return;
  }

  store.services.push({
    id: `s-${Date.now()}`,
    name: name,
    price: price,
    duration: duration,
    category: "Servicio"
  });

  saveStore();
  closeModal('modal-service');
  renderCatalog();
  renderPOS();
  showToast("Servicio agregado", "success");
}

function saveProductFromModal() {
  const name = document.getElementById('product-form-name').value.trim();
  const price = parseFloat(document.getElementById('product-form-price').value);
  const cost = parseFloat(document.getElementById('product-form-cost').value) || 0;
  const stock = parseInt(document.getElementById('product-form-stock').value) || 0;

  if (!name || isNaN(price) || price < 0) {
    showToast("Nombre y precio válidos requeridos", "error");
    return;
  }

  store.products.push({
    id: `p-${Date.now()}`,
    name: name,
    price: price,
    cost: cost,
    stock: stock
  });

  saveStore();
  closeModal('modal-product');
  renderCatalog();
  renderPOS();
  showToast("Producto agregado", "success");
}

function saveClientFromModal() {
  const name = document.getElementById('client-form-name').value.trim();
  const phone = document.getElementById('client-form-phone').value.trim();
  const notes = document.getElementById('client-form-notes').value.trim();

  if (!name || !phone) {
    showToast("Nombre y teléfono requeridos", "error");
    return;
  }

  store.clients.push({
    id: `c-${Date.now()}`,
    name: name,
    phone: phone,
    visits: 0,
    totalSpent: 0,
    notes: notes
  });

  saveStore();
  closeModal('modal-client');
  renderClients();
  showToast("Cliente registrado", "success");
}

// ================= TICKETS E IMPRESIÓN =================
function generateReceiptModal(movement) {
  const dateStr = new Date(movement.timestamp).toLocaleString();
  const printContent = `
    <h4>${escapeHtml(store.config.shopName)}</h4>
    <div class="receipt-center">${escapeHtml(store.config.address || 'Barbería')}</div>
    <div class="receipt-center">Tel: ${escapeHtml(store.config.phone || '')}</div>
    <div class="receipt-divider"></div>
    <div style="display:flex; justify-content:space-between; font-size:11px;">
      <span>Ticket #${movement.id.slice(-6)}</span>
      <span>${dateStr}</span>
    </div>
    <div style="font-size:11px; margin-top:2px;">Cliente: ${escapeHtml(movement.client)}</div>
    <div style="font-size:11px;">Atendió: ${escapeHtml(movement.barberName)}</div>
    <div class="receipt-divider"></div>
    <div style="margin: 6px 0;">
      ${movement.items.map(item => `
        <div style="display:flex; justify-content:space-between; margin-bottom:3px;">
          <span>${escapeHtml(item.name)} x${item.qty}</span>
          <span>${formatMoney(item.price * item.qty)}</span>
        </div>
      `).join('')}
    </div>
    <div class="receipt-divider"></div>
    <div style="display:flex; justify-content:space-between; font-size:11px;">
      <span>Subtotal:</span>
      <span>${formatMoney(movement.subtotal || movement.amount)}</span>
    </div>
    ${movement.discount > 0 ? `
      <div style="display:flex; justify-content:space-between; font-size:11px;">
        <span>Descuento:</span>
        <span>-${formatMoney(movement.discount)}</span>
      </div>
    ` : ''}
    <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:14px; margin-top:4px;">
      <span>TOTAL COBRADO:</span>
      <span>${formatMoney(movement.amount)}</span>
    </div>
    <div style="display:flex; justify-content:space-between; font-size:11px; margin-top:2px;">
      <span>Método de Pago:</span>
      <span style="text-transform:capitalize;">${movement.paymentMethod}</span>
    </div>
    <div class="receipt-divider"></div>
    <div class="receipt-center" style="margin-top:8px;">
      Gracias por su preferencia.<br>Vuelva pronto.
    </div>
  `;

  document.getElementById('printable-receipt-content').innerHTML = printContent;
  document.getElementById('receipt-print-area').innerHTML = printContent;
  openModal('modal-receipt');
}

function generateCashCutPrint(cut) {
  const dateStr = new Date(cut.closedAt).toLocaleString();
  const printContent = `
    <h4>${escapeHtml(store.config.shopName)}</h4>
    <div class="receipt-center">CORTE DE CAJA / CIERRE DE TURNO</div>
    <div class="receipt-divider"></div>
    <div style="font-size:11px;">Fecha: ${dateStr}</div>
    <div style="font-size:11px;">Responsable: ${escapeHtml(cut.responsible)}</div>
    <div class="receipt-divider"></div>
    <div style="display:flex; justify-content:space-between;"><span>Fondo Inicial:</span> <span>${formatMoney(cut.initialFund)}</span></div>
    <div style="display:flex; justify-content:space-between;"><span>Ventas Totales:</span> <span>${formatMoney(cut.totalSales)}</span></div>
    <div style="display:flex; justify-content:space-between;"><span>Efectivo Ventas:</span> <span>${formatMoney(cut.salesCash)}</span></div>
    <div style="display:flex; justify-content:space-between;"><span>Gastos / Salidas:</span> <span>-${formatMoney(cut.expenses)}</span></div>
    <div class="receipt-divider"></div>
    <div style="display:flex; justify-content:space-between;"><span>Efectivo Esperado:</span> <span>${formatMoney(cut.expectedCash)}</span></div>
    <div style="display:flex; justify-content:space-between; font-weight:bold;"><span>Efectivo Contado:</span> <span>${formatMoney(cut.countedCash)}</span></div>
    <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:13px; margin-top:4px;">
      <span>Diferencia:</span>
      <span>${cut.difference >= 0 ? '+' : ''}${formatMoney(cut.difference)}</span>
    </div>
    <div class="receipt-divider"></div>
    <div class="receipt-center" style="margin-top:6px;">Firma de Conformidad: ____________</div>
  `;
  document.getElementById('printable-receipt-content').innerHTML = printContent;
  document.getElementById('receipt-print-area').innerHTML = printContent;
  openModal('modal-receipt');
}

// ================= EXPORTACIÓN =================
function exportBackupData() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  const now = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute("download", `barberia_backup_${now}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("Copia de seguridad descargada", "success");
}

// ================= EVENT LISTENERS =================
function setupEventListeners() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleLogin();
    });
  }

  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) btnLogout.addEventListener('click', logout);

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.dataset.view;
      if (view) switchView(view);
    });
  });

  const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
  if (btnToggleSidebar) {
    btnToggleSidebar.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('open');
    });
  }

  document.querySelectorAll('[data-pos-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-pos-tab]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentPosTab = tab.dataset.posTab;
      renderPOS();
    });
  });

  document.getElementById('btn-pos-clear').addEventListener('click', () => {
    currentPosCart = [];
    renderPosCart();
  });
  document.getElementById('btn-pos-checkout').addEventListener('click', checkoutPOS);
  document.getElementById('pos-discount-input').addEventListener('input', () => renderPosCart());

  document.getElementById('btn-header-new-appointment').addEventListener('click', () => openNewAppointmentModal());
  const btnOpenApp = document.getElementById('btn-modal-open-appointment');
  if (btnOpenApp) btnOpenApp.addEventListener('click', () => openNewAppointmentModal());

  document.getElementById('btn-modal-open-expense').addEventListener('click', () => openModal('modal-expense'));
  document.getElementById('btn-modal-open-cashcut').addEventListener('click', openCashCutModal);
  document.getElementById('btn-quick-cash').addEventListener('click', () => switchView('cash-register'));

  // Botón y modal de reseteo demo
  const btnResetDemo = document.getElementById('btn-reset-demo');
  if (btnResetDemo) btnResetDemo.addEventListener('click', () => openModal('modal-reset-demo'));
  const btnConfirmResetDemo = document.getElementById('btn-confirm-reset-demo');
  if (btnConfirmResetDemo) btnConfirmResetDemo.addEventListener('click', confirmResetDemo);

  // Botón y modal de edición de fondo con clave
  const btnOpenEditFund = document.getElementById('btn-open-edit-fund');
  if (btnOpenEditFund) btnOpenEditFund.addEventListener('click', openEditFundModal);
  const btnConfirmEditFund = document.getElementById('btn-confirm-edit-fund');
  if (btnConfirmEditFund) btnConfirmEditFund.addEventListener('click', confirmEditFund);

  document.getElementById('btn-modal-open-barber').addEventListener('click', () => {
    document.getElementById('modal-barber-title').textContent = "Registrar Barbero & Cuenta";
    document.getElementById('barber-form-name').value = '';
    document.getElementById('barber-form-phone').value = '';
    document.getElementById('barber-form-specialty').value = '';
    document.getElementById('barber-form-username').value = '';
    document.getElementById('barber-form-password').value = '';
    delete document.getElementById('btn-save-barber').dataset.editId;
    openModal('modal-barber');
  });

  document.getElementById('btn-modal-open-service').addEventListener('click', () => {
    document.getElementById('service-form-name').value = '';
    document.getElementById('service-form-price').value = '';
    openModal('modal-service');
  });

  document.getElementById('btn-modal-open-product').addEventListener('click', () => {
    document.getElementById('product-form-name').value = '';
    document.getElementById('product-form-price').value = '';
    document.getElementById('product-form-cost').value = '';
    openModal('modal-product');
  });

  document.getElementById('btn-modal-open-client').addEventListener('click', () => {
    document.getElementById('client-form-name').value = '';
    document.getElementById('client-form-phone').value = '';
    document.getElementById('client-form-notes').value = '';
    openModal('modal-client');
  });

  document.getElementById('btn-save-appointment').addEventListener('click', saveAppointmentFromModal);
  document.getElementById('btn-save-expense').addEventListener('click', saveExpenseFromModal);
  document.getElementById('btn-save-barber').addEventListener('click', saveBarberFromModal);
  document.getElementById('btn-save-service').addEventListener('click', saveServiceFromModal);
  document.getElementById('btn-save-product').addEventListener('click', saveProductFromModal);
  document.getElementById('btn-save-client').addEventListener('click', saveClientFromModal);
  document.getElementById('btn-confirm-cashcut').addEventListener('click', confirmCashCut);

  const btnSaveBarberTip = document.getElementById('btn-save-barber-tip');
  if (btnSaveBarberTip) btnSaveBarberTip.addEventListener('click', saveBarberTipFromModal);

  const filterBarber = document.getElementById('filter-appointment-barber');
  if (filterBarber) filterBarber.addEventListener('change', renderAppointments);

  const filterSearch = document.getElementById('filter-clients-search');
  if (filterSearch) filterSearch.addEventListener('input', renderClients);

  document.getElementById('btn-public-submit-booking').addEventListener('click', submitPublicBooking);
  document.getElementById('btn-print-receipt').addEventListener('click', () => window.print());
  const btnExport = document.getElementById('btn-export-backup');
  if (btnExport) btnExport.addEventListener('click', exportBackupData);
}

// ================= UTILIDADES =================
function formatMoney(amount) {
  const num = Number(amount) || 0;
  return `$${num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderStatusBadge(status) {
  switch (status) {
    case 'pendiente': return `<span class="badge badge-pending">En Espera</span>`;
    case 'en_proceso': return `<span class="badge badge-progress">En Sillón</span>`;
    case 'completada': return `<span class="badge badge-done">Cobrado / Completado</span>`;
    case 'cancelada': return `<span class="badge badge-cancel">Cancelada</span>`;
    default: return `<span class="badge">${escapeHtml(status)}</span>`;
  }
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
