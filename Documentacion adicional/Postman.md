# Guía Detallada de Consumo de Endpoints (Postman)

Esta guía describe cómo consumir los endpoints de cada uno de los microservicios, organizados en el orden lógico de flujos de trabajo (flujo de inventario, flujo de ventas, flujo de operaciones y flujo de reportes).

---

## 1. Módulo de Identidad (`iam-service` - Puerto 3000)

### Registrar un nuevo usuario (Requiere rol `mf_admin`)
* **Endpoint**: `POST http://localhost:3000/users`
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Cuerpo JSON**:
```json
{
  "email": "juan.dueno@retail.com",
  "password": "Password123!",
  "role": "dueno_tienda"
}
```

### Autenticación (Login)
* **Endpoint**: `POST http://localhost:3000/auth/login`
* **Cuerpo JSON**:
```json
{
  "email": "juan.dueno@retail.com",
  "password": "Password123!"
}
```
* **Respuesta**: Copie el valor de `access_token` para las siguientes peticiones.

---

## 2. Módulo de Inventario (`inventory-service` - Puerto 3001)

### Crear una Categoría (Requiere autenticación)
* **Endpoint**: `POST http://localhost:3001/categories`
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Cuerpo JSON**:
```json
{
  "name": "Calzado Deportivo",
  "description": "Zapatillas para correr y entrenamiento"
}
```

### Crear una Ubicación (Tienda/Bodega)
* **Endpoint**: `POST http://localhost:3001/locations`
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Cuerpo JSON**:
```json
{
  "name": "Tienda Central Monterrey",
  "address": "Av. Constitución 456, Centro"
}
```

### Crear un Producto (Requiere rol `mf_admin` o `dueno_tienda`)
* **Endpoint**: `POST http://localhost:3001/products`
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Cuerpo JSON**:
```json
{
  "name": "Running Air Zoom",
  "sku": "RUN-AZ-001",
  "price": 120.50,
  "categoryId": "SU_UUID_DE_CATEGORIA"
}
```

### Registrar Stock Inicial
* **Endpoint**: `POST http://localhost:3001/inventory/increment`
* **Headers**: `Content-Type: application/json` (Abierto para llamadas internas de backend/desarrollo)
* **Cuerpo JSON**:
```json
{
  "productId": "SU_UUID_DE_PRODUCTO",
  "locationId": "SU_UUID_DE_UBICACION",
  "amount": 50
}
```

---

## 3. Módulo de Operaciones (`store-operations-service` - Puerto 3004)

### Registrar Tienda
* **Endpoint**: `POST http://localhost:3004/stores`
* **Headers**: `Authorization: Bearer <TOKEN>` (Requiere `mf_admin`)
* **Cuerpo JSON**:
```json
{
  "name": "Tienda Central Monterrey",
  "address": "Av. Constitución 456, Centro"
}
```

### Registrar Pago de Alquiler Mensual
* **Endpoint**: `POST http://localhost:3004/rental-payments`
* **Headers**: `Authorization: Bearer <TOKEN>` (Requiere `mf_admin` o `mf_finanzas`)
* **Cuerpo JSON**:
```json
{
  "storeId": "SU_UUID_DE_TIENDA",
  "amount": 1500.00,
  "month": 7,
  "year": 2026
}
```

### Aprobar Pago de Alquiler (Acción de Finanzas)
* **Endpoint**: `PATCH http://localhost:3004/rental-payments/SU_UUID_DE_PAGO/approve`
* **Headers**: `Authorization: Bearer <TOKEN>` (Requiere `mf_finanzas`)
* **Cuerpo JSON**:
```json
{
  "approvedByMfUserId": "SU_UUID_DE_USUARIO_FINANZAS"
}
```

### Abrir Jornada Laboral (Abrir Tienda)
* **Endpoint**: `POST http://localhost:3004/workdays`
* **Headers**: `Authorization: Bearer <TOKEN>` (Requiere `dueno_tienda` o `staff_tienda`)
* **Cuerpo JSON**:
```json
{
  "storeId": "SU_UUID_DE_TIENDA",
  "openedByUserId": "SU_UUID_DEL_EMPLEADO"
}
```

---

## 4. Módulo de Ventas (`orders-service` - Puerto 3002)

### Crear una Orden de Venta
* **Endpoint**: `POST http://localhost:3002/orders`
* **Headers**: `Authorization: Bearer <TOKEN>` (Requiere `dueno_tienda` o `staff_tienda`)
* **Cuerpo JSON**:
```json
{
  "userId": "SU_UUID_DEL_CLIENTE_O_VENDEDOR",
  "locationId": "SU_UUID_DE_LA_TIENDA",
  "items": [
    {
      "productId": "SU_UUID_DE_PRODUCTO",
      "quantity": 2,
      "priceAtPurchase": 120.50,
      "customizations": [
        {
          "attributeId": "SU_UUID_ATRIBUTO_TALLA",
          "valueId": "SU_UUID_VALOR_TALLA_42",
          "attributeName": "Talla",
          "valueName": "42"
        }
      ]
    }
  ]
}
```
* **Nota**: Si la base de datos de órdenes falla en guardar la orden o el stock es insuficiente, se gatillará el mecanismo de rollback de stock en el `inventory-service`.

### Cancelar Orden (Compensación de Stock)
* **Endpoint**: `PATCH http://localhost:3002/orders/SU_UUID_DE_LA_ORDEN`
* **Headers**: `Authorization: Bearer <TOKEN>` (Requiere `mf_admin` o `mf_finanzas`)
* **Cuerpo JSON**:
```json
{
  "status": "CANCELADO"
}
```
* **Nota**: Cambiar el estado a `CANCELADO` devolverá automáticamente la cantidad de stock reservado al `inventory-service`.

---

## 5. Módulo de Reportes (`reports-service` - Puerto 3005)

### Reporte de Ventas Consolidadas
* **Endpoint**: `GET http://localhost:3005/sales-reports`
* **Headers**: `Authorization: Bearer <TOKEN>` (Propaga el token internamente a `orders-service`)

### Reporte de Stock de Inventario Detallado
* **Endpoint**: `GET http://localhost:3005/inventory-reports/detailed-stock`
* **Headers**: (Ninguno requerido, consulta directa de stock)

### Reporte de Alquileres Pendientes
* **Endpoint**: `GET http://localhost:3005/store-ops-reports`
* **Headers**: `Authorization: Bearer <TOKEN>` (Propaga el token internamente a `store-operations-service`)
