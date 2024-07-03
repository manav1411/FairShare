FairShare is industry-ready and functional 🥳
visit: [fairshared.me](https://fairshared.me) to try it out.


alternatively, to run locally:
```
cd fairshare
npm i
npm run dev
```


# Tech Stack
Hosting: Vercel, namecheap (domain name)
Frontend: TSX, React, Next.js, TailwindCSS
Backend: Node.js (via Node.js)
database: Supabase

# Cool Tech Used
SupaBase real-time database, to give live updates to main user and friends



# Functionality
## Initialisation
3 options to upload images: 
- camera
- upload (sanatised to only accept jpg/png)
- drag and drop (sanatised to only accept jpg/png)
ability to retake

## Analysis
while loading screen, image sent to gpt-4o.
OpenAI sends analysed result as JSON.

# Styling
Followed tailwind CSS guides, with animations.
used drop shadows, minimal black/white, certain colour highlights (e.g. pay)

## Editing
for each item, Name, Quantity, Price automatically written (all editable)
Ability to delete/add items
Quantity sanatised to be >1, Price sanatised to be number >0 to 2dp
User's beem required to proceed

## Main User View
A live view list of items with items/quantity friends have assigned themselves
automatically calculated user's still-owing amounts
seperate section calculating how much each friend owes
hideable QR code section, with a copy-able link alternative


## Friend View
page for main-user specific friend, input to enter name.
Can click 'enter' button to join too.
live view to select claims.
smart 'your part' - only allowing remaining number of available items to be selected. 
automatically calculated friend total
deep-link button to Beem main user.




## GPT Prompt we used:
This is meant to be an image of a receipt. For each item, can you extract the name, the number of items, and the price in format: {"item_name": "garlic bread", "item_count": 2, "items_price": 16.5}, and return all such items in an array. E.g. [{"item_name": "garlic bread", "item_count": 2, "items_price": 12.95}, {"item_name": "coke", "item_count": 4, "items_price": 32}, {"item_name": "Iced Tea", "item_count": 1, "items_price": 8}]. Make the Items capitalise the first letter from each word only. Return no other text. Only in 1 line. Ignore all non-item text. ONLY return the array. Absolutely no other text. If you cannot see any text, please return empty.'
