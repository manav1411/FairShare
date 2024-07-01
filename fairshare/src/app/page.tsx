"use client";

import React, { useState } from 'react';
import Camera from '../../components/camera/camera';
import GPT from '../../components/gpt/gpt';
import QR from '../../components/qr/qr';
import Editor from '../../components/editor/editor';
import LiveView from '../../components/liveview/liveview'; // Assuming you have a LiveView component

const Home: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [gptResult, setGptResult] = useState<{ item_name: string; item_count: number; items_price: number }[]>([]);
  const [finalResult, setFinalResult] = useState<{ item_name: string; item_count: number; items_price: number }[] | null>(null);

  const handleImageCapture = (imageData: string) => {
    setCapturedImage(imageData);
  };

  const handleGPTResult = (result: { item_name: string; item_count: number; items_price: number }[]) => {
    setGptResult(result);
  };

  const handleEditorClose = (finalResult: { item_name: string; item_count: number; items_price: number }[]) => {
    setFinalResult(finalResult);
  };

  return (
    <div>
      {!capturedImage ? (
        <Camera onImageCapture={handleImageCapture}>
          <div>Scan your receipt</div>
        </Camera>
      ) : finalResult ? (
        <>
          <LiveView finalResult={finalResult} />
          <QR link={"http://localhost:3000/friend"} />
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
