/**
 * BARBERSHOP SYSTEM - THE BARBER CLUB & CO.
 * Lógica Completa de la Aplicación en JavaScript
 */

// ================= ESTADO INICIAL Y PERSISTENCIA =================
const STORAGE_KEY = 'barbershop_system_data_v1';

const DEFAULT_DATA = {
  config: {
    shopName: "The Barber Club & Co.",
    currency: "$",
    initialCashFund: 500.00,
    isCashOpen: true,
    cashOpenedAt: new Date().toISOString(),
    phone: "525512345678",
    address: "Av. Principal #452, Zona Centro"
  },
  barbers: [
    {
      id: "b1",
      name: "Carlos 'Fade' Mendoza",
      phone: "5512345678",
      specialty: "Degradados, Skin Fade & Diseños",
      serviceCommission: 50, // 50%
      productCommission: 15, // 15%
      avatar: "💈"
    },
    {
      id: "b2",
      name: "Mateo 'Beard King' Silva",
      phone: "5587654321",
      specialty: "Barba Spa & Ritual Tradicional",
      serviceCommission: 55,
      productCommission: 15,
      avatar: "🧔"
    },
    {
      id: "b3",
      name: "David 'Scissors' Romero",
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

// Generar citas y movimientos iniciales de demostración para hoy
(function seedInitialData() {
  const todayStr = new Date().toISOString().split('T')[0];
  
  DEFAULT_DATA.appointments = [
    {
      id: "app-101",
      clientName: "Roberto Gómez",
      clientPhone: "5533445566",
      serviceId: "s3",
      serviceName: "Combo VIP (Corte + Barba + Toalla Caliente)",
      price: 290,
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
      serviceId: "s2",
      serviceName: "Perfilado y Ritual de Barba",
      price: 140,
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
      serviceId: "s1",
      serviceName: "Corte Clásico / Skin Fade",
      price: 180,
      barberId: "b1",
      date: todayStr,
      time: "14:00",
      status: "pendiente",
      notes: "Primera vez en la barbería."
    },
    {
      id: "app-104",
      clientName: "Fernando Lara",
      clientPhone: "5566778899",
      serviceId: "s3",
      serviceName: "Combo VIP (Corte + Barba + Toalla Caliente)",
      price: 290,
      barberId: "b3",
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
      concept: "Combo VIP + Cera Pomada",
      client: "Roberto Gómez",
      paymentMethod: "efectivo",
      barberId: "b1",
      barberName: "Carlos 'Fade' Mendoza",
      amount: 490,
      tip: 30,
      items: [
        { name: "Combo VIP", price: 290, qty: 1, type: "service", id: "s3" },
        { name: "Cera Pomada Mate", price: 200, qty: 1, type: "product", id: "p1" }
      ],
      commissions: { b1: 175 } // (290*0.5) + (200*0.15)
    },
    {
      id: "mov-2",
      timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      type: "gasto",
      concept: "Garrafón de agua purificada y vasos",
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
      // Validar claves mínimas
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

// ================= VARIABLES GLOBALES DE INTERFAZ =================
let currentView = 'dashboard';
let currentPosCart = [];
let currentPosTab = 'services';
let publicSelectedBarberId = null;
let publicSelectedTime = null;

// ================= INICIALIZACIÓN =================
document.addEventListener('DOMContentLoaded', () => {
  initUI();
  renderAllViews();
  setupEventListeners();
});

function initUI() {
  // Ajustar fecha de hoy en filtros
  const todayStr = new Date().toISOString().split('T')[0];
  const dateFilter = document.getElementById('filter-appointment-date');
  if (dateFilter) dateFilter.value = todayStr;

  const appFormDate = document.getElementById('app-form-date');
  if (appFormDate) appFormDate.value = todayStr;

  const publicDate = document.getElementById('public-book-date');
  if (publicDate) {
    publicDate.value = todayStr;
    publicDate.min = todayStr;
  }

  // Actualizar estado de caja en sidebar
  updateCashStatusBadge();
}

// ================= NAVEGACIÓN ENTRE VISTAS =================
function switchView(viewName) {
  currentView = viewName;
  document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

  const targetSec = document.getElementById(`view-${viewName}`);
  if (targetSec) targetSec.classList.add('active');

  const navLink = document.querySelector(`.nav-item[data-view="${viewName}"]`);
  if (navLink) navLink.classList.add('active');

  // Actualizar encabezados
  const titles = {
    'dashboard': { t: 'Tablero Principal', s: 'Resumen y métricas de la barbería hoy' },
    'appointments': { t: 'Agenda de Citas', s: 'Control de citas, turnos y clientes en espera' },
    'pos': { t: 'Punto de Venta (POS)', s: 'Cobro rápido de cortes, productos y propinas' },
    'cash-register': { t: 'Corte de Caja', s: 'Arqueo de turno, control de efectivo y gastos' },
    'barbers': { t: 'Barberos & Comisiones', s: 'Control de personal y cálculo de porcentajes' },
    'catalog': { t: 'Servicios & Productos', s: 'Catálogo de cortes, tratamientos y stock' },
    'clients': { t: 'Directorio de Clientes', s: 'Historial de visitas y preferencias de estilo' },
    'public-booking': { t: 'Reserva Online', s: 'Portal para clientes y confirmación vía WhatsApp' }
  };

  if (titles[viewName]) {
    document.getElementById('view-title').textContent = titles[viewName].t;
    document.getElementById('view-subtitle').textContent = titles[viewName].s;
  }

  // Cerrar sidebar en móviles
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.classList.remove('open');

  // Renderizar contenido dinámico de la vista seleccionada
  renderView(viewName);
}

function renderAllViews() {
  renderDashboard();
  renderAppointments();
  renderPOS();
  renderCashRegister();
  renderBarbers();
  renderCatalog();
  renderClients();
  renderPublicBooking();
}

function renderView(viewName) {
  switch (viewName) {
    case 'dashboard': renderDashboard(); break;
    case 'appointments': renderAppointments(); break;
    case 'pos': renderPOS(); break;
    case 'cash-register': renderCashRegister(); break;
    case 'barbers': renderBarbers(); break;
    case 'catalog': renderCatalog(); break;
    case 'clients': renderClients(); break;
    case 'public-booking': renderPublicBooking(); break;
  }
}

// ================= RENDERIZADO: DASHBOARD =================
function renderDashboard() {
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Calcular ventas de hoy
  const todaySales = store.cashMovements.filter(m => m.timestamp.startsWith(todayStr) && m.type === 'venta');
  const totalRevenue = todaySales.reduce((acc, cur) => acc + (cur.amount || 0), 0);
  
  const todayApps = store.appointments.filter(a => a.date === todayStr);
  const completedApps = todayApps.filter(a => a.status === 'completada').length;
  const avgTicket = todaySales.length > 0 ? (totalRevenue / todaySales.length) : 0;

  // Actualizar métricas
  document.getElementById('dash-stat-revenue').textContent = formatMoney(totalRevenue);
  document.getElementById('dash-stat-appointments').textContent = todayApps.length;
  document.getElementById('dash-stat-completed').textContent = completedApps;
  document.getElementById('dash-stat-avg-ticket').textContent = formatMoney(avgTicket);

  // Contador de citas pendientes en el sidebar
  const pendingCount = store.appointments.filter(a => a.date === todayStr && a.status === 'pendiente').length;
  const badgeEl = document.getElementById('badge-appointments-count');
  if (badgeEl) badgeEl.textContent = pendingCount;

  // Tabla de citas de hoy
  const tbody = document.getElementById('dash-today-appointments-tbody');
  tbody.innerHTML = '';

  if (todayApps.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--text-muted); padding: 24px;">No hay citas agendadas para el día de hoy.</td></tr>`;
  } else {
    todayApps.sort((a,b) => a.time.localeCompare(b.time)).forEach(app => {
      const barber = store.barbers.find(b => b.id === app.barberId) || { name: 'Sin asignar' };
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong style="color: var(--gold-primary);">${app.time}</strong></td>
        <td><b>${escapeHtml(app.clientName)}</b></td>
        <td>${escapeHtml(app.serviceName)}</td>
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

  // Estado de los Barberos / Sillones
  const barbersList = document.getElementById('dash-barbers-status-list');
  barbersList.innerHTML = '';
  store.barbers.forEach(barber => {
    // Verificar si está atendiendo a alguien ahorita
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
          <span class="badge badge-progress" title="Atendiendo a ${escapeHtml(inChair.clientName)}">En Sillón</span>
        ` : `
          <span class="badge badge-done">Disponible</span>
        `}
      </div>
    `;
    barbersList.appendChild(div);
  });
}

// ================= RENDERIZADO: AGENDA DE CITAS =================
function renderAppointments() {
  const dateInput = document.getElementById('filter-appointment-date');
  const selectedDate = dateInput ? dateInput.value : new Date().toISOString().split('T')[0];

  const barberSelect = document.getElementById('filter-appointment-barber');
  const selectedBarber = barberSelect ? barberSelect.value : 'all';

  // Poblar select de barberos para el filtro
  if (barberSelect) {
    const currentVal = barberSelect.value;
    barberSelect.innerHTML = `<option value="all">Todos los barberos</option>`;
    store.barbers.forEach(b => {
      barberSelect.innerHTML += `<option value="${b.id}">${escapeHtml(b.name)}</option>`;
    });
    if (currentVal) barberSelect.value = currentVal;
  }

  // Filtrar citas
  let filtered = store.appointments.filter(a => a.date === selectedDate);
  if (selectedBarber !== 'all') {
    filtered = filtered.filter(a => a.barberId === selectedBarber);
  }

  const tbody = document.getElementById('appointments-tbody');
  tbody.innerHTML = '';

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: var(--text-muted); padding: 32px;">No hay citas registradas para esta fecha y barbero.</td></tr>`;
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
          <button class="btn btn-secondary btn-sm" style="padding: 2px 6px; margin-left: 6px; font-size: 0.7rem;" onclick="sendWhatsAppReminder('${app.id}')" title="Enviar recordatorio WhatsApp">
            📲 WhatsApp
          </button>
        ` : ''}
      </td>
      <td>${escapeHtml(app.serviceName)}</td>
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
    renderDashboard();
    renderAppointments();
    showToast(`Estado de cita actualizado a: ${newStatus}`, 'info');
  }
}

function deleteAppointment(appId) {
  if (confirm("¿Estás seguro de que deseas eliminar esta cita?")) {
    store.appointments = store.appointments.filter(a => a.id !== appId);
    saveStore();
    renderDashboard();
    renderAppointments();
    showToast("Cita eliminada correctamente", "info");
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

// ================= RENDERIZADO: PUNTO DE VENTA (POS) =================
function renderPOS() {
  // Selector de barberos en POS
  const barberSelect = document.getElementById('pos-barber-select');
  if (barberSelect) {
    const curVal = barberSelect.value;
    barberSelect.innerHTML = '';
    store.barbers.forEach(b => {
      barberSelect.innerHTML += `<option value="${b.id}">${escapeHtml(b.name)}</option>`;
    });
    if (curVal) barberSelect.value = curVal;
  }

  // Renderizar catálogo según pestaña activa
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
          showToast(`Producto sin stock disponible (${prod.name})`, 'error');
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
        showToast("No hay más unidades en inventario", "error");
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
  const tipInput = document.getElementById('pos-tip-input');
  const discountInput = document.getElementById('pos-discount-input');

  const tip = parseFloat(tipInput.value) || 0;
  const discount = parseFloat(discountInput.value) || 0;

  const total = Math.max(0, subtotal + tip - discount);

  document.getElementById('pos-subtotal').textContent = formatMoney(subtotal);
  document.getElementById('pos-total').textContent = formatMoney(total);
}

// Pasar cita directamente a cobrar en caja
function directPayAppointment(appId) {
  const app = store.appointments.find(a => a.id === appId);
  if (!app) return;

  switchView('pos');

  // Rellenar datos en POS
  document.getElementById('pos-client-name').value = app.clientName;
  document.getElementById('pos-barber-select').value = app.barberId;

  // Agregar el servicio de la cita al carrito
  currentPosCart = [
    {
      id: app.serviceId,
      name: app.serviceName,
      price: app.price,
      qty: 1,
      type: 'service',
      linkedAppointmentId: app.id
    }
  ];

  renderPosCart();
  showToast(`Cita de ${app.clientName} cargada en caja para cobro`, 'info');
}

// Completar cobro en POS
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

  // Procesar ítems y descontar stock de productos
  currentPosCart.forEach(item => {
    subtotal += item.price * item.qty;

    if (item.type === 'service') {
      const commPct = (barber ? barber.serviceCommission : 50) / 100;
      barberCommission += (item.price * item.qty) * commPct;
    } else if (item.type === 'product') {
      const commPct = (barber ? barber.productCommission : 15) / 100;
      barberCommission += (item.price * item.qty) * commPct;

      // Descontar inventario
      const prodInStore = store.products.find(p => p.id === item.id);
      if (prodInStore) {
        prodInStore.stock = Math.max(0, prodInStore.stock - item.qty);
      }
    }

    // Si viene vinculado a una cita, marcarla completada
    if (item.linkedAppointmentId) {
      const linkedApp = store.appointments.find(a => a.id === item.linkedAppointmentId);
      if (linkedApp) linkedApp.status = 'completada';
    }
  });

  const total = Math.max(0, subtotal + tip - discount);

  // Registrar movimiento en el corte de caja
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

  // Actualizar o registrar cliente
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

  // Generar y mostrar ticket
  generateReceiptModal(movement);

  // Limpiar carrito
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

  // Acumulador de comisiones y propinas por barbero hoy
  const barberComms = {};
  store.barbers.forEach(b => barberComms[b.id] = { name: b.name, totalComm: 0, totalTips: 0, servicesCount: 0 });

  todayMovs.forEach(mov => {
    if (mov.type === 'venta') {
      if (mov.paymentMethod === 'efectivo') salesCash += mov.amount;
      if (mov.paymentMethod === 'tarjeta') salesCard += mov.amount;
      if (mov.paymentMethod === 'transferencia') salesTransf += mov.amount;

      // Sumar comisiones
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

  // Total de comisiones acumuladas hoy
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

  // Tabla de movimientos del día
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
        <td>
          <span class="badge ${isSale ? 'badge-done' : 'badge-cancel'}">
            ${isSale ? 'Ingreso Venta' : 'Salida Gasto'}
          </span>
        </td>
        <td>${escapeHtml(m.concept || m.client)}</td>
        <td><span style="text-transform: capitalize;">${m.paymentMethod}</span></td>
        <td>${escapeHtml(m.barberName || '-')}</td>
        <td><strong style="color: ${isSale ? '#4ade80' : '#ff6b6b'};">${isSale ? '+' : '-'}${formatMoney(m.amount)}</strong></td>
      `;
      movsTbody.appendChild(tr);
    });
  }

  // Historial de Cierres Anteriores
  const closuresTbody = document.getElementById('cash-history-tbody');
  closuresTbody.innerHTML = '';
  if (!store.cashClosures || store.cashClosures.length === 0) {
    closuresTbody.innerHTML = `<tr><td colspan="8" style="text-align:center; color: var(--text-muted); padding: 24px;">No hay cierres de caja anteriores registrados.</td></tr>`;
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

// Modal de Arqueo / Cierre
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
    showToast("Por favor ingresa la cantidad de efectivo físico contado", "error");
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

  // Marcar caja cerrada o reiniciar con nuevo fondo sugerido
  saveStore();
  closeModal('modal-cashcut');
  renderCashRegister();
  showToast("¡Cierre de caja registrado exitosamente!", "success");

  // Imprimir reporte de cierre
  generateCashCutPrint(closure);
}

// ================= RENDERIZADO: BARBEROS & COMISIONES =================
function renderBarbers() {
  const container = document.getElementById('barbers-cards-container');
  container.innerHTML = '';

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMovs = store.cashMovements.filter(m => m.timestamp.startsWith(todayStr) && m.type === 'venta');

  store.barbers.forEach(barber => {
    // Calcular estadísticas de hoy para este barbero
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
        <button class="btn btn-secondary btn-sm" onclick="editBarber('${barber.id}')" title="Editar">✏️</button>
      </div>

      <div style="background-color: var(--bg-secondary); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 8px; font-size: 0.85rem;">
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-secondary);">Comisión en Servicios:</span>
          <b style="color: #fff;">${barber.serviceCommission}%</b>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-secondary);">Comisión en Productos:</span>
          <b style="color: #fff;">${barber.productCommission}%</b>
        </div>
        <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border-color); padding-top: 8px;">
          <span style="color: var(--text-secondary);">Cortes/Servicios Hoy:</span>
          <b style="color: #fff;">${servicesCount}</b>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: var(--text-secondary);">Total Facturado:</span>
          <b style="color: #fff;">${formatMoney(totalGenerated)}</b>
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

  document.getElementById('modal-barber-title').textContent = "Editar Barbero";
  document.getElementById('barber-form-name').value = barber.name;
  document.getElementById('barber-form-phone').value = barber.phone || '';
  document.getElementById('barber-form-specialty').value = barber.specialty || '';
  document.getElementById('barber-form-commission-service').value = barber.serviceCommission;
  document.getElementById('barber-form-commission-product').value = barber.productCommission;

  document.getElementById('btn-save-barber').dataset.editId = barberId;
  openModal('modal-barber');
}

// ================= RENDERIZADO: CATÁLOGO DE SERVICIOS Y PRODUCTOS =================
function renderCatalog() {
  // Servicios
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
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteService('${s.id}')">🗑️</button>
      </td>
    `;
    srvTbody.appendChild(tr);
  });

  // Productos
  const prodTbody = document.getElementById('products-tbody');
  prodTbody.innerHTML = '';
  store.products.forEach(p => {
    const isLow = p.stock <= 3;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><b>${escapeHtml(p.name)}</b></td>
      <td>
        <span class="badge ${isLow ? 'badge-cancel' : 'badge-done'}">
          ${p.stock} unid. ${isLow ? '⚠️ Stock Bajo' : ''}
        </span>
      </td>
      <td style="color: var(--text-secondary);">${formatMoney(p.cost)}</td>
      <td><strong style="color: var(--gold-primary);">${formatMoney(p.price)}</strong></td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p.id}')">🗑️</button>
      </td>
    `;
    prodTbody.appendChild(tr);
  });
}

function deleteService(srvId) {
  if (confirm("¿Deseas eliminar este servicio del catálogo?")) {
    store.services = store.services.filter(s => s.id !== srvId);
    saveStore();
    renderCatalog();
    renderPOS();
    showToast("Servicio eliminado", "info");
  }
}

function deleteProduct(prodId) {
  if (confirm("¿Deseas eliminar este producto del inventario?")) {
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
      <td>
        <button class="btn btn-secondary btn-sm" onclick="quickBookForClient('${c.id}')" title="Agendar cita para este cliente">📅 Agendar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function quickBookForClient(clientId) {
  const client = store.clients.find(c => c.id === clientId);
  if (!client) return;
  openNewAppointmentModal(client);
}

// ================= RENDERIZADO: MODO RESERVA ONLINE =================
function renderPublicBooking() {
  // 1. Selector de Servicios
  const srvSelect = document.getElementById('public-book-service');
  srvSelect.innerHTML = '';
  store.services.forEach(s => {
    srvSelect.innerHTML += `<option value="${s.id}">${escapeHtml(s.name)} - ${formatMoney(s.price)} (${s.duration} min)</option>`;
  });

  // 2. Tarjetas de Barberos
  const barbersGrid = document.getElementById('public-book-barbers-grid');
  barbersGrid.innerHTML = '';

  if (!publicSelectedBarberId && store.barbers.length > 0) {
    publicSelectedBarberId = store.barbers[0].id;
  }

  store.barbers.forEach(barber => {
    const isSelected = barber.id === publicSelectedBarberId;
    const card = document.createElement('div');
    card.className = `barber-card-choice ${isSelected ? 'selected' : ''}`;
    card.onclick = () => {
      publicSelectedBarberId = barber.id;
      renderPublicBooking();
    };
    card.innerHTML = `
      <div class="barber-avatar">${barber.avatar || '💈'}</div>
      <strong style="color: #fff; font-size: 0.95rem; display: block;">${escapeHtml(barber.name)}</strong>
      <span style="font-size: 0.75rem; color: var(--gold-primary);">${escapeHtml(barber.specialty)}</span>
    `;
    barbersGrid.appendChild(card);
  });

  // 3. Horarios dinámicos
  renderPublicTimeSlots();
}

function renderPublicTimeSlots() {
  const slotsContainer = document.getElementById('public-book-slots-grid');
  slotsContainer.innerHTML = '';

  const dateInput = document.getElementById('public-book-date');
  const selectedDate = dateInput.value || new Date().toISOString().split('T')[0];

  // Horarios de la barbería: 10:00 a 20:00 cada 45 min
  const potentialSlots = [
    "10:00", "10:45", "11:30", "12:15", "13:00",
    "14:00", "14:45", "15:30", "16:15", "17:00",
    "17:45", "18:30", "19:15"
  ];

  // Citas existentes para este barbero y fecha
  const existingApps = store.appointments.filter(a => a.date === selectedDate && a.barberId === publicSelectedBarberId && a.status !== 'cancelada');
  const bookedTimes = existingApps.map(a => a.time);

  if (!publicSelectedTime || bookedTimes.includes(publicSelectedTime)) {
    publicSelectedTime = potentialSlots.find(t => !bookedTimes.includes(t)) || null;
  }

  potentialSlots.forEach(time => {
    const isBooked = bookedTimes.includes(time);
    const isSelected = time === publicSelectedTime;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `time-slot-btn ${isSelected ? 'selected' : ''} ${isBooked ? 'disabled' : ''}`;
    btn.textContent = time;

    if (!isBooked) {
      btn.onclick = () => {
        publicSelectedTime = time;
        renderPublicTimeSlots();
      };
    } else {
      btn.title = "Horario ya ocupado";
    }

    slotsContainer.appendChild(btn);
  });
}

function submitPublicBooking() {
  const name = document.getElementById('public-book-client-name').value.trim();
  const phone = document.getElementById('public-book-client-phone').value.trim();
  const notes = document.getElementById('public-book-client-notes').value.trim();
  const serviceId = document.getElementById('public-book-service').value;
  const date = document.getElementById('public-book-date').value;

  if (!name || !phone) {
    showToast("Por favor ingresa tu nombre y número de WhatsApp", "error");
    return;
  }

  if (!publicSelectedTime) {
    showToast("Por favor selecciona un horario disponible", "error");
    return;
  }

  const srv = store.services.find(s => s.id === serviceId);
  const barber = store.barbers.find(b => b.id === publicSelectedBarberId);

  const newApp = {
    id: `app-${Date.now()}`,
    clientName: name,
    clientPhone: phone,
    serviceId: serviceId,
    serviceName: srv ? srv.name : "Servicio",
    price: srv ? srv.price : 0,
    barberId: publicSelectedBarberId,
    barberName: barber ? barber.name : "Barbero",
    date: date,
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

  // Enlace de confirmación WhatsApp
  const shopPhone = store.config.phone || "525512345678";
  const msg = encodeURIComponent(
    `¡Hola! Acabo de agendar una cita en *${store.config.shopName}*:\n\n👤 *Cliente:* ${name}\n✂️ *Servicio:* ${newApp.serviceName}\n💈 *Barbero:* ${newApp.barberName}\n📅 *Fecha:* ${date} a las ${publicSelectedTime} hrs\n📝 *Notas:* ${notes || 'Ninguna'}\n\n¡Por favor confirmen mi cita!`
  );

  showToast("¡Tu cita ha sido agendada con éxito!", "success");

  // Limpiar campos
  document.getElementById('public-book-client-name').value = '';
  document.getElementById('public-book-client-phone').value = '';
  document.getElementById('public-book-client-notes').value = '';

  // Abrir WhatsApp para confirmación
  window.open(`https://wa.me/${shopPhone}?text=${msg}`, '_blank');
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

  // Poblar select de servicios
  const srvSelect = document.getElementById('app-form-service');
  srvSelect.innerHTML = '';
  store.services.forEach(s => {
    srvSelect.innerHTML += `<option value="${s.id}">${escapeHtml(s.name)} (${formatMoney(s.price)})</option>`;
  });

  // Poblar select de barberos
  const barberSelect = document.getElementById('app-form-barber');
  barberSelect.innerHTML = '';
  store.barbers.forEach(b => {
    barberSelect.innerHTML += `<option value="${b.id}">${escapeHtml(b.name)}</option>`;
  });

  document.getElementById('app-form-time').value = "11:00";
  document.getElementById('app-form-notes').value = prefillClient ? (prefillClient.notes || '') : '';

  openModal('modal-appointment');
}

function saveAppointmentFromModal() {
  const name = document.getElementById('app-form-client').value.trim();
  const phone = document.getElementById('app-form-phone').value.trim();
  const srvId = document.getElementById('app-form-service').value;
  const barberId = document.getElementById('app-form-barber').value;
  const date = document.getElementById('app-form-date').value;
  const time = document.getElementById('app-form-time').value;
  const notes = document.getElementById('app-form-notes').value.trim();

  if (!name || !date || !time) {
    showToast("Por favor llena el nombre del cliente, fecha y hora", "error");
    return;
  }

  const srv = store.services.find(s => s.id === srvId);
  const barber = store.barbers.find(b => b.id === barberId);

  const newApp = {
    id: `app-${Date.now()}`,
    clientName: name,
    clientPhone: phone,
    serviceId: srvId,
    serviceName: srv ? srv.name : "Servicio",
    price: srv ? srv.price : 0,
    barberId: barberId,
    barberName: barber ? barber.name : "Barbero",
    date: date,
    time: time,
    status: "pendiente",
    notes: notes
  };

  store.appointments.push(newApp);
  saveStore();
  closeModal('modal-appointment');
  renderAppointments();
  renderDashboard();
  showToast("Cita agendada correctamente", "success");
}

function saveExpenseFromModal() {
  const concept = document.getElementById('expense-concept').value.trim();
  const amount = parseFloat(document.getElementById('expense-amount').value);
  const barber = document.getElementById('expense-barber').value;

  if (!concept || isNaN(amount) || amount <= 0) {
    showToast("Ingresa un concepto y un monto válido para el gasto", "error");
    return;
  }

  const expenseMov = {
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
  };

  store.cashMovements.push(expenseMov);
  saveStore();
  closeModal('modal-expense');
  renderCashRegister();
  showToast("Gasto registrado en caja", "info");
}

function saveBarberFromModal() {
  const name = document.getElementById('barber-form-name').value.trim();
  const phone = document.getElementById('barber-form-phone').value.trim();
  const specialty = document.getElementById('barber-form-specialty').value.trim();
  const srvComm = parseFloat(document.getElementById('barber-form-commission-service').value) || 50;
  const prodComm = parseFloat(document.getElementById('barber-form-commission-product').value) || 15;

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
      avatar: "💈"
    });
    showToast("Barbero registrado con éxito", "success");
  }

  saveStore();
  closeModal('modal-barber');
  renderBarbers();
  renderPOS();
}

function saveServiceFromModal() {
  const name = document.getElementById('service-form-name').value.trim();
  const price = parseFloat(document.getElementById('service-form-price').value);
  const duration = parseInt(document.getElementById('service-form-duration').value) || 30;

  if (!name || isNaN(price) || price < 0) {
    showToast("Ingresa un nombre y precio válido", "error");
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
  showToast("Servicio agregado al catálogo", "success");
}

function saveProductFromModal() {
  const name = document.getElementById('product-form-name').value.trim();
  const price = parseFloat(document.getElementById('product-form-price').value);
  const cost = parseFloat(document.getElementById('product-form-cost').value) || 0;
  const stock = parseInt(document.getElementById('product-form-stock').value) || 0;

  if (!name || isNaN(price) || price < 0) {
    showToast("Ingresa un nombre y precio de venta válido", "error");
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
  showToast("Producto agregado al inventario", "success");
}

function saveClientFromModal() {
  const name = document.getElementById('client-form-name').value.trim();
  const phone = document.getElementById('client-form-phone').value.trim();
  const notes = document.getElementById('client-form-notes').value.trim();

  if (!name || !phone) {
    showToast("Nombre y teléfono son obligatorios", "error");
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
  showToast("Cliente registrado en directorio", "success");
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
        <span>Propina Barbero:</span>
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

// ================= EXPORTACIÓN Y COPIA DE SEGURIDAD =================
function exportBackupData() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  const now = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute("download", `barberia_backup_${now}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast("Copia de seguridad descargada en JSON", "success");
}

// ================= EVENT LISTENERS =================
function setupEventListeners() {
  // Navegación Sidebar
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.dataset.view;
      if (view) switchView(view);
    });
  });

  // Botón móvil sidebar
  document.getElementById('btn-toggle-sidebar').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  // Pestañas POS (Servicios / Productos)
  document.querySelectorAll('[data-pos-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-pos-tab]').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentPosTab = tab.dataset.posTab;
      renderPOS();
    });
  });

  // Botones POS
  document.getElementById('btn-pos-clear').addEventListener('click', () => {
    currentPosCart = [];
    renderPosCart();
  });

  document.getElementById('btn-pos-checkout').addEventListener('click', checkoutPOS);

  // Recalcular totales con propina y descuento
  document.getElementById('pos-tip-input').addEventListener('input', () => renderPosCart());
  document.getElementById('pos-discount-input').addEventListener('input', () => renderPosCart());

  // Apertura de Modales
  document.getElementById('btn-header-new-appointment').addEventListener('click', () => openNewAppointmentModal());
  document.getElementById('btn-modal-open-appointment').addEventListener('click', () => openNewAppointmentModal());
  document.getElementById('btn-modal-open-expense').addEventListener('click', () => openModal('modal-expense'));
  document.getElementById('btn-modal-open-cashcut').addEventListener('click', openCashCutModal);
  document.getElementById('btn-quick-cash').addEventListener('click', () => switchView('cash-register'));

  document.getElementById('btn-modal-open-barber').addEventListener('click', () => {
    document.getElementById('modal-barber-title').textContent = "Registrar Barbero";
    document.getElementById('barber-form-name').value = '';
    document.getElementById('barber-form-phone').value = '';
    document.getElementById('barber-form-specialty').value = '';
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

  // Guardar en Modales
  document.getElementById('btn-save-appointment').addEventListener('click', saveAppointmentFromModal);
  document.getElementById('btn-save-expense').addEventListener('click', saveExpenseFromModal);
  document.getElementById('btn-save-barber').addEventListener('click', saveBarberFromModal);
  document.getElementById('btn-save-service').addEventListener('click', saveServiceFromModal);
  document.getElementById('btn-save-product').addEventListener('click', saveProductFromModal);
  document.getElementById('btn-save-client').addEventListener('click', saveClientFromModal);
  document.getElementById('btn-confirm-cashcut').addEventListener('click', confirmCashCut);

  // Filtros de Citas
  document.getElementById('filter-appointment-date').addEventListener('change', renderAppointments);
  document.getElementById('filter-appointment-barber').addEventListener('change', renderAppointments);

  // Búsqueda de Clientes
  document.getElementById('filter-clients-search').addEventListener('input', renderClients);

  // Reserva Pública
  document.getElementById('public-book-date').addEventListener('change', renderPublicTimeSlots);
  document.getElementById('btn-public-submit-booking').addEventListener('click', submitPublicBooking);

  // Impresión y Exportación
  document.getElementById('btn-print-receipt').addEventListener('click', () => window.print());
  document.getElementById('btn-export-backup').addEventListener('click', exportBackupData);
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
    case 'pendiente':
      return `<span class="badge badge-pending">⏳ Pendiente</span>`;
    case 'en_proceso':
      return `<span class="badge badge-progress">✂️ En Sillón</span>`;
    case 'completada':
      return `<span class="badge badge-done">✅ Completada</span>`;
    case 'cancelada':
      return `<span class="badge badge-cancel">❌ Cancelada</span>`;
    default:
      return `<span class="badge">${escapeHtml(status)}</span>`;
  }
}

function updateCashStatusBadge() {
  const dot = document.getElementById('sidebar-cash-dot');
  const text = document.getElementById('sidebar-cash-text');
  if (store.config.isCashOpen) {
    dot.className = 'status-dot open';
    text.textContent = 'Caja Abierta';
  } else {
    dot.className = 'status-dot closed';
    text.textContent = 'Caja Cerrada';
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
