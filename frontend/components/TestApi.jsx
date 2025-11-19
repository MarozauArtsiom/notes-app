import React, { useState, useEffect } from 'react';
import { notesApi } from '../lib/notes-api';

const TestApi = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    const results = [];

    try {
      // Test 1: Create a note
      results.push('1. Creating a note...');
      const newNote = await notesApi.createNote({
        title: 'Test Note',
        content: 'This is a test note from the frontend'
      });
      results.push(`✓ Created note with ID: ${newNote.id}`);

      // Test 2: Get all notes
      results.push('2. Fetching all notes...');
      const allNotes = await notesApi.getAllNotes();
      results.push(`✓ Found ${allNotes.length} notes`);

      // Test 3: Get the specific note
      results.push('3. Fetching the created note...');
      const fetchedNote = await notesApi.getNote(newNote.id);
      results.push(`✓ Fetched note: ${fetchedNote.title}`);

      // Test 4: Update the note
      results.push('4. Updating the note...');
      const updatedNote = await notesApi.updateNote(newNote.id, {
        title: 'Updated Test Note',
        content: 'This note has been updated from the frontend'
      });
      results.push(`✓ Updated note title: ${updatedNote.title}`);

      // Test 5: Delete the note
      results.push('5. Deleting the note...');
      await notesApi.deleteNote(newNote.id);
      results.push('✓ Note deleted successfully');

      // Test 6: Verify deletion
      results.push('6. Verifying deletion...');
      try {
        await notesApi.getNote(newNote.id);
        results.push('✗ Note still exists (should have been deleted)');
      } catch (error) {
        results.push('✓ Note successfully deleted (404 error as expected)');
      }
    } catch (error) {
      results.push(`✗ Error: ${error.message}`);
    }

    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">API Client Test</h1>
      <button
        onClick={runTests}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {loading ? 'Running Tests...' : 'Run API Tests'}
      </button>
      
      {testResults.length > 0 && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Test Results:</h2>
          <ul className="list-disc pl-5">
            {testResults.map((result, index) => (
              <li key={index} className="mb-1">
                <span className={result.startsWith('✓') ? 'text-green-600' : result.startsWith('✗') ? 'text-red-600' : ''}>
                  {result}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TestApi;