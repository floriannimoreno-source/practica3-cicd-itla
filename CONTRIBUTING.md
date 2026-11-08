# Guía de contribución

## Flujo de trabajo

1. Crea una rama desde `main`: `git checkout -b feature/nombre-corto`.
2. Haz cambios pequeños y un commit por idea, con mensajes claros (`feat:`, `fix:`, `test:`, `docs:`).
3. Antes de subir, ejecuta en local:
   ```bash
   npm run lint
   npm test
   ```
4. Sube la rama y abre un **Pull Request** hacia `main`.
5. El pipeline corre solo: el PR debe quedar en **verde** antes de integrarse.
6. Haz merge. El push a `main` dispara el despliegue.

## Reglas

- Toda funcionalidad nueva lleva al menos una prueba; todo bug corregido lleva una prueba que lo reproduzca.
- No bajar el umbral de cobertura para «hacer pasar» el pipeline.
- No subir `node_modules/`, `coverage/` ni credenciales.
- Mantener README y `docs/` actualizados cuando cambie el comportamiento.

## Estilo

- Nombres de variables y mensajes de la API en español, como el resto del proyecto.
- Respuestas de error en JSON: `{ "error": "mensaje" }`.

