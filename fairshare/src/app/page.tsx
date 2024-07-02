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
  };

  const handleGPTResult = (result: { item_name: string; item_count: number; items_price: number }[]) => {
    setGptResult(result);
  };

  const handleEditorClose = (finalResult: ReceiptItem[], beemName: string) => {
    setFinalResult(finalResult);
    setBeemName(beemName); // Update beemName state when closing the editor
  };

  const fetchAllocations = async () => {
    try {
      const response = await fetch('/api/receiptAllocations');
      const data = await response.json();

      // Check if the data structure is as expected
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

  const getItemListDisplay = () => {
    if (finalResult) {
      return (
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg">Item List</span>
            <span className="font-bold text-lg text-red-500">You Owe</span>
          </div>
          <ul className="divide-y divide-gray-200">
            {finalResult.map((item, index) => {
              const allocatedUsers = allocations.filter(allocation =>
                allocation.items_allocated.some(alloc => alloc.item_name === item.item_name)
              );

              const totalAllocatedCount = allocatedUsers.reduce((acc, allocation) => {
                const alloc = allocation.items_allocated.find(alloc => alloc.item_name === item.item_name);
                return acc + (alloc ? alloc.item_count : 0);
              }, 0);

              const totalOwed = (item.items_price - (item.items_price / item.item_count) * totalAllocatedCount).toFixed(2)

              return (
                <li key={index} className="py-4 flex justify-between items-center">
                  <div>
                    <span className="font-normal text-lg">{item.item_name}</span>
                    <span className="ml-2 text-gray-500">{item.item_count}x (${item.items_price.toFixed(2)})</span>
                  </div>
                  <ul className="divide-y divide-gray-200 bg-gray-50 p-2 rounded-lg">
                    {allocatedUsers.map((allocation, idx) => (
                      <li key={idx} className="py-2">
                        <span className="text-sm text-gray-600">
                          {allocation.users.name}: {allocation.items_allocated.find(alloc => alloc.item_name === item.item_name)?.item_count || 0}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <span className="ml-2 text-red-500 font-normal">${totalOwed}</span>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
    return null;
  };

  const qrCodeUrl = `https://www.fairshared.me/${encodeURIComponent(beemName)}/`;

  return (
    <div className="min-h-screen display: inline-block flex-col items-center justify-center p-6 max-h-screen overflow-y-auto ">
      {!capturedImage ? (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
          <Camera onImageCapture={handleImageCapture}>
            <h1 className="text-4xl font-bold mb-4 text-center">Welcome to FairShare 👋</h1>
            <h2 className="text-xl text-center text-gray-600">Scan receipt to get started...</h2>
          </Camera>
        </div>
      ) : finalResult ? (
        <div>
          {getItemListDisplay()}
          <div className="mt-6">
            <QR link={qrCodeUrl} />
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl">
          <GPT
            image="https://qph.cf2.quoracdn.net/main-qimg-9546e75b61c21afe8d6d9f2b58a5e752-lq"
            onResult={handleGPTResult}
          />
          <Editor items={gptResult} setItems={setGptResult} onClose={handleEditorClose} />
        </div>
      )}
    </div>
  );
};

export default Home;
