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
    setIsClient(true); // This component is rendered on the client
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

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
    <div className="flex flex-col items-center">
      {children && <div className="mb-4">{children}</div>}
      <div className="relative w-full max-w-full">
        {isCameraActive ? (
          <video ref={videoRef} autoPlay className="w-full rounded-md shadow-2xl" />
        ) : (
          capturedImage && <img src={capturedImage} alt="Captured" className="w-full rounded-md shadow-2xl" />
        )}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-0" />
      </div>
      <div className="flex mt-4 space-x-4">
        {isCameraActive ? (
          <button className=" text-2xl bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-2xl"
            onClick={handleCapture}>Capture 📸</button>
        ) : (
          <>
            <button className="text-2xl bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md shadow-2xl"
              onClick={handleRetake}>Retake</button>
            <button className="text-2xl bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-2xl"
              onClick={handleContinue}>Continue</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Camera;
