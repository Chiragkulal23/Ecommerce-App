import { Product } from "@/data/products";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SimilarProductsProps {
  products: Product[];
}

const SimilarProducts = ({ products }: SimilarProductsProps) => {
  const navigate = useNavigate();

  if (products.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-playfair font-bold">Similar Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="group overflow-hidden border-none shadow-lg hover-lift cursor-pointer"
          >
            <CardContent className="p-0">
              <div
                className="relative aspect-square overflow-hidden"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {product.originalPrice && (
                  <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    {Math.round(
                      ((product.originalPrice - product.price) / product.originalPrice) * 100
                    )}
                    % OFF
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3
                  className="font-playfair font-semibold mb-2 line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-3">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviews.length})
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-primary">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <Button className="w-full group">
                  <ShoppingCart className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
