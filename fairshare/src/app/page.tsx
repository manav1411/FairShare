"use client";

// pages/index.tsx
import React, { useState } from "react";
import Camera from "../../components/camera/camera";
import GPT from "../../components/gpt/gpt";
import Editor from "../../components/editor/editor";
import QR from "../../components/qr/qr";

const Home: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<File | null>(null);
  const [gptResult, setGptResult] = useState<
    { item_name: string; item_count: number; items_price: number }[]
  >([]);

  const handleImageCapture = (imageData: File) => {
    setCapturedImage(imageData);
  };

  const handleGPTResult = (
    result: { item_name: string; item_count: number; items_price: number }[]
  ) => {
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
          <GPT image={capturedImage} onResult={handleGPTResult} />
          <Editor items={gptResult} setItems={setGptResult} />
          <QR link={"http://localhost:3000/friend"} />
        </>
      )}
    </div>
  );
};

export default Home;
