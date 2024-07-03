"use client";
import React, { useState, useEffect } from 'react';

const FriendPage: React.FC = () => {

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Fetch username from the current URL
    const getUsernameFromUrl = () => {
      const currentUrl = window.location.pathname;
      const parts = currentUrl.split('/');
      if (parts.length >= 3) {
        setUsername(parts[2]);
      }
    };

    getUsernameFromUrl();
  }, []);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleJoin();
    }
  };

  const handleJoin = async () => {
    try {
      // Fetch the new user ID from the API with the name parameter
      const response = await fetch(`/api/users?name=${encodeURIComponent(name)}`);
      const data = await response.json();

      if (response.ok) {
        const newUserId = data.newUserId;
        // Redirect to the new URL with the user ID and name
        window.location.href = `/friend/${username}/${newUserId}/?name=${encodeURIComponent(name)}`;
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  return (
    <div className="text-center max-w-lg p-8 bg-white rounded-lg shadow-lg">
<h1 className="text-3xl mb-6">💌 You've been invited to <span className="text-light-blue-800 font-medium">{username ? `${username}` : ''}</span>'s fairShare!</h1>
<p className="text-lg mb-4">Enter your name 📝</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyPress={handleKeyPress} // Handle Enter key press
        placeholder="John Doe 🫡"
        className="w-full p-3 text-lg mb-4 border rounded outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
      />

      <button
        onClick={handleJoin}
        className="py-3 px-6 text-lg bg-gray-800 text-white rounded hover:bg-gray-700"
      >
        Join
      </button>
    </div>
  );
};

export default FriendPage;
