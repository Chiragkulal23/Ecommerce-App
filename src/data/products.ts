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
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

import kurtiPink from "@/assets/kurti-pink.jpg";
import sareeCream from "@/assets/saree-cream.jpg";
import kurtiSetPurple from "@/assets/kurti-set-purple.jpg";
import dressYellow from "@/assets/dress-yellow.jpg";

export const products: Product[] = [
  {
    id: "1",
    name: "Elegant Pink Kurti with Gold Embroidery",
    price: 2499,
    originalPrice: 3999,
    description: "A stunning pink kurti featuring intricate gold embroidery work. Made from premium cotton silk blend, this kurti offers both comfort and style. Perfect for festive occasions and casual outings. The delicate embroidery on the neckline and sleeves adds a touch of elegance.",
    category: "Kurtis",
    images: [kurtiPink, kurtiPink, kurtiPink],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Pink", value: "#FFB6C1" },
      { name: "Peach", value: "#FFDAB9" },
      { name: "Mint", value: "#98FF98" },
    ],
    rating: 4.5,
    reviews: [
      {
        id: "1",
        author: "Priya Sharma",
        rating: 5,
        date: "2024-01-15",
        comment: "Absolutely love this kurti! The fabric quality is excellent and the embroidery work is stunning. Fits perfectly and looks exactly like the pictures.",
        verified: true,
      },
      {
        id: "2",
        author: "Anjali Gupta",
        rating: 4,
        date: "2024-01-10",
        comment: "Beautiful kurti with great attention to detail. Only minor issue was the color was slightly lighter than expected, but still gorgeous!",
        verified: true,
      },
    ],
    features: [
      "Premium cotton silk blend fabric",
      "Intricate gold embroidery",
      "Three-quarter sleeves",
      "Round neckline",
      "Machine washable",
    ],
  },
  {
    id: "2",
    name: "Classic Cream & Gold Saree",
    price: 4999,
    originalPrice: 7999,
    description: "Traditional cream saree with rich gold border. Crafted from pure silk with exquisite weaving patterns. This timeless piece is perfect for weddings and special celebrations. Comes with an unstitched blouse piece.",
    category: "Sarees",
    images: [sareeCream, sareeCream, sareeCream],
    sizes: ["Free Size"],
    colors: [
      { name: "Cream & Gold", value: "#F5E6D3" },
      { name: "Red & Gold", value: "#DC143C" },
      { name: "Green & Gold", value: "#228B22" },
    ],
    rating: 4.8,
    reviews: [
      {
        id: "3",
        author: "Meera Patel",
        rating: 5,
        date: "2024-01-20",
        comment: "This saree is absolutely breathtaking! The gold work is so elegant and the draping is perfect. Received so many compliments at the wedding!",
        verified: true,
      },
    ],
    features: [
      "Pure silk fabric",
      "Gold zari border",
      "Unstitched blouse piece included",
      "Traditional weaving",
      "Dry clean only",
    ],
  },
  {
    id: "3",
    name: "Royal Purple Kurti Set",
    price: 3499,
    originalPrice: 5499,
    description: "Complete kurti set in regal purple with traditional embroidery. Set includes matching palazzo pants and dupatta. Perfect for festive occasions and celebrations.",
    category: "Kurti Sets",
    images: [kurtiSetPurple, kurtiSetPurple, kurtiSetPurple],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Purple", value: "#800080" },
      { name: "Maroon", value: "#800000" },
      { name: "Navy Blue", value: "#000080" },
    ],
    rating: 4.6,
    reviews: [
      {
        id: "4",
        author: "Divya Singh",
        rating: 5,
        date: "2024-01-18",
        comment: "Love this complete set! The palazzo is so comfortable and the embroidery is beautiful. Great value for money!",
        verified: true,
      },
    ],
    features: [
      "Three-piece set (Kurti, Palazzo, Dupatta)",
      "Premium rayon fabric",
      "Traditional embroidery work",
      "Comfortable fit",
      "Hand wash recommended",
    ],
  },
  {
    id: "4",
    name: "Modern Mustard Ethnic Dress",
    price: 2999,
    originalPrice: 4499,
    description: "Contemporary ethnic dress in vibrant mustard yellow. Features minimal embellishments with traditional motifs. Perfect fusion of modern and traditional styles.",
    category: "Dresses",
    images: [dressYellow, dressYellow, dressYellow],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Mustard", value: "#FFDB58" },
      { name: "Coral", value: "#FF7F50" },
      { name: "Turquoise", value: "#40E0D0" },
    ],
    rating: 4.4,
    reviews: [
      {
        id: "5",
        author: "Riya Verma",
        rating: 4,
        date: "2024-01-12",
        comment: "Beautiful dress! The color is so vibrant and cheerful. Comfortable for all-day wear. Slightly loose fit but still lovely.",
        verified: true,
      },
    ],
    features: [
      "Premium cotton fabric",
      "Traditional motifs",
      "Bell sleeves",
      "A-line silhouette",
      "Machine washable",
    ],
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id);
};

export const getSimilarProducts = (productId: string, category: string, limit = 4): Product[] => {
  return products
    .filter((product) => product.id !== productId && product.category === category)
    .slice(0, limit);
};
