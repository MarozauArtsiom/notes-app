import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('NotesController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new (await import('@nestjs/common')).ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Clear all notes before each test
    await request(app.getHttpServer())
      .delete('/notes')
      .expect(204);
  });

  describe('POST /notes', () => {
    it('should create a new note with valid data', () => {
      return request(app.getHttpServer())
        .post('/notes')
        .send({
          title: 'Test Note',
          content: 'This is a test note',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toMatchObject({
            title: 'Test Note',
            content: 'This is a test note',
          });
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('createdAt');
          expect(res.body).toHaveProperty('updatedAt');
        });
    });

    it('should create a note with empty content', () => {
      return request(app.getHttpServer())
        .post('/notes')
        .send({
          title: 'Empty Content Note',
          content: '',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toMatchObject({
            title: 'Empty Content Note',
            content: '',
          });
        });
    });

    it('should return 400 for invalid data (empty title)', () => {
      return request(app.getHttpServer())
        .post('/notes')
        .send({
          title: '',
          content: 'Missing title',
        })
        .expect(400);
    });

    it('should return 400 for missing title', () => {
      return request(app.getHttpServer())
        .post('/notes')
        .send({
          content: 'Missing title',
        })
        .expect(400);
    });
  });

  describe('GET /notes', () => {
    it('should return an empty array when no notes exist', () => {
      return request(app.getHttpServer())
        .get('/notes')
        .expect(200)
        .expect([]);
    });

    it('should return all notes when notes exist', async () => {
      // Create two notes
      const note1 = await request(app.getHttpServer())
        .post('/notes')
        .send({
          title: 'Test Note 1',
          content: 'Test content 1',
        })
        .expect(201);

      const note2 = await request(app.getHttpServer())
        .post('/notes')
        .send({
          title: 'Test Note 2',
          content: 'Test content 2',
        })
        .expect(201);

      // Get all notes
      return request(app.getHttpServer())
        .get('/notes')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(2);
          expect(res.body[0]).toHaveProperty('id', note1.body.id);
          expect(res.body[1]).toHaveProperty('id', note2.body.id);
        });
    });
  });

  describe('GET /notes/:id', () => {
    it('should return a specific note by ID', async () => {
      // Create a note
      const createdNote = await request(app.getHttpServer())
        .post('/notes')
        .send({
          title: 'Test Note',
          content: 'Test content',
        })
        .expect(201);

      // Get the note by ID
      return request(app.getHttpServer())
        .get(`/notes/${createdNote.body.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            id: createdNote.body.id,
            title: 'Test Note',
            content: 'Test content',
          });
        });
    });

    it('should return 404 for non-existent note', () => {
      return request(app.getHttpServer())
        .get('/notes/non-existent-id')
        .expect(404);
    });
  });

  describe('PUT /notes/:id', () => {
    it('should update a note with valid data', async () => {
      // Create a note
      const createdNote = await request(app.getHttpServer())
        .post('/notes')
        .send({
          title: 'Original Title',
          content: 'Original content',
        })
        .expect(201);

      // Update the note
      return request(app.getHttpServer())
        .put(`/notes/${createdNote.body.id}`)
        .send({
          title: 'Updated Title',
          content: 'Updated content',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            id: createdNote.body.id,
            title: 'Updated Title',
            content: 'Updated content',
          });
          // Check that updatedAt was updated
          expect(res.body.updatedAt).not.toEqual(res.body.createdAt);
        });
    });

    it('should update only the title of a note', async () => {
      // Create a note
      const createdNote = await request(app.getHttpServer())
        .post('/notes')
        .send({
          title: 'Original Title',
          content: 'Original content',
        })
        .expect(201);

      // Update only the title
      return request(app.getHttpServer())
        .put(`/notes/${createdNote.body.id}`)
        .send({
          title: 'Updated Title Only',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            id: createdNote.body.id,
            title: 'Updated Title Only',
            content: 'Original content',
          });
        });
    });

    it('should return 404 for non-existent note', () => {
      return request(app.getHttpServer())
        .put('/notes/non-existent-id')
        .send({
          title: 'Updated Title',
          content: 'Updated content',
        })
        .expect(404);
    });
  });

  describe('DELETE /notes/:id', () => {
    it('should delete a note by ID', async () => {
      // Create a note
      const createdNote = await request(app.getHttpServer())
        .post('/notes')
        .send({
          title: 'Test Note',
          content: 'Test content',
        })
        .expect(201);

      // Delete the note
      await request(app.getHttpServer())
        .delete(`/notes/${createdNote.body.id}`)
        .expect(204);

      // Verify the note was deleted
      return request(app.getHttpServer())
        .get(`/notes/${createdNote.body.id}`)
        .expect(404);
    });

    it('should return 404 for non-existent note', () => {
      return request(app.getHttpServer())
        .delete('/notes/non-existent-id')
        .expect(404);
    });
  });
});