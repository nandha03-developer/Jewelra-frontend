import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://jewelra-admin.vercel.app/api/rates', {
      cache: 'no-store' // Ensure we get fresh rates
    });
    
    if (!response.ok) {
        // Fallback or error
        return NextResponse.json({ gold: 0, silver: 0 }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in rates proxy:', error);
    return NextResponse.json({ gold: 0, silver: 0 }, { status: 500 });
  }
}
