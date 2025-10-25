// Mock data for orders, in a real app this would come from a database.
export const mockOrders = [
    { id: 'ORD001', date: '2023-10-26', status: 'Delivered', total: 43.50, items: 2, customer: { name: 'Jane Doe', email: 'jane.doe@example.com' } },
    { id: 'ORD006', date: '2023-10-27', status: 'Awaiting Confirmation', total: 95.50, items: 1, isCustom: true, customer: { name: 'John Smith', email: 'john.smith@example.com' } },
    { id: 'ORD002', date: '2023-10-24', status: 'Pending', total: 85.00, items: 1, isCustom: true, customer: { name: 'Alice Johnson', email: 'alice.j@example.com' } },
    { id: 'ORD003', date: '2023-10-22', status: 'Rejected', total: 22.00, items: 1, customer: { name: 'Bob Williams', email: 'bob.w@example.com' } },
    { id: 'ORD004', date: '2023-10-20', status: 'Delivered', total: 15.75, items: 1, needsReview: true, customer: { name: 'Jane Doe', email: 'jane.doe@example.com' } },
    { id: 'ORD005', date: '2023-10-18', status: 'Delivered', total: 12.00, items: 1, customer: { name: 'Charlie Brown', email: 'charlie.b@example.com' } },
    { id: 'ORD007', date: '2023-11-01', status: 'Delivered', total: 55.00, items: 3, customer: { name: 'Jane Doe', email: 'jane.doe@example.com' } },
    { id: 'ORD008', date: '2023-11-02', status: 'Pending', total: 18.25, items: 1, customer: { name: 'John Smith', email: 'john.smith@example.com' } },
];
