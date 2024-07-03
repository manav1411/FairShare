import React, { useRef, useEffect, useState } from 'react';

interface CameraProps {
  children?: React.ReactNode;
  onImageCapture: (imageData: string) => void;
}

const Camera: React.FC<CameraProps> = ({ children, onImageCapture }) => {
  const [isClient, setIsClient] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);

  useEffect(() => {
    setIsClient(true); // rendered on the client
  }, []);

  useEffect(() => {
    if (isCameraActive && isClient) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isCameraActive, isClient]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const imageData = canvasRef.current.toDataURL('image/png');
        setCapturedImage(imageData);
        setIsCameraActive(false);
        stopCamera();
      }
    }
  };
  

  const handleRetake = () => {
    setCapturedImage(null);
    setIsCameraActive(true);
  };

  const handleContinue = () => {
    if (capturedImage) {
      onImageCapture(capturedImage); // Pass captured image data to parent component
    } else {
      console.error('No image captured.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsCameraActive(false);
    stopCamera();
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target?.result as string;
          setCapturedImage(imageData);
          setIsCameraActive(false);
        };
        reader.readAsDataURL(file);
      } else {
        console.error('Invalid file type. Please select PNG or JPEG.');
      }
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    setIsCameraActive(false);
    stopCamera();
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = e.target?.result as string;
          setCapturedImage(imageData);
          setIsCameraActive(false);
          stopCamera();
        };
        reader.readAsDataURL(file);
      } else {
        console.error('Invalid file type. Please drop PNG or JPEG.');
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  if (!isClient) {
    return null; //render nothing on server
  }

  return (
    <div className="flex flex-col items-center">
      {children && <div className="mb-4">{children}</div>}
      <div
        className="relative w-full max-w-full"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
      >
        {isCameraActive ? (
          <video ref={videoRef} autoPlay className="w-full rounded-md shadow-2xl" />
        ) : (
          capturedImage && <img src={capturedImage} alt="Captured" className="w-full rounded-md shadow-2xl" />
        )}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-0" />
        <input
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div
          className="absolute inset-0 w-full h-full cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
        />
      </div>
      <div className="flex mt-4 space-x-4">
        {isCameraActive ? (
          <>
            <button
              className="text-2xl bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md shadow-2xl"
              onClick={handleCapture}
            >
              Capture 📸
            </button>
            <label className="text-2xl bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md shadow-2xl cursor-pointer">
              Upload 📁
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </>
        ) : (
          <>
            <button
              className="text-2xl bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md shadow-2xl"
              onClick={handleRetake}
            >
              Retake❌
            </button>
            <button
              className="text-2xl bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md shadow-2xl"
              onClick={handleContinue}
            >
              Continue⚡
            </button>
          </>
        )}
      </div>
      <div className="flex items-center justify-center text-gray-600 text-lg mt-4">
        Drag and drop images here
      </div>
    </div>
  );
};

export default Camera;
