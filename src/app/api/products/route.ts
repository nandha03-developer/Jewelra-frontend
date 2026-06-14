import { NextResponse } from 'next/server';

const BASE_URL = 'https://jewelra-admin.vercel.app/api/products';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.toString();
    const targetUrl = `${BASE_URL}${query ? `?${query}` : ''}`;

    const cleanHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'PostmanRuntime/7.29.2',
    };

    // console.log('Forwarding products request to admin API...', targetUrl);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: cleanHeaders,
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
      console.error('Admin API products error:', data);
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Products proxy crashed:', error.message);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
