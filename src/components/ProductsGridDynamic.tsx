import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";

interface ProductsGridDynamicProps {
  category?: string;
  limit?: number;
  showFilters?: boolean;
}

const ProductsGridDynamic: React.FC<ProductsGridDynamicProps> = ({
  category,
  limit,
  showFilters = false
}) => {
  const { data: allProducts = [], isLoading: loading } = useProducts();
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories = [
    "all", "Sarees", "Kurtis", "Kurti Sets", "Sharara Sets", "Gowns", "Dresses", "Ethnic Wear", "Western Wear", "Fusion Wear"
  ];

  useEffect(() => {
    let filtered = [...allProducts];

    // Filter by prop category if provided
    if (category && category !== "all") {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      );
    }
    // Otherwise filter by local state category
    else if (selectedCategory !== "all") {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply limit if specified
    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    setDisplayedProducts(filtered);
  }, [allProducts, category, limit, selectedCategory]);

  const handleAddToCart = (product: Product) => {
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : "Free Size";
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0].name : "Default";
    
    addToCart(product, 1, defaultSize, defaultColor);

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-0">
              <div className="aspect-[3/4] bg-muted rounded-t-lg" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-muted rounded" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-6 bg-muted rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (displayedProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No products found in this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setSelectedCategory(cat);
                navigate(cat === "all" ? "/products" : `/products?category=${cat}`);
              }}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedProducts.map((product) => (
          <Card key={product.id} className="group overflow-hidden hover-lift">
            <CardContent className="p-0">
              <div
                className="relative aspect-[3/4] overflow-hidden cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDQwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMzAwTDE3NSAzMjVMMjAwIDM1MEwyMjUgMzI1TDIwMCAzMDBaIiBmaWxsPSIjOUI5QjlCIi8+CjxwYXRoIGQ9Ik0yMDAgMjUwTDE1MCAzMDBMMjAwIDM1MEwyNTAgMzAwTDIwMCAyNTBaIiBmaWxsPSIjOUI5QjlCIi8+Cjwvc3ZnPgo=";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex gap-2 justify-center">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick(product.id);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="backdrop-blur-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                  <Badge variant="outline" className="text-xs ml-2 flex-shrink-0">
                    {product.category}
                  </Badge>
                </div>

                <p className="text-muted-foreground text-xs line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">₹{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-muted-foreground line-through text-sm">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {product.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-muted-foreground">{product.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductsGridDynamic;