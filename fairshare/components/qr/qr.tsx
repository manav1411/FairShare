import React from 'react';
import QRCode from 'react-qr-code';

import './style.css'; // Import your CSS file

interface QRProps {
  link: string;
}

const QR: React.FC<QRProps> = ({ link }) => {
  return (
    <div className="qr-container">
      <div>
        <p>Ask friends To fill in</p>
        <QRCode value={link} />
      </div>
    </div>
  );
};

export default QR;
