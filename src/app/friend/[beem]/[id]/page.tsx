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

    //fetch allocations when component 1st called
    handleGetAllocations();
    fetchReceiptData();

    //subscription logic
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
    const userFromPath = pathArray[2]; //2nd element in path is user name
    setUserName(userFromPath);

  }, []); //empty dependency array = effect runs only once

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
    const userId = window.location.pathname.split('/').pop(); //get last part of URL path

    //filer out items w item_count <= 0
    const itemsToAllocate = Object.entries(selectedItems)
      .filter(([item_name, item_count]) => item_count >= 1)
      .map(([item_name, item_count]) => ({ item_name, item_count }));

    try {
      const response = await fetch('/api/receiptAllocations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, itemsToAllocate }),
      });
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
    <div style={{ maxHeight: '100vh', overflowY: 'visible', overflowX: 'auto' }}>
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
                      <p>{item.item_count} · ${(item.items_price/item.item_count).toFixed(2)}</p>
                    </div>
                    <div className="w-1/3 flex items-center justify-center">
                      <button
                        className={`btn-decrement px-3 py-1 rounded-lg mr-1 text-2xl ${selectedItems[item.item_name] <= 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 text-white'} shadow-lg`}
                        onClick={() => handleDecrement(item.item_name)}
                        disabled={selectedItems[item.item_name] <= 0}
                      >
                        -
                      </button>
                      <span className="">{( selectedItems[item.item_name])}</span>
                      <button
                        className={`btn-increment px-3 py-1 rounded-lg ml-1 text-2xl ${calculateAllocationPercentage(item) >= 100 ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 text-white'} shadow-lg`}
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
            <span className="mb-2 sm:mb-0 flex justify-end font-bold">💰 Your Total: ${receiptData.reduce((total, item) => total + ((item.items_price / item.item_count) * selectedItems[item.item_name]), 0).toFixed(2)}</span>
              <li className="flex justify-between items-center border-t pt-4 mt-4">
                <Link className="button px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white" href={`/friend/${userName}`} passHref>
                  ⬅ Back
                </Link>
              <Link
href={`https://beem.com.au/app/pay?amount=${Math.round(receiptData.reduce((total, item) => total + ((item.items_price / item.item_count) * selectedItems[item.item_name]), 0) * 100)}&handle=${userName}&description=${name}'s part of the receipt`}
passHref
              >
              <button
                className={`button px-4 py-2 rounded-lg font-bold ${
                  totalAmount === 0
                    ? 'bg-gray-500 text-gray-400 shadow-lg shadow-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-400'
                }`}
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

