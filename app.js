/**
 * BARBERSHOP SYSTEM - THE BARBER CLUB & CO.
 * Lógica Completa de la Aplicación en JavaScript
 * Con soporte para Sesiones (Caja vs Barberos), Selección Múltiple y Calendario Personalizado
 */

// ================= ESTADO INICIAL Y PERSISTENCIA =================
const STORAGE_KEY = 'barbershop_system_data_v2';
const SESSION_KEY = 'barbershop_system_session_v2';

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
      serviceCommission: 50, // 50%
      productCommission: 15, // 15%
      avatar: "💈"
    },
    {
      id: "b2",
      name: "Mateo 'Beard King' Silva",
      username: "mateo",
      password: "123",
      phone: "5587654321",
      specialty: "Barba Spa & Ritual Tradicional",
      serviceCommission: 55,
      productCommission: 15,
      avatar: "🧔"
    },
    {
      id: "b3",
      name: "David 'Scissors' Romero",
      username: "david",
      password: "123",
      phone: "5599887766",
      specialty: "Cortes Clásicos & Tijera",
      serviceCommission: 50,
      productCommission: 10,
      avatar: "✂️"
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
  cashClosures: []
};

// Generar citas y movimientos de muestra para hoy
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
      tip: 30,
      items: [
        { name: "Corte Clásico", price: 180, qty: 1, type: "service", id: "s1" },
        { name: "Perfilado de Barba", price: 140, qty: 1, type: "service", id: "s2" },
        { name: "Cera Pomada Mate", price: 200, qty: 1, type: "product", id: "p1" }
      ],
      commissions: { b1: 190 } // (320*0.5) + (200*0.15)
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
      tip: 0,
      items: []
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
    if (raw) return JSON.parse(raw);
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

  // Validar si es admin/caja
  if ((userVal === 'caja' || userVal === 'admin') && passVal === (store.config.adminPass || '123')) {
    saveSession({
      role: 'admin',
      name: 'Caja Principal / Dueño',
      username: userVal,
      avatar: '💼'
    });
    applyUserSession();
    showToast("¡Bienvenido! Sesión iniciada como Caja Principal", "success");
    return;
  }

  // Validar si es un barbero
  const barber = store.barbers.find(b => (b.username && b.username.toLowerCase() === userVal) || b.id === userVal);
  if (barber && (barber.password === passVal || passVal === '123')) {
    saveSession({
      role: 'barber',
      barberId: barber.id,
      name: barber.name,
      username: barber.username,
      avatar: barber.avatar || '💈',
      specialty: barber.specialty
    });
    applyUserSession();
    showToast(`¡Hola ${barber.name}! Bienvenido a tu portal de barbero`, "success");
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

  // Actualizar badge en header
  document.getElementById('header-user-name').textContent = currentUser.name;
  document.getElementById('header-user-avatar').textContent = currentUser.avatar || '👤';
  document.getElementById('header-user-role').textContent = currentUser.role === 'admin' ? 'CAJA / ADMIN' : 'BARBERO';
  document.getElementById('sidebar-role-label').textContent = currentUser.role === 'admin' ? 'CAJA & CONTROL' : `BARBERO: ${currentUser.name.split(' ')[0]}`;

  // Ajustar visibilidad de ítems en Sidebar
  const adminElements = document.querySelectorAll('.nav-admin-only');
  const barberElements = document.querySelectorAll('.nav-barber-only');

  if (currentUser.role === 'admin') {
    adminElements.forEach(el => el.style.display = '');
    barberElements.forEach(el => el.style.display = 'none');
    switchView('dashboard');
  } else {
    // Es barbero
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

// Filtro de fechas
let adminSelectedDate = new Date().toISOString().split('T')[0];
let barberSelectedDate = new Date().toISOString().split('T')[0];

// Estado de selección de Modal Cita
let modalSelectedServices = [];
let modalSelectedBarberId = null;
let modalSelectedDate = new Date().toISOString().split('T')[0];
let modalSelectedTime = null;

// Estado de selección de Reserva Pública
let publicSelectedServices = [];
let publicSelectedBarberId = null;
let publicSelectedDate = new Date().toISOString().split('T')[0];
let publicSelectedTime = null;

// ================= INICIALIZACIÓN =================
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  applyUserSession();
});

