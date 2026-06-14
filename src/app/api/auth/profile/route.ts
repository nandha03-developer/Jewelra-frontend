import { NextResponse } from 'next/server';

const BASE_URL = 'https://jewelra-admin.vercel.app/api/auth/profile';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    let authHeader = request.headers.get('Authorization');

    // Safety check for common token formatting issues
    if (authHeader) {
      authHeader = authHeader.trim();
      // Handle the "Bearer Bearer ..." or case-insensitive duplicates
      if (/^bearer bearer/i.test(authHeader)) {
        authHeader = 'Bearer ' + authHeader.replace(/^bearer bearer\s+/i, '').trim();
      }
      // Ensure it starts with Bearer if it doesn't already
      if (!/^bearer\s+/i.test(authHeader) && authHeader.length > 10) {
        authHeader = `Bearer ${authHeader}`;
      }
    }

    // console.log('--- Profiling Auth Proxy [PUT] ---');
    // console.log('Authorization Header status:', authHeader ? 'Present' : 'Missing');

    const response = await fetch(BASE_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || ''
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    // console.log('Backend Status Code:', response.status);

    if (response.status === 401) {
      console.warn('CRITICAL: Backend rejected the token as UNAUTHORIZED');
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Proxy Exception:', error);
    return NextResponse.json({ message: 'Authorization System Error', error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    let authHeader = request.headers.get('Authorization');
    if (authHeader) {
      authHeader = authHeader.trim();
      if (/^bearer bearer/i.test(authHeader)) {
        authHeader = 'Bearer ' + authHeader.replace(/^bearer bearer\s+/i, '').trim();
      }
      if (!/^bearer\s+/i.test(authHeader) && authHeader.length > 10) {
        authHeader = `Bearer ${authHeader}`;
      }
    }

    const response = await fetch(BASE_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader || ''
      }
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Proxy GET Exception:', error);
    return NextResponse.json({ message: 'Authorization System Error', error: error.message }, { status: 500 });
  }
}
