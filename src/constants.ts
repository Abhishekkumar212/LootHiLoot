import type { Deal } from './types';

// Helper function to create future dates
const addDays = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

// Helper function to create past dates
const subtractDays = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

// Fix: Changed deal IDs from numbers to strings to match the 'Deal' type definition.
export const initialDeals: Deal[] = [
  {
    id: '1',
    productName: "Wireless Noise Cancelling Headphones",
    affiliateUrl: "https://amazon.com/dp/example1",
    imageUrl: "https://picsum.photos/seed/headphones/400/300",
    originalPrice: 15000,
    dealPrice: 7999,
    dueDate: addDays(3),
    quantity: 50,
    orderLink: "https://forms.gle/TqVtvEwxWq6tk7sXA",
    refundLink: "https://forms.gle/exampleRefund1",
  },
  {
    id: '2',
    productName: "Smart Watch with GPS & Heart Rate Monitor",
    affiliateUrl: "https://amazon.com/dp/example2",
    imageUrl: "https://picsum.photos/seed/smartwatch/400/300",
    originalPrice: 10000,
    dealPrice: 4500,
    dueDate: addDays(5),
    quantity: 30,
    orderLink: "https://forms.gle/TqVtvEwxWq6tk7sXA",
    refundLink: "https://forms.gle/exampleRefund2",
  },
  {
    id: '3',
    productName: "4K UHD 55-Inch Smart TV",
    affiliateUrl: "https://amazon.com/dp/example3",
    imageUrl: "https://picsum.photos/seed/tv/400/300",
    originalPrice: 55000,
    dealPrice: 35000,
    dueDate: addDays(1),
    quantity: 1, // Low stock
    orderLink: "https://forms.gle/TqVtvEwxWq6tk7sXA",
    refundLink: "https://forms.gle/exampleRefund3",
  },
  {
    id: '4',
    productName: "Ergonomic Office Chair",
    affiliateUrl: "https://amazon.com/dp/example4",
    imageUrl: "https://picsum.photos/seed/chair/400/300",
    originalPrice: 20000,
    dealPrice: 12000,
    dueDate: subtractDays(2), // Expired 2 days ago
    quantity: 25,
    orderLink: "https://forms.gle/TqVtvEwxWq6tk7sXA",
    refundLink: "https://forms.gle/exampleRefund4",
  },
  {
    id: '5',
    productName: "Portable Bluetooth Speaker",
    affiliateUrl: "https://amazon.com/dp/example5",
    imageUrl: "https://picsum.photos/seed/speaker/400/300",
    originalPrice: 8000,
    dealPrice: 4999,
    dueDate: addDays(10),
    quantity: 0, // Out of stock
    orderLink: "https://forms.gle/TqVtvEwxWq6tk7sXA",
    refundLink: "https://forms.gle/exampleRefund5",
  },
  {
    id: '6',
    productName: "Professional Blender for Smoothies",
    affiliateUrl: "https://amazon.com/dp/example6",
    imageUrl: "https://picsum.photos/seed/blender/400/300",
    originalPrice: 12000,
    dealPrice: 9000,
    dueDate: subtractDays(5), // Expired 5 days ago
    quantity: 10,
    orderLink: "https://forms.gle/TqVtvEwxWq6tk7sXA",
    refundLink: "https://forms.gle/exampleRefund6",
  },
  {
    id: '7',
    productName: "Electric Standing Desk",
    affiliateUrl: "https://amazon.com/dp/example7",
    imageUrl: "https://picsum.photos/seed/desk/400/300",
    originalPrice: 40000,
    dealPrice: 28000,
    dueDate: addDays(2),
    quantity: 15,
    orderLink: "https://forms.gle/TqVtvEwxWq6tk7sXA",
    refundLink: "https://forms.gle/exampleRefund7",
  },
    {
    id: '8',
    productName: "Air Fryer & Convection Oven",
    affiliateUrl: "https://amazon.com/dp/example8",
    imageUrl: "https://picsum.photos/seed/airfryer/400/300",
    originalPrice: 15000,
    dealPrice: 11000,
    dueDate: subtractDays(10), // Expired 10 days ago (should not show up)
    quantity: 5,
    orderLink: "https://forms.gle/TqVtvEwxWq6tk7sXA",
    refundLink: "https://forms.gle/exampleRefund8",
  },
];