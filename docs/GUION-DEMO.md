# Guion para el video / presentación (step by step)

Duración sugerida: 8 a 10 minutos. Graba pantalla y voz.

1. **Introducción (30 s):** objetivo, qué hace la app y qué herramientas usas.
2. **Repositorio (1 min):** estructura de carpetas y el archivo `ci.yml`.
3. **Pruebas en local (1 min):** `npm test`; muestra la tabla de cobertura.
4. **Pipeline en verde (1 min):** pestaña Actions con los dos jobs correctos.
5. **Pipeline en rojo a propósito (2 min):**
   - En `tests/app.test.js` cambia un `expect` (por ejemplo `toBe(201)` por `toBe(200)`).
   - `git commit -am "test: romper a propósito"` y `git push`.
   - Muestra la ejecución en **rojo** y el paso que falló; confirma que el deploy **no** se ejecutó.
6. **Corrección (1 min):** revierte el cambio, haz push y muestra el pipeline en **verde** de nuevo.
7. **Despliegue (1 min):** abre la URL de GitHub Pages.
8. **Pull Request (1 min, opcional):** abre un PR y muestra que corre solo el Job 1.
9. **Cierre (30 s):** lecciones aprendidas y dificultades.

Consejo: deja los commits de «rojo» y «verde» en el historial; son tu evidencia.

