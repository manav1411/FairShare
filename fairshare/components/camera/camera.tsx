// components/Camera.tsx
import React, { useRef, useEffect, useState } from 'react';
import './style.css';

interface CameraProps {
  children?: React.ReactNode;
  onImageCapture: (imageData: File) => void;
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

  const dataURLtoFile = (dataUrl: string, filename: string): File => {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleContinue = () => {
    if (capturedImage) {
      console.log('captured image: ', capturedImage);
      const imageFile = dataURLtoFile(capturedImage, 'receipt.jpeg')
      onImageCapture(imageFile); // Pass captured image data to parent component
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
