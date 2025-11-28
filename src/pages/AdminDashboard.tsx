import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LogOut, Package, Tag, Edit, Trash2, ImageIcon, RefreshCw } from "lucide-react";
import { addProduct, updateProduct, deleteProduct, getOrders, updateOrderStatus, fetchProducts } from "@/services/api";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [stock, setStock] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [activeTab, setActiveTab] = useState("products");
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate("/admin/login");
    } else {
      fetchProductsData();
      fetchOrdersData();
    }
  }, [user, navigate]);

  // Auto-refresh orders when orders tab is active
  useEffect(() => {
    if (activeTab === "orders" && user?.role === 'admin') {
      // Refresh orders every 5 seconds when orders tab is active
      const interval = setInterval(() => {
        fetchOrdersData();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab, user]);

  const fetchProductsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOrdersData = async () => {
    try {
      setOrdersLoading(true);
      const ordersData = await getOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      toast({
        title: "Order Updated",
        description: `Order status updated to ${status}`,
      });
      fetchOrdersData(); // Refresh orders
    } catch (error: any) {
      console.error("Error updating order:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setCategory("");
    setImageUrl("");
    setStock("");
    setOriginalPrice("");
    setErrors({});
    setEditingProduct(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Product name is required";
    if (!price || parseFloat(price) <= 0) newErrors.price = "Valid price is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!category) newErrors.category = "Category is required";
    if (!imageUrl.trim()) newErrors.imageUrl = "Image URL is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setUploading(true);
    try {
      const productData = {
        name,
        price: parseFloat(price),
        description,
        category,
        imageUrl,
        images: [imageUrl],
        stock: stock ? parseInt(stock) : 0,
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      };

      await addProduct(productData);
      toast({
        title: "Product added",
        description: "Product has been added successfully",
      });
      resetForm();
      fetchProductsData(); // Refresh products list
      setActiveTab("products");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add product",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !editingProduct) return;

    setUploading(true);
    try {
      const productData = {
        name,
        price: parseFloat(price),
        description,
        category,
        imageUrl,
        images: [imageUrl],
        stock: stock ? parseInt(stock) : 0,
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      };

      await updateProduct(editingProduct.id, productData);
      toast({
        title: "Product updated",
        description: "Product has been updated successfully",
      });
      resetForm();
      fetchProductsData(); // Refresh products list
      setActiveTab("products");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setName(product.name || "");
    setPrice(product.price?.toString() || "");
    setDescription(product.description || "");
    setCategory(product.category || "");
    setImageUrl(product.images?.[0] || product.imageUrl || "");
    setStock(product.stock?.toString() || "0");
    setOriginalPrice(product.originalPrice?.toString() || "");
    setActiveTab("add-product");
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(productId);
      toast({
        title: "Product deleted",
        description: "Product has been deleted successfully",
      });
      fetchProductsData(); // Refresh products list
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-serif font-bold text-foreground">Admin Dashboard</h1>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              Admin Mode
            </Badge>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="add-product">Add Product</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Product Inventory
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{products.length} Products</Badge>
                    <Button variant="outline" size="icon" onClick={fetchProductsData}>
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading products...</p>
                  </div>
                ) : products.length === 0 ? (
                  <Alert>
                    <AlertDescription>
                      No products found. Start by adding your first product!
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Image</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id || product._id}>
                            <TableCell>
                              {product.images?.[0] || product.imageUrl ? (
                                <img
                                  src={product.images?.[0] || product.imageUrl}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded-md"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>₹{product.price}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{product.category}</Badge>
                            </TableCell>
                            <TableCell>{product.stock || 0}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(product)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDelete(product.id || product._id)}
                                >
                                  <Trash2 className="w-4 h-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-product">
            <div className="grid gap-8 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={editingProduct ? handleUpdate : handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Elegant Silk Saree"
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="2499"
                        className={errors.price ? "border-destructive" : ""}
                      />
                      {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="originalPrice">Original Price (₹) - Optional</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        step="0.01"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        placeholder="3999"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Sarees">Sarees</SelectItem>
                          <SelectItem value="Kurtis">Kurtis</SelectItem>
                          <SelectItem value="Kurti Sets">Kurti Sets</SelectItem>
                          <SelectItem value="Sharara Sets">Sharara Sets</SelectItem>
                          <SelectItem value="Gowns">Gowns</SelectItem>
                          <SelectItem value="Dresses">Dresses</SelectItem>
                          <SelectItem value="Ethnic Wear">Ethnic Wear</SelectItem>
                          <SelectItem value="Western Wear">Western Wear</SelectItem>
                          <SelectItem value="Fusion Wear">Fusion Wear</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="10"
                        min="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Beautiful handcrafted saree..."
                        rows={3}
                        className={errors.description ? "border-destructive" : ""}
                      />
                      {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">Product Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className={errors.imageUrl ? "border-destructive" : ""}
                      />
                      {errors.imageUrl && <p className="text-sm text-destructive">{errors.imageUrl}</p>}
                      {imageUrl && (
                        <div className="mt-2">
                          <img src={imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded-md" />
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1" size="lg" disabled={uploading}>
                        {uploading ? "Processing..." : editingProduct ? "Update Product" : "Add Product"}
                      </Button>
                      {editingProduct && (
                        <Button type="button" variant="outline" onClick={() => {
                          resetForm();
                          setActiveTab("products");
                        }}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upload Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert>
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Recommended image size: 800x1200px (3:4 ratio)</li>
                        <li>Use high-quality images for better presentation</li>
                        <li>Supported formats: JPG, PNG, WebP</li>
                        <li>You can use image URLs from external sources</li>
                        <li>Products will appear immediately on the user website after adding</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{products.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Set(products.map(p => p.category)).size}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{orders.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {orders.filter(o => o.status === "Pending").length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    Order Management
                    <Badge variant="outline" className="text-xs">
                      Auto-refreshing every 5s
                    </Badge>
                  </div>
                  <Button variant="outline" size="icon" onClick={fetchOrdersData} disabled={ordersLoading}>
                    <RefreshCw className={`w-4 h-4 ${ordersLoading ? 'animate-spin' : ''}`} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <Alert>
                    <AlertDescription>
                      No orders found yet. Orders will appear here when customers make purchases.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Items</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Payment</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell className="font-mono text-xs">{order._id?.slice(-8)}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p className="font-medium">{order.user?.name}</p>
                                <p className="text-muted-foreground">{order.user?.phone}</p>
                                {order.user?.email && (
                                  <p className="text-muted-foreground text-xs">{order.user.email}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {order.items?.map((item: any, idx: number) => (
                                  <p key={idx}>{item.name} (x{item.quantity})</p>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>₹{order.payment?.amount || 0}</TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <p className="font-medium">{order.payment?.method || "N/A"}</p>
                                <Badge variant={order.payment?.status === "Success" ? "default" : "outline"}>
                                  {order.payment?.status || "Pending"}
                                </Badge>
                                {(order.payment?.transactionId || order.payment?.reference) && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Ref: {order.payment.transactionId || order.payment.reference}
                                  </p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                order.status === 'Delivered' ? 'default' :
                                  order.status === 'Shipped' || order.status === 'Out for Delivery' ? 'secondary' : 'outline'
                              }>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Select
                                defaultValue={order.status}
                                onValueChange={(val) => handleUpdateOrderStatus(order._id, val)}
                              >
                                <SelectTrigger className="w-[150px]">
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Pending">Pending</SelectItem>
                                  <SelectItem value="Shipped">Shipped</SelectItem>
                                  <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                                  <SelectItem value="Delivered">Delivered</SelectItem>
                                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
