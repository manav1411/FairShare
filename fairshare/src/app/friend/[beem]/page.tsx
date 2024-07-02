//QR code leads to this page

"use client";
import React, { useState } from 'react';
import './style.css'; // Adjust the path as per your project structure

const FriendPage: React.FC = () => {

  // Directly call testing here
  const testing = () => {
    console.log("testing");
  };
  testing(); // This will log "testing" every time the component re-renders




  const [name, setName] = useState('');

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
        const currentUrl = window.location.pathname;
        window.location.href = `/friend/${currentUrl.split('/')[2]}/${newUserId}/?name=${encodeURIComponent(name)}`;
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };


  return (
    <div className="container">
      <h1>💌 You've been invited to fairShare!</h1>
      <p>Enter your name 📝</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyPress={handleKeyPress} // Handle Enter key press
        placeholder="John Doe 🫡"
      />
      <button onClick={handleJoin}>Join</button>
    </div>
  );
};

export default FriendPage;
