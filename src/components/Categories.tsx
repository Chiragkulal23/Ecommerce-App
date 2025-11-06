import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import kurtiImage from "@/assets/kurti-pink.jpg";
import sareeImage from "@/assets/saree-cream.jpg";
import kurtiSetImage from "@/assets/kurti-set-purple.jpg";
import dressImage from "@/assets/dress-yellow.jpg";

const categories = [
  {
    name: "Kurtis",
    image: kurtiImage,
    description: "Elegant everyday wear",
    productId: "1",
  },
  {
    name: "Sarees",
    image: sareeImage,
    description: "Traditional elegance",
    productId: "2",
  },
  {
    name: "Kurti Sets",
    image: kurtiSetImage,
    description: "Complete ensembles",
    productId: "3",
  },
  {
    name: "Dresses",
    image: dressImage,
    description: "Modern ethnic fusion",
    productId: "4",
  },
];

const Categories = () => {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our curated collection of premium ethnic wear
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-none shadow-lg hover-lift cursor-pointer"
              onClick={() => navigate(`/product/${category.productId}`)}
            >
              <CardContent className="p-0">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-card transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-playfair font-bold mb-1">
                      {category.name}
                    </h3>
                    <p className="text-card/80 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      {category.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
