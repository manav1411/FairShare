

//landing page for individual friend user.

//update users by calling /api/users POST request with name=[name from query string], and id from URL. This will find user based on id, and update name to name from query string.
// display receipt by calling /api/receipt GET request


// perhaps update liveView to actually be live (call /api/receipt GET req whenever it is changed. need to 'subscribe' to changes somehow.)

// implement and call component(pass in [id]) that:
// displays allocation by calling /api/receiptAllocations GET request.
// it should print out a coloured list of items, with grey being 'unallocated', and each user having a different colour. if say userA picked 1 burger, and userB picked 1 burger, and the receipt had 3, 1/3 of the burger item should be userA coloured, 1/3 should be userB coloured, and 1/3 should be grey.
// then, have +/- buttons next to each item, which when pressed will call /api/receiptAllocations POST request to update the allocation, and then call /api/receiptAllocations GET request to update the display.



// pages/friend/[id].tsx

"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import './style.css'; // Import the CSS file

interface ReceiptItem {
  item_name: string;
  item_count: number;
  items_price: number;
}

const FriendPage: React.FC = () => {
  const [receiptData, setReceiptData] = useState<ReceiptItem[]>([]);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    // Function to parse query parameters from URL
    const getQueryParam = (param: string): string | null => {
      const query = new URLSearchParams(window.location.search);
      return query.get(param);
    };

    // Extract the 'name' parameter from the query string
    const nameFromQuery = getQueryParam('name');
    if (nameFromQuery) {
      setName(nameFromQuery);
    }

    const fetchReceiptData = async () => {
      try {
        const response = await fetch('/api/receipt');
        const data = await response.json();
        console.log('Receipt Data:', data);
        setReceiptData(data.receiptData);
      } catch (error) {
        console.error('Error fetching receipt data:', error);
      }
    };

    fetchReceiptData();
  }, []);

  return (
    <div className="container"> {/* Apply container class */}
      <h1>Hello, {name}</h1>
      <h3>basic Receipt(remove later):</h3>
      {receiptData.length > 0 ? (
        <ul>
          {receiptData.map((item, index) => (
            <li key={index}>
              {item.item_name}: {item.item_count} x ${item.items_price.toFixed(2)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No receipt data available.</p>
      )}

      <br /><br /><br />
      <h3>Allocations Reciept:</h3>
      <p>TODO</p>
      <Link href="/">
        Go back home
      </Link>
    </div>
  );
};

export default FriendPage;
