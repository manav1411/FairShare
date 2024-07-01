"use client";
// page.tsx
import React, { useState, useEffect } from 'react';
import Camera from '../../components/camera/camera';
import GPT from '../../components/gpt/gpt';
import QR from '../../components/qr/qr';
import Editor from '../../components/editor/editor';

interface ReceiptItem {
  item_name: string;
  item_count: number;
  items_price: number;
}

interface Allocation {
  user_id: number;
  items_allocated: { item_name: string; item_count: number }[];
}

const Home: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [gptResult, setGptResult] = useState<{ item_name: string; item_count: number; items_price: number }[]>([]);
  const [finalResult, setFinalResult] = useState<ReceiptItem[] | null>(null);
  const [allocations, setAllocations] = useState<Allocation[]>([]);

  useEffect(() => {
    if (finalResult) {
      fetchAllocations();
    }
  }, [finalResult]);

  const handleImageCapture = (imageData: string) => {
    setCapturedImage(imageData);
  };

  const handleGPTResult = (result: { item_name: string; item_count: number; items_price: number }[]) => {
    setGptResult(result);
  };

  const handleEditorClose = (finalResult: ReceiptItem[]) => {
    setFinalResult(finalResult);
  };

  const fetchAllocations = async () => {
    try {
      const response = await fetch('/api/receiptAllocations');
      const data: { allocations: Allocation[] } = await response.json();
      console.log('Allocations:', data.allocations);
      setAllocations(data.allocations);
    } catch (error) {
      console.error('Error fetching allocations:', error);
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
        <ul>
          {finalResult.map((item, index) => {
            const allocatedUsers = allocations.filter(allocation => {
              return allocation.items_allocated.some(alloc => alloc.item_name === item.item_name);
            });

            return (
              <li key={index}>
                <span>{item.item_name}</span>
                <span>{item.item_count}x (${item.items_price.toFixed(2)})</span>
                <ul>
                  {allocatedUsers.map((allocation, idx) => (
                    <li key={idx}>
                      User ID: {allocation.user_id}, Allocated: {allocation.items_allocated.find(alloc => alloc.item_name === item.item_name)?.item_count || 0}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      );
    }
    return null;
  };

  return (
    <div>
      {!capturedImage ? (
        <Camera onImageCapture={handleImageCapture}>
          <div>Scan your receipt</div>
        </Camera>
      ) : finalResult ? (
        <>
          {getItemListDisplay()}
          <button onClick={handleGetAllocations}>Get Latest Allocations</button>
          <QR link={"https://www.fairshared.me/friend"} />
        </>
      ) : (
        <>
          <GPT
            image="https://qph.cf2.quoracdn.net/main-qimg-9546e75b61c21afe8d6d9f2b58a5e752-lq"
            onResult={handleGPTResult}
          />
          <Editor items={gptResult} setItems={setGptResult} onClose={handleEditorClose} />
        </>
      )}
    </div>
  );
};

export default Home;
