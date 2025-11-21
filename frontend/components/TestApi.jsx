import React, { useState } from "react";
import { clsx } from "clsx";
import * as Progress from "@radix-ui/react-progress";
import { notesApi } from "../lib/notes-api";

const TestApi = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results = [];

    try {
      results.push("1. Creating a note...");
      const newNote = await notesApi.createNote({
        title: "Test Note",
        content: "This is a test note from the frontend",
      });
      results.push(`[ok] Created note with ID: ${newNote.id}`);

      results.push("2. Fetching all notes...");
      const allNotes = await notesApi.getAllNotes();
      results.push(`[ok] Found ${allNotes.length} notes`);

      results.push("3. Fetching the created note...");
      const fetchedNote = await notesApi.getNote(newNote.id);
      results.push(`[ok] Fetched note: ${fetchedNote.title}`);

      results.push("4. Updating the note...");
      const updatedNote = await notesApi.updateNote(newNote.id, {
        title: "Updated Test Note",
        content: "This note has been updated from the frontend",
      });
      results.push(`[ok] Updated note title: ${updatedNote.title}`);

      results.push("5. Deleting the note...");
      await notesApi.deleteNote(newNote.id);
      results.push("[ok] Note deleted successfully");

      results.push("6. Verifying deletion...");
      try {
        await notesApi.getNote(newNote.id);
        results.push("[err] Note still exists (should have been deleted)");
      } catch (error) {
        results.push("[ok] Note successfully deleted (404 error as expected)");
      }
    } catch (error) {
      results.push(`[err] Error: ${error.message}`);
    }

    setTestResults(results);
    setLoading(false);
  };

  const progressValue =
    loading && testResults.length === 0
      ? 35
      : testResults.length > 0
      ? 100
      : 0;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">API Client Test</h1>
          <p className="text-sm text-muted-foreground">
            A Radix-powered walkthrough that touches every endpoint.
          </p>
        </div>
        <div
          className={clsx(
            "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide border",
            loading
              ? "border-amber-200 bg-amber-50 text-amber-700"
              : "border-lightblue-200 bg-lightblue-50 text-lightblue-800"
          )}
        >
          {loading ? "Running" : "Idle"}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={runTests}
          disabled={loading}
          className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Running tests..." : "Run API tests"}
        </button>
        <div className="text-xs text-muted-foreground">
          Creates, updates, and deletes a note to verify the pipeline.
        </div>
      </div>

      <Progress.Root
        value={progressValue}
        className="relative overflow-hidden rounded-full bg-muted h-2 border border-border"
      >
        <Progress.Indicator
          style={{ width: `${progressValue}%` }}
          className="h-full bg-primary transition-[width] duration-500"
        />
      </Progress.Root>

      {testResults.length > 0 && (
        <div className="rounded-2xl border border-border bg-muted max-h-56 overflow-y-auto p-4 space-y-3">
          <h2 className="text-base font-semibold">Test Results:</h2>
          <ul className="space-y-2 text-sm">
            {testResults.map((result, index) => {
              const color = result.startsWith("[ok]")
                ? "text-lightblue-800"
                : result.startsWith("[err]")
                ? "text-red-700"
                : "text-foreground";
              return (
                <li
                  key={index}
                  className="rounded-xl bg-card border border-border p-3 shadow-sm"
                >
                  <span className={color}>{result}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TestApi;
