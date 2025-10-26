


export const mockUserRoles = [
  { name: "Administrator", isSuperAdmin: true, permissions: {} },
  { name: "Content Manager", isSuperAdmin: false, permissions: { 'Inventory': ['View', 'Create', 'Edit'] } },
  { name: "Support Agent", isSuperAdmin: false, permissions: { 'Conversations': ['View', 'Edit'], 'Orders': ['View'] } },
  { name: "Customer", isSuperAdmin: false, permissions: {} }, // Adding customer as a role
];

// Mock data for orders, in a real app this would come from a database.
export const mockOrders = [
    { 
        id: 'ORD001', 
        date: '2023-10-26', 
        status: 'Delivered' as const, 
        total: 43.50, 
        items: 2, 
        customer: { name: 'Jane Doe', email: 'jane.doe@example.com' } 
    },
    { 
        id: 'ORD006', 
        date: '2023-10-27', 
        status: 'Awaiting Confirmation' as const, 
        total: 0.00, 
        items: 3, 
        isCustom: true, 
        customer: { name: 'John Smith', email: 'john.smith@example.com' },
        customOrderDetails: {
            items: [
                { id: 'item1', name: 'Fresh Black Truffles', quantity: 500, measure: 'Grams' },
                { id: 'item2', name: 'Aged Balsamic Vinegar', quantity: 1, measure: 'Bottle' },
            ],
            services: [
                { id: 'gift-wrapping', label: 'Gift Wrapping' }
            ],
            notes: 'Looking for high-quality truffles for a special event. Please ensure they are fresh. The gift wrapping is for the vinegar.'
        },
        shippingAddress: {
            address: '456 Oak Avenue, Metropolis, CA 90210, USA'
        }
    },
    { 
        id: 'ORD002', 
        date: '2023-10-24', 
        status: 'Pending' as const, 
        total: 85.00, 
        items: 1, 
        isCustom: true, 
        customer: { name: 'Alice Johnson', email: 'alice.j@example.com' } 
    },
    { 
        id: 'ORD003', 
        date: '2023-10-22', 
        status: 'Rejected' as const, 
        total: 22.00, 
        items: 1, 
        customer: { name: 'Bob Williams', email: 'bob.w@example.com' } 
    },
    { 
        id: 'ORD004', 
        date: '2023-10-20', 
        status: 'Delivered' as const, 
        total: 15.75, 
        items: 1, 
        needsReview: true, 
        customer: { name: 'Jane Doe', email: 'jane.doe@example.com' } 
    },
    { 
        id: 'ORD005', 
        date: '2023-10-18', 
        status: 'Delivered' as const,         total: 12.00, 
        items: 1, 
        customer: { name: 'Charlie Brown', email: 'charlie.b@example.com' } 
    },
    { 
        id: 'ORD007', 
        date: '2023-11-01', 
        status: 'Delivered' as const, 
        total: 55000.00, 
        items: 3, 
        customer: { name: 'Jane Doe', email: 'jane.doe@example.com' } 
    },
    { 
        id: 'ORD008', 
        date: '2023-11-02', 
        status: 'Pending' as const, 
        total: 18250.25, 
        items: 1, 
        customer: { name: 'John Smith', email: 'john.smith@example.com' } 
    },
];

export const initialUsers = [
  {
    id: 'usr1',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'Customer' as const,
    joined: '2023-10-01',
    avatar: 'https://picsum.photos/seed/jane-doe/40/40',
    status: 'Active' as const,
  },
  {
    id: 'usr2',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Customer' as const,
    joined: '2023-09-15',
     avatar: 'https://picsum.photos/seed/john-smith/40/40',
     status: 'Active' as const,
  },
  {
    id: 'usr3',
    name: 'Alice Johnson',
    email: 'alice.j@gourmet.com',
    role: 'Content Manager' as const,
    joined: '2023-08-20',
    avatar: 'https://picsum.photos/seed/alice-j/40/40',
    status: 'Disabled' as const,
  },
    {
    id: 'usr4',
    name: 'Admin User',
    email: 'admin@gourmet.com',
    role: 'Administrator' as const,
    joined: '2023-01-15',
    avatar: 'https://picsum.photos/seed/admin-user/40/40',
    status: 'Active' as const,
  },
   {
    id: 'usr5',
    name: 'Bob Brown',
    email: 'bob.brown@example.com',
    role: 'Customer' as const,
    joined: '2023-11-05',
    avatar: 'https://picsum.photos/seed/bob-brown/40/40',
    status: 'Active' as const,
  },
  {
    id: 'usr6',
    name: 'Charlie Davis',
    email: 'charlie.d@example.com',
    role: 'Customer' as const,
    joined: '2023-11-10',
    avatar: 'https://picsum.photos/seed/charlie-davis/40/40',
    status: 'Active' as const,
  },
  {
    id: 'usr7',
    name: 'Diana Evans',
    email: 'diana.e@gourmet.com',
    role: 'Support Agent' as const,
    joined: '2023-07-30',
    avatar: 'https://picsum.photos/seed/diana-evans/40/40',
    status: 'Active' as const,
  },
];

export const mockTransactions = [
    { id: 'txn1', date: '2023-11-05', description: 'Sale from Order ORD007', category: 'Sales Revenue', type: 'sale' as const, amount: 55000.00 },
    { id: 'txn2', date: '2023-11-04', description: 'Fresh produce supply', category: 'Cost of Goods Sold', type: 'expense' as const, amount: 15230.50 },
    { id: 'txn3', date: '2023-11-03', description: 'Brevo Subscription', category: 'Marketing', type: 'expense' as const, amount: 8500.00 },
    { id: 'txn4', date: '2023-11-02', description: 'Sale from Order ORD001', category: 'Sales Revenue', type: 'sale' as const, amount: 4350.00 },
    { id: 'txn5', date: '2023-11-01', description: 'Packaging Materials', category: 'Supplies', type: 'expense' as const, amount: 12000.00 },
];
