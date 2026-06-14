import { NextResponse } from 'next/server';

const BASE_URL = 'https://jewelra-admin.vercel.app/api/contacts';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Mimic a clean Postman request to avoid CORS/Forbidden issues
    const cleanHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'PostmanRuntime/7.29.2', // Spoofing Postman to bypass potential browser-specific blocks
    };

    // Safely forward the authorization header
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
      cleanHeaders['Authorization'] = authHeader;
    }

    // console.log('Forwarding contact to admin API...', BASE_URL);

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: cleanHeaders,
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    // Log response status for local debugging
    // console.log('Admin API Response Status:', response.status);

    let data;
    const text = await response.text();
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = { message: text };
    }

    if (!response.ok) {
      console.error('Admin API error response:', data);
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Proxy crashed:', error.message);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
