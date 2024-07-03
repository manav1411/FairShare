import { NextResponse } from "next/server";
import supabase from '../../../../supabaseClient';

// GET: list of all allocations with user names
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('allocations')
      .select('*, users (id, name)')
      .order('user_id', { ascending: true });

    if (error) throw error;

    return NextResponse.json({
      allocations: data,
    });
  } catch (error) {
    console.error('Error fetching allocations:', error);
    return NextResponse.json({
      error: 'Failed to fetch allocations',
    }, { status: 500 });
  }
}


// POST: user submission of claimed items for allocations
export async function POST(request: Request) {
  try {
    //parse incoming JSON data from req
    const requestData = await request.json();
    const { userId, itemsToAllocate } = requestData;

    //fetch existing allocation data for the userId, if any
    const { data: existingData, error: fetchError } = await supabase
      .from('allocations')
      .select('*')
      .eq('user_id', userId);

    if (fetchError) throw fetchError;

    //determine insert or update based on existing data
    if (existingData && existingData.length > 0) {
      //update existing row with new items_allocated JSON
      const { data: updateData, error: updateError } = await supabase
        .from('allocations')
        .update({
          items_allocated: itemsToAllocate
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      return NextResponse.json({
        message: 'Allocation updated successfully',
        updatedData: updateData,
      });
    } else {
      //insert a new row for the userId with items_allocated JSON
      const { data: insertData, error: insertError } = await supabase
        .from('allocations')
        .insert([
          {
            user_id: userId,
            items_allocated: itemsToAllocate,
          }
        ]);

      if (insertError) throw insertError;

      return NextResponse.json({
        message: 'New allocation added successfully',
        insertedData: insertData,
      });
    }
  } catch (error) {
    console.error('Error handling allocation:', error);
    return NextResponse.json({
      error: 'Failed to handle allocation',
    }, { status: 500 });
  }
}
