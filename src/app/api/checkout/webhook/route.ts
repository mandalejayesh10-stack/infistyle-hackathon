import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';

    if (!secret) {
      return NextResponse.json({ warning: 'Webhook secret not configured, skipping validation' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body)
      .digest('hex');

    if (expectedSignature === signature) {
      const payload = JSON.parse(body);
      const event = payload.event;

      if (event === 'payment.captured') {
        const paymentId = payload.payload.payment.entity.id;
        const razorpayOrderId = payload.payload.payment.entity.order_id;
        
        // Sync database payment status (would update supabase here)
        console.log(`Payment confirmed: ${paymentId} for Order: ${razorpayOrderId}`);
      }

      return NextResponse.json({ status: 'ok' });
    } else {
      return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Webhook Verification Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
