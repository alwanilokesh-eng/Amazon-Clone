import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios.js';
import Loader from '../components/Loader.jsx';
import Message from '../components/Message.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function OrderPage() {
  const { id } = useParams();
  const { userInfo } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const markAsPaid = async () => {
    setActionLoading(true);
    try {
      await api.put(`/orders/${id}/pay`);
      await fetchOrder();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const markAsDelivered = async () => {
    setActionLoading(true);
    try {
      await api.put(`/orders/${id}/deliver`);
      await fetchOrder();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!order) return null;

  return (
    <div className="place-order-page">
      <h1>Order {order._id}</h1>
      <div className="place-order-layout">
        <div className="order-details">
          <h2>Shipping</h2>
          <p>
            {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
          {order.isDelivered ? (
            <Message variant="success">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</Message>
          ) : (
            <Message variant="info">Not Delivered</Message>
          )}

          <h2>Payment Method</h2>
          <p>{order.paymentMethod}</p>
          {order.isPaid ? (
            <Message variant="success">Paid on {new Date(order.paidAt).toLocaleDateString()}</Message>
          ) : (
            <Message variant="info">Not Paid</Message>
          )}

          <h2>Order Items</h2>
          <ul className="order-item-list">
            {order.orderItems.map((item) => (
              <li key={item.product}>
                <img src={item.image} alt={item.name} />
                <Link to={`/product/${item.product}`}>{item.name}</Link>
                <span>
                  {item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Items</span>
            <span>${order.itemsPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>${order.shippingPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <span>${order.taxPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${order.totalPrice.toFixed(2)}</span>
          </div>

          {!order.isPaid && (
            <button type="button" className="btn btn-primary" disabled={actionLoading} onClick={markAsPaid}>
              Mark As Paid
            </button>
          )}
          {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
            <button
              type="button"
              className="btn btn-primary"
              disabled={actionLoading}
              onClick={markAsDelivered}
            >
              Mark As Delivered
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderPage;
