import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

// Featured Category Images
import newArrivals1 from "@/assets/category-new-arrivals-1.jpg";
import under15001 from "@/assets/category-under-1500-1.jpg";

// Indian Wear Category Images
import kurtis1 from "@/assets/category-kurtis-1.jpg";
import kurtis2 from "@/assets/category-kurtis-2.jpg";
import kurtis3 from "@/assets/category-kurtis-3.jpg";
import kurtiSet1 from "@/assets/category-kurti-set-1.jpg";
import kurtiSet2 from "@/assets/category-kurti-set-2.jpg";
import kurtiDupatta1 from "@/assets/category-kurti-dupatta-1.jpg";
import kurtiPant1 from "@/assets/category-kurti-pant-1.jpg";
import sharara1 from "@/assets/category-sharara-1.jpg";
import sharara2 from "@/assets/category-sharara-2.jpg";
import gown1 from "@/assets/category-gown-1.jpg";
import gown2 from "@/assets/category-gown-2.jpg";
import pants1 from "@/assets/category-pants-1.jpg";
import pants2 from "@/assets/category-pants-2.jpg";

// Indo Western Category Images
import coordSet1 from "@/assets/category-coord-set-1.jpg";
import coordSet2 from "@/assets/category-coord-set-2.jpg";
import indoGown1 from "@/assets/category-indo-gown-1.jpg";
import cropSkirt1 from "@/assets/category-crop-skirt-1.jpg";
import fusion1 from "@/assets/category-fusion-1.jpg";

interface Category {
  name: string;
  images: string[];
  description: string;
  productId: string;
}

interface CategorySection {
  title: string;
  categories: Category[];
}

const categorySections: CategorySection[] = [
  {
    title: "FEATURED",
    categories: [
      {
        name: "New Arrivals",
        images: [newArrivals1],
        description: "Latest trending styles",
        productId: "new-arrivals",
      },
      {
        name: "Under 1500",
        images: [under15001],
        description: "Affordable elegance",
        productId: "under-1500",
      },
    ],
  },
  {
    title: "INDIAN WEAR",
    categories: [
      {
        name: "Kurtis",
        images: [kurtis1, kurtis2, kurtis3],
        description: "Elegant everyday wear",
        productId: "kurtis",
      },
      {
        name: "Kurti Sets",
        images: [kurtiSet1, kurtiSet2],
        description: "Complete ensembles",
        productId: "kurti-sets",
      },
      {
        name: "Kurtis with Dupatta",
        images: [kurtiDupatta1],
        description: "Traditional complete sets",
        productId: "kurti-dupatta",
      },
      {
        name: "Kurti and Pant Sets",
        images: [kurtiPant1],
        description: "Comfortable combinations",
        productId: "kurti-pant",
      },
      {
        name: "Sharara Sets",
        images: [sharara1, sharara2],
        description: "Festive elegance",
        productId: "sharara",
      },
      {
        name: "Gowns",
        images: [gown1, gown2],
        description: "Regal ethnic wear",
        productId: "gowns",
      },
      {
        name: "Pants",
        images: [pants1, pants2],
        description: "Versatile bottoms",
        productId: "pants",
      },
    ],
  },
  {
    title: "INDO WESTERN",
    categories: [
      {
        name: "Coord Sets",
        images: [coordSet1, coordSet2],
        description: "Modern ethnic fusion",
        productId: "coord-sets",
      },
      {
        name: "Gowns",
        images: [indoGown1],
        description: "Contemporary elegance",
        productId: "indo-gowns",
      },
      {
        name: "Crop Top & Skirts",
        images: [cropSkirt1],
        description: "Trendy fusion wear",
        productId: "crop-skirt",
      },
      {
        name: "Fusion Wear",
        images: [fusion1],
        description: "East meets West",
        productId: "fusion",
      },
    ],
  },
];

const Categories = () => {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our curated collection of premium ethnic wear
          </p>
        </div>

        {categorySections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-16">
            <div className="mb-8">
              <h3 className="text-2xl md:text-3xl font-playfair font-bold text-primary mb-2">
                {section.title}
              </h3>
              <div className="h-1 w-20 bg-primary/30" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {section.categories.map((category, index) => (
                <Card
                  key={index}
                  className="group overflow-hidden border-none shadow-lg hover-lift cursor-pointer"
                  onClick={() => navigate(`/product/${category.productId}`)}
                >
                  <CardContent className="p-0">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img
                        src={category.images[0]}
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
        ))}
      </div>
    </section>
  );
};

export default Categories;
