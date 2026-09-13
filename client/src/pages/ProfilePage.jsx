import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';
import Message from '../components/Message.jsx';
import Loader from '../components/Loader.jsx';

function ProfilePage() {
  const { userInfo, updateProfile } = useAuth();
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  useEffect(() => {
    api
      .get('/orders/mine')
      .then((res) => setOrders(res.data))
      .catch((err) => setOrdersError(err.response?.data?.message || err.message))
      .finally(() => setOrdersLoading(false));
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await updateProfile({ name, email, password: password || undefined });
      setMessage('Profile updated');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-form">
        <h1>User Profile</h1>
        {message && <Message variant="success">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        <form onSubmit={submitHandler}>
          <label htmlFor="name">Name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">New Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
          />
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Update
          </button>
        </form>
      </div>

      <div className="profile-orders">
        <h2>My Orders</h2>
        {ordersLoading ? (
          <Loader />
        ) : ordersError ? (
          <Message variant="danger">{ordersError}</Message>
        ) : orders.length === 0 ? (
          <Message variant="info">No orders yet.</Message>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Delivered</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                  <td>{order.isPaid ? new Date(order.paidAt).toLocaleDateString() : '✗'}</td>
                  <td>{order.isDelivered ? new Date(order.deliveredAt).toLocaleDateString() : '✗'}</td>
                  <td>
                    <Link to={`/order/${order._id}`} className="btn btn-secondary">
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
