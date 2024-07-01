import { NextResponse } from "next/server";

interface Item {
  item_name: string;
  item_count: number;
  items_price: number;
}

interface User {
  name: string;
  items_claimed: Item[];
}

// structure of receipt allocation data
let userAllocations: Array<{
    user: User;
}> = [];

//GET: all reciept allocation data
export async function GET() {
  return NextResponse.json({
    userAllocations
  });
}

// POST: Specific user submits claimed items
export async function POST(request: Request) {
  try {
    const givenData: { name: string; items_claimed: Item[] } = await request.json();

    // Validate givenData
    if (!givenData.name || !Array.isArray(givenData.items_claimed)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    


    // Create new user allocation
    const newUserAllocation = {
      user: {
        name: givenData.name,
        items_claimed: givenData.items_claimed,
      },
    };

    // Add new allocation to the array
    userAllocations.push(newUserAllocation);

    return NextResponse.json({ message: "User allocation added successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}