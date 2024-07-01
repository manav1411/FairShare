import { NextResponse } from "next/server";
import supabase from '../../../../supabaseClient';


// initial receipt data
let receiptData: Array<{
    item_name: string;
    item_count: number;
    items_price: number;
}> = [];

// GET: Fetch receipt data
export async function GET() {
  try {
    const { data, error } = await supabase.from('receipts').select('*');
    if (error) throw error;

    return NextResponse.json({
      receiptData: data,
    });
  } catch (error) {
    console.error('Error fetching receipt data:', error);
    return NextResponse.json({
      error: 'Failed to fetch receipt data',
    }, { status: 500 }); // Set appropriate HTTP status code
  }
}

// POST: Update receipt data
export async function POST(request: Request) {
  const givenData = await request.json();

  try {
    const { data, error } = await supabase.from('receipts').insert(givenData);
    if (error) throw error;

    return NextResponse.json({
      receiptData: data,
    });
  } catch (error) {
    console.error('Error saving receipt data:', error);
    return NextResponse.json({
      error: 'Failed to save receipt data',
    }, { status: 500 }); // Set appropriate HTTP status code
  }
}
