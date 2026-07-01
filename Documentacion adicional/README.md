# Plataforma Retail: Guía del Backend y Arquitectura

Esta carpeta contiene la documentación oficial del backend de la **Plataforma Retail**, un sistema de microservicios robusto diseñado para gestionar tiendas, inventario, ventas, operaciones financieras y reportes agregados.

---

## 1. ¿De qué trata este Backend?

El backend de la **Plataforma Retail** es un ecosistema distribuido que automatiza el flujo operativo de múltiples tiendas físicas afiliadas a una marca o administrador central ("María Fernanda"). Permite registrar usuarios con diferentes niveles de privilegios (administradores, analistas de finanzas, dueños de tiendas y personal de atención), controlar stocks en tiempo real, procesar ventas de calzado/ropa, gestionar pagos de alquiler de locales, recibir abonos a órdenes de compra de proveedores y consultar reportes operativos consolidados.

Cada servicio de la plataforma posee su propia base de datos física para mantener un aislamiento estricto de responsabilidades, y se comunican entre sí mediante REST APIs internas, garantizando escalabilidad e independencia.

---

## 2. Arquitectura del Sistema

La arquitectura está basada en **Microservicios Aislados con Base de Datos por Servicio (Database-per-Service)**, implementados con **NestJS (TypeScript)**, **TypeORM**, y **PostgreSQL**.

### Diagrama de la Arquitectura
```
                      +-------------------+
                      |   Cliente (Web)   |
                      +---------+---------+
                                | HTTP (JSON + JWT)
                                v
     +-------------------------------------------------------+
     |                    REPORTS-SERVICE                    | (Puerto 3005)
     +-----+------------+------------+------------+----------+
           |            |            |            |
           | HTTP       | HTTP       | HTTP       | HTTP
           v            v            v            v
      +----+---+   +----+---+   +----+---+   +----+---+
      |  IAM   |   | INVEN- |   | ORDERS |   | SUP-   |
      |SERVICE |   |  TORY  |   |SERVICE |   |PLIERS  |
      +----+---+   +----+---+   +----+---+   +----+---+
           |            |            |            |
           |            +<-----------+            | (Saga/Rollback Stock)
           |            |                         |
           v            v            v            v
      +----+---+   +----+---+   +----+---+   +----+---+
      |  DB    |   |  DB    |   |  DB    |   |  DB    |
      |  IAM   |   | INVEN- |   | ORDERS |   | SUP-   |
      |        |   | TORY   |   |        |   |PLIERS  |
      +--------+   +--------+   +--------+   +--------+
```

### Microservicios del Sistema
1. **`iam-service` (Puerto 3000)**: Gestión de Identidad y Acceso (IAM). Controla el registro de usuarios, roles (`mf_admin`, `mf_finanzas`, `dueno_tienda`, `staff_tienda`, `proveedor`) y la generación de tokens JWT.
2. **`inventory-service` (Puerto 3001)**: Administración de catálogo. Gestiona categorías, atributos de productos, ubicaciones físicas (tiendas/bodegas) y el stock físico disponible.
3. **`orders-service` (Puerto 3002)**: Gestión del punto de venta. Registra transacciones de ventas y coordina descuentos de stock concurrentes con el `inventory-service` mediante un patrón Saga de compensación (rollback) si falla la persistencia.
4. **`suppliers-service` (Puerto 3003)**: Relación con proveedores. Registra órdenes de compra corporativas y procesa abonos financieros para liquidar deudas de mercancía.
5. **`store-operations-service` (Puerto 3004)**: Operaciones físicas. Administra el registro de tiendas, el control de jornadas laborales (apertura y cierre de día de trabajo) y el control de pagos de alquiler mensual con bloqueos pesimistas contra duplicados.
6. **`reports-service` (Puerto 3005)**: Servicio agregador. No tiene base de datos local; consulta dinámicamente el estado y las transacciones de los otros microservicios de manera desacoplada para presentar consolidados financieros y de stock al administrador central.

---

## 3. Requisitos Previos a Revisar

Antes de realizar cualquier petición HTTP a los servicios del backend, asegúrese de validar el cumplimiento de los siguientes puntos:

1. **Docker y PostgreSQL en ejecución**:
   El contenedor Postgres de Docker (`container_postgres`) debe estar encendido y con estado `healthy`. Esto creará automáticamente las bases de datos requeridas:
   * `plataforma_retail_iam` (BD Principal)
   * `plataforma_retail_inventory`
   * `plataforma_retail_orders`
   * `plataforma_retail_suppliers`
   * `plataforma_retail_store_ops`

2. **Microservicios levantados**:
   Verifique que todos los puertos locales estén asignados y respondiendo:
   * `localhost:3000` (IAM)
   * `localhost:3001` (Inventory)
   * `localhost:3002` (Orders)
   * `localhost:3003` (Suppliers)
   * `localhost:3004` (Store Operations)
   * `localhost:3005` (Reports)

3. **Variables de entorno cargadas**:
   Cada microservicio debe contar con su archivo `.env` configurado. Para entornos de desarrollo local sin Docker, verifique que `DB_HOST` apunte a `localhost` en lugar de `postgres-db`.

4. **Usuario Administrador Creado**:
   Dado que gran parte de los métodos requieren autorización previa, se debe registrar el primer usuario administrador (`mf_admin`) para poder orquestar y dar de alta a los demás usuarios o tiendas.

---

## Guía de Navegación

* **[Guía de Autenticación y Roles](file:///c:/Users/Jonathan%20Cabrera/plataforma-retail/Documentacion%20adicional/Autenticacion.md)**: Aprenda a iniciar sesión, crear usuarios y entender los roles y permisos.
* **[Guía Detallada de Postman](file:///c:/Users/Jonathan%20Cabrera/plataforma-retail/Documentacion%20adicional/Postman.md)**: Endpoints, cuerpos JSON de ejemplo y flujos de consumo de APIs paso a paso.
