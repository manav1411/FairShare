import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests
import './style.css'; // Import the CSS file

interface Item {
  item_name: string;
  item_count: number;
  items_price: number; // New field for item price
}

interface EditorProps {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  onClose: (finalResult: Item[]) => void; // Callback to close editor and pass final result
}

const Editor: React.FC<EditorProps> = ({ items, setItems, onClose }) => {
  const [loading, setLoading] = useState(true);

  // Simulate loading effect with useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Simulate loading time

    return () => clearTimeout(timer);
  }, []);

  const handleNameChange = (index: number, newName: string) => {
    const updatedItems = [...items];
    updatedItems[index].item_name = newName;
    setItems(updatedItems);
  };

  const handleIncrement = (index: number) => {
    const updatedItems = [...items];
    updatedItems[index].item_count += 1;
    // Ensure item_count is not less than 1
    if (updatedItems[index].item_count < 1) {
      updatedItems[index].item_count = 1;
    }
    // Update price rounded to 2 decimal places
    updatedItems[index].items_price = parseFloat(
      (
        (updatedItems[index].items_price / (updatedItems[index].item_count - 1)) *
        updatedItems[index].item_count
      ).toFixed(2)
    );
    setItems(updatedItems);
  };

  const handleDecrement = (index: number) => {
    const updatedItems = [...items];
    if (updatedItems[index].item_count > 1) {
      updatedItems[index].item_count -= 1;
      // Update price rounded to 2 decimal places
      updatedItems[index].items_price = parseFloat(
        (
          (updatedItems[index].items_price / (updatedItems[index].item_count + 1)) *
          updatedItems[index].item_count
        ).toFixed(2)
      );
      setItems(updatedItems);
    }
  };

  const handlePriceChange = (index: number, newPrice: number) => {
    const updatedItems = [...items];
    // Round price to 2 decimal places
    updatedItems[index].items_price = Math.round(newPrice * 100) / 100; // Round to 2 decimal places
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([...items, { item_name: '', item_count: 1, items_price: 0 }]);
  };

  const handleDeleteItem = (index: number) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/receipt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Ensure you set the correct content type
        },
        body: JSON.stringify(items), // Convert items to JSON string
      });
  
      if (!response.ok) {
        throw new Error('Failed to save receipt');
      }
  
      const responseData = await response.json(); // Parse response data if needed
  
      console.log('Receipt saved:', responseData);
      onClose(items); // Pass the final items array to the onClose callback
    } catch (error) {
      console.error('Error saving receipt:', error);
      // Handle error as needed
    }
  };
  

  if (loading) {
    return (
      <div className="loading">
        Processing...
      </div>
    );
  }

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="header-item">Name</div>
        <div className="header-item">Quantity</div>
        <div className="header-item">Price ($)</div>
        <div className="header-item"></div>
      </div>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <input
              type="text"
              value={item.item_name}
              onChange={(e) => handleNameChange(index, e.target.value)}
            />
            <button onClick={() => handleDecrement(index)}>-</button>
            <span>{item.item_count}</span>
            <button onClick={() => handleIncrement(index)}>+</button>
            <input
              type="number"
              value={item.items_price}
              step="0.01"
              onChange={(e) => handlePriceChange(index, parseFloat(e.target.value))}
            />
            <button className="delete-button" onClick={() => handleDeleteItem(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <div className="button-container">
        <button onClick={handleAddItem}>Add Item</button>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};

export default Editor;