// ================= NAVEGACIÓN ENTRE VISTAS =================
function switchView(viewName) {
  currentView = viewName;
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

  const targetSec = document.getElementById(`view-${viewName}`);
  if (targetSec) targetSec.classList.add('active');

  const navLink = document.querySelector(`.nav-item[data-view="${viewName}"]`);
  if (navLink) navLink.classList.add('active');

  const titles = {
    'dashboard': { t: 'Tablero Principal', s: 'Resumen y métricas de la barbería hoy' },
    'appointments': { t: 'Agenda de Citas', s: 'Control de citas, turnos y clientes en espera' },
    'barber-portal': { t: 'Mi Portal de Barbero', s: 'Tu calendario de citas y clientes asignados' },
    'barber-earnings': { t: 'Mis Ganancias', s: 'Desglose de cortes realizados, comisiones y propinas' },
    'pos': { t: 'Punto de Venta (POS)', s: 'Cobro rápido de cortes, productos y propinas' },
    'cash-register': { t: 'Corte de Caja', s: 'Arqueo de turno, control de efectivo y gastos' },
    'barbers': { t: 'Barberos & Cuentas', s: 'Control de personal y credenciales de acceso' },
    'catalog': { t: 'Servicios & Productos', s: 'Catálogo de cortes, tratamientos y stock' },
    'clients': { t: 'Directorio de Clientes', s: 'Historial de visitas y preferencias de estilo' },
    'public-booking': { t: 'Reserva Online', s: 'Portal para clientes y confirmación vía WhatsApp' }
  };

  if (titles[viewName]) {
    document.getElementById('view-title').textContent = titles[viewName].t;
    document.getElementById('view-subtitle').textContent = titles[viewName].s;
  }

  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.remove('open');

  renderView(viewName);
}

function renderAllViews() {
  if (currentUser && currentUser.role === 'barber') {
    renderBarberPortal();
    renderBarberEarnings();
  } else {
    renderDashboard();
    renderAppointments();
    renderPOS();
    renderCashRegister();
    renderBarbers();
    renderCatalog();
    renderClients();
  }
  renderPublicBooking();
}

function renderView(viewName) {
  switch (viewName) {
    case 'dashboard': renderDashboard(); break;
    case 'appointments': renderAppointments(); break;
    case 'barber-portal': renderBarberPortal(); break;
    case 'barber-earnings': renderBarberEarnings(); break;
    case 'pos': renderPOS(); break;
    case 'cash-register': renderCashRegister(); break;
    case 'barbers': renderBarbers(); break;
    case 'catalog': renderCatalog(); break;
    case 'clients': renderClients(); break;
    case 'public-booking': renderPublicBooking(); break;
  }
}

