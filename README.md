# 🍽️ Banreservas Auditoría - Prueba Técnica
## Sistema de Gestión de Reservas de Restaurante

Un sistema completo de gestión de reservas para restaurantes construido con **Vue 3**, **TypeScript**, **Bootstrap 5** y **Composition API**.

---

## ✨ Características Principales

### 🔐 **Autenticación Segura**
- Sistema de autenticación basado en JWT
- Protección de rutas con guards de navegación
- Gestión automática de tokens y renovación

### 📱 **Gestión de Reservas**
- **Crear** nuevas reservas con validación de formularios
- **Leer** todas las reservas con paginación
- **Actualizar** reservas existentes y su estado
- **Eliminar** reservas con confirmación de seguridad

### 🎨 **Interfaz de Usuario Elegante**
- Diseño responsive con Bootstrap 5
- Interfaz completamente en español
- Animaciones y transiciones suaves
- Tema de gradientes personalizados
- Iconos de Bootstrap Icons

### 📊 **Funcionalidades Avanzadas**
- Búsqueda en tiempo real por nombre, email o teléfono
- Filtrado por estado de reserva
- Paginación inteligente
- Modales elegantes para formularios
- Estados de carga y manejo de errores

---

## 🏗️ Arquitectura Técnica

### **Frontend Stack**
- **Vue 3** con Composition API
- **TypeScript** para tipado estático
- **Pinia** para gestión de estado
- **Vue Router** para navegación
- **Bootstrap 5** para UI components
- **Axios** para comunicación con API
- **Vite** para desarrollo y build

### **Estructura de Proyecto**
```
src/
├── components/           # Componentes reutilizables
│   ├── AppNavbar.vue    # Navegación principal
│   ├── ReservationModal.vue  # Modal de creación/edición
│   └── DeleteConfirmationModal.vue
├── views/               # Páginas principales
│   ├── HomeView.vue     # Página de inicio
│   ├── LoginView.vue    # Página de login
│   ├── ReservationsView.vue  # Gestión de reservas
│   └── NotFoundView.vue # Página 404
├── services/            # Capa de servicios
│   ├── authService.ts   # Servicio de autenticación
│   └── reservationService.ts  # Servicio de reservas
├── stores/              # Gestión de estado con Pinia
│   ├── auth.ts          # Store de autenticación
│   └── reservations.ts  # Store de reservas
├── types/               # Definiciones de TypeScript
├── utils/               # Utilidades y helpers
└── router/              # Configuración de rutas
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js** (versión 20.19.0 o 22.12.0+)
- **npm** o **yarn**

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Jeroo18/barnreservas-auditoria-prueba-tecnica.git
cd barnreservas-auditoria-prueba-tecnica
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Desarrollo Local
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`

### 4. Build para Producción
```bash
npm run build
```

### 5. Vista Previa de Producción
```bash
npm run preview
```

---

## 🔧 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo con hot-reload |
| `npm run build` | Construye la aplicación para producción |
| `npm run preview` | Vista previa de la versión de producción |
| `npm run test:unit` | Ejecuta las pruebas unitarias con Vitest |
| `npm run lint` | Ejecuta ESLint para revisar el código |
| `npm run format` | Formatea el código con Prettier |
| `npm run type-check` | Verifica tipos con TypeScript |

---

## 🎮 Uso de la Aplicación

### **Autenticación**
1. Navega a `/login`
2. Ingresa credenciales o usa parámetros URL para pruebas:
   ```
   /login?username=admin&password=password
   ```

### **Gestión de Reservas**
1. **Ver Reservas**: Navega a `/reservations`
2. **Crear Reserva**: Click en "Nueva Reserva" (requiere autenticación)
3. **Buscar**: Usa la barra de búsqueda en tiempo real
4. **Filtrar**: Selecciona estado en el dropdown de filtros
5. **Editar**: Click en el ícono de edición (requiere autenticación)
6. **Eliminar**: Click en el ícono de eliminación con confirmación

---

## 📱 Características Responsive

### **Breakpoints**
- **Mobile**: < 576px
- **Tablet**: 576px - 991px
- **Desktop**: ≥ 992px

### **Optimizaciones Móviles**
- Touch targets de mínimo 48px
- Texto adaptativo según tamaño de pantalla
- Navegación colapsable
- Modales optimizados para móvil
- Orientación landscape soportada

---

## 🔒 Seguridad

- **JWT Authentication**: Tokens seguros con expiración
- **Route Guards**: Protección de rutas sensibles
- **Form Validation**: Validación client-side y server-side
- **XSS Protection**: Sanitización de inputs
- **CORS**: Configuración adecuada para APIs

---

## 🌐 Navegación

| Ruta | Descripción | Autenticación |
|------|-------------|---------------|
| `/` | Página de inicio | No requerida |
| `/login` | Iniciar sesión | Solo invitados |
| `/reservations` | Gestión de reservas | No requerida (ver) |
| `/about` | Información | No requerida |

---

## 🎨 Temas y Estilos

### **Paleta de Colores**
- **Primario**: Gradiente azul-púrpura (#667eea → #764ba2)
- **Secundario**: Grises suaves (#f8f9fa, #6c757d)
- **Estados**: Verde (éxito), Rojo (error), Amarillo (advertencia)

### **Características Visuales**
- Bordes redondeados (border-radius: 0.5rem - 1rem)
- Sombras suaves con blur
- Transiciones suaves (0.3s ease)
- Efectos hover con transform
- Animaciones de entrada con keyframes

---

## 💻 Configuración Recomendada del IDE

### **VS Code**
- [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### **Extensiones del Navegador**
- [Vue.js devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)

---

## 📋 Estados de Reserva

| Estado | Descripción | Color |
|--------|-------------|-------|
| `PENDING` | Pendiente de confirmación | Amarillo |
| `CONFIRMED` | Confirmada | Verde |
| `CANCELLED` | Cancelada | Rojo |
| `COMPLETED` | Completada | Gris |

---

## 🤝 Contribución

Este proyecto fue desarrollado como parte de una prueba técnica para Banreservas.

### **Generado con**
🤖 [Claude Code](https://claude.ai/code)

**Co-Authored-By:** Claude <noreply@anthropic.com>

---

## 📄 Licencia

Este proyecto es parte de una evaluación técnica y está destinado únicamente para fines educativos y de demostración.

---

## 📞 Soporte

Para preguntas o issues relacionados con este proyecto, por favor contacta al equipo de desarrollo.