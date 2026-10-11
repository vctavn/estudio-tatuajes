# 💈 The Barber Club & Co. - Sistema de Gestión de Barbería

Sistema web integral, moderno y ligero para la gestión diaria de una barbería profesional. Funciona **completamente offline** en cualquier navegador web moderno (Edge, Chrome, Firefox, Brave) sin necesidad de instalar Node.js ni Python.

---

## 🚀 Cómo Iniciar el Sistema

1. **Opción 1:** Haz doble clic sobre el archivo `abrir_barberia.bat`.
2. **Opción 2:** Haz doble clic sobre `index.html` para abrirlo en tu navegador.

---

## 🔐 Sistema de Sesiones & Cuentas por Rol

La plataforma cuenta con un sistema de autenticación para separar la información financiera de la agenda de los barberos:

### 1. 💼 Sesión de Caja / Administrador
- **Usuario:** `caja` (o `admin`) | **Contraseña:** `123`
- **Acceso:** Acceso total a toda la plataforma:
  - Tablero general con ingresos del día y tickets promedio.
  - Agenda global de todos los barberos.
  - Punto de Venta (POS) para cobrar servicios y productos.
  - Corte de Caja diario con arqueo de dinero en efectivo y registro de gastos.
  - Gestión de comisiones y credenciales de acceso de cada barbero.
  - Catálogo de servicios y control de stock de productos.
  - Directorio de clientes.

### 2. ✂️ Sesiones Individuales para Barberos
- Cada barbero tiene su propio usuario y contraseña personal:
  - **Carlos Mendoza:** Usuario `carlos` | Contraseña `123`
  - **Mateo Silva:** Usuario `mateo` | Contraseña `123`
  - **David Romero:** Usuario `david` | Contraseña `123`
- *(El administrador puede crear nuevos barberos o cambiar sus contraseñas en cualquier momento).*
- **Acceso exclusivo del barbero:**
  - **Mi Agenda & Citas:** Vista privada de sus clientes y turnos asignados en tiempo real.
  - **Acciones Rápidas:** Marcar cliente en sillón (`✂️ En Sillón`) o terminado (`✅ Terminado`), y enviar recordatorios por WhatsApp.
  - **Mis Ganancias del Día:** Reporte transparente con sus cortes realizados, comisiones ganadas y propinas recibidas hoy.
  - **Seguridad:** No pueden ver la caja general ni las finanzas privadas de la barbería.

---

## 🌟 Módulos y Funcionalidades Incluidas

### 1. ✂️ Selección Múltiple de Servicios al Agendar
- Ahora se pueden elegir **múltiples servicios en la misma cita** (ej. *Corte Fade* + *Perfilado de Barba* + *Perfilado de Cejas*).
- Cálculo dinámico del precio total y de la duración estimada combinada.
- Transferencia automática de todos los servicios al Punto de Venta al momento de cobrar.

### 2. 📅 Calendario Interactivo & Selectores Visuales Premium
- **Calendario Integrado:** Navegación por meses con días interactivos, diseño oscuro con acentos dorados y detección del día de hoy.
- **Selector de Barberos:** Tarjetas visuales con avatar, especialidad y estado en sillón.
- **Selector de Horarios:** Cuadrícula de turnos (mañana y tarde) que deshabilita automáticamente los horarios ya reservados.

### 3. 💵 Corte de Caja & Arqueo Diario (Cash Cut)
- Fondo inicial de apertura de caja.
- Ventas desglosadas por Efectivo, Tarjeta y Transferencia.
- Registro de gastos menores de caja chica.
- Arqueo inteligente: compara el efectivo en sistema contra el dinero físico contado por el cajero (detecta caja cuadrada, faltantes o sobrantes).
- Resumen imprimible de cierre con comisiones de barberos.

### 4. 💳 Punto de Venta (POS) & Cobro
- Venta combinada de servicios y productos de cuidado personal.
- Asignación de barbero y cálculo de comisiones.
- Propinas voluntarias y descuentos.
- Generación e impresión de ticket térmico para impresoras de 58mm y 80mm.

### 5. 👥 Clientes & Reservas Online
- Directorio de clientes con historial de visitas y notas de corte preferido.
- Portal público para clientes con reserva online y confirmación directa por WhatsApp.

---

## 📁 Estructura del Proyecto

```
barbershop-system/
├── index.html          # Interfaz principal, pantalla de login y modales
├── styles.css          # Estilos premium, calendario oscuro y diseño térmico
├── app.js              # Lógica de sesiones, comisiones, citas múltiples y arqueo
├── abrir_barberia.bat  # Acceso directo para ejecutar en Windows con doble clic
├── subir_a_github.bat  # Asistente para futuras actualizaciones en Git
└── README.md           # Documentación completa del sistema
```
