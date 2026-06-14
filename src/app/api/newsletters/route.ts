import { NextResponse } from 'next/server';

const BASE_URL = 'https://jewelra-admin.vercel.app/api/newsletters';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Mimic a clean request to avoid potential blocks
    const cleanHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'PostmanRuntime/7.29.2',
    };

    // console.log('Forwarding newsletter subscription to admin API...', BASE_URL);

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: cleanHeaders,
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    let data;
    const text = await response.text();
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { message: text };
    }

    if (!response.ok) {
      console.error('Admin API newsletter error:', data);
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Newsletter proxy crashed:', error.message);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
