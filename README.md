# FallaMarket - Marketplace de Trajes Valencianos

## Descripción del Proyecto

**FallaMarket** es una plataforma marketplace especializada en la compra y venta de trajes tradicionales valencianos falleros y sus accesorios. El proyecto implementa una arquitectura MEAN con dos frontends independientes (Angular y React) que consumen la misma API REST.

## Problema que Resolver

La comunidad fallera necesita una plataforma especializada donde puedan:
- Comprar y vender trajes falleros de manera segura
- Encontrar accesorios específicos para las fallas
- Intercambiar piezas entre falleros de diferentes comisiones
- Acceder a un catálogo organizado por categorías y precios

## Descripción Funcional

### Funcionalidades Principales:
- **Gestión de Usuarios**: Registro, autenticación y perfil de compradores/vendedores
- **Catálogo de Productos**: Listado, búsqueda y filtrado de trajes y accesorios
- **CRUD Completo**: Crear, leer, actualizar y eliminar productos y usuarios
- **Sistema de Categorías**: Organización por tipos de productos
- **Estados de Productos**: Control de disponibilidad y condición
- **Interfaz Responsiva**: Compatible con dispositivos móviles y desktop

## Entidades del Sistema

### 1. Trajes (Traje)
Representa los trajes falleros y accesorios disponibles en el marketplace.

**Campos:**
- `_id`: ObjectId - Identificador único (generado automáticamente)
- `nombre`: String - Nombre del traje (ej: "Traje Fallero Siglo XVIII") - **Obligatorio**
- `material`: String - Material del cual está compuesto el traje (ej: "Seda", "Brocado", "Terciopelo") - **Obligatorio**
- `propietario`: String - Nombre del propietario (ej: "Hugo", "Sonia") - **Obligatorio**
- `descripcion`: String - Descripción detallada del traje (10-500 caracteres) - **Obligatorio**
- `precio`: Number - Precio del traje en euros (debe ser > 0) - **Obligatorio**
- `disponible`: Boolean - Indica si el traje está disponible para la venta - **Obligatorio**
- `createdAt`: Date - Fecha de creación del registro (generado automáticamente)
- `updatedAt`: Date - Fecha de última actualización (generado automáticamente)

**Ejemplo de documento:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nombre": "Traje Fallero Siglo XVIII",
  "material": "Seda",
  "propietario": "Hugo",
  "descripcion": "Traje tradicional valenciano de época con detalles bordados en oro",
  "precio": 450.00,
  "disponible": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Materiales comunes:**
- `Seda`, `Brocado`, `Terciopelo`, `Raso`, `Tafetán`, `Damasco`, `Algodón`, `Lino`

---

### 2. Usuarios (User)
Representa a los compradores y vendedores de la plataforma.

**Campos:**
- `_id`: ObjectId - Identificador único
- `name`: String - Nombre completo del usuario
- `email`: String - Email único del usuario
- `phone`: String - Teléfono de contacto
- `location`: String - Ubicación (ciudad, barrio)
- `registrationDate`: Date - Fecha de registro en la plataforma
- `isActive`: Boolean - Estado de la cuenta
- `createdAt`: Date - Fecha de creación
- `updatedAt`: Date - Fecha de última actualización

## Reglas de Negocio

1. **Validación de Precios**: No se permiten precios negativos o igual a cero en el campo `precio`
2. **Email Único**: Cada usuario debe tener un email único en el sistema
3. **Campos Obligatorios de Traje**: Todos los campos (nombre, material, propietario, descripcion, precio, disponible) son obligatorios
4. **Validación de Nombre**: El nombre del traje debe tener al menos 3 caracteres
5. **Unicidad de Nombre**: No pueden existir dos trajes con el mismo nombre
6. **Trajes Disponibles**: Solo se muestran trajes con `disponible: true` en el catálogo público
7. **Validación de Campos**: Todos los campos obligatorios deben estar presentes en las peticiones
8. **Formato de Email**: El email del usuario debe tener un formato válido
9. **Longitud de Descripción**: La descripción del traje debe tener entre 10 y 500 caracteres
10. **Usuarios Activos**: Solo usuarios con `isActive: true` pueden realizar operaciones
11. **Validación de ID**: Los IDs deben ser ObjectId válidos de MongoDB
12. **Actualización Automática**: El campo `updatedAt` se actualiza automáticamente en cada modificación

