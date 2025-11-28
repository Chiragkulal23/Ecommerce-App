import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import paymentQr from "@/assets/payment-qr.jpg";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [transactionId, setTransactionId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    houseNo: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const total = getCartTotal();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleManualPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId) {
      toast({
        title: "Transaction ID Required",
        description: "Please enter the UPI Transaction ID / UTR Number",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/payments/manual-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId,
          orderData: {
            user: {
              name: formData.name,
              phone: formData.phone,
              email: formData.email,
              address: {
                houseNo: formData.houseNo,
                street: formData.street,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
              },
            },
            items: items.map(item => ({
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              image: item.product.images[0],
            })),
            amount: total,
          }
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        clearCart();
        navigate("/order-success", { state: { orderId: data.orderId } });
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to cart before checkout",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === "manual") {
      handleManualPayment(e);
      return;
    }

    setLoading(true);

    const res = await loadRazorpay();
    if (!res) {
      toast({
        title: "Error",
        description: "Razorpay SDK failed to load",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      // 1. Create Order
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const orderData = await orderResponse.json();

      // 2. Open Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: orderData.amount,
        currency: orderData.currency,
        name: "StyleAura Boutique",
        description: "Purchase Transaction",
        order_id: orderData.id,
        handler: async function (response: any) {
          // 3. Verify Payment
          const verifyResponse = await fetch("/api/payments/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderData: {
                user: {
                  name: formData.name,
                  phone: formData.phone,
                  email: formData.email,
                  address: {
                    houseNo: formData.houseNo,
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                  },
                },
                items: items.map(item => ({
                  name: item.product.name,
                  price: item.product.price,
                  quantity: item.quantity,
                  image: item.product.images[0],
                })),
                amount: total,
              }
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.status === "success") {
            clearCart();
            navigate("/order-success", { state: { orderId: verifyData.orderId } });
          } else {
            toast({
              title: "Payment Failed",
              description: "Payment verification failed",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong during checkout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-playfair font-bold mb-8 text-center">Checkout</h1>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Shipping Details Form */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input required id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input required id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="9876543210" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="houseNo">House No / Flat</Label>
                  <Input required id="houseNo" name="houseNo" value={formData.houseNo} onChange={handleInputChange} placeholder="A-101" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Street / Area</Label>
                  <Input required id="street" name="street" value={formData.street} onChange={handleInputChange} placeholder="Main Street" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input required id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="Mumbai" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input required id="state" name="state" value={formData.state} onChange={handleInputChange} placeholder="Maharashtra" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input required id="pincode" name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="400001" />
                </div>

                <div className="pt-4">
                  <Label className="text-base mb-2 block">Payment Method</Label>
                  <Tabs defaultValue="razorpay" onValueChange={setPaymentMethod} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="razorpay">Pay Online</TabsTrigger>
                      <TabsTrigger value="manual">Scan & Pay (UPI)</TabsTrigger>
                    </TabsList>
                    <TabsContent value="razorpay" className="mt-4">
                      <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-sm text-blue-800">
                        Pay securely using Credit/Debit Card, NetBanking, UPI, or Wallets via Razorpay.
                      </div>
                    </TabsContent>
                    <TabsContent value="manual" className="mt-4 space-y-4">
                      <div className="bg-gray-50 p-4 rounded-md border flex flex-col items-center text-center">
                        <p className="font-medium mb-2">Scan QR Code to Pay</p>
                        <img src={paymentQr} alt="Payment QR" className="w-48 h-48 object-contain mb-2 border rounded" />
                        <p className="text-sm text-muted-foreground">UPI ID: chiragkulal44@okicici</p>
                        <p className="text-sm font-bold mt-2 text-primary">Total Amount: ₹{total}</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="transactionId">Transaction ID / UTR Number</Label>
                        <Input
                          id="transactionId"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          placeholder="Enter 12-digit UTR number"
                          required={paymentMethod === "manual"}
                        />
                        <p className="text-xs text-muted-foreground">Please enter the transaction ID after successful payment.</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <Button type="submit" className="w-full mt-6" size="lg" disabled={loading}>
                  {loading ? "Processing..." : paymentMethod === "manual" ? "Place Order" : `Pay ₹${total}`}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize}`} className="flex gap-4 py-2 border-b last:border-0">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                      <p className="font-medium">₹{item.product.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
