import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import SearchBox from './SearchBox.jsx';

function Header() {
  const { userInfo, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const logoutHandler = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="site-header">
      <div className="header-top">
        <Link to="/" className="logo">
          amazon<span className="logo-clone">clone</span>
        </Link>
        <SearchBox />
        <nav className="header-nav">
          {userInfo ? (
            <div className="dropdown">
              <button className="nav-link" type="button">
                Hello, {userInfo.name.split(' ')[0]} ▾
              </button>
              <div className="dropdown-menu">
                <Link to="/profile">Your Profile</Link>
                {userInfo.isAdmin && (
                  <>
                    <Link to="/admin/products">Products</Link>
                    <Link to="/admin/orders">Orders</Link>
                    <Link to="/admin/users">Users</Link>
                  </>
                )}
                <button type="button" onClick={logoutHandler}>
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="nav-link">
              Sign In
            </Link>
          )}
          <Link to="/cart" className="nav-link cart-link">
            🛒 Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
