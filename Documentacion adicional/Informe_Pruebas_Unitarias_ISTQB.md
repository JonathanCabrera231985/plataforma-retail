# Informe de Pruebas Unitarias - Plataforma Retail (Framework ISTQB)

Este documento detalla el enfoque, diseño y ejecución de las pruebas unitarias aplicadas a los métodos y servicios del backend de la **Plataforma Retail**, siguiendo los lineamientos de documentación de pruebas del **International Software Testing Qualifications Board (ISTQB)**.

---

## 1. Resumen del Proyecto de Pruebas (Test Summary)

- **Objetivo de la Prueba:** Verificar el correcto funcionamiento y la lógica de negocio individual de los Controladores y Servicios de la arquitectura basada en microservicios, asegurando que cada componente reaccione correctamente ante entradas válidas e inválidas de forma aislada.
- **Nivel de Prueba:** Pruebas Unitarias (Component Testing).
- **Enfoque de Prueba (Test Approach):** Caja Blanca (White-box testing), basándose en la estructura interna del código desarrollado en NestJS, utilizando `Jest` para aserciones y creación de "Mocks/Stubs".
- **Alcance (Scope):** 
  - `iam-service` (Autenticación y Usuarios)
  - `inventory-service` (Productos, Atributos, Categorías)
  - `orders-service` (Órdenes, Personalizaciones)
  - `reports-service` (Reportes consolidados)
  - `store-operations-service` (Tiendas, Accesos, Jornadas)
  - `suppliers-service` (Proveedores, Órdenes de Compra)

---

## 2. Elementos de Prueba (Test Items)

Los elementos sujetos a prueba son los métodos expuestos en las clases anotadas con `@Controller()` y `@Injectable()` (Services).

| Componente | Tipo | Responsabilidad en Pruebas |
| :--- | :--- | :--- |
| **Controladores** | Endpoint HTTP | Validación del ruteo, recepción de DTOs (Data Transfer Objects), correcta delegación a los servicios y respuestas HTTP (status codes). |
| **Servicios** | Lógica de Negocio | Procesamiento de reglas de negocio, interacción con repositorios de TypeORM simulados (Mocking), manejo de excepciones y errores lógicos. |

---

## 3. Diseño de Pruebas y Consumo de Métodos (Test Design & Specification)

De acuerdo con el estándar ISTQB, las pruebas unitarias se estructuran utilizando **Partición de Equivalencia** y **Análisis de Valores Frontera**, implementados en código bajo la metodología *Arrange-Act-Assert* (Preparar-Actuar-Afirmar).

### 3.1. Pruebas de Controladores (Paso a Paso)

El consumo de métodos en las pruebas unitarias de Controladores sigue este proceso estándar:

1. **Test Setup (Preparación del Entorno - Arrange):**
   - Inicialización del módulo de prueba de NestJS (`Test.createTestingModule`).
   - Inyección del Controlador y una versión "Mock" (Falsa) del Servicio del cual depende, utilizando `jest.fn()` para simular sus respuestas.
2. **Consumo del Método (Act):**
   - Se invoca directamente el método del controlador pasándole un objeto DTO o parámetros simulados.
3. **Verificación (Assert):**
   - Comprobación de que el controlador llama al servicio interno exactamente 1 vez (`toHaveBeenCalled()`).
   - Comprobación de que retorna la estructura de datos o la respuesta esperada.

### 3.2. Pruebas de Servicios (Paso a Paso)

El consumo en Servicios evalúa los métodos críticos del negocio:

1. **Test Setup (Preparación - Arrange):**
   - Se inyectan los repositorios de TypeORM usando el token de inyección (ej. `getRepositoryToken(User)`).
   - Se configuran los mocks para métodos de base de datos (`find`, `save`, `findOne`, `create`).
2. **Consumo de Método (Act):**
   - Se invoca el método del servicio.
3. **Verificación de Lógica de Negocio (Assert):**
   - **Flujo de Éxito:** Se verifica que al recibir datos correctos (Partición válida), devuelva un objeto procesado.
   - **Manejo de Excepciones:** Se inyectan datos erróneos (ej. usuario no existente) y se evalúa que el servicio lance excepciones controladas de NestJS (ej. `NotFoundException`, `UnauthorizedException`).

