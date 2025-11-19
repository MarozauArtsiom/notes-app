const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const { z } = require("zod");

const app = express();
// Update to use port 4000 as default per requirements
const PORT = process.env.PORT || 4000;

// Configure CORS to allow frontend origin in development
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// In-memory storage for notes
let notes = [];

// Updated Zod schema for note validation - content can be empty
const NoteSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string(), // Removed min(1) to allow empty content
});

// Updated schema for note updates - content can be empty
const UpdateNoteSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  content: z.string().optional(), // Removed min(1) to allow empty content
});

// Helper function to format Zod validation errors
const formatZodErrors = (zodErrors) => {
  return zodErrors
    .map((error) => {
      if (error.path && error.path.length > 0) {
        const field = error.path[0];
        return `${field.charAt(0).toUpperCase() + field.slice(1)} ${
          error.message
        }`;
      }
      return error.message;
    })
    .join(", ");
};

// Routes
// POST /notes - Create a note
app.post("/notes", (req, res) => {
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
      return res.status(400).json({ message: formatZodErrors(error.errors) });
    }
    // Log unexpected errors server-side
    console.error("Unexpected error in POST /notes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /notes - List all notes
app.get("/notes", (req, res) => {
  try {
    res.json(notes);
  } catch (error) {
    // Log unexpected errors server-side
    console.error("Unexpected error in GET /notes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /notes/:id - Get a note by ID
app.get("/notes/:id", (req, res) => {
  try {
    const note = notes.find((note) => note.id === req.params.id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    res.json(note);
  } catch (error) {
    // Log unexpected errors server-side
    console.error("Unexpected error in GET /notes/:id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /notes/:id - Update a note
app.put("/notes/:id", (req, res) => {
  try {
    const noteIndex = notes.findIndex((note) => note.id === req.params.id);
    if (noteIndex === -1) {
      return res.status(404).json({ message: "Note not found" });
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
      return res.status(400).json({ message: formatZodErrors(error.errors) });
    }
    // Log unexpected errors server-side
    console.error("Unexpected error in PUT /notes/:id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /notes/:id - Delete a note
app.delete("/notes/:id", (req, res) => {
  try {
    const noteIndex = notes.findIndex((note) => note.id === req.params.id);
    if (noteIndex === -1) {
      return res.status(404).json({ message: "Note not found" });
    }

    notes.splice(noteIndex, 1);
    // Return success with no body as per requirements
    res.status(204).send();
  } catch (error) {
    // Log unexpected errors server-side
    console.error("Unexpected error in DELETE /notes/:id:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Export notes array and clear function for testing
module.exports = {
  app,
  notes,
  clearNotes: () => {
    notes.length = 0;
  },
};

// Only start the server if this file is run directly
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`Notes API server running on port ${PORT}`);
  });
  module.exports.server = server;
}
