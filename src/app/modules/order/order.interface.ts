export type IOrderAddress = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postCode: string;
};

export type IOrder = {
  userEmail: string;
  items: any[];
  shippingAddress: IOrderAddress;
  totalAmount: number;
  transactionId?: string;
  status: 'Unpaid' | 'Paid' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: Date;
};