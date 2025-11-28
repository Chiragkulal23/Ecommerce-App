export interface Review {
    id: string;
    author: string;
    rating: number;
    date: string;
    comment: string;
    verified: boolean;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    description: string;
    category: string;
    images: string[];
    sizes: string[];
    colors: { name: string; value: string }[];
    rating: number;
    reviews: Review[];
    features: string[];
    stock?: number;
    _id?: string; // For MongoDB compatibility
}
