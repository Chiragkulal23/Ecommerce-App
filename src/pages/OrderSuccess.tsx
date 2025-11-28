import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const OrderSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId } = location.state || {};

    useEffect(() => {
        if (!orderId) {
            navigate("/");
        }
    }, [orderId, navigate]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-20 flex items-center justify-center">
                <Card className="max-w-md w-full text-center p-8">
                    <CardContent className="space-y-6">
                        <div className="flex justify-center">
                            <CheckCircle className="w-20 h-20 text-green-500" />
                        </div>
                        <h1 className="text-3xl font-playfair font-bold text-green-600">Payment Successful!</h1>
                        <p className="text-muted-foreground">
                            Thank you for your purchase. Your order has been placed successfully.
                        </p>
                        {orderId && (
                            <div className="bg-gray-100 p-4 rounded-md">
                                <p className="text-sm text-gray-600">Order ID</p>
                                <p className="font-mono font-medium">{orderId}</p>
                            </div>
                        )}
                        <div className="pt-4 flex flex-col gap-3">
                            <Button onClick={() => window.print()} variant="outline" className="w-full">
                                Download Receipt
                            </Button>
                            <Button onClick={() => navigate("/shop")} className="w-full">
                                Continue Shopping
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
};

export default OrderSuccess;
