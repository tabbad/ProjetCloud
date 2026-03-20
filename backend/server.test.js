const request = require('supertest');

const mockTodos = [
  {
    id: 'todo-1',
    data: () => ({
      title: 'Premier TODO',
      description: 'Test',
      completed: false
    })
  }
];

jest.mock('./firebase', () => ({
  db: {
    collection: jest.fn((name) => {
      if (name === 'TODO') {
        return {
          get: jest.fn().mockResolvedValue({
            forEach: (callback) => mockTodos.forEach((doc) => callback(doc))
          })
        };
      }

      return {
        doc: () => ({
          get: jest.fn().mockResolvedValue({ exists: true, id: 'id', data: () => ({}) })
        })
      };
    })
  }
}));

const app = require('./server');

describe('Backend API - tests simples', () => {
  test('GET /hello doit retourner 200 et success', async () => {
    const response = await request(app).get('/hello');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.message).toContain('Hello World');
  });

  test('POST /todos sans titre doit retourner 400', async () => {
    const response = await request(app)
      .post('/todos')
      .send({ description: 'Sans titre' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Titre requis');
  });

  test('GET /todos doit retourner une liste', async () => {
    const response = await request(app).get('/todos');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(1);
    expect(response.body.data[0]).toMatchObject({
      id: 'todo-1',
      title: 'Premier TODO'
    });
  });
});
