import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Grid3X3,
  Shirt,
  TrendingUp,
  Users,
  Package,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import { authAPI, CategoriesAPI, ProductsAPI, OrdersAPI } from '../services/api';
import { connectAdminSocket, getSocket } from '../services/socket';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCategories: 0,
    lowStockProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    const s = connectAdminSocket();
    if (s) {
      s.on('payment:notification', (data) => {
        setPaymentAlerts((prev) => [{
          id: data.logId,
          transactionId: data.payment.transactionId,
          status: data.payment.status,
          orderId: data.order.id,
          receivedAt: new Date().toISOString()
        }, ...prev]);
        s.emit('notification:ack', { logId: data.logId });
      });
    }
    return () => {
      const sock = getSocket();
      if (sock) {
        sock.off('payment:notification');
      }
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const categoriesAPI = new CategoriesAPI(authAPI.api);
      const productsAPI = new ProductsAPI(authAPI.api);
      const ordersAPI = new OrdersAPI(authAPI.api);

      const [
        categoriesRes,
        productsRes,
        ordersRes,
        recentOrdersRes
      ] = await Promise.all([
        categoriesAPI.getStats(),
        productsAPI.getStats(),
        ordersAPI.getStats(),
        ordersAPI.getRecent(5)
      ]);

      setStats({
        totalOrders: ordersRes.data.totalOrders || 0,
        pendingOrders: ordersRes.data.pendingOrders || 0,
        totalRevenue: ordersRes.data.totalRevenue || 0,
        totalCategories: categoriesRes.data.count || 0,
        totalProducts: productsRes.data.total || 0,
        lowStockProducts: productsRes.data.lowStock || 0
      });

      setRecentOrders(recentOrdersRes.data || []);
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, trend }) => (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-label">{label}</p>
        {trend && (
          <span className={`stat-trend ${trend > 0 ? 'positive' : 'negative'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="loading">
        <div>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {paymentAlerts.length > 0 && (
        <div className="realtime-banner">
          <div className="banner-title">Real-time Payment Alerts</div>
          <ul className="alerts-list">
            {paymentAlerts.slice(0, 5).map((a) => (
              <li key={a.id} className={`alert-item ${a.status.toLowerCase()}`}>
                <span className="alert-status">{a.status}</span>
                <span className="alert-text">Txn {a.transactionId} for Order {a.orderId}</span>
                <span className="alert-time">{new Date(a.receivedAt).toLocaleTimeString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome to your StyleAura admin dashboard</p>
      </div>

      <div className="stats-grid">
        <StatCard
          icon={ShoppingCart}
          label="Total Orders"
          value={stats.totalOrders}
          color="blue"
          trend={12}
        />
        <StatCard
          icon={Package}
          label="Pending Orders"
          value={stats.pendingOrders}
          color="orange"
        />
        <StatCard
          icon={DollarSign}
          label="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          color="green"
          trend={8}
        />
        <StatCard
          icon={Shirt}
          label="Total Products"
          value={stats.totalProducts}
          color="purple"
          trend={5}
        />
        <StatCard
          icon={Grid3X3}
          label="Categories"
          value={stats.totalCategories}
          color="indigo"
        />
        <StatCard
          icon={AlertTriangle}
          label="Low Stock"
          value={stats.lowStockProducts}
          color="red"
        />
      </div>

      <div className="dashboard-content">
        <div className="recent-orders">
          <h2>Recent Orders</h2>
          {recentOrders.length > 0 ? (
            <div className="orders-list">
              {recentOrders.map((order) => (
                <div key={order._id} className="order-item">
                  <div className="order-info">
                    <h4>{order.user?.name || 'Unknown'}</h4>
                    <p>{order.user?.phone || 'No phone'}</p>
                    <span className={`status ${order.status?.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="order-amount">
                    <p className="amount">₹{order.payment?.amount || 0}</p>
                    <p className="date">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No recent orders</p>
          )}
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn primary">
              <Shirt size={20} />
              <span>Add Product</span>
            </button>
            <button className="action-btn secondary">
              <Grid3X3 size={20} />
              <span>Manage Categories</span>
            </button>
            <button className="action-btn tertiary">
              <ShoppingCart size={20} />
              <span>View Orders</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .realtime-banner {
          background: linear-gradient(135deg, #e0f2fe, #f5f3ff);
          border: 1px solid rgba(190, 230, 253, 0.7);
          color: #0c4a6e;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          box-shadow: 0 8px 24px -10px rgba(99,102,241,0.25);
        }
        .banner-title { font-weight: 600; margin-bottom: 0.5rem; }
        .alerts-list { display: flex; flex-direction: column; gap: 0.25rem; }
        .alert-item { display:flex; align-items:center; gap:0.5rem; }
        .alert-item.success .alert-status { color:#16a34a; }
        .alert-item.failed .alert-status { color:#dc2626; }
        .alert-status { font-weight:600; }
        .alert-text { flex:1; }
        .alert-time { color:#6b7280; font-size:0.75rem; }
      
        .dashboard {
          padding: 2rem 0;
        }

        .dashboard-header {
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .dashboard-header p {
          color: #6b7280;
          font-size: 1.125rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: linear-gradient(135deg, #ffffff, #f8fafc);
          padding: 1.5rem;
          border-radius: 0.75rem;
          box-shadow: 0 12px 30px -12px rgba(99, 102, 241, 0.25);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 40px -16px rgba(99, 102, 241, 0.35);
        }

        .stat-icon {
          padding: 0.75rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.blue {
          background: linear-gradient(135deg, #93c5fd, #6366f1);
          color: #ffffff;
        }

        .stat-icon.orange {
          background: linear-gradient(135deg, #fed7aa, #f59e0b);
          color: #ffffff;
        }

        .stat-icon.green {
          background: linear-gradient(135deg, #bbf7d0, #22c55e);
          color: #ffffff;
        }

        .stat-icon.purple {
          background: linear-gradient(135deg, #e9d5ff, #8b5cf6);
          color: #ffffff;
        }

        .stat-icon.indigo {
          background: linear-gradient(135deg, #c7d2fe, #6366f1);
          color: #ffffff;
        }

        .stat-icon.red {
          background: linear-gradient(135deg, #fecaca, #ef4444);
          color: #ffffff;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .stat-trend {
          font-size: 0.75rem;
          font-weight: 500;
        }

        .stat-trend.positive {
          color: #22c55e;
        }

        .stat-trend.negative {
          color: #ef4444;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .recent-orders {
          background: rgba(255,255,255,0.8);
          padding: 1.5rem;
          border-radius: 0.75rem;
          box-shadow: 0 12px 30px -12px rgba(99, 102, 241, 0.25);
          backdrop-filter: blur(6px);
        }

        .recent-orders h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border: 1px solid rgba(226,232,240,0.7);
          border-radius: 0.5rem;
          transition: background 0.2s ease;
        }
        .order-item:hover {
          background: #f8fafc;
        }

        .order-info h4 {
          font-weight: 500;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .order-info p {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .status {
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .status.pending {
          background: #ffedd5;
          color: #f97316;
        }

        .status.shipped {
          background: #dbeafe;
          color: #3b82f6;
        }

        .status.delivered {
          background: #dcfce7;
          color: #22c55e;
        }

        .order-amount .amount {
          font-weight: 600;
          color: #1f2937;
          text-align: right;
          margin-bottom: 0.25rem;
        }

        .order-amount .date {
          color: #6b7280;
          font-size: 0.75rem;
          text-align: right;
        }

        .quick-actions {
          background: rgba(255,255,255,0.8);
          padding: 1.5rem;
          border-radius: 0.75rem;
          box-shadow: 0 12px 30px -12px rgba(99, 102, 241, 0.25);
          backdrop-filter: blur(6px);
        }

        .quick-actions h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          background: none;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          border-color: transparent;
          box-shadow: 0 10px 24px -10px rgba(99,102,241,0.5);
        }

        .action-btn.primary:hover {
          filter: brightness(1.05);
          transform: translateY(-1px);
        }

        .action-btn.secondary {
          background: linear-gradient(135deg, #fce7f3, #fde68a);
          color: #111827;
        }

        .action-btn.secondary:hover {
          filter: brightness(1.02);
          transform: translateY(-1px);
        }

        .action-btn.tertiary {
          background: rgba(255,255,255,0.9);
          color: #3b82f6;
          border-color: rgba(99,102,241,0.4);
        }

        .action-btn.tertiary:hover {
          background: #eff6ff;
          transform: translateY(-1px);
        }

        @media (max-width: 1024px) {
          .dashboard-content {
            grid-template-columns: 1fr;
          }
          
          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }
        }

        @media (max-width: 640px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
