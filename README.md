# 💈 The Barber Club & Co. - Sistema de Gestión de Barbería

Sistema web integral, moderno y ligero para la gestión diaria de una barbería profesional. Funciona **completamente offline** en cualquier navegador web moderno (Edge, Chrome, Firefox, Brave) sin necesidad de instalar Node.js ni Python.

---

## 🚀 Cómo Iniciar el Sistema

1. **Opción 1:** Haz doble clic sobre el archivo `abrir_barberia.bat`.
2. **Opción 2:** Haz doble clic sobre `index.html` para abrirlo en tu navegador.

---

## 🌟 Módulos y Funcionalidades Incluidas

### 1. 📅 Agenda de Citas & Turnos
- **Control de estados:** *Pendiente*, *En Sillón (Atendiendo)*, *Completada*, *Cancelada*.
- **Integración con WhatsApp:** Envío de recordatorios y confirmaciones con un solo clic hacia el WhatsApp del cliente con el texto ya redactado.
- **Cobro Express:** Botón directo **"Cobrar en Caja"** que transfiere la cita y su precio al Punto de Venta al terminar el servicio.
- **Filtros rápidos:** Visualiza las citas por día o filtra por barbero específico.

### 2. 💵 Corte de Caja & Arqueo Diario (Cash Cut)
- **Fondo Inicial de Caja:** Control del efectivo inicial para dar cambio.
- **Seguimiento en Vivo:** Monitorea en tiempo real las ventas separadas por:
  - 💵 Efectivo
  - 💳 Terminal Tarjeta (Débito/Crédito)
  - 📲 Transferencias / QR (SPEI / Bizum / etc.)
- **Registro de Gastos Menores:** Permite registrar salidas de dinero de caja chica (ej. garrafones de agua, insumos de limpieza, adelantos).
- **Arqueo y Cierre de Turno:**
  - El cajero ingresa el efectivo físico contado en el cajón.
  - El sistema calcula al instante la diferencia: **Caja Cuadrada**, **Faltante** (alerta roja) o **Sobrante**.
  - Muestra el cálculo acumulado de las **comisiones devengadas por cada barbero** en el turno.
  - Genera un resumen imprimible con firma de conformidad para el dueño o administrador.

### 3. 💳 Punto de Venta (POS) & Cobro
- **Cobro mixto:** Agrega servicios del corte y productos de cuidado personal al mismo ticket.
- **Asignación de Barbero:** Para acreditar la comisión correspondiente de la venta.
- **Propinas & Descuentos:** Registro de propinas voluntarias y promociones.
- **Control de Stock automático:** Descuenta del inventario los productos vendidos.
- **Impresión de Tickets Térmicos:** Formato listo para impresoras de 58mm y 80mm o para guardar en PDF.

### 4. ✂️ Barberos & Comisiones
- Configuración personalizada de porcentaje de comisión en servicios (ej. 50%, 60%) y en productos (ej. 15%).
- Resumen financiero individual en tiempo real:
  - Número de cortes realizados hoy.
  - Total facturado.
  - Comisiones acumuladas a liquidar.
  - Propinas recibidas.

### 5. 🧴 Inventario & Catálogo de Servicios
- Catálogo de servicios con duración estimada (minutos) y precio.
- Control de inventario de productos con precio de costo, precio de venta y alerta visual cuando el stock está bajo (menor o igual a 3 unidades).

### 6. 👥 Directorio de Clientes (CRM)
- Registro de clientes recurrentes.
- Historial con número de visitas y dinero total gastado.
- **Notas de estilo y preferencias:** Guarda especificaciones clave (ej. *"Fade medio con 0.5, navaja en patillas, tijera arriba"*).
- Botón rápido para agendar cita directamente a ese cliente.

### 7. 🌐 Portal de Reservas Online para Clientes
- Vista que el cliente puede utilizar desde su teléfono o computadora:
  1. Elige el servicio deseado.
  2. Selecciona a su barbero preferido con su avatar y especialidad.
  3. Selecciona la fecha y visualiza solo los horarios que realmente están disponibles (evita choques de citas).
  4. Ingresa sus datos y confirma mediante WhatsApp directo a la barbería.

### 8. 💾 Copia de Seguridad & Persistencia
- Todos los datos se guardan de forma permanente y automática en `localStorage`.
- Botón **"Exportar Datos"** en la barra superior para descargar un archivo `.json` de respaldo en cualquier momento.

---

## 📁 Estructura del Proyecto

```
barbershop-system/
├── index.html          # Interfaz principal, navegación y modales
├── styles.css          # Estilos premium oscuros, animaciones y formato térmico de ticket
├── app.js              # Lógica de negocio, base de datos local y cálculos
├── abrir_barberia.bat  # Acceso directo para ejecutar en Windows con doble clic
└── README.md           # Documentación completa del sistema
```
