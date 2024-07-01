// pages/api/users/route.ts

import { NextResponse } from 'next/server';

// Example in-memory user data
let users: Array<{
  id: number;
  name: string;
}> = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  // Add more users as needed
];

// GET: Fetch the next user ID and append new user with passed-in name
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name');

  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  // Get the current maximum user ID
  const maxUserId = users.reduce((max, user) => (user.id > max ? user.id : max), 0);

  // Calculate the new user ID
  const newUserId = maxUserId + 1;

  // Append the new user data
  users.push({ id: newUserId, name });

  return NextResponse.json({
    newUserId,
  });
}
