import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Item {
  item_name: string;
  item_count: number;
  items_price: number;
}

interface EditorProps {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  onClose: (finalResult: Item[], beemName: string) => void;
}

const Editor: React.FC<EditorProps> = ({ items, setItems, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [beemName, setBeemName] = useState('');

  // Simulate loading effect with useEffect
  useEffect(() => {
    // Check if items are empty to determine loading state
    if (items.length === 0) {
      setLoading(true); // Set loading to true if items are empty
    } else {
      setLoading(false); // Set loading to false if items are not empty
    }
  }, [items]); // Run effect whenever items change

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
    updatedItems[index].items_price = Math.round(newPrice * 100) / 100;
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
      onClose(items, beemName);
    } catch (error) {
      console.log('Error saving receipt:', error);
      // Handle error as needed
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">Loading</div>
          <div className="h-5 w-5 bg-blue-500 rounded-full animate-ping"></div>
        </div>
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
              <button
                onClick={() => handleDecrement(index)}
                className={`px-3 py-1 rounded-lg text-2xl p-2 ${item.item_count === 1 ? 'bg-gray-400 text-gray-300 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                disabled={item.item_count === 1}
              >
                -
              </button>
              <span className="mx-2">{item.item_count}</span>
              <button onClick={() => handleIncrement(index)} className="btn-decrement px-3 py-1 text-2xl p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">+</button>
            </div>
  
            <input
              type="number"
              value={item.items_price}
              step="0.01"
              onChange={(e) => handlePriceChange(index, parseFloat(e.target.value))}
              className="min-w-0.5 flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <button onClick={() => handleDeleteItem(index)} className="p-2 ml-2 bg-transparent text-white rounded-md hover:bg-gray-300">❌</button>
          </li>
        ))}
      </ul>

      <div className="flex mt-4 justify-between">
        <button onClick={handleAddItem} className="p-3 bg-gray-800 text-white rounded-md hover:bg-gray-700">Add Item</button>
        <div className="flex justify-center">
          <input
            type="text"
            value={beemName}
            onChange={(e) => setBeemName(e.target.value)}
            placeholder="Enter your Beem"
            className="w-full md:w-auto flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-center max-w-44"
          />
        </div>
        <button 
          onClick={handleSave} 
          disabled={!beemName} 
          className={`p-3 ${beemName ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed'} text-white rounded-md`} 
          title={!beemName ? "Please enter your Beem name to continue" : ""}
        >
          Continue
        </button>
      </div>
    </div>
  );
}  

export default Editor;