---

## 4. Estrategia de Inyección y Mocking (Entorno de Pruebas)

Para aislar cada unidad, aplicamos un "Test Harness" usando el framework Jest:

* **Inyección de Repositorios TypeORM:** Se anula la conexión real inyectando repositorios falsos.
  ```typescript
  {
    provide: getRepositoryToken(Product),
    useValue: { find: jest.fn(), save: jest.fn() }
  }
  ```
* **Dependencias Externas (JWT):** El `JwtService` se falsea para retornar tokens de prueba inmediatos sin pasar por firmas asíncronas reales.
* **Manejo de Respuestas de Red:** En las pruebas unitarias **no se consume red**, garantizando velocidad y determinismo en los resultados.

---

## 5. Recomendaciones Avanzadas (Dependencias y Variables de Entorno)

Como recomendación de Arquitectura de Pruebas y Diseño Técnico, se implementan las siguientes mejores prácticas para mejorar la madurez y la robustez de las pruebas unitarias (Testability):

### 5.1. Uso e Inyección de Dependencias Específicas
En lugar de acoplar la lógica de un servicio a librerías externas o métodos nativos del sistema directamente dentro del servicio (ejemplo: usar `Date.now()` de forma estática o importar bibliotecas complejas directamente):
1. **Wrappers y Providers:** Inyectar las dependencias específicas como proveedores en el constructor del servicio (`@Inject()`).
2. **Mocking Preciso:** Esto permite que, en el archivo `.spec.ts`, se pasen "Mocks" que simulen comportamientos exactos de las librerías (ej. control del tiempo en validaciones temporales o respuestas pre-diseñadas de APIs bancarias o pasarelas de pago externas).
3. **Desacoplamiento:** Facilita la creación de particiones de equivalencia para "Dependencia No Disponible" (Fallos 500, Timeouts) validando cómo el servicio reacciona sin afectar dependencias externas.

### 5.2. Validación y Mocking de Variables de Entorno
El acceso directo a `process.env` dentro de los servicios de NestJS disminuye severamente la capacidad de realizar pruebas unitarias estructuradas:
1. **ConfigModule (NestJS):** Se recomienda usar inyección del `ConfigService` de `@nestjs/config` en todas las capas que requieran variables de entorno (como `JWT_SECRET`, credenciales o parámetros).
2. **Validación Estricta:** Implementar `Joi` u otras validaciones de esquemas a nivel de `ConfigModule` para asegurar que las variables (`DB_HOST`, `JWT_SECRET`) existen en tiempo de inicialización de la app.
3. **Impacto en Pruebas:** Al estar inyectadas mediante `ConfigService`, en el archivo `*.spec.ts` resulta trivial falsear una variable. 
   - Ejemplo de inyección para forzar un escenario de fallo:
     ```typescript
     {
       provide: ConfigService,
       useValue: {
         get: jest.fn((key: string) => {
           if (key === 'JWT_SECRET') return 'secret-test-mock';
           return null;
         }),
       },
     }
     ```
   - Esto blinda las pruebas de factores impredecibles o secretos no presentes en CI/CD, garantizando que el entorno local de desarrollo o de Pipeline funcione consistentemente.

---

## 6. Criterios de Evaluación y Calidad (Exit Criteria)

1. **100% de Tasa de Pase (Pass Rate):** Todas las suites de pruebas definidas con `it()` deben finalizar sin errores.
2. **Cobertura de Funciones Esenciales:** Los módulos de `iam-service` (manejo de tokens) y `orders-service` (creación de órdenes) no deben tener funciones o ramas huérfanas sin casos de prueba.
3. **Validación de Configuración (Boilerplate):** Como mínimo, cada servicio y controlador debe aprobar su caso fundamental: `should be defined`.

---

## 7. Conclusiones
Las pruebas unitarias y su aislamiento de módulos E2E aseguran la salud técnica general del código. Con la adopción adicional de las recomendaciones de desacoplamiento de dependencias específicas e inyección del estado del entorno (`ConfigService`), el Backend poseerá una resiliencia excelente frente a fallos y despliegues automáticos.
