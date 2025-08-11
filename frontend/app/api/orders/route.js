import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

export async function POST(request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      items, 
      shippingInfo, 
      billingInfo, 
      shippingMethod, 
      paymentMethod, 
      total 
    } = body;

    // Generate order number
    const orderNumber = `PN-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // In a real implementation, you would:
    // 1. Save order to database
    // 2. Send confirmation email
    // 3. Update inventory
    // 4. Create shipping label (if applicable)

    const order = {
      id: orderNumber,
      userId,
      items,
      shippingInfo,
      billingInfo,
      shippingMethod,
      paymentMethod,
      total,
      status: paymentMethod === 'bank_transfer' ? 'awaiting_payment' : 'confirmed',
      createdAt: new Date().toISOString(),
    };

    // Mock database save
    console.log('Order created:', order);

    // Mock email sending
    if (paymentMethod === 'bank_transfer') {
      console.log('Sending bank transfer instructions email to:', shippingInfo.email);
    } else {
      console.log('Sending order confirmation email to:', shippingInfo.email);
    }

    return NextResponse.json({
      success: true,
      order: {
        id: orderNumber,
        status: order.status,
        total: total
      }
    });

  } catch (error) {
    console.error('Order creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // In a real implementation, fetch user's orders from database
    const mockOrders = [
      {
        id: 'PN-1735731234-ABC12',
        status: 'shipped',
        total: 125.50,
        createdAt: '2024-01-15T10:30:00.000Z',
        items: [
          { name: 'Χειροποίητο Δαχτυλίδι', quantity: 1, price: 45.00 },
          { name: 'Χρυσό Κολιέ', quantity: 1, price: 89.00 }
        ]
      }
    ];

    return NextResponse.json({ orders: mockOrders });

  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
