import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import Message from '../components/Message.jsx';

function CartPage() {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <Message variant="info">
          Your cart is empty. <Link to="/">Go shopping</Link>
        </Message>
      ) : (
        <div className="cart-layout">
          <ul className="cart-items">
            {cartItems.map((item) => (
              <li key={item.product} className="cart-item">
                <img src={item.image} alt={item.name} />
                <Link to={`/product/${item.product}`} className="cart-item-name">
                  {item.name}
                </Link>
                <span className="cart-item-price">${item.price.toFixed(2)}</span>
                <select
                  value={item.qty}
                  onChange={(e) => addToCart({ ...item, qty: Number(e.target.value) })}
                >
                  {[...Array(Math.min(item.countInStock, 10)).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => removeFromCart(item.product)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <h2>
              Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items): $
              {itemsPrice.toFixed(2)}
            </h2>
            <button
              type="button"
              className="btn btn-primary"
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
