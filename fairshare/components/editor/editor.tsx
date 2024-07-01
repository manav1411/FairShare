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
      const response = await axios.post('/api/receipt', items);
      console.log('Receipt saved:', response.data);
      onClose(items); // Pass the final items array to the onClose callback
    } catch (error) {
      console.log('Error saving receipt:', error);
      // Handle error as needed
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Processing...</div>
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
            <div className="ml-2 mr-2">
              <button onClick={() => handleDecrement(index)} className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">-</button>
            <span className="p-2">{item.item_count}</span>
            <button onClick={() => handleIncrement(index)} className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">+</button>
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
        <button onClick={handleSave} className="p-3 bg-green-500 text-white rounded-md hover:bg-green-600">Save</button>
      </div>
    </div>
  );
};

export default Editor;
