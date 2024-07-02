import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests

interface Item {
  item_name: string;
  item_count: number;
  items_price: number; // New field for item price
}

interface EditorProps {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  onClose: (finalResult: Item[], beemName: string) => void; // Callback to close editor and pass final result and beem_name
}

const Editor: React.FC<EditorProps> = ({ items, setItems, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [beemName, setBeemName] = useState('');

  // Simulate loading effect with useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Simulate loading time

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
      const response = await axios.post('/api/receipt', items);
      onClose(items, beemName); // Pass the final items array and beem_name to the onClose callback
    } catch (error) {
      console.log('Error saving receipt:', error);
      // Handle error as needed
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <div className="flex bg-gray-300 rounded-t-lg mb-4">
        <div className="flex-1 p-3 text-lg font-bold text-gray-800">Name</div>
        <div className="flex-1 p-3 text-lg font-bold text-gray-800">Quantity</div>
        <div className="flex-1 p-3 text-lg font-bold text-gray-800">Price ($)</div>
        <div className="p-3"></div>
      </div>
      <ul>
        {items.map((item, index) => (
          <li key={index} className="flex items-center bg-white mb-2 p-3 rounded-lg shadow-md">
            <input
              type="text"
              value={item.item_name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              className="w-1/2 flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <div className="flex items-center mr-2 ml-2">
              <button onClick={() => handleDecrement(index)} className="btn-decrement px-3 py-1 rounded-lg text-2xl p-2 bg-blue-500 text-white hover:bg-blue-600">-</button>
              <span className="mx-2">{item.item_count}</span>
              <button onClick={() => handleIncrement(index)} className="btn-decrement px-3 py-1 text-2xl p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">+</button>
            </div>
  
            <input
              type="number"
              value={item.items_price}
              step="0.01"
              onChange={(e) => handlePriceChange(index, parseFloat(e.target.value))}
              className="min-w-0.5 flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <button onClick={() => handleDeleteItem(index)} className="p-2 ml-2 bg-red-500 text-white rounded-md hover:bg-red-600">Delete</button>
          </li>
        ))}
      </ul>
      <div className="flex mt-4 justify-between">
        <button onClick={handleAddItem} className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add Item</button>
        <input
          type="text"
          value={beemName}
          onChange={(e) => setBeemName(e.target.value)}
          placeholder="Enter your Beem"
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        <button onClick={handleSave} disabled={!beemName} className={`p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${!beemName && 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed'}`} title={!beemName ? "Please enter your Beem name to continue" : ""}>Continue</button>
      </div>
    </div>
  );
}  

export default Editor;
