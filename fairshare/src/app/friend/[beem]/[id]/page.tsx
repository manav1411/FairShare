"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import supabase from '../../../../../supabaseClient';

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
  const [userName, setUserName] = useState<string>('');

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

    const handleGetAllocations = async () => {
      try {
        const response = await fetch('/api/receiptAllocations');
        const data: { allocations: Allocation[] } = await response.json();
        setAllocations(data.allocations);
      } catch (error) {
        console.error('Error fetching allocations:', error);
      }
    };

    // Fetch allocations when component mounts
    handleGetAllocations();
    fetchReceiptData();

    // Subscription logic remains the same
    supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'allocations',
        },
        (payload) => {
          handleGetAllocations();
        }
      )
      .subscribe();

    // Fetch and set userName once when component mounts
    const pathArray = window.location.pathname.split('/');
    const userFromPath = pathArray[2]; // Assuming the second element in path is the user name
    setUserName(userFromPath);

  }, []); // Empty dependency array ensures this effect runs only once on mount

  const handleIncrement = (item_name: string) => {
    const item = receiptData.find(item => item.item_name === item_name);
    if (item && calculateAllocationPercentage(item) < 100) {
      if (selectedItems[item_name] < (item.item_count || 0)) {
        setSelectedItems({
          ...selectedItems,
          [item_name]: selectedItems[item_name] + 1
        });
      }
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

  useEffect(() => {
    handleSaveAllocations();
  }, [selectedItems]);

  const handleSaveAllocations = async () => {
    const userId = window.location.pathname.split('/').pop(); // Get the last segment of the path

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

  const totalAmount = receiptData.reduce((total, item) => {
    return total + ((item.items_price / item.item_count) * selectedItems[item.item_name]);
  }, 0);

  return (
    <div style={{ maxHeight: '90vh', overflowY: 'visible', minWidth: '170vh'}}>
      <div className="container w-full mx-auto p-4 border rounded-lg shadow-lg bg-gray-100">
        <h1 className="text-3xl mb-4 text-gray-800">Hello, {name} 👋</h1>
        <h3 className="text-xl mb-4 text-gray-600">Select your order below</h3>
        {receiptData.length > 0 ? (
          <ul>
            <li className="flex justify-between items-center font-bold border-b pb-2 mb-4">
              <span className="w-1/3 text-center text-xl">Item 🥗</span>
              <span className="w-1/3 text-center text-xl">Total 📊</span>
              <span className="w-1/3 text-center text-xl">Your Part 🍰</span>
            </li>
            {receiptData.map((item, index) => (
              <li key={index} style={{ background: getItemBackgroundColor(item) }} className="rounded-lg overflow-hidden shadow-sm mb-4">
                <div style={{ background: getItemBackgroundColor(item) }} className={`px-4 py-4 sm:px-6 ${index % 2 === 0 ? 'bg-gray-200' : 'bg-white'}`}>
                  <div className="flex items-center">
                    <div className="w-1/3">
                      <p>{item.item_name}</p>
                    </div>
                    <div className="w-1/3 text-center">
                      <p>{item.item_count}x (${item.items_price.toFixed(2)})</p>
                    </div>
                    <div className="w-1/3 flex items-center justify-center">
                      <span className="mr-2">${((item.items_price / item.item_count) * selectedItems[item.item_name]).toFixed(2)}</span>
                      <button
                        className={`btn-decrement px-3 py-1 rounded-lg mr-2 text-2xl ${selectedItems[item.item_name] <= 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                        onClick={() => handleDecrement(item.item_name)}
                        disabled={selectedItems[item.item_name] <= 0}
                      >
                        -
                      </button>
                      <span>{selectedItems[item.item_name]}</span>
                      <button
                        className={`btn-increment px-3 py-1 rounded-lg ml-2 text-2xl ${calculateAllocationPercentage(item) >= 100 ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                        onClick={() => handleIncrement(item.item_name)}
                        disabled={calculateAllocationPercentage(item) >= 100}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            <li className="flex justify-between items-center border-t pt-4 mt-4">
              <div>
                <Link className="button bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg" href="/friend" passHref>
                  ⬅ Go back
                </Link>
              </div>
              <div className="flex-1 text-right text-lg font-bold text-gray-800">
                <span className="mr-4">💰 Your Total: ${receiptData.reduce((total, item) => total + ((item.items_price / item.item_count) * selectedItems[item.item_name]), 0).toFixed(2)}</span>
              </div>
              <Link
                href={`https://beem.com.au/app/pay?amount=${receiptData.reduce((total, item) => total + ((item.items_price / item.item_count) * selectedItems[item.item_name]), 0) * 100}&handle=${userName}&description=${name}'s part of the receipt`}
                passHref
              >
                <button
                  className={`button px-4 py-2 rounded-lg ${totalAmount === 0 ? 'bg-gray-500 text-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                  disabled={totalAmount === 0}
                >
                  Beem {userName}
                </button>
              </Link>
            </li>
          </ul>
        ) : (
          <p className="text-gray-600">No receipt data available ❌</p>
        )}
      </div>
    </div>
  );
}  

export default FriendPage;

