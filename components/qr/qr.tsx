import React, { useRef, useState } from 'react';
import QRCode from 'react-qr-code';

interface QRProps {
  link: string;
}

const QR: React.FC<QRProps> = ({ link }) => {
  const linkRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1500); // Reset copied state after 1.5 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <p>Ask friends to fill in:</p>
        <div className="relative flex flex-col items-center justify-center">
          <div className="mb-4 relative flex items-center justify-center">
            {copied && (
              <div className="bg-white p-2 border-gray-800 border-4 rounded-md text-gray-800 shadow-md absolute top-0 mt-[220px]">
                Copied!
              </div>
            )}
            <QRCode value={link} />
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={copyToClipboard}
              className="btn align-middle select-none font-sans font-bold text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs rounded-lg bg-gray-900 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none flex items-center gap-x-3 px-4 py-2.5 lowercase"
              type="button"
            >
              <p className="block pr-3 font-sans text-sm antialiased font-normal leading-normal border-r text-inherit border-gray-400/50">
                {link}
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
                className="w-4 h-4 text-white"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QR;
