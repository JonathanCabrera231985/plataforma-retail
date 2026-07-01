# Guía de Autenticación y Roles

El backend de la **Plataforma Retail** utiliza autenticación basada en tokens **JWT (JSON Web Tokens)**. Toda petición a rutas protegidas de los microservicios debe llevar el encabezado `Authorization: Bearer <TOKEN>`.

---

## 1. Roles del Sistema

El sistema implementa un control de acceso basado en roles (**RBAC**). Los roles permitidos son:

| Rol | Valor en BD (`role`) | Descripción |
| :--- | :--- | :--- |
| **María Fernanda Admin** | `mf_admin` | Administrador general de la marca. Puede registrar nuevos usuarios de cualquier tipo, crear tiendas (`stores`), dar de alta productos y categorías. |
| **María Fernanda Finanzas** | `mf_finanzas` | Rol contable. Puede aprobar pagos de alquiler, visualizar reportes de deudas de proveedores, aprobar jornadas de trabajo y consultar reportes agregados de ventas. |
| **Dueño de Tienda** | `dueno_tienda` | Propietario de un local afiliado. Puede registrar pedidos de venta (`orders`), abrir/cerrar su jornada laboral, ver los reportes específicos de su stock e ingresar bitácoras de acceso. |
| **Personal de Tienda (Staff)** | `staff_tienda` | Empleados del local. Pueden abrir/cerrar jornadas de trabajo, registrar ventas y subir bitácoras de accesos. |
| **Proveedor** | `proveedor` | Entidad proveedora de mercancía. |

---

## 2. Flujo de Autenticación Paso a Paso

### Paso 1: Registro del Primer Administrador (Desarrollo/Seed)
Dado que para registrar nuevos usuarios con `POST /users` se requiere un token con rol `mf_admin`, el primer administrador debe crearse directamente en la base de datos (por ejemplo, mediante una migración de TypeORM o insertando la fila a través de una interfaz de SQL), o bien se puede registrar temporalmente exponiendo el endpoint `POST /users` sin protección de rol para la primera llamada.

Un registro típico de usuario requiere:
* **Endpoint**: `POST http://localhost:3000/users`
* **Headers**: `Content-Type: application/json`
* **Cuerpo JSON**:
```json
{
  "email": "admin@retail.com",
  "password": "Password123!",
  "role": "mf_admin"
}
```

### Paso 2: Iniciar Sesión (Obtener JWT)
Cualquier usuario registrado debe autenticarse para recibir un token temporal de acceso:
* **Endpoint**: `POST http://localhost:3000/auth/login`
* **Cuerpo JSON**:
```json
{
  "email": "admin@retail.com",
  "password": "Password123!"
}
```
* **Respuesta Exitosa (HTTP 200)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Paso 3: Consumo de Endpoints Protegidos
Para consumir cualquier endpoint que requiera autenticación, copie el `access_token` y agréguelo en los Headers de su cliente HTTP (como Postman):
* **Key**: `Authorization`
* **Value**: `Bearer <su_access_token>`

---

## 3. Comprobación de Perfil
Puede verificar la validez de su token actual y la información asociada llamando al endpoint:
* **Endpoint**: `GET http://localhost:3000/auth/profile`
* **Headers**: `Authorization: Bearer <TOKEN>`
* **Respuesta (HTTP 200)**:
```json
{
  "sub": "b2f6b31e-450f-48d0-9eb1-840be6d3a9bb",
  "email": "admin@retail.com",
  "role": "mf_admin"
}
```
