import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tag, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface OrderSummaryProps {
  subtotal: number;
  onCheckout: () => void;
}

const PROMO_CODES = {
  WELCOME10: { discount: 0.1, description: "10% off for new customers" },
  FESTIVE30: { discount: 0.3, description: "30% off festive sale" },
  SAVE20: { discount: 0.2, description: "20% off all items" },
};

const OrderSummary = ({ subtotal, onCheckout }: OrderSummaryProps) => {
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const shipping = subtotal > 0 ? (subtotal >= 1000 ? 0 : 99) : 0;
  const discount = appliedPromo
    ? subtotal * PROMO_CODES[appliedPromo as keyof typeof PROMO_CODES].discount
    : 0;
  const total = subtotal + shipping - discount;

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase();
    if (PROMO_CODES[code as keyof typeof PROMO_CODES]) {
      setAppliedPromo(code);
      toast.success("Promo code applied!", {
        description: PROMO_CODES[code as keyof typeof PROMO_CODES].description,
      });
    } else {
      toast.error("Invalid promo code", {
        description: "Please check the code and try again.",
      });
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    toast.info("Promo code removed");
  };

  return (
    <Card className="sticky top-24">
      <CardContent className="p-6">
        <h2 className="text-2xl font-playfair font-bold mb-6">Order Summary</h2>

        {/* Promo Code Section */}
        <div className="mb-6 p-4 rounded-lg bg-secondary/20 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Have a promo code?</span>
          </div>
          {appliedPromo ? (
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div>
                <span className="font-semibold text-primary">{appliedPromo}</span>
                <p className="text-xs text-muted-foreground">
                  {PROMO_CODES[appliedPromo as keyof typeof PROMO_CODES].description}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemovePromo}
                className="text-destructive hover:text-destructive"
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Enter code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="uppercase"
              />
              <Button onClick={handleApplyPromo} variant="outline">
                Apply
              </Button>
            </div>
          )}
          <div className="mt-3 text-xs text-muted-foreground space-y-1">
            <p>Try: WELCOME10, FESTIVE30, SAVE20</p>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-foreground/80">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-foreground/80">
            <span>Shipping</span>
            <span className={shipping === 0 ? "text-primary font-semibold" : ""}>
              {shipping === 0 ? "FREE" : `₹${shipping}`}
            </span>
          </div>
          {shipping > 0 && subtotal < 1000 && (
            <p className="text-xs text-muted-foreground">
              Add ₹{(1000 - subtotal).toLocaleString()} more for free shipping!
            </p>
          )}
          {discount > 0 && (
            <div className="flex justify-between text-primary font-semibold">
              <span>Discount</span>
              <span>-₹{discount.toLocaleString()}</span>
            </div>
          )}
          <div className="pt-4 border-t border-border">
            <div className="flex justify-between items-baseline">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-3xl font-bold text-primary">
                ₹{total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <Button
          size="lg"
          className="w-full text-lg group"
          onClick={onCheckout}
          disabled={subtotal === 0}
        >
          Proceed to Checkout
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>

        {/* Security Note */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          Secure checkout · SSL encrypted
        </p>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
