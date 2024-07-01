# import base64
import requests
import os
import json

class OpenAIVisionService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")

    def process_image(self, image_file):
        image_data = image_file.read()
        return self.process_image_data(image_data)

    def process_image_data(self, image_data):
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }

        payload = {
            "model": "gpt-4o",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": 'Analyze this receipt image. Get the store name and extract each item\'s name, quantity, and price. Format the data as a JSON array of objects, each with "item_name" (string), "item_count" (number), and "items_price" (number) fields. Example: [{"item_name": "garlic bread", "item_count": 2, "items_price": 12.95}, {"item_name": "coke", "item_count": 4, "items_price": 32}]. If no items are found, return an empty array []. Respond ONLY with the JSON array, no other text.'
                        },
                        {
                            "type": "image_url",
                            "image_url": { 
                                "url": f"data:image/jpeg;base64,{image_data}"
                            }
                        }
                    ]
                }
            ],
            "max_tokens": 300
        }

        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

        if response.status_code == 200:
            result = response.json()
            print("Raw OpenAI API response:", result)  # Add this line
            content = result['choices'][0]['message']['content']
            print("content receieved", content)
            
            # Try to extract a JSON array from the content
            try:
                start = content.index('[')  # finds the first occurrence of '[' in the content.
                end = content.rindex(']') + 1   #  finds the last occurrence of ']' in the content and includes it.
                json_str = content[start:end]   # parses the JSON string into a Python list.
                
                # Parse the JSON string
                items = json.loads(json_str)
                return json.dumps(items)  # Return a properly formatted JSON string
            except Exception as e:
                print(f"Error parsing content: {e}")
                return json.dumps([])  # Return an empty array if parsing fails
        else:
            raise Exception(f"Error processing image: {response.status_code}")