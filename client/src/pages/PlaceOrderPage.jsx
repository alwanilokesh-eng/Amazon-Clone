import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import api from '../api/axios.js';
import CheckoutSteps from '../components/CheckoutSteps.jsx';
import Message from '../components/Message.jsx';

function PlaceOrderPage() {
  const { cartItems, shippingAddress, paymentMethod, clearCart } = useCart();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

  const placeOrderHandler = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
      });
      clearCart();
      navigate(`/order/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="place-order-page">
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="place-order-layout">
        <div className="order-details">
          <h2>Shipping</h2>
          <p>
            {shippingAddress.address}, {shippingAddress.city} {shippingAddress.postalCode},{' '}
            {shippingAddress.country}
          </p>

          <h2>Payment Method</h2>
          <p>{paymentMethod}</p>

          <h2>Order Items</h2>
          {cartItems.length === 0 ? (
            <Message variant="info">Your cart is empty</Message>
          ) : (
            <ul className="order-item-list">
              {cartItems.map((item) => (
                <li key={item.product}>
                  <img src={item.image} alt={item.name} />
                  <Link to={`/product/${item.product}`}>{item.name}</Link>
                  <span>
                    {item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Items</span>
            <span>${itemsPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>${shippingPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <span>${taxPrice.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
          {error && <Message variant="danger">{error}</Message>}
          <button
            type="button"
            className="btn btn-primary"
            disabled={cartItems.length === 0 || loading}
            onClick={placeOrderHandler}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrderPage;