## 🔌 API Endpoints

### 📚 Documentación General
```
GET /api/v1/documentacion - Documentación de la API
```

---

### 👔 Trajes (Endpoint Principal con Paginación)

#### **GET** `/api/v1/trajes` - Obtener todos los trajes
**Parámetros de consulta (Query Parameters):**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10)

**Ejemplo de petición:**
```bash
GET https://falleros.vercel.app/api/v1/trajes?page=2&limit=20
```

**Respuesta exitosa (200):**
```json
{
  "status": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "nombre": "Traje Fallero Siglo XVIII",
      "material": "Seda",
      "propietario": "Hugo",
      "descripcion": "Traje tradicional valenciano",
      "precio": 450.00,
      "disponible": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 2,
    "limit": 20,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPrevPage": true
  }
}
```

#### **GET** `/api/v1/trajes/traje/:id` - Obtener un traje por ID
**Parámetros:**
- `id`: ID del traje (MongoDB ObjectId)

**Respuesta exitosa (200):**
```json
{
  "status": "Traje encontrado correctamente",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "nombre": "Traje Fallero Siglo XVIII",
    "material": "Seda",
    "propietario": "Hugo",
    ...
  }
}
```

**Respuesta error (404):**
```json
{
  "status": "Traje no encontrado"
}
```

#### **POST** `/api/v1/trajes/anadir` - Crear nuevo traje
**Body (JSON):**
```json
{
  "nombre": "Traje Fallera Valenciana",
  "material": "Brocado",
  "propietario": "Sonia",
  "descripcion": "Traje de fallera mayor",
  "precio": 650.00,
  "disponible": true
}
```

**Respuesta exitosa (200):**
```json
{
  "status": "Traje agregado correctamente",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "nombre": "Traje Fallera Valenciana",
    ...
  }
}
```

#### **PUT** `/api/v1/trajes/editar/:id` - Actualizar traje
**Parámetros:**
- `id`: ID del traje

**Body (JSON):**
```json
{
  "nombre": "Traje Fallera Actualizado",
  "material": "Seda",
  "propietario": "Sonia"
}
```

**Respuesta exitosa (200):**
```json
{
  "status": "Traje actualizado correctamente",
  "data": { ... }
}
```

#### **DELETE** `/api/v1/trajes/eliminar/:id` - Eliminar traje
**Parámetros:**
- `id`: ID del traje

**Respuesta exitosa (200):**
```json
{
  "status": "Traje eliminado correctamente"
}
```

---

### 📦 Productos (Products)
```
GET    /api/v1/products/get/all                  - Obtener todos los productos
GET    /api/v1/products/get/:id                  - Obtener producto por ID
POST   /api/v1/products/post                     - Crear nuevo producto
PUT    /api/v1/products/update/:id               - Actualizar producto
DELETE /api/v1/products/delete/:id               - Eliminar producto
GET    /api/v1/products/category/:category       - Filtrar por categoría
GET    /api/v1/products/search?q=:query          - Búsqueda por nombre/descripción
```

---

### 👥 Usuarios (Users)
```
GET    /api/v1/users/get/all         - Obtener todos los usuarios
GET    /api/v1/users/get/:id         - Obtener usuario por ID
POST   /api/v1/users/post            - Crear nuevo usuario
PUT    /api/v1/users/update/:id      - Actualizar usuario
DELETE /api/v1/users/delete/:id      - Eliminar usuario
GET    /api/v1/users/email/:email    - Buscar usuario por email
```

## Ubicación del Proyecto

