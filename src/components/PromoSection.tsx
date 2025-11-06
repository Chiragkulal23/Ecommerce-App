import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const PromoSection = () => {
  return (
    <section className="py-16 hero-gradient">
      <div className="container mx-auto px-4">
        <div className="bg-card rounded-2xl shadow-xl p-8 md:p-12 text-center max-w-4xl mx-auto border border-border/50">
          <div className="flex justify-center mb-4">
            <Sparkles className="h-12 w-12 text-accent" />
          </div>
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-4">
            Festive Season Sale
          </h2>
          <p className="text-xl text-primary font-semibold mb-4">
            Get 30% OFF on All Collections
          </p>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Celebrate the festive season in style with our exclusive collection. 
            Free shipping across India on all orders.
          </p>
          <Button size="lg" className="text-lg px-8">
            Shop Now & Save
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;
