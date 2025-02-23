import React from 'react';

function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Your Contacts Manager</h1>
        <p className="text-gray-600 mb-6">
          A simple, modern application to manage all your contacts efficiently.
        </p>
       
      </div>
    </div>
  );
}

export default HomePage;
