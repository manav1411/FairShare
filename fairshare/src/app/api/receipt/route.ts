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
  try {
    // Delete all existing data from the 'receipts' table
    const { error: deleteError } = await supabase.from('receipts').delete().neq("item_name", 0)
    if (deleteError) throw deleteError;

    // Insert new data provided in the request body
    const givenData = await request.json();
    const { data, error: insertError } = await supabase.from('receipts').insert(givenData);
    if (insertError) throw insertError;

    return NextResponse.json({
      receiptData: data,
    });
  } catch (error) {
    console.error('Error saving or deleting receipt data:', error);
    return NextResponse.json({
      error: 'Failed to save or delete receipt data',
    }, { status: 500 }); // Set appropriate HTTP status code
  }
}
