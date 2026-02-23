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
- `_id`: ObjectId - Identificador único
- `nombre`: String - Nombre del producto (ej: "Traje Fallero Siglo XVIII")
- `material`: String - Material de cual esta compuesto el traje (ej: "Lana de color azul")
- `propietario`: String - Nombre del propietraio (ej: "Hugo")

**Categorías válidas:**
- `traje-fallero`: Trajes masculinos tradicionales
- `traje-fallera`: Trajes femeninos tradicionales
- `complementos`: Fajines, pañuelos, mantones
- `calzado`: Espardeñas, zapatos tradicionales
- `accesorios`: Joyas, peinetas, flores

**Estados válidos:**
- `nuevo`: Producto sin usar
- `usado`: Producto de segunda mano
- `reservado`: Producto apartado para compra
- `vendido`: Producto ya vendido


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

1. **Validación de Precios**: No se permiten precios negativos o igual a cero
2. **Email Único**: Cada usuario debe tener un email único en el sistema
3. **Vendedores Registrados**: Solo usuarios registrados pueden publicar productos
4. **Estados de Producto**: Los productos deben tener un estado válido del catálogo
5. **Categorías Válidas**: Los productos deben pertenecer a una categoría válida
6. **Productos Activos**: Solo se muestran productos con `available: true`
7. **Validación de Campos**: Todos los campos obligatorios deben estar presentes
8. **Formato de Email**: El email debe tener un formato válido
9. **Longitud de Descripción**: La descripción debe tener entre 10 y 500 caracteres
10. **Usuarios Activos**: Solo usuarios con `isActive: true` pueden realizar operaciones

## API Endpoints

### Documentación General
```
GET /api/v1/documentacion - Documentación de la API
```

### Productos (Products)
```
GET    /api/v1/products/get/all      - Obtener todos los productos
GET    /api/v1/products/get/:id      - Obtener producto por ID
POST   /api/v1/products/post         - Crear nuevo producto
PUT    /api/v1/products/update/:id   - Actualizar producto
DELETE /api/v1/products/delete/:id   - Eliminar producto
GET    /api/v1/products/category/:category - Filtrar por categoría
GET    /api/v1/products/search?q=:query - Búsqueda por nombre/descripción
```

### Usuarios (Users)
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

## URLs de Acceso

- **API Backend**: http://localhost:3000
- **Frontend Angular**: http://localhost:4200
- **Frontend React**: http://localhost:3001
- **XAMPP**: http://localhost/FallaMarket/

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
