# Informe de implementación — Práctica 3: Pipeline CI/CD con GitHub Actions

**Estudiante(s):** Florianni Eckeila Moreno
**Matrícula:** 2025-2014
**Fecha:** 08/11/2026
**Repositorio:** https://github.com/floriannimoreno-source/practica3-cicd-itla
**Sitio publicado:** https://floriannimoreno-source.github.io/practica3-cicd-itla/
**Video / presentación:** _pegar aquí el enlace de YouTube o el nombre del archivo PPT_

## 1. Objetivo

Implementar un pipeline CI/CD básico con GitHub Actions que automatice la revisión, las pruebas, la construcción y el despliegue de una aplicación web sencilla (lista de tareas en Node.js/Express), demostrando que un cambio defectuoso es detectado y bloqueado antes de llegar a producción.

## 2. Qué se implementó

**Aplicación y funcionalidad nueva**

- Se partió de la plantilla proporcionada (API Express, frontend estático, Dockerfile y pruebas con Jest).
- Se agregó el endpoint `DELETE /api/tareas/:id` (responde 204 si borra y 404 si la tarea no existe) y un botón «Borrar» en el frontend.
- Se agregó una validación: el título de una tarea no puede superar los 100 caracteres.
- Se corrigió un problema de diseño: los ids se calculaban con `tareas.length + 1`, lo que habría repetido ids al borrar tareas. Ahora se usa un contador propio.

**Pruebas (14 en total, 8 nuevas)**

- Borrado de una tarea y borrado de una tarea inexistente.
- Títulos inválidos: más de 100 caracteres, solo espacios y valor que no es texto.
- Pruebas de integración: flujo completo (crear, completar, listar y borrar), los ids no se reutilizan después de borrar y `/metrics` refleja los cambios.
- La cobertura tiene un umbral mínimo configurado en `package.json` (85 % en sentencias, funciones y líneas; 75 % en ramas). Si baja, `npm test` falla y el pipeline se pone en rojo.

**Pipeline (`.github/workflows/ci.yml`)**

- Se ejecuta en cada `push` y `pull request` hacia `main`.
- Job 1, *Build y pruebas*: checkout, instalación de Node 20, `npm install`, revisión estática, pruebas con cobertura, guardado del reporte de cobertura como artefacto y construcción de la imagen Docker.
- Job 2, *Despliegue a GitHub Pages*: solo corre si el Job 1 pasó y el evento es un `push` a `main`.

**Documentación**

- `README.md`, `docs/PIPELINE.md`, `docs/DESPLIEGUE.md` y `CONTRIBUTING.md`.

## 3. Evidencias

### 3.1 Pruebas y cobertura en local

![npm test con 14 pruebas en verde y tabla de cobertura](img/test-local.png)

### 3.2 Pipeline en verde (ejecución #1)

![Ejecución #1 con los dos jobs en verde](img/pipeline-verde.png)

### 3.3 Sitio publicado en GitHub Pages

![Página publicada en GitHub Pages](img/pages.png)

### 3.4 Fallo provocado a propósito

Se cambió en `tests/app.test.js` la expectativa `toBe(201)` por `toBe(200)` en la prueba «POST /api/tareas crea una tarea». En local, Jest reportó una prueba fallida:

![Prueba fallida en local](img/test-falla-local.png)

Al hacer `push` de ese commit, el pipeline (ejecución #2) terminó en rojo. El job *Build y pruebas* falló y el job de despliegue fue omitido, por lo que el código defectuoso no llegó a GitHub Pages:

![Ejecución #2 en rojo con el despliegue omitido](img/pipeline-rojo.png)

El paso que falló fue «Pruebas con cobertura», con el resumen `1 failed, 13 passed` y el código de salida 1:

![Detalle del paso fallido](img/error-paso.png)

### 3.5 Corrección y vuelta a verde

Se restauró `toBe(201)` y se hizo un nuevo commit (`fix: corregir la prueba y volver el pipeline a verde`). La ejecución #3 terminó en verde y volvió a desplegar. El historial completo muestra el ciclo verde, rojo, verde:

![Historial de ejecuciones: verde, rojo, verde](img/historial.png)

## 4. Resultados

| Métrica | Resultado |
|---|---|
| Pruebas | 14 de 14 pasan (6 de la plantilla y 8 nuevas) |
| Cobertura de sentencias | 96 % |
| Cobertura de ramas | 87.5 % |
| Cobertura de funciones | 100 % |
| Cobertura de líneas | 100 % |
| Duración del pipeline completo | Aproximadamente 52 a 53 segundos |
| Líneas sin cubrir | 21 y 22 de `app.js` (contador de errores 500 y registro en consola) |

El pipeline cumplió su función: detectó el cambio defectuoso, impidió el despliegue y volvió a desplegar al corregirlo.

## 5. Problemas encontrados y soluciones

1. **El despliegue falló en la primera ejecución** con `HttpError: Not Found`. GitHub Pages no estaba activado en el repositorio. Se resolvió en *Settings → Pages* eligiendo *GitHub Actions* como fuente y volviendo a ejecutar los jobs.
2. **Node.js no estaba instalado** en la computadora (`node` no se reconocía). Se instaló la versión LTS desde nodejs.org, desmarcando la instalación opcional de herramientas para módulos nativos, y se reabrió la terminal.
3. **`jest` no se reconocía** al correr `npm test`, porque faltaba ejecutar `npm install` para descargar las dependencias.
4. **Errores por ejecutar comandos en la carpeta equivocada** (`package.json` no encontrado y «not a git repository»). La terminal se abría en la carpeta exterior; se resolvió entrando a `plantilla-devops-itla` con `cd`.
5. **Avisos informativos en el pipeline** sobre Node.js 20 y la migración de `ubuntu-latest`. No afectan el resultado y quedan como mejora futura (actualizar versiones de las acciones).

## 6. Lecciones aprendidas

- Un pipeline de integración continua actúa como barrera de calidad: un cambio que rompe una prueba no se despliega.
- Condicionar el despliegue con `needs` y `if` evita publicar versiones defectuosas y separa la validación de la publicación.
- Configurar un umbral de cobertura obliga a mantener pruebas al día cuando se agrega código nuevo.
- Conviene ejecutar `npm test` en local antes de hacer `push`, para detectar errores sin esperar al pipeline.
- Guardar el reporte de cobertura como artefacto, incluso cuando las pruebas fallan, facilita diagnosticar el problema.
- Los mensajes de commit claros dejan un historial que sirve como evidencia del proceso.

## 7. Mejoras posibles

- Reemplazar la revisión estática básica por ESLint.
- Publicar la imagen Docker en GitHub Container Registry.
- Agregar persistencia (por ejemplo SQLite) en lugar del arreglo en memoria.
- Definir una alerta de monitoreo con el endpoint `/metrics`.
