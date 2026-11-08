const request = require('supertest');
const { createApp } = require('../src/app');

describe('API de tareas', () => {
  let app;
  beforeEach(() => { app = createApp(); });

  test('GET /health responde ok', async () => {
    const r = await request(app).get('/health');
    expect(r.status).toBe(200);
    expect(r.body.estado).toBe('ok');
  });

  test('POST /api/tareas crea una tarea', async () => {
    const r = await request(app).post('/api/tareas').send({ titulo: 'Configurar pipeline' });
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ id: 1, titulo: 'Configurar pipeline', completada: false });
  });

  test('POST /api/tareas sin título devuelve 400', async () => {
    const r = await request(app).post('/api/tareas').send({});
    expect(r.status).toBe(400);
  });

  test('PATCH /api/tareas/:id alterna completada', async () => {
    await request(app).post('/api/tareas').send({ titulo: 'Escribir pruebas' });
    const r = await request(app).patch('/api/tareas/1');
    expect(r.body.completada).toBe(true);
  });

  test('PATCH de una tarea inexistente devuelve 404', async () => {
    const r = await request(app).patch('/api/tareas/99');
    expect(r.status).toBe(404);
  });

  test('GET /metrics cuenta solicitudes y tareas', async () => {
    await request(app).post('/api/tareas').send({ titulo: 'Medir' });
    const r = await request(app).get('/metrics');
    expect(r.body.tareas).toBe(1);
    expect(r.body.solicitudes).toBeGreaterThanOrEqual(2);
  });

  // ---------- Pruebas nuevas (Práctica 3) ----------

  test('DELETE /api/tareas/:id elimina la tarea', async () => {
    await request(app).post('/api/tareas').send({ titulo: 'Borrar esta' });
    const r = await request(app).delete('/api/tareas/1');
    expect(r.status).toBe(204);
    const lista = await request(app).get('/api/tareas');
    expect(lista.body).toHaveLength(0);
  });

  test('DELETE de una tarea inexistente devuelve 404', async () => {
    const r = await request(app).delete('/api/tareas/99');
    expect(r.status).toBe(404);
  });

  test('POST con título de más de 100 caracteres devuelve 400', async () => {
    const r = await request(app).post('/api/tareas').send({ titulo: 'a'.repeat(101) });
    expect(r.status).toBe(400);
    expect(r.body.error).toMatch(/100/);
  });

  test('POST con título de solo espacios devuelve 400', async () => {
    const r = await request(app).post('/api/tareas').send({ titulo: '   ' });
    expect(r.status).toBe(400);
  });

  test('POST con título que no es texto devuelve 400', async () => {
    const r = await request(app).post('/api/tareas').send({ titulo: 123 });
    expect(r.status).toBe(400);
  });
});

describe('Integración: flujo completo de una tarea', () => {
  test('crear, completar, listar y borrar', async () => {
    const app = createApp();
    const creada = await request(app).post('/api/tareas').send({ titulo: 'Flujo completo' });
    expect(creada.status).toBe(201);

    const completada = await request(app).patch(`/api/tareas/${creada.body.id}`);
    expect(completada.body.completada).toBe(true);

    const lista = await request(app).get('/api/tareas');
    expect(lista.body).toEqual([{ id: creada.body.id, titulo: 'Flujo completo', completada: true }]);

    await request(app).delete(`/api/tareas/${creada.body.id}`);
    const vacia = await request(app).get('/api/tareas');
    expect(vacia.body).toEqual([]);
  });

  test('los ids no se reutilizan después de borrar', async () => {
    const app = createApp();
    await request(app).post('/api/tareas').send({ titulo: 'Una' });
    await request(app).post('/api/tareas').send({ titulo: 'Dos' });
    await request(app).delete('/api/tareas/1');
    const r = await request(app).post('/api/tareas').send({ titulo: 'Tres' });
    expect(r.body.id).toBe(3);
  });

  test('/metrics refleja las tareas tras borrar', async () => {
    const app = createApp();
    await request(app).post('/api/tareas').send({ titulo: 'Medir' });
    await request(app).delete('/api/tareas/1');
    const r = await request(app).get('/metrics');
    expect(r.body.tareas).toBe(0);
  });
});
