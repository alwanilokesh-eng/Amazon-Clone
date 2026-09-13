import { Link } from 'react-router-dom';
import Rating from './Rating.jsx';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`}>
        <img src={product.image} alt={product.name} className="product-card-img" />
      </Link>
      <div className="product-card-body">
        <Link to={`/product/${product._id}`} className="product-card-title">
          {product.name}
        </Link>
        <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        <div className="product-card-price">${product.price.toFixed(2)}</div>
      </div>
    </div>
  );
}

export default ProductCard;
