// components/GPT.tsx
import React, { useEffect, useState } from 'react';

interface GPTProps {
  image: string;
  onResult: (result: { item_name: string, item_count: number }[]) => void;
}

const GPT: React.FC<GPTProps> = ({ image, onResult }) => {
  const [response, setResponse] = useState<{ item_name: string, item_count: number }[]>([]);

  useEffect(() => {
    const fetchGPT = async () => {
      try {
        const apiKey = "";
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
                "response_format":{ "type": "json_object" },
                "content": [
                  {"type": "text", "text": 'This is meant to be an image of a receipt. For each item, can you extract the name and the number of items in format: {"item_name": "garlic bread", "item_count": 2}, and return all such items in an array. E.g. [{"item_name": "garlic bread", "item_count": 2}, {"item_name": "coke", "item_count": 4}, {"item_name": "Iced Tea", "item_count": 1}]. Return no other text. Only in 1 line. Ignore all non-item text. ONLY return the array. Absolutely no other text.'},
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
          const items = JSON.parse(data.choices[0].message.content);
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
  }, [image]); // Dependency array to run effect on image change

  return (
    <div>
      {/* Optionally display the response */}
    </div>
  );
};

export default GPT;
