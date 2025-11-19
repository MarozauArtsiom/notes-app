import React from 'react';
import NotesList from '../components/NotesList';
import TestApi from '../components/TestApi';
import Link from 'next/link';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Notes App</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-6">
              <Link href="/notes" className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Go to Notes Management Page
              </Link>
            </div>
            <TestApi />
            <NotesList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;