# Karina Ocampo Cantante - Event Management MVP

Este repositorio contiene el esqueleto de un Producto Mínimo Viable (MVP) para un sistema de gestión y ventas de "entretenimiento para eventos" para Karina Ocampo Cantante.

## Estructura del Proyecto (Monorepo)

El proyecto está organizado como un monorepo con las siguientes carpetas principales:

- `/apps/web`: Frontend desarrollado con Next.js 14 (TypeScript, App Router, TailwindCSS).
- `/apps/api`: Backend desarrollado con Python 3.11 y FastAPI.
- `/packages/shared`: (Placeholder) Para tipos y esquemas compartidos entre frontend y backend.
- `/infra`: Contiene la configuración de Docker y scripts de desarrollo.
- `/docs`: Documentación del proyecto, incluyendo este `README.md`.

## Requerimientos

Necesitas tener Docker y Docker Compose instalados en tu sistema.

## Configuración del Entorno

1.  **Variables de Entorno:**
    Crea un archivo `.env` en la raíz del proyecto (al mismo nivel que `infra/docker-compose.yml`) y copia el contenido de `infra/.env.example` en él. Asegúrate de rellenar las variables necesarias, especialmente `MP_ACCESS_TOKEN` y `MP_WEBHOOK_SECRET` para la integración con Mercado Pago.

    ```bash
    cp infra/.env.example .env
    # Edita el archivo .env con tus credenciales
    ```

2.  **Instalar dependencias del Frontend:**
    Navega a la carpeta `apps/web` e instala las dependencias de Node.js:

    ```bash
    cd apps/web
    npm install
    cd ..
    ```

## Cómo Correr el Proyecto

Utilizamos `Makefile` para simplificar las tareas de desarrollo.

1.  **Levantar el Entorno de Desarrollo (Backend y Base de Datos):**
    Este comando construirá las imágenes de Docker y levantará los contenedores de la API y la base de datos PostgreSQL en segundo plano.

    ```bash
    make dev
    ```

2.  **Aplicar Migraciones de Base de Datos:**
    Una vez que los servicios estén corriendo, aplica las migraciones para crear las tablas en la base de datos. Esto es crucial la primera vez que levantas el proyecto.

    ```bash
    make migrate
    ```

3.  **Cargar Datos de Ejemplo (Opcional):**
    Puedes poblar la base de datos con datos de ejemplo (usuarios, paquetes, canciones, etc.) ejecutando el script de *seeding*.

    ```bash
    make seed
    ```

4.  **Iniciar el Frontend (Next.js):**
    Abre una nueva terminal, navega a la carpeta `apps/web` e inicia el servidor de desarrollo de Next.js:

    ```bash
    cd apps/web
    npm run dev
    ```

    El frontend estará disponible en `http://localhost:3000`.

## Flujos Principales del MVP

### 1. Captura de Leads y Cotización

-   **Frontend:** Accede a `http://localhost:3000/contacto` para usar el formulario de consulta. Rellena los datos y envíalo.
-   **Backend:** El lead se guardará en la base de datos.
-   **Administración:** Accede a `http://localhost:3000/admin` para ver la lista de leads. Desde aquí, puedes hacer clic en "Crear Cotización" para un lead específico. Ingresa el monto y la descripción, y genera un link de pago de Mercado Pago.

### 2. Gestión de Karaoke

-   **Catálogo de Canciones:** Puedes importar canciones al backend a través del endpoint `/api/karaoke/import` (requiere un archivo CSV con columnas `artist`, `title`, `language`, `duration_seconds`, `genre_tags`).
-   **Página Pública de Karaoke:** Accede a `http://localhost:3000/karaoke/[ID_EVENTO]/public` (reemplaza `[ID_EVENTO]` con cualquier número, ej. `123`). Esta página mostrará la cola de canciones en tiempo real.
-   **Consola del Host de Karaoke:** Accede a `http://localhost:3000/karaoke/[ID_EVENTO]/host`. Desde aquí, puedes agregar nuevas solicitudes de canciones y ver la cola. Las actualizaciones se reflejarán en la página pública.

### 3. Gestión de Inventario

-   **Administración:** En `http://localhost:3000/admin`, verás secciones para "Inventario de Equipos" y "Asignaciones de Equipos". Los datos se cargarán desde la base de datos (puedes usar `make seed` para datos de ejemplo).

### 4. Gestión de Documentos y Contratos

-   **Administración:** En `http://localhost:3000/admin`, encontrarás secciones para "Contratos" y "Documentos". Puedes subir nuevos documentos a través del formulario de subida.

### 5. Configuración de la Aplicación

-   **Administración:** En `http://localhost:3000/admin`, hay una sección para "Configuración de la Aplicación" donde puedes ver y actualizar el porcentaje de seña por defecto y las zonas de cobertura.

## Roadmap Corto (Posibles Mejoras)

-   **Autenticación y Autorización:** Implementación completa de JWT y roles para proteger los endpoints de la API y las rutas del frontend.
-   **Integración Real de Instagram:** Conexión con la API de Instagram para mostrar el feed real.
-   **Notificaciones:** Implementación de notificaciones por email/WhatsApp para leads, reservas y pagos.
-   **Gestión de Proveedores:** Interfaz completa para el onboarding y la gestión de proveedores.
-   **Calendario de Eventos:** Vista de calendario interactiva para la agenda de eventos.
-   **Generación de Contratos:** Lógica para generar contratos PDF a partir de plantillas con datos dinámicos.
-   **Pruebas Unitarias e Integración:** Añadir un conjunto robusto de pruebas para el backend y el frontend.
-   **CI/CD:** Configurar GitHub Actions para linting, pruebas y despliegue automático.

---

Este MVP proporciona una base sólida para el sistema de gestión de eventos. ¡Disfrútalo!
