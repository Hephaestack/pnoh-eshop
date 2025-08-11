# PNOH E-Shop Cart & Checkout System

A complete, professional cart and checkout system built with Next.js 15, Clerk Authentication, and modern UI components.

## 🚀 Features

### Cart System
- **Persistent Cart**: Uses Zustand with localStorage persistence
- **Real-time Updates**: Instant quantity changes and total calculations
- **Variant Support**: Size, color, and other product variants
- **Mobile Responsive**: Optimized for all screen sizes
- **Live Totals**: Automatic subtotal, tax, and shipping calculations
- **Free Shipping Threshold**: Configurable free shipping over €50

### Checkout Process
- **Multi-step Flow**: 4-step guided checkout process
- **Progress Indicator**: Visual progress bar and step completion
- **Form Validation**: Real-time validation with Zod schemas
- **Address Management**: Separate shipping and billing addresses
- **Shipping Options**: Multiple delivery methods with pricing
### Payment Integration
- **Stripe Checkout**: Hosted payment page (recommended)
- **PayPal support** for alternative payments
- **Bank transfer** with automatic instructions
- **Security indicators** and SSL badges

### Key Benefits of Stripe Checkout
- **PCI Compliance**: Stripe handles all card data
- **No Sensitive Data**: Cards never touch your server
- **Mobile Optimized**: Stripe's checkout is highly optimized
- **Multiple Payment Methods**: Cards, PayPal, Apple Pay, Google Pay
- **International**: Supports many countries and currencies
- **Conversion Optimized**: Higher conversion rates than custom forms
- **Security Features**: SSL encryption and security badges

### Authentication & Security
- **Clerk Integration**: Secure user authentication
- **Protected Routes**: Checkout requires sign-in
- **SSL Security**: 256-bit encryption indicators
- **Input Validation**: Comprehensive form validation

### User Experience
- **Professional Design**: Dark theme with elegant UI
- **Smooth Animations**: Framer Motion transitions
- **Loading States**: Skeleton loaders and processing indicators
- **Error Handling**: User-friendly error messages
- **Success Pages**: Order confirmation and tracking info

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**: App Router with server/client components
- **React 19**: Latest React features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **ShadCN UI**: Modern component library

### State Management
- **Zustand**: Lightweight state management
- **Persistence**: localStorage integration
- **Real-time Updates**: Reactive state changes

### Forms & Validation
- **React Hook Form**: Performant form handling
- **Zod**: Runtime type validation
- **Real-time Validation**: Instant feedback

### Authentication
- **Clerk**: Complete auth solution
- **User Management**: Profile and account handling
- **Protected Routes**: Secure checkout process

### Payment Processing
- **Stripe**: Credit card processing
- **PayPal**: Alternative payment method
- **Bank Transfer**: Manual payment option

## 📁 Project Structure

```
frontend/
├── app/
│   ├── cart/
│   │   ├── layout.js
│   │   └── page.js
│   ├── checkout/
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── success/
│   │       └── page.js
│   ├── collections/
│   │   └── page.js (sample products)
│   └── api/
│       ├── create-payment-intent/
│       └── orders/
├── components/
│   ├── checkout/
│   │   ├── ShippingStep.jsx
│   │   ├── BillingStep.jsx
│   │   ├── ShippingMethodStep.jsx
│   │   └── PaymentStep.jsx
│   ├── ui/ (ShadCN components)
│   └── Header.jsx (updated with cart)
└── lib/
    └── store/
        ├── cart.js
        └── checkout.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Clerk account
- Stripe account (optional)

### Installation

1. **Install Dependencies**
```bash
npm install @stripe/stripe-js stripe @hookform/resolvers zod react-hook-form zustand
```

2. **Environment Variables**
Copy `.env.example` to `.env.local` and fill in your keys:
```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (for payments)
- `STRIPE_SECRET_KEY` (for payments)

3. **Run Development Server**
```bash
npm run dev
```

4. **Test the System**
- Visit `/collections` to see sample products
- Add items to cart and test the flow
- Complete checkout process (test mode)

## 💳 Payment Integration

### Stripe Checkout Setup
1. Create Stripe account
2. Get SECRET API key from dashboard (no publishable key needed)
3. Configure webhooks for order processing:
   - Endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `payment_intent.payment_failed`
4. Test with Stripe test mode

**Stripe Checkout Flow:**
1. Customer clicks "Complete Order"
2. Server creates Stripe Checkout Session
3. Customer redirected to Stripe's secure payment page
4. Stripe handles all payment processing
5. Customer redirected back to success page
6. Webhook processes the order automatically

