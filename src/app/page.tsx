"use client";
import React, { useState, useEffect } from 'react';
import Camera from '../../components/camera/camera';
import GPT from '../../components/gpt/gpt';
import QR from '../../components/qr/qr';
import Editor from '../../components/editor/editor';
import supabase from '../../supabaseClient';

interface ReceiptItem {
  item_name: string;
  item_count: number;
  items_price: number;
}

interface Allocation {
  user_id: number;
  users: {
    id: number;
    name: string;
  };
  items_allocated: { item_name: string; item_count: number }[];
}

const Home: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [gptResult, setGptResult] = useState<{ item_name: string; item_count: number; items_price: number }[]>([]);
  const [finalResult, setFinalResult] = useState<ReceiptItem[] | null>(null);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [beemName, setBeemName] = useState<string>('');
  const [showQR, setShowQR] = useState(true);
  const [loading, setLoading] = useState(false);

  const toggleQRVisibility = () => {
    setShowQR((prevShowQR) => !prevShowQR);
  };

  useEffect(() => {
    if (finalResult) {
      fetchAllocations();
    }
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
          fetchAllocations();
        }
      )
      .subscribe()
  }, [finalResult]);

  const handleImageCapture = (imageData: string) => {
    setCapturedImage(imageData);
    setLoading(true);
  };

  const handleGPTResult = (result: { item_name: string; item_count: number; items_price: number }[]) => {
    setGptResult(result);
    setLoading(false);
  };

  const handleEditorClose = (finalResult: ReceiptItem[], beemName: string) => {
    setFinalResult(finalResult);
    setBeemName(beemName);
  };

  const fetchAllocations = async () => {
    try {
      const response = await fetch('/api/receiptAllocations');
      const data = await response.json();

      //check if response in expected JSON format
      if (data.allocations) {
        setAllocations(data.allocations);
      } else {
        console.error('Unexpected API response structure:', data);
        setAllocations([]);
      }
    } catch (error) {
      console.error('Error fetching allocations:', error);
      setAllocations([]);
    }
  };

  const handleGetAllocations = () => {
    if (finalResult) {
      fetchAllocations();
    }
  };

  const calculateUserAllocations = () => {
    const userAllocations: { [key: number]: { name: string; claimed: number } } = {};

    allocations.forEach((allocation) => {
      const userId = allocation.user_id;
      const userName = allocation.users.name;

      const claimedAmount = allocation.items_allocated.reduce((acc, alloc) => {
        const item = finalResult?.find((item) => item.item_name === alloc.item_name);
        if (item) {
          acc += (item.items_price / item.item_count) * alloc.item_count;
        }
        return acc;
      }, 0);

      if (claimedAmount > 0) {
        if (userAllocations[userId]) {
          userAllocations[userId].claimed += claimedAmount;
        } else {
          userAllocations[userId] = { name: userName, claimed: claimedAmount };
        }
      }
    });

    return Object.values(userAllocations);
  };


  const getItemListDisplay = () => {
    if (finalResult) {
      //total amount owed
      let totalOwed:any = 0;
      finalResult.forEach((item) => {
        const allocatedUsers = allocations.filter((allocation) =>
          allocation.items_allocated.some((alloc) => alloc.item_name === item.item_name)
        );

        const totalAllocatedCount = allocatedUsers.reduce((acc, allocation) => {
          const alloc = allocation.items_allocated.find((alloc) => alloc.item_name === item.item_name);
          return acc + (alloc ? alloc.item_count : 0);
        }, 0);

        totalOwed += parseFloat((item.items_price - (item.items_price / item.item_count) * totalAllocatedCount).toFixed(2));
      });

      return (
        <div>
          <div className="flex justify-end mb-0">
            <button
              type="button"
              className="relative inline-flex items-center px-5 py-1 text-xs font-medium text-center text-white bg-gray-800 rounded-t-lg"
            >
              LIVE
              <div className="absolute inline-flex items-center justify-center w-6 h-6 text-2xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900 animate-ping"></div>
            </button>
          </div>
  
          <div className="bg-gray-300 rounded-t-lg mb-0"></div>
  
          <div className="bg-white shadow-xl rounded-tl-lg rounded-b-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-lg">Item List</span>
              <span className="font-bold text-lg text-red-500"></span>
            </div>
            <ul className="divide-y divide-gray-200">
              {finalResult.map((item, index) => {
                const allocatedUsers = allocations.filter((allocation) =>
                  allocation.items_allocated.some((alloc) => alloc.item_name === item.item_name)
                );
  
                const totalAllocatedCount = allocatedUsers.reduce((acc, allocation) => {
                  const alloc = allocation.items_allocated.find((alloc) => alloc.item_name === item.item_name);
                  return acc + (alloc ? alloc.item_count : 0);
                }, 0);
  
                const totalOwed = (
                  item.items_price -
                  (item.items_price / item.item_count) * totalAllocatedCount
                ).toFixed(2);
  
                //class based on the totalOwed value
                const moneyTextClass = parseFloat(totalOwed) === 0 ? 'text-gray-500' : 'text-red-500 font-normal';
  
                return (
                  <li key={index} className="py-4 flex justify-between items-center">
                    <div>
                      <span className="font-normal text-lg">{item.item_name}</span>
                      <span className="ml-2 text-gray-500">
                        {item.item_count} · ${(item.items_price / item.item_count).toFixed(2)}
                      </span>
                    </div>
                    <ul className="divide-y divide-gray-200 bg-gray-50 p-2 rounded-lg">
                      {allocatedUsers.map((allocation, idx) => (
                        <li key={idx} className="py-2">
                          <span className="text-sm text-gray-600">
                            {allocation.users.name}:{' '}
                            {allocation.items_allocated.find((alloc) => alloc.item_name === item.item_name)?.item_count ||
                              0}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <span className={`ml-2 ${moneyTextClass}`}>${totalOwed}</span>
                  </li>
                );
              })}
              {/* Your Total row */}
              <li className="py-4 flex justify-between items-center">
                <span className="font-bold text-lg">Your Total</span>
                <span className={`font-bold text-lg ${parseFloat(totalOwed) === 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${totalOwed.toFixed(2)}
                </span>

              </li>
            </ul>
          </div>
        </div>
      );
    }
    return null;
  };

  const LoadingScreen = () => (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="h-5 w-5 bg-blue-500 rounded-full animate-ping"></div>
        <div className="text-2xl">Oliver is Reading that...</div>
      </div>
    </div>
  );

  const getUserAllocationsDisplay = () => {
    const userAllocations = calculateUserAllocations();
    return (
      <div className="bg-white shadow-xl rounded-t rounded-br p-4 mt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold text-lg">Friends Pay</span>
        </div>
        <ul className="divide-y divide-gray-200">
          {userAllocations.map((allocation, index) => (
            <li key={index} className="py-4 flex justify-between items-center">
              <span className="font-normal text-lg">{allocation.name}</span>
              <span className="font-normal text-lg text-green-700">${allocation.claimed.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const qrCodeUrl = `https://www.fairshared.me/friend/${encodeURIComponent(beemName)}/`;

  return (
    <div className="min-h-screen display: inline-block flex-col items-center justify-center p-6 max-h-screen overflow-y-auto">
      {loading && <LoadingScreen />} {/* Add this line */}
      {!capturedImage ? (
        <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-lg">
          <Camera onImageCapture={handleImageCapture}>
            <h1 className="text-4xl font-bold mb-4 text-center">Welcome to FairShare 👋</h1>
            <h2 className="text-xl text-center text-gray-600">Scan receipt to get started...</h2>
          </Camera>
        </div>
      ) : finalResult ? (
        <div>
          {getItemListDisplay()}
          {getUserAllocationsDisplay()}
          <div className="flex flex-col items-start justify-center">
            <button
              className="btn-toggle bg-gray-800 hover:bg-gray-400 text-white font-bold py-1 px-2 rounded-b"
              onClick={toggleQRVisibility}
            >
              {showQR ? 'Hide QR Code' : 'Show QR Code'}
            </button>
            {showQR && (
              <div className="mt-6">
                <QR link={qrCodeUrl} />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl">
          <GPT
            image={capturedImage}
            onResult={handleGPTResult}
          />
          <Editor items={gptResult} setItems={setGptResult} onClose={handleEditorClose} />
        </div>
      )}
    </div>
  );
  
};

export default Home;
