import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    // console.log('API PROXY RECEIVED RAW:', rawBody);

    if (!rawBody) {
      return NextResponse.json({ message: 'Empty body received by proxy' }, { status: 400 });
    }

    const body = JSON.parse(rawBody);
    const token = request.headers.get('authorization');


    const response = await fetch('https://jewelra-admin.vercel.app/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': token } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Order Proxy Error:', error);
    return NextResponse.json({ message: 'Internal Server Error during order proxy', error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const token = request.headers.get('authorization');

    const response = await fetch('https://jewelra-admin.vercel.app/api/order', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': token } : {}),
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to fetch orders' }, { status: 500 });
  }
}