### PayPal Setup
1. Create PayPal developer account
2. Configure PayPal SDK
3. Set up webhook endpoints

### Bank Transfer
- Automated order creation
- Email instructions to customer
- Manual payment verification process

## 🎨 Customization

### Styling
- Modify Tailwind classes for theme changes
- Update color scheme in `globals.css`
- Customize component variants in ShadCN

### Cart Behavior
- Adjust free shipping threshold in `cart.js`
- Modify tax calculation (currently 24% VAT)
- Add/remove product variants support

### Checkout Flow
- Add/remove checkout steps
- Customize validation rules
- Modify shipping methods and pricing

### Internationalization
- Greek text currently used
- Easy to extend with react-i18next
- Currency formatting for different regions

## 🔧 Configuration

### Cart Settings
```javascript
// In lib/store/cart.js
const tax = subtotal * 0.24; // 24% VAT
const shipping = subtotal > 50 ? 0 : 5; // Free shipping threshold
```

### Checkout Steps
1. **Shipping Information**: Name, address, contact
2. **Billing Information**: Payment address (can be same as shipping)
3. **Shipping Method**: Delivery options and pricing
4. **Payment**: Method selection and processing

### Shipping Methods
- **Standard**: 3-5 days, €5 (free over €50)
- **Express**: 1-2 days, €12
- **Overnight**: Next day, €25 (domestic only)

## 📱 Mobile Optimization

- **Responsive Design**: Works on all screen sizes
- **Touch-Friendly**: Large buttons and touch targets
- **Collapsible Sections**: Optimized mobile layout
- **Swipe Gestures**: Smooth mobile interactions

## 🧪 Testing

### Cart Testing
- Add/remove items
- Quantity updates
- Variant selection
- Persistence across sessions

### Checkout Testing
- Form validation
- Step navigation
- Payment methods
- Order creation

### Testing with Stripe Checkout

**Test in Development:**
1. Use Stripe test mode
2. No test cards needed - Stripe provides test interface
3. Use webhook testing tools in Stripe dashboard

**Test Cards (if using Stripe Elements):**
```
4242424242424242 - Visa success
4000000000000002 - Declined card
4000000000009995 - Insufficient funds
```

**Stripe Checkout Testing:**
- Stripe provides complete test interface
- No need to remember test card numbers
- Test various payment methods easily
- Webhooks can be tested with Stripe CLI

## 🚀 Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

### Environment Variables for Production
- Update `NEXT_PUBLIC_APP_URL` to your domain
- Use production Stripe SECRET key (no publishable key needed)
- Configure production Clerk instance
- Set up Stripe webhook endpoint

## 📧 Order Management

### Email Notifications
- Order confirmation
- Payment instructions (bank transfer)
- Shipping notifications
- Delivery confirmation

### Order Tracking
- Order status updates
- Tracking number integration
- Customer account integration

## 🛡️ Security Features

- **SSL Encryption**: All data transmitted securely
- **Input Validation**: Prevent malicious inputs
- **Authentication**: Protected checkout process
- **PCI Compliance**: Stripe handles card data
- **CSRF Protection**: Built-in Next.js protection

## 🎯 Best Practices Implemented

1. **Progressive Enhancement**: Works without JavaScript
2. **Accessibility**: Screen reader friendly
3. **Performance**: Optimized loading and rendering
4. **SEO**: Proper meta tags and structure
5. **Error Handling**: Graceful error management
6. **User Feedback**: Clear success/error messages

## 🐛 Troubleshooting

### Common Issues

**Cart not persisting**
- Check localStorage in browser
- Verify Zustand persistence setup

**Checkout form validation errors**
- Check Zod schema definitions
- Verify required field configurations

**Stripe Checkout integration issues**
- Verify Stripe SECRET key (not publishable)
- Check webhook configurations
- Review error logs
- Ensure correct redirect URLs

**Authentication problems**
- Verify Clerk configuration
- Check protected route setup

## 📞 Support

For issues or questions:
- Check the documentation
- Review error messages in console
- Test with different browsers
- Verify environment variables

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## 📝 License

This project is part of the PNOH E-Shop system. All rights reserved.

---

## 🎉 Success!

You now have a complete, professional cart and checkout system that includes:

✅ **Persistent shopping cart** with real-time updates  
✅ **Multi-step checkout** with progress tracking  
✅ **Multiple payment methods** (Stripe, PayPal, Bank Transfer)  
✅ **Mobile-responsive design** with smooth animations  
✅ **Form validation** and error handling  
✅ **Order management** and confirmation system  
✅ **Security features** and user authentication  
✅ **Professional UI/UX** with modern design  

The system is ready for production use and can be easily customized for your specific needs!
