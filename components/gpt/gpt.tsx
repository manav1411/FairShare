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
            model: 'gpt-4o',
            messages: [
              {
                "role": "user",
                "response_format": { "type": "json_object" },
                "content": [
                  {
                    "type": "text",
                    "text": 'This is meant to be an image of a receipt. For each item, can you extract the name, the number of items, and the price in format: {"item_name": "garlic bread", "item_count": 2, "items_price": 16.5}, and return all such items in an array. E.g. [{"item_name": "garlic bread", "item_count": 2, "items_price": 12.95}, {"item_name": "coke", "item_count": 4, "items_price": 32}, {"item_name": "Iced Tea", "item_count": 1, "items_price": 8}]. Make the Items capitalise the first letter from each word only. Return no other text. Only in 1 line. Ignore all non-item text. ONLY return the array. Absolutely no other text. If you cannot see any text, please return empty.'
                  },
                  {
                    "type": "image_url",
                    "image_url": {
                      "url": image, //use passed image prop here
                    },
                  },
                ],
              }
            ],
            max_tokens: 1500,
          })
        };

        const res = await fetch(url, requestOptions);
        const data = await res.json();

        //parse response into the JSON
        if (data.choices && data.choices.length > 0) {
          const items: Item[] = JSON.parse(data.choices[0].message.content);
          setResponse(items);
          onResult(items); //pass result to parent component
        } else {
          console.error('No valid response from API');
        }
      } catch (error) {
        console.error('Error fetching GPT response:', error);
      }
    };

    if (image) {
      fetchGPT();
    }
  }, [image]); //only depend on image to trigger initial API call

  return (
    <div></div>
  );
};

export default GPT;
