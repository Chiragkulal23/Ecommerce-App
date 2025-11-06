import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById, getSimilarProducts } from "@/data/products";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductImageCarousel from "@/components/ProductImageCarousel";
import SizeColorSelector from "@/components/SizeColorSelector";
import ProductReviews from "@/components/ProductReviews";
import SimilarProducts from "@/components/SimilarProducts";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Star, Truck, RotateCcw, Shield } from "lucide-react";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const product = id ? getProductById(id) : undefined;
  const similarProducts = product ? getSimilarProducts(product.id, product.category) : [];

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-playfair font-bold mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The product you're looking for doesn't exist.
            </p>
            <Button onClick={() => navigate("/")}>Return to Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    toast.success(`Added ${product.name} to cart!`, {
      description: `Quantity: ${quantity}`,
    });
  };

  const handleAddToWishlist = () => {
    toast.success("Added to wishlist!");
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating ? "fill-accent text-accent" : "text-muted"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <button onClick={() => navigate("/")} className="hover:text-primary">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate("/shop")} className="hover:text-primary">
            Shop
          </button>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Carousel */}
          <div>
            <ProductImageCarousel images={product.images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                {product.category}
              </span>
              <h1 className="text-4xl font-playfair font-bold mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-1">{renderStars(Math.round(product.rating))}</div>
                <span className="text-lg font-medium">{product.rating}</span>
                <span className="text-muted-foreground">
                  ({product.reviews.length} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold text-primary">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-accent/20 text-accent font-semibold">
                      {Math.round(
                        ((product.originalPrice - product.price) / product.originalPrice) * 100
                      )}
                      % OFF
                    </span>
                  </>
                )}
              </div>

              <p className="text-foreground/80 leading-relaxed mb-6">{product.description}</p>
            </div>

            {/* Size & Color Selection */}
            <SizeColorSelector sizes={product.sizes} colors={product.colors} />

            {/* Quantity */}
            <div>
              <label className="block text-sm font-semibold mb-3">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button size="lg" className="flex-1 text-lg" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleAddToWishlist}
              >
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-4 pt-6 border-t border-border">
              <div className="flex items-center gap-3 text-foreground/80">
                <Truck className="h-5 w-5 text-primary" />
                <span>Free shipping on all orders across India</span>
              </div>
              <div className="flex items-center gap-3 text-foreground/80">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span>Easy 7-day return and exchange</span>
              </div>
              <div className="flex items-center gap-3 text-foreground/80">
                <Shield className="h-5 w-5 text-primary" />
                <span>100% authentic products</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details & Features */}
        <div className="mb-16 p-8 rounded-2xl bg-secondary/20">
          <h2 className="text-3xl font-playfair font-bold mb-6">Product Details</h2>
          <ul className="space-y-3">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-primary mt-2" />
                <span className="text-foreground/80">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Reviews */}
        <div className="mb-16">
          <ProductReviews reviews={product.reviews} rating={product.rating} />
        </div>

        {/* Similar Products */}
        <SimilarProducts products={similarProducts} />
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
