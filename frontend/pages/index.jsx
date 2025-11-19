import React from "react";
import NotesList from "../components/NotesList";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Notes App</h1>
        </div>
      </header>
      <main>
        <NotesList />
      </main>
    </div>
  );
};

export default HomePage;
