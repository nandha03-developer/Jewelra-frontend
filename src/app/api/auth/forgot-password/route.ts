import { NextResponse } from 'next/server';

const BASE_URL = 'https://jewelra-admin.vercel.app/api/auth/forgot-password';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
