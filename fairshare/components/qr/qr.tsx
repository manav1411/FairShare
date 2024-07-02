import React from 'react';
import QRCode from 'react-qr-code';

interface QRProps {
  link: string;
}

const QR: React.FC<QRProps> = ({ link }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <p>Ask friends To fill in</p>
        <QRCode value={link} />
      </div>
    </div>
  );
};

export default QR;
