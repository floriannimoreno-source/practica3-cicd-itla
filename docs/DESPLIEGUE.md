# Instrucciones de despliegue

## A. Despliegue automático a GitHub Pages (el del pipeline)

1. Crea un repositorio **público** vacío en GitHub.
2. Sube el proyecto:
   ```bash
   git init
   git add .
   git commit -m "Proyecto inicial"
   git branch -M main
   git remote add origin https://github.com/floriannimoreno-source/practica3-cicd-itla.git
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Source: GitHub Actions**.
4. Abre **Actions**: al terminar el workflow *CI/CD*, la URL aparece en el job *Despliegue a GitHub Pages*.
5. Cada `push` posterior a `main` redespliega automáticamente.

Si el deploy falla con error 404 o de permisos, casi siempre falta el paso 3.

## B. Ejecución con Docker (API completa)

```bash
docker build -t tareas-devops .
docker run -d -p 3000:3000 --name tareas tareas-devops
curl http://localhost:3000/health     # {"estado":"ok"}
docker ps                              # el estado pasa a "healthy"
docker rm -f tareas                    # detener y borrar
```

## C. Ejecución local sin Docker

```bash
npm install
npm start
```

## Verificación posterior al despliegue

- Abrir la URL de Pages y comprobar que carga el título «Lista de tareas».
- En local o Docker: `GET /health` responde 200 y `GET /metrics` muestra contadores.

