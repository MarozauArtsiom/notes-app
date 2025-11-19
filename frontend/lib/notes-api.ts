// Define the Note type aligned with the backend
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// Get the base URL from environment variables
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4000';

// Helper function to handle fetch requests and errors
async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }

  // For requests that don't return content (e.g., 204 No Content)
  if (response.status === 204 || response.headers.get('Content-Length') === '0') {
    return undefined as unknown as T;
  }

  return response.json();
}

// API client functions
export const notesApi = {
  // GET /notes - Fetch all notes
  getAllNotes: async (): Promise<Note[]> => {
    return fetchAPI<Note[]>('/notes');
  },

  // GET /notes/:id - Fetch a single note
  getNote: async (id: string): Promise<Note> => {
    return fetchAPI<Note>(`/notes/${id}`);
  },

  // POST /notes - Create a new note
  createNote: async (data: { title: string; content: string }): Promise<Note> => {
    return fetchAPI<Note>('/notes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT /notes/:id - Update a note
  updateNote: async (id: string, data: { title?: string; content?: string }): Promise<Note> => {
    return fetchAPI<Note>(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // DELETE /notes/:id - Delete a note
  deleteNote: async (id: string): Promise<void> => {
    await fetchAPI<void>(`/notes/${id}`, {
      method: 'DELETE',
    });
  },
};