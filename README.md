# The Barber Club & Co. - Sistema de Gestión de Barbería

Sistema web profesional, sobrio y ligero para la gestión integral de una barbería comercial o cadena de sucursales. Diseñado con una interfaz SaaS B2B limpia y discreta, funciona de forma autónoma sin dependencias complejas ni frameworks pesados, garantizando máxima velocidad y privacidad.

---

## Cómo Iniciar el Sistema

1. **Opción 1:** Haz doble clic sobre el archivo `actualizar_y_abrir.bat` (sincroniza cambios si hay conexión y abre la app).
2. **Opción 2:** Haz doble clic sobre `abrir_barberia.bat` o `index.html` en tu navegador favorito.

---

## Sistema de Sesiones & Cuentas por Rol

La plataforma cuenta con un sistema de autenticación para separar la información sensible de la caja y administración de la vista de agenda de los barberos:

### 1. Sesión de Caja / Administrador
- **Usuario:** `caja` (o `admin`) | **Contraseña:** `123`
- **Acceso:** Control total de la plataforma:
  - **Tablero Principal:** Métricas en tiempo real de facturación, citas agendadas, servicios atendidos y ticket promedio.
  - **Agenda de Citas:** Control de estados de cada cliente. Al seleccionar **"Completar y Cobrar"**, el sistema redirige automáticamente al POS con los servicios precargados para cobro inmediato.
  - **Punto de Venta (POS):** Cobro de servicios y productos, desglose de tickets, descuentos y múltiples métodos de pago (efectivo, tarjeta, transferencia).
  - **Control & Corte de Caja:** Fondo inicial editable con clave de seguridad, desglose por método de pago, registro de gastos de caja chica, arqueo físico de efectivo y cálculo automático de sobrante/faltante.
  - **Gestión de Barberos:** Administración de personal y credenciales bajo modalidad de **Sueldo Semanal**.
  - **Catálogo & Inventario:** Gestión de tarifas de corte y stock de productos de cuidado.
  - **Directorio de Clientes:** Historial de consumos, visitas y preferencias de corte.
  - **Botón Limpiar Datos Demo:** Permite vaciar citas, propinas y movimientos de prueba para iniciar una demostración limpia.

### 2. Sesiones Individuales para Barberos
- Cuentas de acceso individuales:
  - **Carlos Mendoza:** Usuario `carlos` | Contraseña `123`
  - **Mateo Silva:** Usuario `mateo` | Contraseña `123`
  - **David Romero:** Usuario `david` | Contraseña `123`
- **Acceso exclusivo del barbero:**
  - **Mi Agenda de Citas:** Visualiza únicamente a sus clientes asignados con calendario interactivo.
  - **Estado en Tiempo Real (Solo Lectura):** Visualiza el estado asignado por la cajera (`En Espera`, `En Sillón`, `Cobrado / Completado`), sin permisos de modificación.
  - **Registro de Propinas:** Módulo exclusivo para registrar propinas directas en efectivo entregadas por los clientes, con historial y total acumulado.
  - **Privacidad Financiera:** El personal no tiene visibilidad sobre ingresos globales, gastos ni arqueos de caja del negocio.

---

## Funcionalidades Clave

### 1. Edición de Fondo Inicial con Clave de Dueño
- El fondo inicial de caja (por defecto $500) puede editarse directamente desde el módulo de Corte de Caja.
- Requiere autenticación con la contraseña autorizada de dueño: **`12345`**.

### 2. Limpieza de Datos de Demostración (Reset Demo)
- Diseñado para pruebas y demostraciones en vivo.
- Vacía en un solo clic las citas de agenda, los movimientos de caja, las propinas registradas y los cierres previos sin alterar el catálogo de servicios ni las cuentas de usuarios.

### 3. Flujo Directo de Cobro
- Al marcar una cita como completada en la agenda, el sistema abre la orden directamente en el Punto de Venta para agilizar la atención en recepción.

### 4. Selección Múltiple de Servicios
- Permite seleccionar combinaciones de servicios al agendar (ej. Corte Clásico + Perfilado de Barba + Cejas), calculando automáticamente precio y tiempo total.

---

## Estructura del Proyecto

```
barbershop-system/
├── index.html              # Interfaz principal, pantalla de acceso y modales
├── styles.css              # Hoja de estilos profesional SaaS (sobrio, sin emojis)
├── app.js                  # Lógica de sesiones, POS, arqueo, propinas y reset demo
├── abrir_barberia.bat      # Acceso directo rápido en Windows
├── actualizar_y_abrir.bat  # Script para actualizar vía git y abrir el sistema
└── README.md               # Documentación general del sistema
```
