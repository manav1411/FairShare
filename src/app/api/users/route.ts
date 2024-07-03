// pages/api/users/route.ts

import { NextResponse } from 'next/server';
import supabase from '../../../../supabaseClient';

// GET: the next user ID, append new user with passed-in name
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    try {
      //get users from Supabase to get the current maximum user ID
      const { data: usersData, error } = await supabase.from('users').select('id').order('id', { ascending: false }).limit(1);

      if (error) {
        throw error;
      }

      //calculate the new user ID
      let newUserId = 1;
      if (usersData && usersData.length > 0) {
        newUserId = usersData[0].id + 1;
      }

      //append new user data to Supabase
      const { data: newUser, error: insertError } = await supabase.from('users').insert([{ id: newUserId, name }]);

      if (insertError) {
        throw insertError;
      }
      return NextResponse.json({
        newUserId,
      });
    } catch (error) {
      console.error('Error adding user:', error);
      return NextResponse.json({
        error: 'Failed to add user',
      }, { status: 500 });
    }
  }
