import { useState } from "react";
import { Search, ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-sm">
      {/* Announcement Bar */}
      <div className="bg-primary text-primary-foreground py-2 text-center text-sm overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          ✨ Free Shipping all over India !! | Festive Offers - 30% Off | Premium Quality Assured ✨
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2">
            <div className="text-3xl font-playfair font-bold text-gradient">
              StyleAura
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className="text-foreground hover:text-primary smooth-transition"
              activeClassName="text-primary font-medium"
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className="text-foreground hover:text-primary smooth-transition"
              activeClassName="text-primary font-medium"
            >
              Shop
            </NavLink>
            <NavLink
              to="/categories"
              className="text-foreground hover:text-primary smooth-transition"
              activeClassName="text-primary font-medium"
            >
              Categories
            </NavLink>
            <NavLink
              to="/about"
              className="text-foreground hover:text-primary smooth-transition"
              activeClassName="text-primary font-medium"
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              className="text-foreground hover:text-primary smooth-transition"
              activeClassName="text-primary font-medium"
            >
              Contact
            </NavLink>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="hover:text-primary">
              <Search className="h-5 w-5" />
            </Button>
            
            {user ? (
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-primary"
                onClick={signOut}
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-primary"
                onClick={() => navigate("/login")}
                title="Login"
              >
                <User className="h-5 w-5" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="hover:text-primary relative"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              <NavLink
                to="/"
                className="text-foreground hover:text-primary smooth-transition py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink
                to="/shop"
                className="text-foreground hover:text-primary smooth-transition py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </NavLink>
              <NavLink
                to="/categories"
                className="text-foreground hover:text-primary smooth-transition py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </NavLink>
              <NavLink
                to="/about"
                className="text-foreground hover:text-primary smooth-transition py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </NavLink>
              <NavLink
                to="/contact"
                className="text-foreground hover:text-primary smooth-transition py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </NavLink>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
