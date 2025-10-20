# **App Name**: GourmetBasket

## Core Features:

- User Authentication: Implement signup/login with email/password and Google. Includes password reset, email verification, and terms of service agreement.
- Homepage Management: Admin can edit hero section content (title, subtitle, image) and manage featured products.
- Product Display: Show products in a shop page. Allow users to add items to the cart and checkout, signup to view user tabs
- Custom Order Request: Enable users to request custom orders with item details, quantity, unit of measure, optional services, and shipping address (pickup or delivery).
- Order History: Users can view their purchase history for both standard shop and custom orders.
- Admin Dashboard: Role-based admin dashboard with user, order, and inventory management; homepage and footer settings; and custom order settings. All current and future admin tabs automatically become roles in the roles tab
- Ads and AI Flyer Generation: AI-powered tool to generate marketing flyers and ads with configurable options and integration of store-specific details and branding. Includes a CTA to monitor ad performance.
- Checkout Flow: A two-step approval flow. A shopping cart shows a subtotal and 6% service charge, then admin puts a shipment fee and returns a final quote to user, who may accept, reject, or edit. Payment button enabled when user accepts.
- Realtime Chat Interface: Firestore subcollection messages in the Converstations collection. Real-time updates using onSnapshot. The 'messages' collection tool to send and receive messages.
- Automated Notifications: Notifications that send data in realtime upon triggers for new orders, user actions or status updates.
- Analytics and Accounting: Analytics and accounting tools in the admin dashboard for robust app management. Includes Google Analytics integration.

## Style Guidelines:

- Primary color: Forest green (#3D9951) for a natural, fresh feel.
- Background color: Light mint (#F0FFFA) to provide a refreshing backdrop.
- Accent color: Teal (#26BFA8) for highlights and interactive elements.
- Headline font: 'Playfair', a modern serif font with an elegant, high-end feel.
- Body font: 'PT Sans', a modern sans-serif, compatible with 'Playfair'.
- Code font: 'Source Code Pro' for displaying code snippets.
- Use natural and food-related icons with a clean, minimalist style.
- Clean, modern layout with clear sections for easy navigation.  Scrollable sidebar, pages, forms and pagination for efficient scalability across devices
- Subtle animations for user interactions, like transitions and loading states.