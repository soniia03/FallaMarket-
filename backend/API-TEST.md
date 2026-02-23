# Backend Testing Scripts

## Test the API endpoints

### 1. Get all trajes
```bash
curl -X GET http://localhost:3000/api/v1/trajes
```

### 2. Add a test traje
```bash
curl -X POST http://localhost:3000/api/v1/trajes/anadir \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Traje Fallero Histórico",
    "material": "Seda",
    "propietario": "Juan Pérez"
  }'
```

### 3. Add another test traje
```bash
curl -X POST http://localhost:3000/api/v1/trajes/anadir \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Traje Fallera Infantil",
    "material": "Brocado",
    "propietario": "María García"
  }'
```

### 4. Get a specific traje by ID (replace with actual ID)
```bash
curl -X GET http://localhost:3000/api/v1/trajes/traje/[ID_HERE]
```

### 5. Update a traje (replace with actual ID)
```bash
curl -X PUT http://localhost:3000/api/v1/trajes/editar/[ID_HERE] \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Traje Fallero Histórico Actualizado",
    "material": "Terciopelo",
    "propietario": "Juan Pérez"
  }'
```

### 6. Delete a traje (replace with actual ID)
```bash
curl -X DELETE http://localhost:3000/api/v1/trajes/eliminar/[ID_HERE]
```

## PowerShell Version (for Windows)

### Add test data
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/trajes/anadir" -Method POST -ContentType "application/json" -Body '{"nombre": "Traje Fallero Histórico", "material": "Seda", "propietario": "Juan Pérez"}'

Invoke-RestMethod -Uri "http://localhost:3000/api/v1/trajes/anadir" -Method POST -ContentType "application/json" -Body '{"nombre": "Traje Fallera Infantil", "material": "Brocado", "propietario": "María García"}'

Invoke-RestMethod -Uri "http://localhost:3000/api/v1/trajes/anadir" -Method POST -ContentType "application/json" -Body '{"nombre": "Traje Regional Valenciano", "material": "Damasco", "propietario": "Ana López"}'
```

### Get all trajes
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/trajes" -Method GET
```