# Purpose
1. FairShare is a tool to make sharing the bill with friends easier. A small, seamless service.
2. you simply take a photo of your reciept, and ask your friends to fill in their order.

To try out FairShare, visit: [fairshared.me](https://fairshared.me).

# Screenshots
User POV:
![temp](https://github.com/user-attachments/assets/f8582c43-c51e-498d-9e72-c7a3ef09ddb6)

User's Friends POV:
![temp2](https://github.com/user-attachments/assets/01eb825e-1a53-4ab2-abca-16e8a055cb1a)

## To Run Locally:
```
cd fairshare
npm i
npm run dev
```

# Tech Stack
- Hosting: Vercel, namecheap (domain name)
- Frontend: TSX, React, Next.js, TailwindCSS
- Backend: Node.js (via Node.js)
- database: Supabase

# Cool Tech Used
- SupaBase real-time database, to give live updates to main user and friends
- Publisher-Subscriber model
- Dynamic Linking
- private APIs (our secret sauce)
- dynamic QR code generation



# Functionality
## Initialisation
3 options to upload images: 
- camera
- upload (sanatised to only accept jpg/png)
- drag and drop (sanatised to only accept jpg/png)
ability to retake

## Analysis
while loading screen, image analysed in the background by API.
after analysis, result sent back as JSON.

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
