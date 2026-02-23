# FallaMarket - Frontend React Adaptado

## Descripción

Frontend React adaptado para conectarse con el backend de **trajes falleros**. Este frontend ha sido completamente adaptado para gestionar trajes con las propiedades: `nombre`, `material` y `propietario`.

## Características Adaptadas

### ✅ Componentes Principales

1. **TrajeList** - Lista todos los trajes registrados
2. **TrajeForm** - Formulario para crear/editar trajes
3. **TrajeDetail** - Visualización detallada de un traje
4. **Home** - Página principal con estadísticas de trajes
5. **Navbar** - Navegación adaptada para trajes

### ✅ Hook Personalizado

- **useTrajes** - Hook para manejar todas las operaciones CRUD con la API del backend

### ✅ API Endpoints Conectados

- `GET /api/v1/trajes/` - Obtener todos los trajes
- `GET /api/v1/trajes/traje/:id` - Obtener un traje específico
- `POST /api/v1/trajes/anadir` - Crear nuevo traje
- `PUT /api/v1/trajes/editar/:id` - Actualizar traje
- `DELETE /api/v1/trajes/eliminar/:id` - Eliminar traje

## Estructura del Proyecto Adaptado

```
frontend-react/
├── src/
│   ├── components/
│   │   ├── TrajeList.js       # Lista de trajes con búsqueda
│   │   ├── TrajeForm.js       # Formulario create/edit
│   │   ├── TrajeDetail.js     # Vista detallada
│   │   ├── Home.js           # Página principal adaptada
│   │   ├── Navbar.js         # Navegación adaptada
│   │   └── Footer.js         # Sin cambios
│   ├── hooks/
│   │   └── useTrajes.js      # Hook para API de trajes
│   ├── App.js                # Rutas adaptadas
│   ├── App.css              # Estilos para trajes
│   └── index.js             # Sin cambios
├── package.json             # Con proxy al backend
└── README.md               # Este archivo
```

## Instalación y Ejecución

### 1. Instalar dependencias

```bash
cd frontend-react
npm install
```

### 2. Verificar configuración

El `package.json` ya tiene configurado el proxy al backend:

```json
{
  "proxy": "http://localhost:3000"
}
```

### 3. Ejecutar el frontend

```bash
npm start
```

El frontend se ejecutará en: **http://localhost:3001**

## Funcionalidades Implementadas

### 📋 Lista de Trajes

- Visualización de todos los trajes registrados
- Búsqueda en tiempo real por nombre, material o propietario
- Acciones rápidas: ver, editar, eliminar
- Información de fechas de creación y actualización

### ➕ Agregar Traje

- Formulario validado para crear nuevos trajes
- Campo de nombre personalizable
- Selector de materiales comunes + opción "Otro"
- Campo de propietario

### ✏️ Editar Traje

- Carga automática de datos existentes
- Formulario igual al de creación pero pre-poblado
- Actualización en tiempo real

### 👁️ Ver Detalles

- Página completa de información del traje
- Metadatos de fechas
- Acciones disponibles (editar/eliminar)
- Navegación breadcrumb

### 🏠 Página Principal

- Estadísticas en tiempo real:
  - Total de trajes registrados
  - Materiales únicos
  - Propietarios diferentes
- Visualización de trajes recientes
- Categorías por materiales principales

## Materiales Soportados

El formulario incluye estos materiales predefinidos:

- Seda
- Terciopelo
- Raso
- Brocado
- Lentejuela
- Damasco
- Faille
- Tul
- Gasa
- Otro (campo libre)

## Rutas Disponibles

- `/` - Página principal
- `/trajes` - Lista de todos los trajes
- `/trajes/add` - Agregar nuevo traje
- `/trajes/edit/:id` - Editar traje existente
- `/trajes/:id` - Ver detalles del traje

## Tecnologías Utilizadas

- **React 18** - Frontend framework
- **React Router 6** - Navegación
- **Bootstrap 5** - Estilos y componentes
- **Axios** - Cliente HTTP para API
- **Font Awesome** - Iconografía

## Conexión con Backend

### URL Base de la API

```javascript
const API_BASE_URL = 'http://localhost:3000/api/v1';
```

### Formato de Datos

Los trajes tienen esta estructura:

```javascript
{
  _id: "ObjectId",
  nombre: "string",
  material: "string", 
  propietario: "string",
  createdAt: "ISODate",
  updatedAt: "ISODate"
}
```

### Formato de Respuesta de la API

```javascript
// Éxito
{
  status: "Traje agregado correctamente", // o el mensaje correspondiente
  data: { /* traje object */ }
}

// Error
{
  status: "mensaje de error"
}
```

## Próximas Mejoras

- [ ] Filtrado por material
- [ ] Paginación para listas grandes
- [ ] Exportación de datos
- [ ] Búsqueda avanzada
- [ ] Imágenes para trajes
- [ ] Gestión de usuarios propietarios

## Backend Requerido

Este frontend está diseñado para trabajar específicamente con el backend que tiene:

- Modelo `Traje` con campos: nombre, material, propietario
- API REST en `/api/v1/trajes/`
- Respuestas en formato específico con campo `status`

## Notas de Desarrollo

1. **Proxy configurado**: El frontend usa proxy para evitar problemas de CORS
2. **Bootstrap incluido**: Los estilos están listos para usar
3. **Responsive**: Funciona en dispositivos móviles
4. **Validación**: Formularios incluyen validación básica
5. **Feedback visual**: Loading states y mensajes de error

---

**¡El frontend está completamente adaptado y listo para conectar con tu backend de trajes falleros!**