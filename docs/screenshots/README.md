# 📸 Capturas de Pantalla - FallaMarket

Esta carpeta contiene las capturas de pantalla del proyecto para la documentación.

## 📋 Lista de Capturas Necesarias

### Backend - API REST
- [ ] `api-trajes-paginacion.png` - Respuesta del endpoint GET /api/v1/trajes con parámetros de paginación
- [ ] `postman-collection.png` - Colección completa de tests en Postman
- [ ] `mongodb-compass.png` - Vista de la base de datos en MongoDB Compass

### Frontend Angular
- [ ] `angular-traje-list.png` - Lista principal de trajes con filtros y paginación
- [ ] `angular-traje-form.png` - Formulario de creación/edición de traje
- [ ] `angular-traje-detail.png` - Vista de detalle de un traje
- [ ] `angular-pagination.png` - Controles de paginación en acción

### Frontend React
- [ ] `react-traje-list.png` - Lista principal de trajes con búsqueda
- [ ] `react-traje-edit.png` - Formulario de edición de traje
- [ ] `react-mobile.png` - Vista responsive en móvil
- [ ] `react-pagination.png` - Sistema de paginación funcionando

### Producción en Vercel
- [ ] `vercel-backend.png` - API desplegada en Vercel (https://falleros.vercel.app/api/v1/)
- [ ] `vercel-angular.png` - Frontend Angular desplegado (https://fallerosangular.vercel.app/)
- [ ] `vercel-react.png` - Frontend React desplegado (https://falleros-react.vercel.app/)

## 📸 Guía para Tomar las Capturas

### Backend
1. Usa Postman o navegador para hacer peticiones a la API
2. Captura la respuesta JSON mostrando:
   - Array de trajes
   - Objeto pagination con todos sus campos

### Frontend Angular
1. Ejecuta `ng serve` y navega a http://localhost:4200
2. Captura pantalla completa mostrando:
   - Navbar
   - Lista de trajes
   - Controles de paginación
   - Filtros funcionando

### Frontend React
1. Ejecuta `npm start` y navega a http://localhost:3001
2. Captura similar al Angular
3. Para móvil: usa DevTools (F12) > Toggle device toolbar

### Vercel
1. Visita cada URL de producción
2. Captura la aplicación funcionando en producción
3. Muestra la URL en la barra de direcciones

## 🎨 Consejos para Buenas Capturas

- ✅ Resolución mínima: 1920x1080
- ✅ Formato: PNG (mejor calidad que JPG)
- ✅ Muestra datos reales, no pantallas vacías
- ✅ Incluye la URL en la captura (barra del navegador visible)
- ✅ Usa tema claro para mejor visibilidad
- ✅ Asegúrate de que el texto sea legible
- ✅ Limpia información sensible si la hay

## 📁 Estructura de Nombres

Usa exactamente los nombres listados arriba para que coincidan con el README principal.

```
docs/
  screenshots/
    README.md (este archivo)
    api-trajes-paginacion.png
    angular-traje-list.png
    angular-traje-form.png
    angular-traje-detail.png
    angular-pagination.png
    react-traje-list.png
    react-traje-edit.png
    react-mobile.png
    react-pagination.png
    vercel-backend.png
    vercel-angular.png
    vercel-react.png
    postman-collection.png
    mongodb-compass.png
```

## 🔧 Herramientas Recomendadas

### Para Capturas de Pantalla
- **Windows**: Snipping Tool (Win + Shift + S)
- **Windows**: Game Bar (Win + G)
- **Navegador**: Extensión "Full Page Screen Capture"

### Para Edición (opcional)
- **Paint** - Para recortar/redimensionar
- **ShareX** - Herramienta avanzada gratuita
- **Lightshot** - Captura y edición rápida

## ⚠️ Importante

Estas capturas son **obligatorias** para la entrega del proyecto. Asegúrate de:
1. Tomar TODAS las capturas listadas
2. Usar los nombres exactos
3. Guardarlas en esta carpeta
4. Verificar que sean legibles y profesionales
5. Que muestren la funcionalidad de paginación claramente
