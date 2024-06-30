// components/Camera.tsx
import React, { useRef, useEffect, useState } from 'react';
import './style.css';

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
    <div className="camera-container">
      {children && <div className="camera-header">{children}</div>}
      {isCameraActive ? (
        <video ref={videoRef} autoPlay className="camera-video" />
      ) : (
        capturedImage && <img src={capturedImage} alt="Captured" className="captured-image" />
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div className="camera-buttons">
        {isCameraActive ? (
          <button className="camera-button" onClick={handleCapture}>Capture</button>
        ) : (
          <div>
            <button className="camera-button" onClick={handleRetake}>Retake</button>
            <button className="camera-button" onClick={handleContinue}>Continue</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Camera;
