//QR code leads to this page


//when user lands here, have text saying "You've been invited for you fairShare!"
//and have a field for name, and a button that says "Join"

//call an /api/users GET request to get a user ID
//(it will give a number 1 bigger than currently existing biggest user ID)

//then, go to /friend/[API recieved id from call above]/?name=[given name from name field above]


// components/FriendPage.tsx



"use client";
import React, { useState } from 'react';
import './style.css'; // Adjust the path as per your project structure

const FriendPage: React.FC = () => {
  const [name, setName] = useState('');

  const handleJoin = async () => {
    try {
      // Fetch the new user ID from the API with the name parameter
      const response = await fetch(`/api/users?name=${encodeURIComponent(name)}`);
      const data = await response.json();

      if (response.ok) {
        const newUserId = data.newUserId;
        // Redirect to the new URL with the user ID and name
        window.location.href = `/friend/${newUserId}/?name=${encodeURIComponent(name)}`;
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
    }
  };

  return (
    <div className="container">
      <h1>You've been invited to fairShare!</h1>
      <p>Enter your name:</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <button onClick={handleJoin}>Join</button>
    </div>
  );
};

export default FriendPage;
