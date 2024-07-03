import { NextResponse } from "next/server";
import supabase from '../../../../supabaseClient';

// initial receipt data
let receiptData: Array<{
    item_name: string;
    item_count: number;
    items_price: number;
}> = [];

// GET: receipt data
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
    }, { status: 500 });
  }
}

// POST: receipt data
export async function POST(request: Request) {
  try {
    //delete all existing data from all tables
    const { error: deleteError1 } = await supabase.from('receipts').delete().neq("item_name", 0)
    if (deleteError1) throw deleteError1;
    const { error: deleteError2 } = await supabase.from('allocations').delete().neq("user_id", 0)
    if (deleteError2) throw deleteError2;
    const { error: deleteError3 } = await supabase.from('users').delete().neq("id", 0)
    if (deleteError3) throw deleteError3;

    // insert new data provided in req body
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
    }, { status: 500 });
  }
}
