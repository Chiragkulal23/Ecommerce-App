import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import ProductsGrid from "@/components/ProductsGrid";
import PromoSection from "@/components/PromoSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Categories />
        <ProductsGrid />
        <PromoSection />
        <WhyChooseUs />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
