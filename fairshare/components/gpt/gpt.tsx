// components/GPT.tsx
import React, { useEffect, useState } from 'react';

interface Item {
  item_name: string;
  item_count: number;
  items_price: number;
}

interface GPTProps {
  image: string;
  onResult: (result: Item[]) => void;
}

const GPT: React.FC<GPTProps> = ({ image, onResult }) => {
  const [response, setResponse] = useState<Item[]>([]);

  useEffect(() => {
    const fetchGPT = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        const url = `https://api.openai.com/v1/chat/completions`;

        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o', // Specify the model here
            messages: [
              {
                "role": "user",
                "response_format": { "type": "json_object" },
                "content": [
                  {
                    "type": "text",
                    "text": 'This is meant to be an image of a receipt. For each item, can you extract the name, the number of items, and the price in format: {"item_name": "garlic bread", "item_count": 2, "items_price": 16.5}, and return all such items in an array. E.g. [{"item_name": "garlic bread", "item_count": 2, "items_price": 12.95}, {"item_name": "coke", "item_count": 4, "items_price": 32}, {"item_name": "Iced Tea", "item_count": 1, "items_price": 8}]. Return no other text. Only in 1 line. Ignore all non-item text. ONLY return the array. Absolutely no other text.'
                  },
                  {
                    "type": "image_url",
                    "image_url": {
                      "url": image, // Use the passed image prop here
                    },
                  },
                ],
              }
            ],
            max_tokens: 150,
          })
        };

        const res = await fetch(url, requestOptions);
        const data = await res.json();

        // Parse the response into the appropriate format
        if (data.choices && data.choices.length > 0) {
          const items: Item[] = JSON.parse(data.choices[0].message.content);
          console.log(items);
          setResponse(items);
          onResult(items); // Pass the result to the parent component
        } else {
          console.error('No valid response from API');
          // Handle no valid response state
        }

      } catch (error) {
        console.error('Error fetching GPT response:', error);
        // Handle error state
      }
    };

    if (image) {
      fetchGPT();
    }
  }, [image]); // Only depend on image to trigger initial API call

  return (
    <div>
      {/* Optionally display the response */}
    </div>
  );
};

export default GPT;
