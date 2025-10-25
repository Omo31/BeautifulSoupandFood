

// Mock data for orders, in a real app this would come from a database.
export const mockOrders = [
    { 
        id: 'ORD001', 
        date: '2023-10-26', 
        status: 'Delivered', 
        total: 43.50, 
        items: 2, 
        customer: { name: 'Jane Doe', email: 'jane.doe@example.com' } 
    },
    { 
        id: 'ORD006', 
        date: '2023-10-27', 
        status: 'Awaiting Confirmation', 
        total: 0.00, 
        items: 1, 
        isCustom: true, 
        customer: { name: 'John Smith', email: 'john.smith@example.com' },
        customOrderDetails: {
            itemName: 'Fresh Black Truffles',
            quantity: 500,
            measure: 'Grams',
            notes: 'Looking for high-quality truffles for a special event. Please ensure they are fresh.'
        },
        shippingAddress: {
            address: '456 Oak Avenue',
            city: 'Metropolis',
            state: 'CA',
            zip: '90210',
            country: 'USA'
        }
    },
    { 
        id: 'ORD002', 
        date: '2023-10-24', 
        status: 'Pending', 
        total: 85.00, 
        items: 1, 
        isCustom: true, 
        customer: { name: 'Alice Johnson', email: 'alice.j@example.com' } 
    },
    { 
        id: 'ORD003', 
        date: '2023-10-22', 
        status: 'Rejected', 
        total: 22.00, 
        items: 1, 
        customer: { name: 'Bob Williams', email: 'bob.w@example.com' } 
    },
    { 
        id: 'ORD004', 
        date: '2023-10-20', 
        status: 'Delivered', 
        total: 15.75, 
        items: 1, 
        needsReview: true, 
        customer: { name: 'Jane Doe', email: 'jane.doe@example.com' } 
    },
    { 
        id: 'ORD005', 
        date: '2023-10-18', 
        status: 'Delivered', 
        total: 12.00, 
        items: 1, 
        customer: { name: 'Charlie Brown', email: 'charlie.b@example.com' } 
    },
    { 
        id: 'ORD007', 
        date: '2023-11-01', 
        status: 'Delivered', 
        total: 55.00, 
        items: 3, 
        customer: { name: 'Jane Doe', email: 'jane.doe@example.com' } 
    },
    { 
        id: 'ORD008', 
        date: '2023-11-02', 
        status: 'Pending', 
        total: 18.25, 
        items: 1, 
        customer: { name: 'John Smith', email: 'john.smith@example.com' } 
    },
];

export const initialUsers = [
  {
    id: 'usr1',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'Customer',
    joined: '2023-10-01',
    avatar: 'https://picsum.photos/seed/jane-doe/40/40',
    status: 'Active',
  },
  {
    id: 'usr2',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'Customer',
    joined: '2023-09-15',
     avatar: 'https://picsum.photos/seed/john-smith/40/40',
     status: 'Active',
  },
  {
    id: 'usr3',
    name: 'Alice Johnson',
    email: 'alice.j@gourmet.com',
    role: 'Content Manager',
    joined: '2023-08-20',
    avatar: 'https://picsum.photos/seed/alice-j/40/40',
    status: 'Disabled',
  },
    {
    id: 'usr4',
    name: 'Admin User',
    email: 'admin@gourmet.com',
    role: 'Administrator',
    joined: '2023-01-15',
    avatar: 'https://picsum.photos/seed/admin-user/40/40',
    status: 'Active',
  },
   {
    id: 'usr5',
    name: 'Bob Brown',
    email: 'bob.brown@example.com',
    role: 'Customer',
    joined: '2023-11-05',
    avatar: 'https://picsum.photos/seed/bob-brown/40/40',
    status: 'Active',
  },
  {
    id: 'usr6',
    name: 'Charlie Davis',
    email: 'charlie.d@example.com',
    role: 'Customer',
    joined: '2023-11-10',
    avatar: 'https://picsum.photos/seed/charlie-davis/40/40',
    status: 'Active',
  },
  {
    id: 'usr7',
    name: 'Diana Evans',
    email: 'diana.e@gourmet.com',
    role: 'Support Agent',
    joined: '2023-07-30',
    avatar: 'https://picsum.photos/seed/diana-evans/40/40',
    status: 'Active',
  },
];
