import { NextResponse } from 'next/server';

const steps = [
  { title: 'Order placed', detail: 'Your order has been received by Jewelra.' },
  { title: 'Processing', detail: 'Our artisans are preparing your jewellery.' },
  { title: 'Shipped', detail: 'Your order is on the way to your address.' },
  { title: 'Delivered', detail: 'Expected delivery within 3-4 business days.' }
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json({ message: 'Order ID is required.' }, { status: 400 });
  }

  const digitSum = Array.from(orderId).reduce((sum, char) => sum + (/[0-9]/.test(char) ? Number(char) : 0), 0);
  const currentStep = digitSum % steps.length;
  const currentStatus = steps[currentStep].title;

  return NextResponse.json({
    orderId,
    currentStep,
    status: currentStatus,
    steps
  });
}
