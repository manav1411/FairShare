import React, { useEffect } from 'react';
import './style.css'; // Import the CSS file

interface LiveViewProps {
  finalResult: { item_name: string; item_count: number; items_price: number }[];
}

const LiveView: React.FC<LiveViewProps> = ({ finalResult }) => {

  useEffect(() => {
    const updateReceiptData = async () => {
      try {
        const response = await fetch('/api/receipt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(finalResult),
        });
        if (!response.ok) {
          throw new Error('Failed to update receipt data');
        }
        const data = await response.json();
        console.log('Receipt data updated:', data.receiptData);
      } catch (error) {
        console.error('Error updating receipt data:', error);
      }
    };

    if (finalResult.length > 0) {
      updateReceiptData();
    }
  }, [finalResult]);

  return (
    <div className="live-view"> {/* Apply the live-view class */}
      <h2>Live View</h2>
      <ul>
        {finalResult.map((item, index) => (
          <li key={index}>
            <strong>{item.item_name}</strong>: {item.item_count} items, Total Price: ${item.items_price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LiveView;
