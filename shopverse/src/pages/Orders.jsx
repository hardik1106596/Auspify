import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, PackageCheck, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import AccountLayout from '../components/AccountLayout.jsx';
import { apiRequest } from '../api.js';
import { useAuth } from '../auth/AuthContext.jsx';

const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);

function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export default function Orders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const data = await apiRequest('/orders/my-orders', { token });
      setOrders(data.orders);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return (
    <AccountLayout
      eyebrow="YOUR ACCOUNT"
      title="Your orders."
      description="Everything you’ve ordered, all in one place."
    >
      <div className="account-nav">
        <Link to="/profile"><span>◉</span> Profile <ArrowRight size={15} /></Link>
        <Link className="account-nav-active" to="/orders"><PackageCheck size={16} /> Orders</Link>
      </div>

      {loading ? (
        <div className="account-panel orders-loading"><span className="account-spinner" /> Loading your orders...</div>
      ) : error ? (
        <section className="account-panel account-state">
          <h2>We couldn’t load your orders.</h2>
          <p>{error}</p>
          <button className="btn btn-dark" type="button" onClick={loadOrders}>Try again</button>
        </section>
      ) : orders.length === 0 ? (
        <section className="account-panel account-state">
          <span className="empty-account-icon"><ShoppingBag size={25} /></span>
          <h2>No orders just yet</h2>
          <p>Your next everyday favorite is waiting to be discovered.</p>
          <Link className="btn btn-dark" to="/">Explore the shop <ArrowRight size={16} /></Link>
        </section>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article className="account-panel order-card" key={order._id}>
              <div className="order-heading">
                <div>
                  <span className="order-kicker">ORDER PLACED</span>
                  <strong>{formatDate(order.createdAt)}</strong>
                </div>
                <span className="order-status">{(order.status || order.orderStatus || 'Processing').replaceAll('_', ' ')}</span>
              </div>
              <div className="order-items">
                {order.items.map((item, index) => (
                  <div className="order-item" key={`${order._id}-${item.product || index}`}>
                    {item.image ? <img src={item.image} alt="" /> : <span className="order-item-placeholder"><ShoppingBag size={18} /></span>}
                    <div className="order-item-info">
                      <strong>{item.name}</strong>
                      <span>Qty {item.quantity}</span>
                    </div>
                    <strong>{formatPrice(item.price * item.quantity)}</strong>
                  </div>
                ))}
              </div>
              <div className="order-total">
                <span>Total · {order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                <strong>{formatPrice(order.totalAmount)}</strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </AccountLayout>
  );
}
