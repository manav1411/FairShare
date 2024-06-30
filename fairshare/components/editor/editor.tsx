// components/Editor.tsx
import React, { useState, useEffect } from 'react';
import './style.css'; // Import the CSS file

interface EditorProps {
  items: { item_name: string, item_count: number }[];
  setItems: React.Dispatch<React.SetStateAction<{ item_name: string, item_count: number }[]>>;
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
    setItems(updatedItems);
  };

  const handleDecrement = (index: number) => {
    const updatedItems = [...items];
    if (updatedItems[index].item_count > 0) {
      updatedItems[index].item_count -= 1;
      setItems(updatedItems);
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Editor;
