import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/useProducts";

const ProductsGrid = () => {
  const { data: products = [], isLoading: loading } = useProducts();
  const navigate = useNavigate();

  if (loading) {
    return (
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <h2 className="text-4xl font-serif font-bold text-center mb-12 text-foreground">
            Our Latest Collection
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold mb-4 text-foreground">
            Our Latest Collection
          </h2>
          <p className="text-muted-foreground">
            No products available yet. Check back soon!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto">
        <h2 className="text-4xl font-serif font-bold text-center mb-12 text-foreground">
          Our Latest Collection
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card
              key={product.id}
              className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 border border-border/50"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="relative overflow-hidden aspect-[3/4]">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                  {product.category}
                </p>
                <p className="text-lg font-bold text-primary">
                  ₹{product.price.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsGrid;