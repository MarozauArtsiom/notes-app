const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const { z } = require("zod");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for notes (would be replaced with actual DB in full implementation)
let notes = [];

// Zod schema for note validation
const NoteSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1),
});

const UpdateNoteSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  content: z.string().min(1).optional(),
});

// Routes
// GET /api/notes - Get all notes
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// GET /api/notes/:id - Get a specific note
app.get("/api/notes/:id", (req, res) => {
  const note = notes.find((note) => note.id === req.params.id);
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }
  res.json(note);
});

// POST /api/notes - Create a new note
app.post("/api/notes", (req, res) => {
  try {
    const validatedData = NoteSchema.parse(req.body);

    const newNote = {
      id: uuidv4(),
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    notes.push(newNote);
    res.status(201).json(newNote);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /api/notes/:id - Update a note
app.put("/api/notes/:id", (req, res) => {
  try {
    const noteIndex = notes.findIndex((note) => note.id === req.params.id);
    if (noteIndex === -1) {
      return res.status(404).json({ error: "Note not found" });
    }

    const validatedData = UpdateNoteSchema.parse(req.body);

    notes[noteIndex] = {
      ...notes[noteIndex],
      ...validatedData,
      updatedAt: new Date().toISOString(),
    };

    res.json(notes[noteIndex]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ error: "Validation failed", details: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/notes/:id - Delete a note
app.delete("/api/notes/:id", (req, res) => {
  const noteIndex = notes.findIndex((note) => note.id === req.params.id);
  if (noteIndex === -1) {
    return res.status(404).json({ error: "Note not found" });
  }

  notes.splice(noteIndex, 1);
  res.status(204).send();
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Notes API server running on port ${PORT}`);
});
