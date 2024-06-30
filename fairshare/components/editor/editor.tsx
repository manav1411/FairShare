import React, { useState, useEffect } from 'react';
import './style.css'; // Import the CSS file

interface Item {
  item_name: string;
  item_count: number;
  items_price: number; // New field for item price
}

interface EditorProps {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
}

const Editor: React.FC<EditorProps> = ({ items, setItems }) => {
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
    updatedItems[index].items_price = updatedItems[index].items_price / (updatedItems[index].item_count - 1) * updatedItems[index].item_count;
    setItems(updatedItems);
  };

  const handleDecrement = (index: number) => {
    const updatedItems = [...items];
    if (updatedItems[index].item_count > 0) {
      updatedItems[index].item_count -= 1;
      updatedItems[index].items_price = updatedItems[index].items_price / (updatedItems[index].item_count + 1) * updatedItems[index].item_count;
      setItems(updatedItems);
    }
  };

  const handlePriceChange = (index: number, newPrice: number) => {
    const updatedItems = [...items];
    updatedItems[index].items_price = newPrice;
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

  if (loading) {
    return (
      <div className="loading">
        Processing...
      </div>
    );
  }

  return (
    <div className="editor-container">
      <h2>Items from GPT</h2>
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
              onChange={(e) => handlePriceChange(index, parseFloat(e.target.value))}
            />
            <button onClick={() => handleDeleteItem(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={handleAddItem}>Add Item</button>
    </div>
  );
};

export default Editor;
