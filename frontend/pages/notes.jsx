import React, { useState, useEffect } from "react";
import { notesApi } from "../lib/notes-api";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  // Fetch all notes on initial load
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const data = await notesApi.getAllNotes();
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      if (editingNote) {
        // Update existing note
        const updatedNote = await notesApi.updateNote(editingNote.id, formData);
        setNotes(
          notes.map((note) => (note.id === editingNote.id ? updatedNote : note))
        );
        setEditingNote(null);
      } else {
        // Create new note
        const newNote = await notesApi.createNote(formData);
        setNotes([...notes, newNote]);
      }

      // Reset form
      setFormData({ title: "", content: "" });
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      title: note.title,
      content: note.content,
    });
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setFormData({ title: "", content: "" });
    setError(null);
  };

  const handleDelete = async (id) => {
    // Simple confirmation
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await notesApi.deleteNote(id);
        setNotes(notes.filter((note) => note.id !== id));
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading)
    return <div className="max-w-6xl mx-auto p-4">Loading notes...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Notes</h1>

      {/* Note Form */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          {editingNote ? "Edit Note" : "Create New Note"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 font-medium mb-2"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="content"
              className="block text-gray-700 font-medium mb-2"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {editingNote ? "Update Note" : "Create Note"}
            </button>

            {editingNote && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Notes List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Notes</h2>

        {notes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No notes yet. Create your first note!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div
                key={note.id}
                className="border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow bg-white border-gray-200 flex flex-col h-full"
              >
                <h3 className="font-bold text-lg mb-2 text-gray-900">
                  {note.title}
                </h3>
                <p className="text-gray-600 mb-4 flex-grow">{note.content}</p>

                <div className="mt-auto">
                  <div className="text-xs text-gray-400 mb-3">
                    Created: {new Date(note.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(note)}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(note.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;
