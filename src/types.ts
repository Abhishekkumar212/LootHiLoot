export interface Deal {
  id: string;
  productName: string;
  affiliateUrl: string;
  imageUrl: string;
  originalPrice: number;
  dealPrice: number;
  dueDate: string; // ISO 8601 format
  quantity: number;
  orderLink: string;
  refundLink: string;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  password?: string;
}

// User object from Firebase Auth
export interface FirestoreUser {
    uid: string;
    name: string;
    email: string;
}