// ================= COMPONENTE DE CALENDARIO INTERACTIVO =================
function renderCustomCalendar(containerId, activeDateStr, onSelectCallback) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const activeDate = new Date(activeDateStr + "T00:00:00");
  const year = activeDate.getFullYear();
  const month = activeDate.getMonth();

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0: Dom, 1: Lun...
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const todayStr = new Date().toISOString().split('T')[0];

  container.innerHTML = `
    <div class="calendar-widget-wrapper">
      <div class="calendar-widget-header">
        <button type="button" class="calendar-nav-btn" id="${containerId}-prev">&lt;</button>
        <span class="calendar-widget-title">${monthNames[month]} ${year}</span>
        <button type="button" class="calendar-nav-btn" id="${containerId}-next">&gt;</button>
      </div>
      <div class="calendar-weekdays-row">
        <span>Do</span><span>Lu</span><span>Ma</span><span>Mi</span><span>Ju</span><span>Vi</span><span>Sá</span>
      </div>
      <div class="calendar-days-grid" id="${containerId}-days"></div>
    </div>
  `;

  const daysGrid = document.getElementById(`${containerId}-days`);

  // Días vacíos al inicio
  for (let i = 0; i < firstDayIndex; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-day-cell empty';
    daysGrid.appendChild(empty);
  }

  // Días del mes
  for (let d = 1; d <= daysInMonth; d++) {
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const cell = document.createElement('div');
    cell.className = 'cal-day-cell';
    cell.textContent = d;

    if (dayStr === todayStr) cell.classList.add('today');
    if (dayStr === activeDateStr) cell.classList.add('selected');

    cell.onclick = () => {
      onSelectCallback(dayStr);
    };

    daysGrid.appendChild(cell);
  }

  // Botones anterior y siguiente
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

  // Citas agendadas para este barbero en esta fecha
  const bookedApps = store.appointments.filter(a => a.date === selectedDate && a.barberId === barberId && a.status !== 'cancelada');
  const bookedTimes = bookedApps.map(a => a.time);

  container.innerHTML = `
    <div class="time-shift-title">☀️ Mañana</div>
    <div class="time-slots-wrapper" id="${containerId}-morning"></div>
    <div class="time-shift-title" style="margin-top: 8px;">🌙 Tarde</div>
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

  // Citas de hoy
  const tbody = document.getElementById('dash-today-appointments-tbody');
  tbody.innerHTML = '';

  if (todayApps.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-muted); padding: 24px;">No hay citas agendadas para el día de hoy.</td></tr>`;
  } else {
    todayApps.sort((a,b) => a.time.localeCompare(b.time)).forEach(app => {
      const barber = store.barbers.find(b => b.id === app.barberId) || { name: 'Sin asignar' };
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="color: var(--gold-primary); font-size: 1rem;">${app.time}</strong></td>
        <td><b>${escapeHtml(app.clientName)}</b></td>
        <td><span style="font-size:0.85rem;">${escapeHtml(app.serviceName)}</span></td>
        <td>${escapeHtml(barber.name)}</td>
        <td>${renderStatusBadge(app.status)}</td>
        <td>
          <div style="display:flex; gap:6px;">
            ${app.status !== 'completada' ? `
              <button class="btn btn-primary btn-sm" onclick="directPayAppointment('${app.id}')" title="Cobrar cita en caja">
                💳 Cobrar
              </button>
            ` : `<span style="color:#4ade80; font-size:0.8rem; font-weight:600;">✓ Cobrado</span>`}
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Estado de barberos
  const barbersList = document.getElementById('dash-barbers-status-list');
  barbersList.innerHTML = '';
  store.barbers.forEach(barber => {
    const inChair = todayApps.find(a => a.barberId === barber.id && a.status === 'en_proceso');
    const div = document.createElement('div');
    div.style.cssText = "display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--bg-secondary); border-radius: 8px; border: 1px solid var(--border-color);";
    div.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 1.5rem;">${barber.avatar || '💈'}</span>
        <div>
          <strong style="color: #fff; font-size: 0.9rem;">${escapeHtml(barber.name)}</strong>
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

// ================= RENDERIZADO: PORTAL EXCLUSIVO DE BARBERO =================
function renderBarberPortal() {
  if (!currentUser || currentUser.role !== 'barber') return;

  const barberId = currentUser.barberId;
  const todayStr = new Date().toISOString().split('T')[0];

  // Métricas del barbero para hoy
  const todayApps = store.appointments.filter(a => a.barberId === barberId && a.date === todayStr);
  const doneApps = todayApps.filter(a => a.status === 'completada');

  // Ganancias del barbero hoy
  const todaySales = store.cashMovements.filter(m => m.timestamp.startsWith(todayStr) && m.type === 'venta' && m.barberId === barberId);
  let earnedComm = 0;
  let earnedTips = 0;

  todaySales.forEach(s => {
    if (s.commissions && s.commissions[barberId]) earnedComm += s.commissions[barberId];
    earnedTips += (s.tip || 0);
  });

  document.getElementById('barber-portal-stat-apps').textContent = todayApps.length;
  document.getElementById('barber-portal-stat-done').textContent = doneApps.length;
  document.getElementById('barber-portal-stat-comm').textContent = formatMoney(earnedComm);
  document.getElementById('barber-portal-stat-tips').textContent = formatMoney(earnedTips);

  // Renderizar Calendario del Barbero
  renderCustomCalendar('barber-calendar-widget-container', barberSelectedDate, (newDate) => {
    barberSelectedDate = newDate;
    document.getElementById('barber-selected-date-label').textContent = (newDate === todayStr) ? "Hoy (" + newDate + ")" : newDate;
    renderBarberPortal();
  });

  document.getElementById('barber-citas-header-title').textContent = (barberSelectedDate === todayStr)
    ? `Mis Citas para Hoy (${barberSelectedDate})`
    : `Mis Citas para el ${barberSelectedDate}`;

  // Lista de Citas del Barbero para la fecha seleccionada
  const dateApps = store.appointments.filter(a => a.barberId === barberId && a.date === barberSelectedDate);
  const tbody = document.getElementById('barber-my-appointments-tbody');
  tbody.innerHTML = '';

  if (dateApps.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: var(--text-muted); padding: 32px;">No tienes citas programadas para esta fecha.</td></tr>`;
    return;
  }

  dateApps.sort((a,b) => a.time.localeCompare(b.time)).forEach(app => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong style="color: var(--gold-primary); font-size: 1.05rem;">${app.time}</strong></td>
      <td>
        <b>${escapeHtml(app.clientName)}</b>
        ${app.notes ? `<div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(app.notes)}</div>` : ''}
      </td>
      <td>
        <span>${escapeHtml(app.clientPhone || 'Sin tel')}</span>
        ${app.clientPhone ? `
          <button class="btn btn-secondary btn-sm" style="padding: 2px 6px; margin-left: 6px; font-size: 0.7rem;" onclick="sendWhatsAppReminder('${app.id}')">📲 WhatsApp</button>
        ` : ''}
      </td>
      <td><span style="font-size: 0.88rem; color: #fff;">${escapeHtml(app.serviceName)}</span></td>
      <td><strong>${formatMoney(app.price)}</strong></td>
      <td>${renderStatusBadge(app.status)}</td>
      <td>
        <div style="display:flex; gap:6px;">
          ${app.status === 'pendiente' ? `
            <button class="btn btn-primary btn-sm" onclick="updateAppointmentStatus('${app.id}', 'en_proceso')">✂️ En Sillón</button>
          ` : ''}
          ${app.status === 'en_proceso' ? `
            <button class="btn btn-success btn-sm" onclick="updateAppointmentStatus('${app.id}', 'completada')">✅ Terminado</button>
          ` : ''}
          ${app.status === 'completada' ? `
            <span style="color:#4ade80; font-size:0.8rem; font-weight:600;">Listo para Caja</span>
          ` : ''}
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderBarberEarnings() {
  if (!currentUser || currentUser.role !== 'barber') return;

  const barberId = currentUser.barberId;
  const todayStr = new Date().toISOString().split('T')[0];
  const mySales = store.cashMovements.filter(m => m.timestamp.startsWith(todayStr) && m.type === 'venta' && m.barberId === barberId);

  let totalSalesAmount = 0;
  let totalCommissions = 0;
  let totalTips = 0;

  mySales.forEach(s => {
    totalSalesAmount += s.amount;
    if (s.commissions && s.commissions[barberId]) totalCommissions += s.commissions[barberId];
    totalTips += (s.tip || 0);
  });

  const content = document.getElementById('barber-earnings-content');
  content.innerHTML = `
    <div class="grid-stats">
      <div class="stat-card green">
        <div class="stat-details">
          <span>Total Facturado por Ti</span>
          <h3>${formatMoney(totalSalesAmount)}</h3>
          <small>En servicios y productos hoy</small>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-details">
          <span>Tu Comisión a Cobrar</span>
          <h3 style="color: var(--gold-primary);">${formatMoney(totalCommissions)}</h3>
          <small>Tu porcentaje del día</small>
        </div>
      </div>
      <div class="stat-card purple">
        <div class="stat-details">
          <span>Tus Propinas Acumuladas</span>
          <h3 style="color: #c084fc;">+${formatMoney(totalTips)}</h3>
          <small>100% tuyas</small>
        </div>
      </div>
    </div>

    <div class="panel-card" style="margin-top: 14px;">
      <h4 style="color:#fff; margin-bottom: 12px;">Desglose de Clientes Atendidos Hoy</h4>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Hora</th>
              <th>Cliente</th>
              <th>Concepto / Servicios</th>
              <th>Total Cobrado</th>
              <th>Tu Comisión</th>
              <th>Propina</th>
            </tr>
          </thead>
          <tbody>
            ${mySales.length === 0 ? `<tr><td colspan="6" style="text-align:center; padding: 20px; color: var(--text-muted);">No has generado cobros el día de hoy.</td></tr>` : ''}
            ${mySales.map(s => `
              <tr>
                <td><strong>${new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong></td>
                <td><b>${escapeHtml(s.client)}</b></td>
                <td>${escapeHtml(s.concept)}</td>
                <td>${formatMoney(s.amount)}</td>
                <td><strong style="color: var(--gold-primary);">${formatMoney((s.commissions && s.commissions[barberId]) || 0)}</strong></td>
                <td><strong style="color: #4ade80;">+${formatMoney(s.tip || 0)}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// ================= RENDERIZADO: AGENDA DE CITAS (ADMIN) =================
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

  // Renderizar Calendario Interactivo de Admin
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
      <td><strong style="color: var(--gold-primary); font-size: 1rem;">${app.time}</strong></td>
      <td>
        <b>${escapeHtml(app.clientName)}</b>
        ${app.notes ? `<div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(app.notes)}</div>` : ''}
      </td>
      <td>
        <span>${escapeHtml(app.clientPhone || 'Sin tel')}</span>
        ${app.clientPhone ? `
          <button class="btn btn-secondary btn-sm" style="padding: 2px 6px; margin-left: 6px; font-size: 0.7rem;" onclick="sendWhatsAppReminder('${app.id}')">📲 WhatsApp</button>
        ` : ''}
      </td>
      <td><span style="font-size: 0.88rem;">${escapeHtml(app.serviceName)}</span></td>
      <td>${escapeHtml(barber.name)}</td>
      <td><strong>${formatMoney(app.price)}</strong></td>
      <td>
        <select class="form-select" style="padding: 4px 8px; font-size: 0.8rem; width: auto;" onchange="updateAppointmentStatus('${app.id}', this.value)">
          <option value="pendiente" ${app.status === 'pendiente' ? 'selected' : ''}>⏳ Pendiente</option>
          <option value="en_proceso" ${app.status === 'en_proceso' ? 'selected' : ''}>✂️ En Sillón</option>
          <option value="completada" ${app.status === 'completada' ? 'selected' : ''}>✅ Completada</option>
          <option value="cancelada" ${app.status === 'cancelada' ? 'selected' : ''}>❌ Cancelada</option>
        </select>
      </td>
      <td>
        <div style="display: flex; gap: 6px;">
          ${app.status !== 'completada' ? `
            <button class="btn btn-primary btn-sm" onclick="directPayAppointment('${app.id}')">Cobrar</button>
          ` : ''}
          <button class="btn btn-danger btn-sm" onclick="deleteAppointment('${app.id}')" title="Eliminar cita">🗑️</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function updateAppointmentStatus(appId, newStatus) {
  const app = store.appointments.find(a => a.id === appId);
  if (app) {
    app.status = newStatus;
    saveStore();
    if (currentUser && currentUser.role === 'barber') {
      renderBarberPortal();
    } else {
      renderDashboard();
      renderAppointments();
    }
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
    `¡Hola ${app.clientName}! 👋 Te recordamos tu cita en *${store.config.shopName}* para hoy a las *${app.time} hrs* (${app.serviceName}). ¡Te esperamos!`
  );
  window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
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
      <div class="custom-checkbox">${isSelected ? '✓' : ''}</div>
      <div class="service-select-info">
        <div class="service-select-title">${escapeHtml(srv.name)}</div>
        <div class="service-select-meta">
          <span class="service-select-duration">⏱️ ${srv.duration} min</span>
          <span class="service-select-price">${formatMoney(srv.price)}</span>
        </div>
      </div>
    `;

    item.onclick = () => {
      onToggleCallback(srv);
    };

    container.appendChild(item);
  });

  // Actualizar resumen
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
      summaryText.textContent = `${totalCount} servicio(s) seleccionado(s) • ⏱️ ${totalDuration} min`;
      summaryPrice.textContent = formatMoney(totalPrice);
    }
  }
}

// ================= MODAL DE CITAS (NUEVA CITA CON MÚLTIPLES SERVICIOS) =================
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

  // Si estamos como barbero, preseleccionar al barbero actual
  if (currentUser && currentUser.role === 'barber') {
    modalSelectedBarberId = currentUser.barberId;
  } else if (!modalSelectedBarberId && store.barbers.length > 0) {
    modalSelectedBarberId = store.barbers[0].id;
  }

  // Preseleccionar primer servicio si está vacío
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
  // 1. Selector múltiple de servicios
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

  // 2. Selector de Barberos
  const barberContainer = document.getElementById('modal-barber-picker');
  barberContainer.innerHTML = '';
  store.barbers.forEach(b => {
    const isSelected = (b.id === modalSelectedBarberId);
    const card = document.createElement('div');
    card.className = `barber-picker-card ${isSelected ? 'selected' : ''}`;
    card.innerHTML = `
      <div class="avatar">${b.avatar || '💈'}</div>
      <div class="name">${escapeHtml(b.name)}</div>
      <div class="role">${escapeHtml(b.specialty)}</div>
    `;
    card.onclick = () => {
      modalSelectedBarberId = b.id;
      renderModalAppointmentComponents();
    };
    barberContainer.appendChild(card);
  });

  // 3. Calendario Interactivo
  renderCustomCalendar('modal-calendar-widget-container', modalSelectedDate, (newDate) => {
    modalSelectedDate = newDate;
    renderModalAppointmentComponents();
  });

  // 4. Selector de Horarios
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
    showToast("Por favor ingresa el nombre del cliente", "error");
    return;
  }

  if (modalSelectedServices.length === 0) {
    showToast("Selecciona al menos un servicio para la cita", "error");
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

// ================= RENDERIZADO: RESERVA ONLINE (CLIENTES) =================
function renderPublicBooking() {
  if (publicSelectedServices.length === 0 && store.services.length > 0) {
    publicSelectedServices = [store.services[0]];
  }

  if (!publicSelectedBarberId && store.barbers.length > 0) {
    publicSelectedBarberId = store.barbers[0].id;
  }

  // 1. Selector múltiple de servicios en vista pública
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

  // 2. Selector visual de barberos
  const barbersGrid = document.getElementById('public-book-barbers-grid');
  barbersGrid.innerHTML = '';
  store.barbers.forEach(b => {
    const isSelected = (b.id === publicSelectedBarberId);
    const card = document.createElement('div');
    card.className = `barber-picker-card ${isSelected ? 'selected' : ''}`;
    card.innerHTML = `
      <div class="avatar">${b.avatar || '💈'}</div>
      <div class="name">${escapeHtml(b.name)}</div>
      <div class="role">${escapeHtml(b.specialty)}</div>
    `;
    card.onclick = () => {
      publicSelectedBarberId = b.id;
      renderPublicBooking();
    };
    barbersGrid.appendChild(card);
  });

  // 3. Calendario Interactivo
  renderCustomCalendar('public-calendar-widget-container', publicSelectedDate, (newDate) => {
    publicSelectedDate = newDate;
    renderPublicBooking();
  });

  // 4. Selector de Horarios
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

  // Registrar cliente si es nuevo
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
    `¡Hola! Acabo de agendar una cita en *${store.config.shopName}*:\n\n👤 *Cliente:* ${name}\n✂️ *Servicios:* ${serviceName} ($${totalPrice})\n💈 *Barbero:* ${newApp.barberName}\n📅 *Fecha:* ${publicSelectedDate} a las ${publicSelectedTime} hrs\n📝 *Notas:* ${notes || 'Ninguna'}\n\n¡Por favor confirmen mi cita!`
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
          <div class="pos-item-sub">⏱️ ${srv.duration} min • ${escapeHtml(srv.category || 'Servicio')}</div>
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
          <div class="pos-item-sub" style="color: ${prod.stock <= 3 ? '#ff6b6b' : 'var(--text-muted)'}; font-weight: 600;">
            📦 Stock: ${prod.stock} u.
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
        showToast("No hay más stock", "error");
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
  const tip = parseFloat(document.getElementById('pos-tip-input').value) || 0;
  const discount = parseFloat(document.getElementById('pos-discount-input').value) || 0;
  const total = Math.max(0, subtotal + tip - discount);

  document.getElementById('pos-subtotal').textContent = formatMoney(subtotal);
  document.getElementById('pos-total').textContent = formatMoney(total);
}

function directPayAppointment(appId) {
  const app = store.appointments.find(a => a.id === appId);
  if (!app) return;

  switchView('pos');

  document.getElementById('pos-client-name').value = app.clientName;
  document.getElementById('pos-barber-select').value = app.barberId;

  // Si tiene servicios múltiples, agregarlos todos al carrito
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
  showToast(`Cita de ${app.clientName} cargada para cobro`, 'info');
}

function checkoutPOS() {
  if (currentPosCart.length === 0) {
    showToast("Agrega al menos un servicio o producto para cobrar", "error");
    return;
  }

  const clientNameInput = document.getElementById('pos-client-name').value.trim();
  const clientName = clientNameInput || "Cliente General";
  const barberId = document.getElementById('pos-barber-select').value;
  const barber = store.barbers.find(b => b.id === barberId);
  const paymentMethod = document.getElementById('pos-payment-method').value;

  const tip = parseFloat(document.getElementById('pos-tip-input').value) || 0;
  const discount = parseFloat(document.getElementById('pos-discount-input').value) || 0;

  let subtotal = 0;
  let barberCommission = 0;

  currentPosCart.forEach(item => {
    subtotal += item.price * item.qty;

    if (item.type === 'service') {
      const commPct = (barber ? barber.serviceCommission : 50) / 100;
      barberCommission += (item.price * item.qty) * commPct;
    } else if (item.type === 'product') {
      const commPct = (barber ? barber.productCommission : 15) / 100;
      barberCommission += (item.price * item.qty) * commPct;

      const prodInStore = store.products.find(p => p.id === item.id);
      if (prodInStore) prodInStore.stock = Math.max(0, prodInStore.stock - item.qty);
    }

    if (item.linkedAppointmentId) {
      const linkedApp = store.appointments.find(a => a.id === item.linkedAppointmentId);
      if (linkedApp) linkedApp.status = 'completada';
    }
  });

  const total = Math.max(0, subtotal + tip - discount);

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
    tip: tip,
    discount: discount,
    amount: total,
    items: JSON.parse(JSON.stringify(currentPosCart)),
    commissions: {
      [barberId]: barberCommission
    }
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
  document.getElementById('pos-tip-input').value = '0';
  document.getElementById('pos-discount-input').value = '0';
  renderPosCart();
  renderDashboard();
  renderCatalog();
  renderCashRegister();
  renderBarbers();

  showToast(`¡Cobro exitoso de ${formatMoney(total)} registrado!`, 'success');
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

  const barberComms = {};
  store.barbers.forEach(b => barberComms[b.id] = { name: b.name, totalComm: 0, totalTips: 0, servicesCount: 0 });

  todayMovs.forEach(mov => {
    if (mov.type === 'venta') {
      if (mov.paymentMethod === 'efectivo') salesCash += mov.amount;
      if (mov.paymentMethod === 'tarjeta') salesCard += mov.amount;
      if (mov.paymentMethod === 'transferencia') salesTransf += mov.amount;

      if (mov.commissions) {
        for (const bId in mov.commissions) {
          if (barberComms[bId]) {
            barberComms[bId].totalComm += mov.commissions[bId];
            barberComms[bId].totalTips += (mov.tip || 0);
            barberComms[bId].servicesCount += 1;
          }
        }
      }
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

  let grandTotalCommissions = 0;
  const breakdownDiv = document.getElementById('cash-barbers-commissions-breakdown');
  breakdownDiv.innerHTML = '';

  for (const bId in barberComms) {
    const bData = barberComms[bId];
    grandTotalCommissions += bData.totalComm + bData.totalTips;

    const row = document.createElement('div');
    row.style.cssText = "display: flex; justify-content: space-between; border-bottom: 1px dashed var(--border-color); padding-bottom: 4px;";
    row.innerHTML = `
      <span>${escapeHtml(bData.name)} (${bData.servicesCount} cortes):</span>
      <b>${formatMoney(bData.totalComm + bData.totalTips)} <small style="color:var(--text-muted);">(Prop: ${formatMoney(bData.totalTips)})</small></b>
    `;
    breakdownDiv.appendChild(row);
  }

  document.getElementById('cash-barber-commissions-total').textContent = formatMoney(grandTotalCommissions);

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
        <td><strong style="color: ${isSale ? '#4ade80' : '#ff6b6b'};">${isSale ? '+' : '-'}${formatMoney(m.amount)}</strong></td>
      `;
      movsTbody.appendChild(tr);
    });
  }

  // Historial de cierres
  const closuresTbody = document.getElementById('cash-history-tbody');
  closuresTbody.innerHTML = '';
  if (!store.cashClosures || store.cashClosures.length === 0) {
    closuresTbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: var(--text-muted); padding: 24px;">No hay cierres anteriores registrados.</td></tr>`;
  } else {
    store.cashClosures.slice().reverse().forEach(c => {
      const dateFormatted = new Date(c.closedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
      const diffClass = c.difference === 0 ? 'color: #4ade80' : (c.difference > 0 ? 'color: #60a5fa' : 'color: #f87171');
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${dateFormatted}</strong></td>
        <td>${formatMoney(c.initialFund)}</td>
        <td><strong>${formatMoney(c.totalSales)}</strong></td>
        <td>${formatMoney(c.expectedCash)}</td>
        <td><b>${formatMoney(c.countedCash)}</b></td>
        <td><strong style="${diffClass}">${c.difference >= 0 ? '+' : ''}${formatMoney(c.difference)}</strong></td>
        <td>${formatMoney(c.totalCommissions)}</td>
        <td>${escapeHtml(c.responsible)}</td>
      `;
      closuresTbody.appendChild(tr);
    });
  }
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
      badge.textContent = `Diferencia: $0.00 (Caja Cuadrada Perfecta ✅)`;
    } else if (diff > 0) {
      badge.className = 'diff-badge surplus';
      badge.textContent = `Sobrante: +${formatMoney(diff)} (Efectivo extra en cajón 🟢)`;
    } else {
      badge.className = 'diff-badge missing';
      badge.textContent = `Faltante: -${formatMoney(Math.abs(diff))} (Falta efectivo ⚠️)`;
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
  let totalCommissions = 0;

  todayMovs.forEach(m => {
    if (m.type === 'venta') {
      totalSales += m.amount;
      if (m.paymentMethod === 'efectivo') salesCash += m.amount;
      if (m.commissions) {
        for (const bId in m.commissions) totalCommissions += m.commissions[bId] + (m.tip || 0);
      }
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
    difference: difference,
    totalCommissions: totalCommissions
  };

  if (!store.cashClosures) store.cashClosures = [];
  store.cashClosures.push(closure);

  saveStore();
  closeModal('modal-cashcut');
  renderCashRegister();
  showToast("¡Cierre de caja registrado exitosamente!", "success");
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
    let commissionEarned = 0;
    let tipsEarned = 0;

    todayMovs.forEach(mov => {
      if (mov.barberId === barber.id) {
        totalGenerated += mov.amount;
        tipsEarned += (mov.tip || 0);
        if (mov.commissions && mov.commissions[barber.id]) {
          commissionEarned += mov.commissions[barber.id];
          servicesCount += 1;
        }
      }
    });

    const card = document.createElement('div');
    card.className = 'panel-card';
    card.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 50px; height: 50px; border-radius: 50%; background: #2b3240; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; border: 2px solid var(--gold-primary);">
            ${barber.avatar || '💈'}
          </div>
          <div>
            <h4 style="font-size: 1.05rem; color: #fff; font-weight: 700;">${escapeHtml(barber.name)}</h4>
            <span style="font-size: 0.8rem; color: var(--gold-primary);">${escapeHtml(barber.specialty)}</span>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="editBarber('${barber.id}')" title="Editar">✏️ Editar</button>
      </div>

      <div style="background-color: var(--bg-secondary); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem;">
        <div style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 6px;">
          <span style="color: var(--text-secondary);">Cuenta de acceso:</span>
          <b style="color: #4ade80;">Usuario: ${escapeHtml(barber.username || barber.id)}</b>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-secondary);">Comisión Servicios / Productos:</span>
          <b style="color: #fff;">${barber.serviceCommission}% / ${barber.productCommission}%</b>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-secondary);">Cortes Atendidos Hoy:</span>
          <b style="color: #fff;">${servicesCount}</b>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-secondary);">Propinas Hoy:</span>
          <b style="color: #4ade80;">+${formatMoney(tipsEarned)}</b>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 1rem; border-top: 1px dashed var(--border-color); padding-top: 8px; color: var(--gold-primary);">
          <span>Ganancia a Liquidar:</span>
          <b>${formatMoney(commissionEarned + tipsEarned)}</b>
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
  document.getElementById('barber-form-commission-service').value = barber.serviceCommission;
  document.getElementById('barber-form-commission-product').value = barber.productCommission;
  document.getElementById('barber-form-username').value = barber.username || '';
  document.getElementById('barber-form-password').value = barber.password || '';

  document.getElementById('btn-save-barber').dataset.editId = barberId;
  openModal('modal-barber');
}

function saveBarberFromModal() {
  const name = document.getElementById('barber-form-name').value.trim();
  const phone = document.getElementById('barber-form-phone').value.trim();
  const specialty = document.getElementById('barber-form-specialty').value.trim();
  const srvComm = parseFloat(document.getElementById('barber-form-commission-service').value) || 50;
  const prodComm = parseFloat(document.getElementById('barber-form-commission-product').value) || 15;
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
      existing.serviceCommission = srvComm;
      existing.productCommission = prodComm;
      existing.username = username || existing.username;
      existing.password = password || existing.password;
    }
    delete document.getElementById('btn-save-barber').dataset.editId;
    showToast("Barbero actualizado con éxito", "success");
  } else {
    store.barbers.push({
      id: `b-${Date.now()}`,
      name: name,
      phone: phone,
      specialty: specialty || "Barbero Profesional",
      serviceCommission: srvComm,
      productCommission: prodComm,
      username: username || name.split(' ')[0].toLowerCase(),
      password: password || '123',
      avatar: "💈"
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
      <td>⏱️ ${s.duration} min</td>
      <td><strong style="color: var(--gold-primary); font-size: 1rem;">${formatMoney(s.price)}</strong></td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteService('${s.id}')">🗑️</button></td>
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
      <td><span class="badge ${isLow ? 'badge-cancel' : 'badge-done'}">${p.stock} unid. ${isLow ? '⚠️ Stock Bajo' : ''}</span></td>
      <td style="color: var(--text-secondary);">${formatMoney(p.cost)}</td>
      <td><strong style="color: var(--gold-primary);">${formatMoney(p.price)}</strong></td>
      <td><button class="btn btn-danger btn-sm" onclick="deleteProduct('${p.id}')">🗑️</button></td>
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
      <td><strong style="color:#fff;">${escapeHtml(c.name)}</strong></td>
      <td>${escapeHtml(c.phone || 'Sin registrar')}</td>
      <td><b>${c.visits}</b> visitas</td>
      <td><strong style="color: var(--gold-primary);">${formatMoney(c.totalSpent)}</strong></td>
      <td style="font-size: 0.8rem; color: var(--text-secondary); max-width: 250px;">${escapeHtml(c.notes || '-')}</td>
      <td><button class="btn btn-secondary btn-sm" onclick="quickBookForClient('${c.id}')">📅 Agendar</button></td>
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
    tip: 0,
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
    ${movement.tip > 0 ? `
      <div style="display:flex; justify-content:space-between; font-size:11px;">
        <span>Propina:</span>
        <span>${formatMoney(movement.tip)}</span>
      </div>
    ` : ''}
    ${movement.discount > 0 ? `
      <div style="display:flex; justify-content:space-between; font-size:11px;">
        <span>Descuento:</span>
        <span>-${formatMoney(movement.discount)}</span>
      </div>
    ` : ''}
    <div style="display:flex; justify-content:space-between; font-weight:bold; font-size:14px; margin-top:4px;">
      <span>TOTAL:</span>
      <span>${formatMoney(movement.amount)}</span>
    </div>
    <div style="display:flex; justify-content:space-between; font-size:11px; margin-top:2px;">
      <span>Método de Pago:</span>
      <span style="text-transform:capitalize;">${movement.paymentMethod}</span>
    </div>
    <div class="receipt-divider"></div>
    <div class="receipt-center" style="margin-top:8px;">
      ¡Gracias por tu preferencia!<br>Vuelve pronto.
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
    <div style="display:flex; justify-content:space-between;"><span>Comisiones Barberos:</span> <span>${formatMoney(cut.totalCommissions)}</span></div>
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
  // Login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleLogin();
    });
  }

  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) btnLogout.addEventListener('click', logout);

  // Navegación Sidebar
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.dataset.view;
      if (view) switchView(view);
    });
  });

  document.getElementById('btn-toggle-sidebar').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  // Pestañas POS
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

  document.getElementById('pos-tip-input').addEventListener('input', () => renderPosCart());
  document.getElementById('pos-discount-input').addEventListener('input', () => renderPosCart());

  // Apertura de Modales
  document.getElementById('btn-header-new-appointment').addEventListener('click', () => openNewAppointmentModal());
  const btnOpenApp = document.getElementById('btn-modal-open-appointment');
  if (btnOpenApp) btnOpenApp.addEventListener('click', () => openNewAppointmentModal());

  document.getElementById('btn-modal-open-expense').addEventListener('click', () => openModal('modal-expense'));
  document.getElementById('btn-modal-open-cashcut').addEventListener('click', openCashCutModal);
  document.getElementById('btn-quick-cash').addEventListener('click', () => switchView('cash-register'));

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

  // Guardado en Modales
  document.getElementById('btn-save-appointment').addEventListener('click', saveAppointmentFromModal);
  document.getElementById('btn-save-expense').addEventListener('click', saveExpenseFromModal);
  document.getElementById('btn-save-barber').addEventListener('click', saveBarberFromModal);
  document.getElementById('btn-save-service').addEventListener('click', saveServiceFromModal);
  document.getElementById('btn-save-product').addEventListener('click', saveProductFromModal);
  document.getElementById('btn-save-client').addEventListener('click', saveClientFromModal);
  document.getElementById('btn-confirm-cashcut').addEventListener('click', confirmCashCut);

  // Filtros
  const filterBarber = document.getElementById('filter-appointment-barber');
  if (filterBarber) filterBarber.addEventListener('change', renderAppointments);

  const filterSearch = document.getElementById('filter-clients-search');
  if (filterSearch) filterSearch.addEventListener('input', renderClients);

  // Reserva Pública
  document.getElementById('btn-public-submit-booking').addEventListener('click', submitPublicBooking);

  // Impresión y Exportación
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
    case 'pendiente': return `<span class="badge badge-pending">⏳ Pendiente</span>`;
    case 'en_proceso': return `<span class="badge badge-progress">✂️ En Sillón</span>`;
    case 'completada': return `<span class="badge badge-done">✅ Completada</span>`;
    case 'cancelada': return `<span class="badge badge-cancel">❌ Cancelada</span>`;
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
