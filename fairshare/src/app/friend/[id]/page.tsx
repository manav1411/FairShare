"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import './style.css';

interface ReceiptItem {
  item_name: string;
  item_count: number;
  items_price: number;
}

interface Allocation {
  user_id: number;
  items_allocated: { item_name: string; item_count: number }[];
}

const FriendPage: React.FC = () => {
  const [receiptData, setReceiptData] = useState<ReceiptItem[]>([]);
  const [name, setName] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<{ [item_name: string]: number }>({});
  const [allocations, setAllocations] = useState<Allocation[]>([]);

  useEffect(() => {
    const getQueryParam = (param: string): string | null => {
      const query = new URLSearchParams(window.location.search);
      return query.get(param);
    };

    const nameFromQuery: string | null = getQueryParam('name');
    if (nameFromQuery) {
      setName(nameFromQuery);
    }

    const fetchReceiptData = async () => {
      try {
        const response = await fetch('/api/receipt');
        const data: { receiptData: ReceiptItem[] } = await response.json();
        console.log('Receipt Data:', data);
        setReceiptData(data.receiptData);
        const initialSelectedItems: { [item_name: string]: number } = data.receiptData.reduce<{ [item_name: string]: number }>((acc, item) => {
          acc[item.item_name] = 0;
          return acc;
        }, {});
        setSelectedItems(initialSelectedItems);
      } catch (error) {
        console.error('Error fetching receipt data:', error);
      }
    };

    fetchReceiptData();
  }, []);

  const handleIncrement = (item_name: string) => {
    if (selectedItems[item_name] < (receiptData.find(item => item.item_name === item_name)?.item_count || 0)) {
      setSelectedItems({
        ...selectedItems,
        [item_name]: selectedItems[item_name] + 1
      });
    }
  };

  const handleDecrement = (item_name: string) => {
    if (selectedItems[item_name] > 0) {
      setSelectedItems({
        ...selectedItems,
        [item_name]: selectedItems[item_name] - 1
      });
    }
  };

  const handleGetAllocations = async () => {
    try {
      const response = await fetch('/api/receiptAllocations');
      const data: { allocations: Allocation[] } = await response.json();
      console.log('Allocations:', data.allocations);
      setAllocations(data.allocations);
    } catch (error) {
      console.error('Error fetching allocations:', error);
    }
  };

  const handleSaveAllocations = async () => {
    const pathArray = window.location.pathname.split('/');
    const userId = pathArray[pathArray.length - 1]; // Get the last segment of the path

    // Filter out items with item_count 0 or less
    const itemsToAllocate = Object.entries(selectedItems)
      .filter(([item_name, item_count]) => item_count >= 1) // Adjust condition as needed
      .map(([item_name, item_count]) => ({ item_name, item_count }));
  
    try {
      const response = await fetch('/api/receiptAllocations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, itemsToAllocate }),
      });
      // Handle response as needed
    } catch (error) {
      console.error('Error saving allocations:', error);
    }
  };


  const calculateAllocationPercentage = (item: ReceiptItem): number => {
    const totalItemCount = item.item_count;
    const allocatedCount = allocations.reduce((total, allocation) => {
      const allocatedItem = allocation.items_allocated.find(alloc => alloc.item_name === item.item_name);
      if (allocatedItem) {
        return total + allocatedItem.item_count;
      }
      return total;
    }, 0);
    return (allocatedCount / totalItemCount) * 100;
  };

  const getItemBackgroundColor = (item: ReceiptItem): string => {
    const percentageAllocated = calculateAllocationPercentage(item);
    return `linear-gradient(90deg, #a3a3a3 ${percentageAllocated}%, #ffffff ${percentageAllocated}%)`;
  };

  return (
    <div className="container">
      <h1>Hello, {name}</h1>
      <h3>Allocations Receipt:</h3>
      {receiptData.length > 0 ? (
        <ul>
          <li className="receipt-header">
            <span>Item</span>
            <span>Total</span>
            <span>Your Part</span>
          </li>
          {receiptData.map((item, index) => (
            <li key={index} style={{ background: getItemBackgroundColor(item) }}>
              <div className="item-details">
                <span>{item.item_name}</span>
                <span>{item.item_count}x (${item.items_price.toFixed(2)})</span>
                <div>
                  <span>${((item.items_price / item.item_count) * selectedItems[item.item_name]).toFixed(2)}</span>
                  <button className="btn-decrement" onClick={() => handleDecrement(item.item_name)}>-</button>
                  <span>{selectedItems[item.item_name]}</span>
                  <button className="btn-increment" onClick={() => handleIncrement(item.item_name)}>+</button>
                </div>
              </div>
            </li>
          ))}
          <li className="total-divider">
            <div className="total-amount">
              <span>Your Total: ${receiptData.reduce((total, item) => total + ((item.items_price / item.item_count) * selectedItems[item.item_name]), 0).toFixed(2)}</span>
            </div>
          </li>
        </ul>
      ) : (
        <p>No receipt data available for allocation.</p>
      )}
      <div className="button-container">
        <Link href="/friend" className='button'>
          Go back
        </Link>
        <div className="right-aligned">
          <button className="btn-save" onClick={handleSaveAllocations}>Save Your Allocations</button>
        </div>
      </div>
      <br />
      <div className="right-aligned">
        <button className="btn-save" onClick={handleGetAllocations}>Get Allocations</button>
      </div>
    </div>
  );
};

export default FriendPage;
