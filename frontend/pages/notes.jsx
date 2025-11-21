import React, { useState, useEffect } from "react";
import { clsx } from "clsx";
import * as Label from "@radix-ui/react-label";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import * as Accordion from "@radix-ui/react-accordion";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import TopBar from "../components/TopBar";
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
  const [fieldErrors, setFieldErrors] = useState({});

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

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (error) {
      setError(null);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingNote) {
        const updatedNote = await notesApi.updateNote(editingNote.id, formData);
        setNotes(
          notes.map((note) => (note.id === editingNote.id ? updatedNote : note))
        );
        setEditingNote(null);
      } else {
        const newNote = await notesApi.createNote(formData);
        setNotes([...notes, newNote]);
      }

      setFormData({ title: "", content: "" });
      setFieldErrors({});
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
    setFieldErrors({});
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setFormData({ title: "", content: "" });
    setFieldErrors({});
    setError(null);
  };

  const handleDelete = async (id) => {
    try {
      await notesApi.deleteNote(id);
      setNotes(notes.filter((note) => note.id !== id));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-background">
        <TopBar />
        <div className="max-w-6xl mx-auto px-4 py-8 text-muted-foreground">
          Loading your notes workspace...
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
            Workspace
          </p>
          <div className="flex items-end justify-between gap-3">
            <h1 className="text-3xl font-bold">Notes</h1>
            <div className="text-xs text-muted-foreground">
              {notes.length} note{notes.length === 1 ? "" : "s"} right now
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          <div className="surface-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {editingNote ? "Edit Note" : "Create New Note"}
              </h2>
              {editingNote && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-sm font-semibold text-muted-foreground hover:text-foreground"
                >
                  Cancel editing
                </button>
              )}
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label.Root
                  htmlFor="title"
                  className="text-sm font-medium text-foreground"
                >
                  Title *
                </Label.Root>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={clsx(
                    "w-full rounded-xl border px-3 py-2 text-sm shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
                    fieldErrors.title
                      ? "border-red-300 bg-red-50/60"
                      : "border-border bg-card"
                  )}
                  placeholder="Give your idea a name"
                />
                {fieldErrors.title && (
                  <p className="text-xs text-red-600">{fieldErrors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label.Root
                  htmlFor="content"
                  className="text-sm font-medium text-foreground"
                >
                  Content
                </Label.Root>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                  placeholder="Context, details, and next steps."
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button type="submit" className="btn-primary">
                  {editingNote ? "Update Note" : "Create Note"}
                </button>
                {editingNote && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="surface-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Library
                </p>
                <h2 className="text-xl font-semibold">Your Notes</h2>
              </div>
              <div className="text-xs text-muted-foreground">
                Click a card to expand details
              </div>
            </div>
            {notes.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-muted px-4 py-10 text-center text-muted-foreground">
                No notes yet. Create your first note!
              </div>
            ) : (
              <ScrollArea.Root className="h-[520px] rounded-2xl border border-border bg-muted shadow-inner">
                <ScrollArea.Viewport className="p-2">
                  <Accordion.Root
                    type="single"
                    collapsible
                    className="space-y-2"
                  >
                    {notes.map((note) => (
                      <Accordion.Item
                        key={note.id}
                        value={note.id}
                        className="rounded-2xl border border-border bg-card shadow-sm data-[state=open]:shadow-md transition-shadow"
                      >
                        <Accordion.Header>
                          <Accordion.Trigger className="group w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-foreground hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 rounded-2xl">
                            <div>
                              <div className="text-sm">{note.title}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(note.createdAt).toLocaleString()}
                              </div>
                            </div>
                            <span
                              aria-hidden
                              className={clsx(
                                "text-lg text-muted-foreground transition-transform duration-200",
                                "group-data-[state=open]:rotate-90"
                              )}
                            >
                              &gt;
                            </span>
                          </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Content className="px-4 pb-4 text-sm text-foreground leading-relaxed space-y-4">
                          <div className="whitespace-pre-wrap text-muted-foreground">
                            {note.content || "No content added yet."}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleEdit(note)}
                              className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground hover:bg-lightblue-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
                            >
                              Edit
                            </button>
                            <AlertDialog.Root>
                              <AlertDialog.Trigger asChild>
                                <button className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500">
                                  Delete
                                </button>
                              </AlertDialog.Trigger>
                              <AlertDialog.Portal>
                                <AlertDialog.Overlay className="fixed inset-0 bg-foreground/70 backdrop-blur-[1px]" />
                                <AlertDialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-card border border-border p-6 shadow-2xl shadow-lightblue-200/60 focus:outline-none">
                                  <AlertDialog.Title className="text-lg font-semibold text-foreground">
                                    Delete this note?
                                  </AlertDialog.Title>
                                  <AlertDialog.Description className="text-sm text-muted-foreground mt-2">
                                    This action cannot be undone. The note will
                                    be removed from your library.
                                  </AlertDialog.Description>
                                  <div className="mt-6 flex justify-end gap-3">
                                    <AlertDialog.Cancel asChild>
                                      <button className="btn-secondary">
                                        Keep it
                                      </button>
                                    </AlertDialog.Cancel>
                                    <AlertDialog.Action asChild>
                                      <button
                                        onClick={() => handleDelete(note.id)}
                                        className="rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground shadow-lg shadow-red-300/50 hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600/60"
                                      >
                                        Delete note
                                      </button>
                                    </AlertDialog.Action>
                                  </div>
                                </AlertDialog.Content>
                              </AlertDialog.Portal>
                            </AlertDialog.Root>
                          </div>
                        </Accordion.Content>
                      </Accordion.Item>
                    ))}
                  </Accordion.Root>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar
                  orientation="vertical"
                  className="flex select-none touch-none p-1"
                >
                  <ScrollArea.Thumb className="flex-1 rounded-full bg-lightblue-300 hover:bg-lightblue-400 transition-colors" />
                </ScrollArea.Scrollbar>
                <ScrollArea.Corner />
              </ScrollArea.Root>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotesPage;
