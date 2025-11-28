import { Product } from "@/types/product";

const API_URL = "/api";

export const fetchProducts = async (): Promise<Product[]> => {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        // Map MongoDB _id to id if necessary, or ensure backend sends id
        return data.products.map((p: any) => ({
            ...p,
            id: p._id || p.id,
            images: p.images || [],
            sizes: p.sizes || [],
            colors: p.colors || [],
            reviews: p.reviews || [],
            features: p.features || [],
        }));
    } catch (error) {
        console.error("Error fetching products:", error);
        // Return empty array on error to prevent crashes
        return [];
    }
};

export const fetchProductById = async (id: string): Promise<Product> => {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch product");
    }
    const p = await response.json();
    return {
        ...p,
        id: p._id || p.id,
        images: p.images || [],
        sizes: p.sizes || [],
        colors: p.colors || [],
        reviews: p.reviews || [],
        features: p.features || [],
    };
};

// Admin API functions
export const addProduct = async (productData: any): Promise<Product> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(productData),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add product");
    }
    const data = await response.json();
    return data.product;
};

export const updateProduct = async (id: string, productData: any): Promise<Product> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(productData),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update product");
    }
    const data = await response.json();
    return data.product;
};

export const deleteProduct = async (id: string): Promise<void> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete product");
    }
};

export const getOrders = async (): Promise<any[]> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/orders`, {
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch orders");
    }
    const data = await response.json();
    return data.orders || [];
};

export const updateOrderStatus = async (orderId: string, status: string): Promise<any> => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status }),
    });
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update order status");
    }
    const data = await response.json();
    return data.order;
};
