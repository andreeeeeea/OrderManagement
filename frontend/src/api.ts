import type { Product, Customer, Order, CreateOrderRequest } from './types';

const API_URL = "http://localhost:8080/api";

export const getProducts = async(): Promise<Product[]> => {
    const res = await fetch(`${API_URL}/products`);
    return res.json();
};

export const getCustomers = async(): Promise<Customer[]> => {
    const res = await fetch(`${API_URL}/customers`);
    return res.json();
};

export const getOrders = async(): Promise<Order[]> => {
    const res = await fetch(`${API_URL}/orders`);
    return res.json();
};

export const createOrder = async(orderRequest: CreateOrderRequest): Promise<Order> => {
    const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderRequest)
    });
    return res.json();
};

export const updateOrderStatus = async(orderId: number, status: string): Promise<Order> => {
    const res = await fetch(`${API_URL}/orders/${orderId}/status?status=${status}`, {
        method: 'PATCH',
    });
    return res.json();
};