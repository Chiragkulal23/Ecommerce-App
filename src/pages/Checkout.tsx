import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const Checkout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-playfair font-bold mb-4">Checkout</h1>
          <p className="text-muted-foreground mb-8">
            Checkout functionality will be implemented in the next step.
          </p>
          <Button onClick={() => navigate("/cart")}>Return to Cart</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
