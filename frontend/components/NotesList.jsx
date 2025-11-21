import React, { useState, useEffect } from "react";
import * as Accordion from "@radix-ui/react-accordion";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { clsx } from "clsx";
import { notesApi } from "../lib/notes-api";

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
      const data = await notesApi.getAllNotes();
      setNotes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading notes with Radix scroll areas...
      </div>
    );
  if (error)
    return <div className="p-6 text-sm text-red-600">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {notes.length === 0 ? (
        <p className="text-muted-foreground">
          No notes yet. Create your first note!
        </p>
      ) : (
        <ScrollArea.Root className="h-[360px] md:h-[420px] rounded-2xl border border-border bg-muted shadow-inner">
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
                  <Accordion.Content className="px-4 pb-4 text-sm text-foreground leading-relaxed">
                    {note.content || "No content added yet."}
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
  );
};

export default NotesList;
