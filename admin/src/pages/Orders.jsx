import React, { useState, useEffect } from 'react';
import {
  Search,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Package,
  User,
  Phone,
  Mail,
  MapPin,
  BadgeCheck,
  Bell
} from 'lucide-react';
import { authAPI, OrdersAPI } from '../services/api';
import { connectAdminSocket, getSocket } from '../services/socket';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [transactionInput, setTransactionInput] = useState('');

  const ordersAPI = new OrdersAPI(authAPI.api);
  const [newOrderNotification, setNewOrderNotification] = useState(null);

  useEffect(() => {
    fetchOrders();
    
    // Connect to Socket.IO for real-time notifications
    const socket = connectAdminSocket();
    if (socket) {
      socket.on('payment:notification', (data) => {
        console.log('New order notification:', data);
        setNewOrderNotification({
          orderId: data.order?.id,
          amount: data.payment?.amount,
          status: data.payment?.status
        });
        
        // Refresh orders list
        fetchOrders();
        
        // Auto-hide notification after 5 seconds
        setTimeout(() => {
          setNewOrderNotification(null);
        }, 5000);
      });

      return () => {
        socket.off('payment:notification');
      };
    }
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll();
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Fetch orders error:', error);
      alert('Failed to fetch orders. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order =>
    order._id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.phone?.includes(searchTerm) ||
    (order.payment?.transactionId || order.payment?.reference)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const closeOrderDetails = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    setUpdatingStatus(true);
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      await fetchOrders(); // Refresh orders list

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Update order status error:', error);
      alert('Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const updatePaymentStatus = async (orderId, newStatus, transactionId = '') => {
    setUpdatingStatus(true);
    try {
      await ordersAPI.updatePaymentStatus(orderId, newStatus, transactionId);
      await fetchOrders(); // Refresh orders list

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder(prev => ({
          ...prev,
          payment: {
            ...prev.payment,
            status: newStatus,
            transactionId: transactionId || prev.payment?.transactionId
          }
        }));
      }
    } catch (error) {
      console.error('Update payment status error:', error);
      alert('Failed to update payment status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock className="text-yellow-600" size={16} />;
      case 'Shipped':
        return <Truck className="text-indigo-600" size={16} />;
      case 'Delivered':
        return <CheckCircle className="text-green-600" size={16} />;
      default:
        return <Clock className="text-gray-600" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Success':
        return 'bg-green-100 text-green-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
    <div className="p-6">
      {/* New Order Notification */}
      {newOrderNotification && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between animate-slide-down">
          <div className="flex items-center">
            <Bell className="text-green-600 mr-3" size={20} />
            <div>
              <p className="font-semibold text-green-800">New Order Received!</p>
              <p className="text-sm text-green-700">
                Amount: ₹{newOrderNotification.amount} | Status: {newOrderNotification.status}
              </p>
            </div>
          </div>
          <button
            onClick={() => setNewOrderNotification(null)}
            className="text-green-600 hover:text-green-800"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm glow"
          >
            Refresh
          </button>
          <div className="text-sm text-gray-500">
            {orders.length} orders total
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6 soft-gradient glow">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search orders by ID, customer name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden orders-table soft-gradient glow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order._id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.user?.name || 'Unknown Customer'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.user?.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(order.payment?.amount || 0)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.payment?.status)}`}>
                      {order.payment?.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.payment?.transactionId || order.payment?.reference || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openOrderDetails(order)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && !loading && (
          <div className="text-center py-12 text-gray-500">
            <Package size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No orders found</p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Order #{selectedOrder._id}
                  </h2>
                  <p className="text-gray-500">
                    Created: {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <button
                  onClick={closeOrderDetails}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {(selectedOrder && selectedOrder.payment?.status === 'Success') && (
                <div className="mb-6 border border-green-200 bg-green-50 text-green-800 rounded-lg p-4 flex items-center">
                  <BadgeCheck size={20} className="mr-2" />
                  <div>
                    <div className="font-semibold">Payment Successful</div>
                    <div className="text-sm">
                      {selectedOrder.user?.name} • {formatDate(selectedOrder.createdAt)} • Txn: {selectedOrder.payment?.transactionId || selectedOrder.payment?.reference || 'N/A'}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Customer Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <User size={18} className="mr-2" />
                    Customer Information
                  </h3>
                  <div className="space-y-2">
                    <p className="flex items-center">
                      <User size={16} className="mr-2 text-gray-600" />
                      {selectedOrder.user?.name || 'Unknown Customer'}
                    </p>
                    <p className="flex items-center">
                      <Phone size={16} className="mr-2 text-gray-600" />
                      {selectedOrder.user?.phone || 'No phone'}
                    </p>
                    <p className="flex items-center">
                      <MapPin size={16} className="mr-2 text-gray-600" />
                      {selectedOrder.user?.address ?
                        `${selectedOrder.user.address.houseNo}, ${selectedOrder.user.address.street}, ${selectedOrder.user.address.city}, ${selectedOrder.user.address.state} - ${selectedOrder.user.address.pincode}`
                        : 'No address'}
                    </p>
                  </div>
                </div>

                {/* Order Status */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Order Status</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Order Status
                      </label>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => updateOrderStatus(selectedOrder._id, e.target.value)}
                        disabled={updatingStatus}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Status
                      </label>
                      <select
                        value={selectedOrder.payment?.status}
                        onChange={(e) => updatePaymentStatus(selectedOrder._id, e.target.value, transactionInput)}
                        disabled={updatingStatus}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Success">Success</option>
                        <option value="Failed">Failed</option>
                      </select>
                      {selectedOrder.payment?.status !== 'Success' && (
                        <div className="mt-2">
                          <label className="block text-sm text-gray-600 mb-1">Transaction ID (optional)</label>
                          <input
                            type="text"
                            value={transactionInput}
                            onChange={(e) => setTransactionInput(e.target.value)}
                            placeholder="Enter transaction/reference ID"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Package size={18} className="mr-2" />
                  Order Items
                </h3>
                <div className="space-y-3">
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white rounded border">
                        <div className="flex items-center">
                          <img
                            src={item.image || '/api/placeholder/60/60'}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded mr-3"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjNmNGY1Ii8+PHRleHQgeD0iMzAiIHk9IjMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzk5OSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+';
                            }}
                          />
                          <div>
                            <p className="font-medium">{item.name || 'Unknown Product'}</p>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency((item.price || 0) * (item.quantity || 1))}</p>
                          <p className="text-sm text-gray-500">{formatCurrency(item.price || 0)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <DollarSign size={18} className="mr-2" />
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency((selectedOrder.price || 0) * (selectedOrder.quantity || 1))}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2 mt-2">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedOrder.payment?.amount || 0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    <style jsx>{`
      .orders-table thead {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: #fff;
      }
      .orders-table th { font-weight: 600; letter-spacing: 0.02em; }
      .orders-table tbody tr:hover { background: #f8fafc; }
    `}</style>
    </div>
    </>);
};

export default Orders;
