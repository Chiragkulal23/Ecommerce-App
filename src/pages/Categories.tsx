import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductsGridDynamic from "@/components/ProductsGridDynamic";

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
        name: "Kurtis Set",
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
        name: "Kurti and Pant sets",
        images: [kurtiPant1],
        description: "Comfortable combinations",
        productId: "kurti-pant-sets",
      },
      {
        name: "Sharara sets",
        images: [sharara1, sharara2],
        description: "Festive elegance",
        productId: "sharara-sets",
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
        productId: "crop-top-skirts",
      },
      {
        name: "Fusion Wear",
        images: [fusion1],
        description: "East meets West",
        productId: "fusion-wear",
      },
    ],
  },
];

const Categories = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'categories' | 'products'>('categories');

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setViewMode('products');
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setViewMode('categories');
  };

  if (viewMode === 'products' && selectedCategory) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button
                variant="outline"
                onClick={handleBackToCategories}
                className="mb-4"
              >
                ← Back to Categories
              </Button>
              <h2 className="text-3xl md:text-4xl font-playfair font-bold">
                {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
              </h2>
            </div>
          </div>
          <ProductsGridDynamic category={selectedCategory} />
        </div>
      </section>
    );
  }

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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {section.categories.map((category, categoryIndex) => (
                <Card
                  key={categoryIndex}
                  className="overflow-hidden cursor-pointer group transform hover:scale-105 transition-transform duration-300"
                  onClick={() => handleCategoryClick(category.productId)}
                >
                  <CardContent className="p-0 relative">
                    <img
                      src={category.images[0]}
                      alt={category.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 flex flex-col justify-center items-center text-center p-4">
                      <h4 className="text-xl font-semibold text-white mb-2">
                        {category.name}
                      </h4>
                      <p className="text-sm text-gray-300">
                        {category.description}
                      </p>
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
