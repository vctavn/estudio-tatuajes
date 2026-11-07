# TATTOO STUDIO - Sistema de Gestión

Sistema web profesional, sobrio y optimizado para la gestión integral de **Estudios de Tatuaje y Piercing en México** (Español de México, moneda MXN). Diseñado con una interfaz SaaS B2B limpia en modo oscuro, adaptable a pantallas de computadora y celulares sin desplazamiento horizontal.

---

## 🎨 Paleta de Colores
- **Fondo:** `#0E0E10`
- **Superficie:** `#17171A`
- **Borde:** `#2C2C33`
- **Texto:** `#F2EDE4`
- **Acento Primario:** `#C8102E` (Crimson / Rojo sangre)
- **Acento Secundario:** `#D4A64A` (Gold / Latón)
- **Éxito:** `#3FA672` (Verde esmeralda)
- **Error:** `#FF5A5F` (Coral rojizo)

---

## 👥 Sesiones de Acceso
El sistema cuenta exclusivamente con **dos roles de usuario**:
1. **Caja / Admin:** Usuario `caja` | Contraseña `123`
   - Acceso total a Tablero, Solicitudes & Cotizaciones, Agenda de Sesiones, Punto de Venta (POS) con deducción de anticipos, Corte y Arqueo de Caja, Perfil de Tatuador & Cabina, Servicios & Joyería, Directorio de Clientes y Botón de Limpieza Demo para presentaciones.
2. **Tatuador:** Usuario `tatuador` | Contraseña `123`
   - Acceso enfocado a Mis Sesiones en Cabina, Mis Cotizaciones Asignadas y Mis Propinas.

---

## ⚡ Características Principales Implementadas

1. **Nombre del Negocio Oficial:**
   - **Tattoo Studio** (Identificador visual `TS`).

2. **Botón de Demostración ("Limpiar Datos Demo"):**
   - Diseñado específicamente para **presentaciones de venta en vivo del software**.
   - Con un solo clic (con confirmación de seguridad en modal), restablece a cero las citas, clientes, cotizaciones y movimientos de caja de prueba, permitiendo demostrar el sistema completamente limpio y funcional ante clientes prospectos.

3. **Selector Completo de Diseños y Estilos de Tatuaje:**
   - En el formulario de solicitud de proyecto se eliminó la selección de artista y se integraron todos los estilos y técnicas de la industria:
     - *Blackwork, Fine Line / Trazo Fino, Micro-realismo / Black & Grey, Realismo a Color, Neotradicional, Tradicional Americano / Old School, Japonés Tradicional (Irezumi), Geométrico & Puntillismo (Dotwork), Acuarela / Watercolor, Letras / Caligrafía (Lettering), Anime / Manga / Ilustrativo, Surrealismo / Trash Polka, Tribal / Polinesio / Maorí, Flash / Minimalista, Retoque / Cover-Up y Piercing Corporal*.

4. **Adjuntar Archivo Directo para Fotos o Referencias:**
   - Permite subir archivos de imagen (JPG, PNG, WEBP o capturas de pantalla) directamente desde la galería o explorador del dispositivo móvil/PC con vista previa inmediata, además de soportar URLs web de referencia.

5. **Formulario de Solicitud & Anticipos:**
   - Captura de idea, zona anatómica, medidas en cm, edad con alerta legal para menores de 18 años, y descripción técnica.
   - Evaluación y cotización con generación de enlace de depósito bancario/SPEI.
   - Máquina de estados: `Solicitud` ➔ `Cotizada` ➔ `Depósito pagado` ➔ `Agendada` ➔ `Realizada` ➔ `Retoque`.

6. **Descuento Automático de Anticipo en POS:**
   - Al liquidar la sesión en caja, el anticipo pagado se descuenta automáticamente del monto total y se desglosa en el ticket térmico/digital.

7. **Horarios en Formato 12 Horas (AM/PM) & Duración Libre:**
   - Visualización de horarios en formato estándar (ej. `1:00 PM - 3:30 PM`).
   - Selector de duración flexible (30m, 1h, 1.5h, 2h, 3h, 4h, 5h, 6h) o minutos personalizados.

8. **Optimización Móvil & Sin Reserva Online:**
   - Se removió el canal de reserva pública en línea según especificación.
   - Interfaz con selector dinámico Computadora / Celular, navegación táctil inferior y ancho 100% libre de desplazamiento horizontal.

---

## 🚀 Cómo Iniciar el Sistema
- **Opción 1:** Haz doble clic en `abrir_estudio.bat`.
- **Opción 2:** Haz doble clic en `actualizar_y_abrir.bat` para sincronizar con GitHub y abrir.
- **Opción 3:** Abre `index.html` directamente en tu navegador web preferido (Chrome, Edge, Safari, Firefox).
