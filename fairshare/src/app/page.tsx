"use client";

// pages/index.tsx
import React, { useState } from 'react';
import Camera from '../../components/camera/camera';
import GPT from '../../components/gpt/gpt';
import Editor from '../../components/editor/editor';
import QR from '../../components/qr/qr';

const Home: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [gptResult, setGptResult] = useState<{ item_name: string; item_count: number; items_price: number }[]>([]);

  const handleImageCapture = (imageData: string) => {
    setCapturedImage(imageData);
  };

  const handleGPTResult = (result: { item_name: string; item_count: number; items_price: number }[]) => {
    setGptResult(result);
  };

  return (
    <div>
      <h1>Main Page</h1>
      {!capturedImage ? (
        <Camera onImageCapture={handleImageCapture}>
          <div>Scan your receipt</div>
        </Camera>
      ) : (
        <>
          <GPT
            image="https://qph.cf2.quoracdn.net/main-qimg-9546e75b61c21afe8d6d9f2b58a5e752-lq"
            onResult={handleGPTResult}
          />
          <Editor items={gptResult} setItems={setGptResult} />
          <QR link={"http://localhost:3000/friend"} />
        </>
      )}
    </div>
  );
};

export default Home;
