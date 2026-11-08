# Lista de tareas con CI/CD — Electiva 1: Introducción a DevOps (ITLA 2026-C-3)

![CI/CD](https://github.com/floriannimoreno-source/practica3-cicd-itla/actions/workflows/ci.yml/badge.svg)

Aplicación web mínima (lista de tareas) con un pipeline **CI/CD en GitHub Actions** que revisa el código, ejecuta pruebas con cobertura, construye una imagen Docker y publica el frontend en **GitHub Pages**.

- **Repositorio:** https://github.com/floriannimoreno-source/practica3-cicd-itla
- **Sitio publicado:** https://floriannimoreno-source.github.io/practica3-cicd-itla/
- **Autor(es):** Florianni Eckeila Moreno (2025-2014)

## Contenido del proyecto

| Pieza | Archivo | Para qué sirve |
|---|---|---|
| API Node.js/Express | `src/app.js`, `src/server.js` | Tareas + `/health` y `/metrics` |
| Frontend estático | `public/index.html` | Se publica en GitHub Pages |
| Pruebas | `tests/app.test.js` | Jest + Supertest con cobertura |
| Contenedor | `Dockerfile` | Imagen de producción con *healthcheck* |
| Pipeline | `.github/workflows/ci.yml` | Lint → pruebas → Docker → deploy |

## Ejecutar en local

Requisitos: Git y Node.js 20+ (Docker Desktop es opcional).

```bash
npm install
npm test          # pruebas + cobertura (falla si baja del umbral)
npm start         # http://localhost:3000
```

Con Docker:

```bash
docker build -t tareas-devops .
docker run -p 3000:3000 tareas-devops
```

## API

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| GET | `/health` | Estado del servicio | 200 |
| GET | `/metrics` | Solicitudes, errores, tareas, tiempo activo | 200 |
| GET | `/api/tareas` | Lista las tareas | 200 |
| POST | `/api/tareas` | Crea una tarea (`{"titulo": "..."}`, máx. 100 caracteres) | 201, 400 |
| PATCH | `/api/tareas/:id` | Alterna completada | 200, 404 |
| DELETE | `/api/tareas/:id` | Elimina una tarea | 204, 404 |

## Pruebas y cobertura

- **Unitarias/de API:** validaciones (título vacío, solo espacios, no texto, más de 100 caracteres), 404 en PATCH y DELETE.
- **Integración:** flujo completo crear → completar → listar → borrar, no reutilización de ids y coherencia de `/metrics`.
- **Cobertura:** `npm test` genera `coverage/` y falla si la cobertura global baja de 85 % (sentencias, funciones, líneas) o 75 % (ramas). El reporte también se sube como artefacto en cada ejecución del pipeline.

## Pipeline (resumen)

```
push / pull request a main
        │
        ▼
 Job 1: Build y pruebas ── checkout → Node 20 → npm install → lint → npm test (cobertura) → artefacto → docker build
        │ (solo si pasa y es push a main)
        ▼
 Job 2: Despliegue a GitHub Pages ── configure-pages → upload-pages-artifact → deploy-pages
```

Detalle de cada etapa en [`docs/PIPELINE.md`](docs/PIPELINE.md).

## Documentación

- [`docs/PIPELINE.md`](docs/PIPELINE.md): explicación de cada etapa del pipeline.
- [`docs/DESPLIEGUE.md`](docs/DESPLIEGUE.md): instrucciones de despliegue paso a paso.
- [`CONTRIBUTING.md`](CONTRIBUTING.md): guía de contribución.
- [`docs/INFORME.md`](docs/INFORME.md): informe de implementación.
- [`docs/GUION-DEMO.md`](docs/GUION-DEMO.md): guion para el video/presentación.

## Licencia

MIT


