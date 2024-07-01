import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Item {
  item_name: string;
  item_count: number;
  items_price: number;
}

interface GPTProps {
  image: File;
  onResult: (result: Item[]) => void;
}

const GPT: React.FC<GPTProps> = ({ image, onResult }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGPT = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Convert image to base64
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = async () => {
          const base64Image = reader.result as string;
          const base64Data = base64Image.split(',')[1];

          const response = await axios.post(
            'http://localhost:8080/openai_vision/process-receipt',
            { image: base64Data },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          console.log("Response:", response);

          if (response.data.result) {
            try {
              const items: Item[] = JSON.parse(response.data.result);
              console.log("Raw result:", response.data.result);
              console.log("Parsed items:", items);
              onResult(items);
            } catch (parseError) {
              console.error("Error parsing result:", parseError);
              console.log("Unparsed result:", response.data.result);
              setError("Failed to parse API response");
            }
          } else {
            throw new Error('No valid response from API');
          }
        };
      } catch (error) {
        console.error('Error fetching GPT response:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (image) { 
      fetchGPT();
    }
  }, [image]);

  if (isLoading) {
    return <div>Processing image...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return null;
};

export default GPT;