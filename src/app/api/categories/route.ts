import { NextResponse } from 'next/server';

const BASE_URL = 'https://jewelra-admin.vercel.app/api/categories';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.toString();
  const response = await fetch(`${BASE_URL}${query ? `?${query}` : ''}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
