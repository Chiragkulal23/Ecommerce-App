import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './src/models/Product.js';

dotenv.config();

const products = [
    {
        name: "Elegant Pink Kurti with Gold Embroidery",
        price: 2499,
        originalPrice: 3999,
        description: "A stunning pink kurti featuring intricate gold embroidery work. Made from premium cotton silk blend, this kurti offers both comfort and style. Perfect for festive occasions and casual outings. The delicate embroidery on the neckline and sleeves adds a touch of elegance.",
        category: "Kurtis",
        images: ["https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1000&auto=format&fit=crop"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: [
            { name: "Pink", value: "#FFB6C1" },
            { name: "Peach", value: "#FFDAB9" },
            { name: "Mint", value: "#98FF98" },
        ],
        rating: 4.5,
        features: [
            "Premium cotton silk blend fabric",
            "Intricate gold embroidery",
            "Three-quarter sleeves",
            "Round neckline",
            "Machine washable",
        ],
        stock: 50
    },
    {
        name: "Classic Cream & Gold Saree",
        price: 4999,
        originalPrice: 7999,
        description: "Traditional cream saree with rich gold border. Crafted from pure silk with exquisite weaving patterns. This timeless piece is perfect for weddings and special celebrations. Comes with an unstitched blouse piece.",
        category: "Sarees",
        images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop"],
        sizes: ["Free Size"],
        colors: [
            { name: "Cream & Gold", value: "#F5E6D3" },
            { name: "Red & Gold", value: "#DC143C" },
            { name: "Green & Gold", value: "#228B22" },
        ],
        rating: 4.8,
        features: [
            "Pure silk fabric",
            "Gold zari border",
            "Unstitched blouse piece included",
            "Traditional weaving",
            "Dry clean only",
        ],
        stock: 30
    },
    {
        name: "Royal Purple Kurti Set",
        price: 3499,
        originalPrice: 5499,
        description: "Complete kurti set in regal purple with traditional embroidery. Set includes matching palazzo pants and dupatta. Perfect for festive occasions and celebrations.",
        category: "Kurti Sets",
        images: ["https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1000&auto=format&fit=crop"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: [
            { name: "Purple", value: "#800080" },
            { name: "Maroon", value: "#800000" },
            { name: "Navy Blue", value: "#000080" },
        ],
        rating: 4.6,
        features: [
            "Three-piece set (Kurti, Palazzo, Dupatta)",
            "Premium rayon fabric",
            "Traditional embroidery work",
            "Comfortable fit",
            "Hand wash recommended",
        ],
        stock: 40
    },
    {
        name: "Modern Mustard Ethnic Dress",
        price: 2999,
        originalPrice: 4499,
        description: "Contemporary ethnic dress in vibrant mustard yellow. Features minimal embellishments with traditional motifs. Perfect fusion of modern and traditional styles.",
        category: "Dresses",
        images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop"],
        sizes: ["S", "M", "L", "XL"],
        colors: [
            { name: "Mustard", value: "#FFDB58" },
            { name: "Coral", value: "#FF7F50" },
            { name: "Turquoise", value: "#40E0D0" },
        ],
        rating: 4.4,
        features: [
            "Premium cotton fabric",
            "Traditional motifs",
            "Bell sleeves",
            "A-line silhouette",
            "Machine washable",
        ],
        stock: 25
    },
    {
        name: "Demo Test Dress",
        price: 1,
        originalPrice: 100,
        description: "This is a demo product for testing payment functionality. It costs only ₹1.",
        category: "Dresses",
        images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop"],
        sizes: ["Free Size"],
        colors: [{ name: "Demo Color", value: "#000000" }],
        rating: 5,
        features: ["Test Product", "Price ₹1"],
        stock: 100
    }
];

seedDB();
