import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Calendar, MapPin, Phone, Edit, LogOut, ShoppingBag, Heart } from "lucide-react";

interface UserProfile {
  email: string;
  role: string;
  createdAt: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
}

const UserProfile = () => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    phone: "",
    address: "",
  });
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (user) {
      // Set profile data from user object
      setProfile({
        email: user.email,
        role: user.role,
        createdAt: new Date().toISOString(), // This would come from user data in a real app
      });
      setProfileLoading(false);
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleUpdateProfile = async () => {
    try {
      // In a real app, this would make an API call to update the profile
      setProfile(prev => prev ? {
        ...prev,
        phone: editForm.phone,
        address: editForm.address,
      } : null);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and view your activity</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 flex-shrink-0">
                  <AvatarImage src={profile.avatar_url} alt={profile.email} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {profile.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <CardTitle className="text-lg truncate">{profile.email}</CardTitle>
                  <CardDescription className="truncate">{profile.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm overflow-hidden">
                  <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center space-x-2 text-sm overflow-hidden">
                    <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{profile.phone}</span>
                  </div>
                )}
                {profile.address && (
                  <div className="flex items-center space-x-2 text-sm overflow-hidden">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{profile.address}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm overflow-hidden">
                  <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">Member since {new Date(profile.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm overflow-hidden">
                  <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <Badge variant="outline" className="truncate">{profile.role}</Badge>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingBag className="h-5 w-5" />
                  <span>Recent Orders</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            {order.items?.length || 0} items
                          </span>
                          <span className="font-medium">${order.total_amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No orders yet. Start shopping!
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/")}
                    className="justify-start"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/cart")}
                    className="justify-start"
                  >
                    View Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Address</label>
                <textarea
                  value={editForm.address}
                  onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={3}
                />
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1"
                  onClick={handleUpdateProfile}
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserProfile;