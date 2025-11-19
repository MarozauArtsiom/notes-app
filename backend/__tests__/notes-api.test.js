const request = require("supertest");
const { v4: uuidv4 } = require("uuid");

// Mock the uuid module to return predictable IDs
jest.mock("uuid", () => ({
  v4: jest.fn(() => "12345678-1234-1234-1234-123456789012"),
}));

// Import the app after mocking uuid
const { app, notes, clearNotes } = require("../server");

describe("Notes API", () => {
  beforeEach(() => {
    // Clear the notes array before each test
    clearNotes();
  });

  describe("POST /notes", () => {
    it("should create a new note with valid data", async () => {
      const newNote = {
        title: "Test Note",
        content: "This is a test note",
      };

      const response = await request(app)
        .post("/notes")
        .send(newNote)
        .expect(201);

      expect(response.body).toMatchObject({
        id: "12345678-1234-1234-1234-123456789012",
        title: "Test Note",
        content: "This is a test note",
      });
      expect(response.body).toHaveProperty("createdAt");
      expect(response.body).toHaveProperty("updatedAt");
    });

    it("should create a note with empty content", async () => {
      const newNote = {
        title: "Empty Content Note",
        content: "",
      };

      const response = await request(app)
        .post("/notes")
        .send(newNote)
        .expect(201);

      expect(response.body).toMatchObject({
        title: "Empty Content Note",
        content: "",
      });
    });

    it("should return 400 for invalid data (empty title)", async () => {
      const invalidNote = {
        title: "",
        content: "Missing title",
      };

      const response = await request(app)
        .post("/notes")
        .send(invalidNote)
        .expect(400);

      expect(response.body).toHaveProperty("error");
      expect(response.body).toHaveProperty("details");
    });

    it("should return 400 for missing title", async () => {
      const invalidNote = {
        content: "Missing title",
      };

      const response = await request(app)
        .post("/notes")
        .send(invalidNote)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /notes", () => {
    it("should return an empty array when no notes exist", async () => {
      const response = await request(app).get("/notes").expect(200);

      expect(response.body).toEqual([]);
    });

    it("should return all notes when notes exist", async () => {
      // Add a note directly to the in-memory storage
      notes.push({
        id: "test-id-1",
        title: "Test Note 1",
        content: "Test content 1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      notes.push({
        id: "test-id-2",
        title: "Test Note 2",
        content: "Test content 2",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const response = await request(app).get("/notes").expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty("id", "test-id-1");
      expect(response.body[1]).toHaveProperty("id", "test-id-2");
    });
  });

  describe("GET /notes/:id", () => {
    it("should return a specific note by ID", async () => {
      // Add a note directly to the in-memory storage
      notes.push({
        id: "test-id",
        title: "Test Note",
        content: "Test content",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const response = await request(app).get("/notes/test-id").expect(200);

      expect(response.body).toMatchObject({
        id: "test-id",
        title: "Test Note",
        content: "Test content",
      });
    });

    it("should return 404 for non-existent note", async () => {
      const response = await request(app)
        .get("/notes/non-existent-id")
        .expect(404);

      expect(response.body).toHaveProperty("error", "Note not found");
    });
  });

  describe("PUT /notes/:id", () => {
    it("should update a note with valid data", async () => {
      // Add a note directly to the in-memory storage
      notes.push({
        id: "test-id",
        title: "Original Title",
        content: "Original content",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const updatedNote = {
        title: "Updated Title",
        content: "Updated content",
      };

      const response = await request(app)
        .put("/notes/test-id")
        .send(updatedNote)
        .expect(200);

      expect(response.body).toMatchObject({
        id: "test-id",
        title: "Updated Title",
        content: "Updated content",
      });
      // Check that updatedAt was updated
      expect(response.body.updatedAt).not.toEqual(response.body.createdAt);
    });

    it("should update only the title of a note", async () => {
      // Add a note directly to the in-memory storage
      const createdAt = new Date().toISOString();
      notes.push({
        id: "test-id",
        title: "Original Title",
        content: "Original content",
        createdAt: createdAt,
        updatedAt: createdAt,
      });

      const updatedNote = {
        title: "Updated Title Only",
      };

      const response = await request(app)
        .put("/notes/test-id")
        .send(updatedNote)
        .expect(200);

      expect(response.body).toMatchObject({
        id: "test-id",
        title: "Updated Title Only",
        content: "Original content",
      });
    });

    it("should return 404 for non-existent note", async () => {
      const updatedNote = {
        title: "Updated Title",
        content: "Updated content",
      };

      const response = await request(app)
        .put("/notes/non-existent-id")
        .send(updatedNote)
        .expect(404);

      expect(response.body).toHaveProperty("error", "Note not found");
    });

    it("should return 400 for invalid data", async () => {
      // Add a note directly to the in-memory storage
      notes.push({
        id: "test-id",
        title: "Original Title",
        content: "Original content",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const invalidNote = {
        title: "",
      };

      const response = await request(app)
        .put("/notes/test-id")
        .send(invalidNote)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("DELETE /notes/:id", () => {
    it("should delete a note by ID", async () => {
      // Add a note directly to the in-memory storage
      notes.push({
        id: "test-id",
        title: "Test Note",
        content: "Test content",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      await request(app).delete("/notes/test-id").expect(204);

      // Verify the note was deleted
      await request(app).get("/notes/test-id").expect(404);
    });

    it("should return 404 for non-existent note", async () => {
      const response = await request(app)
        .delete("/notes/non-existent-id")
        .expect(404);

      expect(response.body).toHaveProperty("error", "Note not found");
    });
  });
});
