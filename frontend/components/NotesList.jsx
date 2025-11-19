import React, { useState, useEffect } from "react";
import { clsx } from "clsx";

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/notes");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading notes...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Notes</h1>
      {notes.length === 0 ? (
        <p className="text-gray-500">No notes yet. Create your first note!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className={clsx(
                "border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow",
                "bg-white border-gray-200"
              )}
            >
              <h2 className="font-semibold text-lg mb-2">{note.title}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{note.content}</p>
              <div className="text-xs text-gray-400">
                Created: {new Date(note.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;
