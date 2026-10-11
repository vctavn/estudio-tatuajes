# 💈 The Barber Club & Co. - Sistema de Gestión de Barbería

Sistema web integral, moderno y ligero para la gestión diaria de una barbería profesional. Funciona **completamente offline** en cualquier navegador web moderno (Edge, Chrome, Firefox, Brave) sin necesidad de instalar Node.js ni Python.

---

## 🚀 Cómo Iniciar el Sistema

1. **Opción 1:** Haz doble clic sobre el archivo `abrir_barberia.bat`.
2. **Opción 2:** Haz doble clic sobre `index.html` para abrirlo en tu navegador.

---

## 🔐 Sistema de Sesiones & Cuentas por Rol

La plataforma cuenta con un sistema de autenticación para separar la información de la caja de la agenda de los barberos:

### 1. 💼 Sesión de Caja / Administrador
- **Usuario:** `caja` (o `admin`) | **Contraseña:** `123`
- **Acceso:** Acceso total a toda la plataforma:
  - Tablero general con métricas e ingresos de hoy.
  - **Agenda de citas:** Control total de los estados de cada cita. Al seleccionar **"Completar y Cobrar"** en cualquier cita, el sistema **redirige de inmediato a la pantalla de cobro** con todos los servicios cargados en el ticket.
  - **Punto de Venta (POS):** Cobro directo y rápido de servicios y productos sin recargo de propinas.
  - **Corte de Caja Diario:** Control de fondo inicial, ingresos reales (efectivo, tarjeta, transferencia), salidas de caja chica y arqueo físico.
  - Gestión de cuentas y contraseñas de cada barbero (modalidad de **Sueldo Semanal**).
  - Catálogo de servicios, control de inventario y directorio de clientes.

### 2. ✂️ Sesiones Individuales para Barberos
- Cuentas de acceso individuales:
  - **Carlos Mendoza:** Usuario `carlos` | Contraseña `123`
  - **Mateo Silva:** Usuario `mateo` | Contraseña `123`
  - **David Romero:** Usuario `david` | Contraseña `123`
- **Acceso exclusivo del barbero:**
  - **Mi Agenda de Citas:** Visualiza únicamente a sus clientes y citas asignadas con su calendario interactivo.
  - **Estado en Tiempo Real (Solo Lectura):** El barbero ve el estado de cada cliente (`⏳ En Espera`, `✂️ En Sillón`, `✅ Cobrado / Completado`) asignado por la cajera en recepción, sin opción de modificarlo.
  - **Captura de Propinas Personales:** Apartado exclusivo para registrar las propinas directas en efectivo que le deja cada cliente, con historial y total acumulado.
  - **Seguridad:** Los barberos no ven los ingresos de la caja general, gastos ni finanzas privadas del negocio.

---

## 🌟 Funcionalidades Destacadas

### 1. 💳 Flujo de Cobro Express al Completar Cita
- Tan pronto como la cajera marca una cita como completada o hace clic en "Cobrar", el sistema salta automáticamente al Punto de Venta (POS), precarga el nombre del cliente y desglosa todos los servicios solicitados para cobrar al instante.

### 2. ✂️ Selección Múltiple de Servicios al Agendar
- Permite seleccionar varios servicios al mismo tiempo (ej. *Corte Fade* + *Perfilado de Barba* + *Perfilado de Cejas*).
- Suma dinámica en vivo del precio total y de los minutos combinados.

### 3. 📅 Calendario Interactivo & Selectores Visuales
- Calendario visual mensual con diseño oscuro y dorado.
- Selector visual de barberos con avatares y especialidad.
- Selector de turnos divididos en mañana y tarde que bloquea automáticamente los horarios ya ocupados.

### 4. 💵 Corte de Caja Diario (Arqueo de Turno)
- Fondo inicial de apertura.
- Arqueo físico: compara el dinero en el sistema con el efectivo contado en el cajón (detecta caja cuadrada, faltantes o sobrantes).
- Desglose de gastos y generación de ticket de cierre.

---

## 📁 Estructura del Proyecto

```
barbershop-system/
├── index.html          # Interfaz principal, pantalla de login y modales
├── styles.css          # Estilos premium oscuros, diseño térmico y calendario
├── app.js              # Lógica de sesiones, cobro directo, propinas y arqueo
├── abrir_barberia.bat  # Acceso directo para ejecutar en Windows con doble clic
├── subir_a_github.bat  # Asistente para actualizaciones en Git
└── README.md           # Documentación completa del sistema
```
