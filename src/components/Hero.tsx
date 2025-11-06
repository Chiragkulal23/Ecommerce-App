import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import heroImage from "@/assets/hero-ethnic-wear.jpg";

const Hero = () => {
  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Elegant ethnic wear collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl space-y-6 animate-fade-in">
          <p className="text-accent font-medium uppercase tracking-wider text-sm">
            New Collection
          </p>
          <h1 className="text-5xl md:text-7xl font-playfair font-bold leading-tight">
            Your Everyday
            <span className="block text-gradient">Traditional Look</span>
            Is Here
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Discover elegant Kurtis, Sarees, Suits & Dresses crafted for the modern woman
            who values tradition and style.
          </p>
          <div className="flex gap-4 pt-4">
            <Button size="lg" className="group">
              Shop Now
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline">
              View Collection
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