📁 **XAMPP**: `C:\xampp\htdocs\FallaMarket\`

## Instalación y Configuración

### 1. Configurar Backend
```bash
cd C:\xampp\htdocs\FallaMarket\backend
npm install
npm run dev
```

### 2. Configurar Frontend Angular
```bash
cd C:\xampp\htdocs\FallaMarket\frontend-angular
npm install
ng serve
```

### 3. Configurar Frontend React
```bash
cd C:\xampp\htdocs\FallaMarket\frontend-react
npm install
npm start
```

## 🌐 URLs de Producción
- **API Backend**: https://falleros.vercel.app/api/v1/
- **Frontend Angular**: https://fallerosangular.vercel.app/
- **Frontend React**: https://falleros-react.vercel.app/
  
## Tecnologías Utilizadas

### Backend
- **Node.js**: Runtime de JavaScript
- **Express**: Framework web para Node.js
- **MongoDB**: Base de datos NoSQL
- **Mongoose**: ODM para MongoDB
- **CORS**: Middleware para peticiones cross-origin

### Frontend Angular
- **Angular 17+**: Framework de desarrollo
- **Bootstrap 5**: Framework CSS
- **HttpClientModule**: Cliente HTTP de Angular
- **Reactive Forms**: Formularios reactivos

### Frontend React
- **React 18+**: Librería de interfaz de usuario
- **React Router**: Navegación entre componentes
- **Bootstrap 5**: Framework CSS
- **Axios**: Cliente HTTP

## ⚡ Características Destacadas

### 📄 Paginación Completa
El sistema incluye **paginación optimizada** implementada en todas las capas:

#### **Backend (Node.js + Express)**
- ✅ Endpoint principal: `GET /api/v1/trajes?page=1&limit=10`
- ✅ Parámetros configurables: `page` y `limit`
- ✅ Respuesta con metadata de paginación
- ✅ Ordenamiento por fecha de creación (más recientes primero)
- ✅ Optimización de consultas con MongoDB `.skip()` y `.limit()`

#### **Frontend Angular**
- ✅ Servicio con método `getTrajesPaginated(page, limit)`
- ✅ Componente de lista con controles visuales
- ✅ Interfaces TypeScript para tipado fuerte
- ✅ Gestión de estado reactiva con RxJS

#### **Frontend React**
- ✅ Hook personalizado `useTrajes()` con paginación
- ✅ Estado local para página actual y elementos por página
- ✅ Funciones `changePage()` y `changeItemsPerPage()`
- ✅ Integración con Axios para peticiones HTTP

### 🎛️ Controles de Paginación

**Navegación disponible:**
- 🔢 Botón "Primera página" (<<)
- ◀️ Botón "Página anterior"
- ▶️ Botón "Página siguiente"
- 🔢 Botón "Última página" (>>)
- 📊 Indicador de página actual (ej: "Página 2 de 5")
- 🔢 Contador total de elementos

**Selector de tamaño de página:**
- 5 elementos por página
- 10 elementos por página (default)
- 20 elementos por página
- 50 elementos por página

**Información en tiempo real:**
- Total de elementos en la base de datos
- Número de páginas totales
- Indicadores visuales de páginas disponibles
- Botones deshabilitados cuando no hay más páginas

### 📈 Beneficios de Rendimiento

✨ **Mejoras obtenidas:**
- ⚡ Reducción del tiempo de carga inicial
- 💾 Menor uso de memoria en el cliente
- 🚀 Respuestas del servidor más rápidas
- 📱 Mejor experiencia en dispositivos móviles
- 🎯 Escalabilidad para miles de registros

## 📸 Capturas de Pantalla

### 🖥️ Backend - API REST

#### Endpoint de Trajes con Paginación
![API Endpoint GET /api/v1/trajes con paginación](docs/screenshots/api-trajes-paginacion.png)

#### Respuesta JSON con Metadata de Paginación
```json
{
  "status": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "nombre": "Traje Fallero Siglo XVIII",
      "material": "Seda",
      "propietario": "Hugo",
      "descripcion": "Traje tradicional valenciano",
      "precio": 450.00,
      "disponible": true,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 2,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": true
  }
}
```

---

### 🅰️ Frontend Angular

#### Vista Principal - Lista de Trajes
![Lista de trajes con filtros y paginación](docs/screenshots/angular-traje-list.png)
- Lista de trajes con cards responsivas
- Filtros por nombre, material y propietario
- Controles de paginación completos
- Badges indicadores de estado

#### Formulario de Creación de Traje
![Formulario para añadir nuevo traje](docs/screenshots/angular-traje-form.png)
- Validación de campos en tiempo real
- Selector de materiales
- Campo de precio con validación
- Toggle de disponibilidad

#### Detalle de Traje
![Vista de detalle de un traje específico](docs/screenshots/angular-traje-detail.png)
- Información completa del traje
- Historial de fechas (creación/actualización)
- Botones de acción (editar, eliminar)

#### Controles de Paginación
![Controles de navegación entre páginas](docs/screenshots/angular-pagination.png)
- Navegación primera/anterior/siguiente/última
- Selector de elementos por página (5, 10, 20, 50)
- Indicador de página actual y total
- Contador total de elementos

---

### ⚛️ Frontend React

#### Vista Principal - Lista de Trajes
![Lista de trajes con búsqueda y paginación](docs/screenshots/react-traje-list.png)
- Diseño moderno con Bootstrap 5
- Buscador en tiempo real
- Cards con información del traje
- Paginación integrada

#### Formulario de Edición
![Formulario de edición de traje existente](docs/screenshots/react-traje-edit.png)
- Carga automática de datos
- Validación de formulario
- Feedback visual de errores

#### Vista Responsive Mobile
![Interfaz adaptada para dispositivos móviles](docs/screenshots/react-mobile.png)
- Diseño completamente responsivo
- Navegación optimizada para móvil
- Cards apiladas verticalmente

#### Paginación en Acción
![Sistema de paginación funcionando](docs/screenshots/react-pagination.png)
- Botones de navegación activos/desactivados
- Información de página actual
- Selector de tamaño de página

---

### 🔗 URLs de Producción Funcionando

#### Backend API en Vercel
![API desplegada en producción](docs/screenshots/vercel-backend.png)
- URL: https://falleros.vercel.app/api/v1/
- Estado: ✅ Activo
- Paginación: ✅ Implementada

#### Frontend Angular en Vercel
![Aplicación Angular desplegada](docs/screenshots/vercel-angular.png)
- URL: https://fallerosangular.vercel.app/
- Estado: ✅ Activo
- Paginación: ✅ Funcionando

#### Frontend React en Vercel
![Aplicación React desplegada](docs/screenshots/vercel-react.png)
- URL: https://falleros-react.vercel.app/
- Estado: ✅ Activo
- Paginación: ✅ Funcionando

---

### 📊 Testing y Validación

#### Postman Collection
![Colección de peticiones en Postman](docs/screenshots/postman-collection.png)
- Tests de todos los endpoints
- Validación de paginación
- Casos de error y éxito

#### MongoDB Compass
![Base de datos MongoDB con datos reales](docs/screenshots/mongodb-compass.png)
- Colección de trajes
- Índices optimizados
- Datos de ejemplo poblados

---

> **Nota**: Las capturas de pantalla se encuentran en la carpeta `docs/screenshots/` del repositorio.
> Para generar capturas actualizadas, ejecuta las aplicaciones localmente o visita las URLs de producción.

## Datos de Ejemplo

La base de datos incluye datos de ejemplo con:
- 25+ productos de diferentes categorías
- 15+ usuarios registrados
- Relaciones entre productos y vendedores
- Datos realistas de trajes falleros valencianos

## Autor

Proyecto desarrollado por Hugo Mocholi Antequera y Sonia Traver Casero

## Licencia

Este proyecto es de uso educativo.
