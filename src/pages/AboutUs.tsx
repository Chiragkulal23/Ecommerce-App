import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import heroImage from "@/assets/about-hero.jpg";
import storyImage from "@/assets/about-story.jpg";
import craftsmanshipImage from "@/assets/about-craftsmanship.jpg";

const AboutUs = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="StyleAura Fashion" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/80" />
        </div>
        
        <motion.div 
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 text-foreground">
            Where Elegance Meets Everyday Style
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            At StyleAura, we believe fashion is more than just clothing — it's a reflection of personality, confidence, and grace.
          </p>
        </motion.div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInUp}>
              <img 
                src={storyImage} 
                alt="Our Story" 
                className="rounded-lg shadow-elegant w-full hover-lift"
              />
            </motion.div>
            
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Born out of a passion for Indian ethnic and modern fashion, StyleAura was founded to bring timeless elegance to every woman's wardrobe.
                </p>
                <p>
                  From vibrant kurtis to graceful dresses, we curate styles that celebrate confidence, culture, and comfort — all in one place.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div {...fadeInUp}>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-8 text-foreground">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              To make high-quality, fashionable clothing accessible to every woman who loves to express herself through style.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We aim to blend tradition and modernity — giving you fashion that feels both beautiful and personal.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInUp} className="order-2 md:order-1">
              <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-foreground">
                Our Craftsmanship
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Every collection is thoughtfully designed and carefully crafted.
                </p>
                <p>
                  Our fabrics are handpicked, our patterns are refined, and our goal is simple — to create designs that make you look good and feel amazing.
                </p>
              </div>
            </motion.div>
            
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="order-1 md:order-2">
              <img 
                src={craftsmanshipImage} 
                alt="Craftsmanship" 
                className="rounded-lg shadow-elegant w-full hover-lift"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-rose-gold/10 via-blush/10 to-cream/10">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div {...fadeInUp}>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Join the StyleAura Family
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Be part of a community that loves authentic, elegant fashion. Follow us on social media for new arrivals and styling tips.
            </p>
            
            <div className="flex justify-center gap-4 mb-8">
              <Button 
                variant="outline" 
                size="lg" 
                className="hover-lift"
                onClick={() => window.open('https://instagram.com', '_blank')}
              >
                <Instagram className="mr-2 h-5 w-5" />
                Instagram
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="hover-lift"
                onClick={() => window.open('https://facebook.com', '_blank')}
              >
                <Facebook className="mr-2 h-5 w-5" />
                Facebook
              </Button>
            </div>
            
            <Button 
              size="lg" 
              className="text-lg px-8 hover-lift"
              onClick={() => navigate('/')}
            >
              Shop Now
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
