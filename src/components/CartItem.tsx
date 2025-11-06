import { CartItem as CartItemType } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleIncrement = () => {
    updateQuantity(
      item.product.id,
      item.selectedSize,
      item.selectedColor,
      item.quantity + 1
    );
  };

  const handleDecrement = () => {
    updateQuantity(
      item.product.id,
      item.selectedSize,
      item.selectedColor,
      item.quantity - 1
    );
  };

  const handleRemove = () => {
    removeFromCart(item.product.id, item.selectedSize, item.selectedColor);
  };

  const itemTotal = item.product.price * item.quantity;

  return (
    <div className="flex gap-6 p-6 bg-card rounded-xl border border-border hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="flex-shrink-0 w-32 h-32 rounded-lg overflow-hidden bg-secondary/20">
        <img
          src={item.product.images[0]}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-playfair font-semibold text-lg mb-2 line-clamp-2">
            {item.product.name}
          </h3>
          <div className="flex gap-4 text-sm text-muted-foreground mb-3">
            <span>
              Size: <span className="font-medium text-foreground">{item.selectedSize}</span>
            </span>
            <span>
              Color: <span className="font-medium text-foreground">{item.selectedColor}</span>
            </span>
          </div>
        </div>

        {/* Quantity Controls & Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleDecrement}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-semibold">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleIncrement}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                ₹{itemTotal.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                ₹{item.product.price.toLocaleString()} each
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleRemove}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
