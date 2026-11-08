# Informe de implementación — Práctica 3: Pipeline CI/CD con GitHub Actions

**Estudiante(s):** Florianni Eckeila Moreno · **Matrícula:** 2025-2014 · **Fecha:** 08/11/2026
**Repositorio:** https://github.com/floriannimoreno-source/practica3-cicd-itla · **Sitio:** https://floriannimoreno-source.github.io/practica3-cicd-itla/
**Video / presentación:** _pegar enlace de YouTube o archivo PPT_

## 1. Objetivo

Implementar un pipeline CI/CD básico con GitHub Actions que automatice pruebas, construcción y despliegue de una aplicación web.

## 2. Qué se implementó

- Repositorio público con la plantilla (API Express, frontend, Dockerfile, pruebas).
- Funcionalidad nueva: `DELETE /api/tareas/:id` y validación de título de máximo 100 caracteres.
- Pruebas nuevas: borrado, borrado inexistente, título largo, título de solo espacios, título que no es texto, flujo de integración, ids no reutilizados y métricas.
- Cobertura con umbral mínimo que hace fallar el pipeline.
- Workflow `ci.yml` con lint, pruebas, artefacto de cobertura, build Docker y deploy a Pages.
- Documentación: README, `docs/PIPELINE.md`, `docs/DESPLIEGUE.md`, `CONTRIBUTING.md`.

## 3. Evidencias

| Evidencia | Captura / enlace |
|---|---|
| `npm test` en local con cobertura | _pegar captura_ |
| Pipeline en rojo (prueba fallida) | _pegar captura y enlace a la ejecución_ |
| Pipeline en verde (corregido) | _pegar captura y enlace a la ejecución_ |
| Sitio en GitHub Pages | _pegar captura_ |
| Reporte de cobertura (artefacto) | _pegar captura_ |

## 4. Resultados

- Porcentaje de cobertura obtenido: _completar_
- Tiempo aproximado del pipeline: _completar_

## 5. Problemas encontrados y soluciones

_Describe con tus palabras al menos uno (por ejemplo: Pages no activado, error de permisos, prueba que falló)._

## 6. Lecciones aprendidas

_Completar._


