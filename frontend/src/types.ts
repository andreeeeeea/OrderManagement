export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
}

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    address?: string;
}

export interface OrderItem {
    id: number;
    product: Product;
    quantity: number;
    priceAtTime: number;
}

export interface Order {
    id: number;
    customer: Customer;
    orderItems: OrderItem[];
    status: 'PENDING' | 'CONFIRMED' |'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrderRequest {
    customerId: number;
    items: { productId: number; quantity: number }[];
}

