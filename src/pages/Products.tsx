import React from "react";
import { useSearchParams } from "react-router-dom";
import ProductsGridDynamic from "@/components/ProductsGridDynamic";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";

  const categories = [
    "all", "Sarees", "Kurtis", "Kurti Sets", "Sharara Sets", "Gowns", "Dresses", 
    "Ethnic Wear", "Western Wear", "Fusion Wear"
  ];

  const handleCategoryChange = (newCategory: string) => {
    if (newCategory === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", newCategory);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-4">
            Our Collection
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover our curated selection of premium ethnic wear, from traditional elegance to contemporary fusion
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-card rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5" />
                <h3 className="font-semibold">Filters</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Category</h4>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <Button
                        key={cat}
                        variant={category === cat ? "default" : "ghost"}
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleCategoryChange(cat)}
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">
                {category === "all" ? "All Products" : category}
              </h2>
              <p className="text-muted-foreground">
                Showing products in {category === "all" ? "all categories" : category.toLowerCase()}
              </p>
            </div>
            
            <ProductsGridDynamic 
              category={category === "all" ? undefined : category} 
              showFilters={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;