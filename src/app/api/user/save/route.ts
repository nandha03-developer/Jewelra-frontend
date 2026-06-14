import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const { name, email, image } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectDB();

    // Find user or create new one
    const user = await User.findOneAndUpdate(
      { email },
      { name, image },
      { new: true, upsert: true }
    );

    return NextResponse.json({ message: 'User saved successfully', user });
  } catch (error: any) {
    console.error('Save user error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
