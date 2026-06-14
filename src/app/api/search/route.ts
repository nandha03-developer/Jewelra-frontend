import { NextResponse } from 'next/server';

const PRODUCTS_URL = 'https://jewelra-admin.vercel.app/api/products?page=1&limit=120';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q')?.trim().toLowerCase() || '';

  const response = await fetch(PRODUCTS_URL, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    return NextResponse.json({ data: [] }, { status: 500 });
  }

  const data = await response.json();
  const products = Array.isArray(data.data) ? data.data : [];

  const results = query
    ? products.filter((product: any) => {
        const text = `${product.name ?? ''} ${product.description ?? ''} ${product.category ?? ''} ${product.material ?? ''}`.toLowerCase();
        return text.includes(query);
      })
    : [];

  return NextResponse.json({ data: results });
}
