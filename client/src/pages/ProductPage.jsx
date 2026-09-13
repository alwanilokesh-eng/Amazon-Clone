import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios.js';
import Rating from '../components/Rating.jsx';
import Loader from '../components/Loader.jsx';
import Message from '../components/Message.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { userInfo } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    addToCart({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      qty,
    });
    navigate('/cart');
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSubmitting(true);
    try {
      await api.post(`/products/${id}/reviews`, { rating, comment });
      setRating(0);
      setComment('');
      await fetchProduct();
    } catch (err) {
      setReviewError(err.response?.data?.message || err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!product) return null;

  return (
    <div className="product-page">
      <Link to="/" className="back-link">
        ← Back to results
      </Link>
      <div className="product-detail">
        <img src={product.image} alt={product.name} className="product-detail-img" />

        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <Rating value={product.rating} text={`${product.numReviews} reviews`} />
          <p className="product-brand">Brand: {product.brand}</p>
          <p>{product.description}</p>
        </div>

        <div className="product-buybox">
          <div className="buybox-row">
            <span>Price:</span>
            <strong>${product.price.toFixed(2)}</strong>
          </div>
          <div className="buybox-row">
            <span>Status:</span>
            <strong>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</strong>
          </div>

          {product.countInStock > 0 && (
            <div className="buybox-row">
              <span>Qty:</span>
              <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            className="btn btn-primary"
            disabled={product.countInStock === 0}
            onClick={addToCartHandler}
          >
            Add to Cart
          </button>
        </div>
      </div>

      <div className="product-reviews">
        <h2>Reviews</h2>
        {product.reviews.length === 0 && <Message variant="info">No reviews yet.</Message>}
        <ul className="review-list">
          {product.reviews.map((review) => (
            <li key={review._id}>
              <strong>{review.name}</strong>
              <Rating value={review.rating} />
              <p>{new Date(review.createdAt).toLocaleDateString()}</p>
              <p>{review.comment}</p>
            </li>
          ))}
        </ul>

        <div className="review-form">
          <h3>Write a Customer Review</h3>
          {reviewError && <Message variant="danger">{reviewError}</Message>}
          {userInfo ? (
            <form onSubmit={submitReview}>
              <label htmlFor="rating">Rating</label>
              <select
                id="rating"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                required
              >
                <option value={0}>Select...</option>
                <option value={1}>1 - Poor</option>
                <option value={2}>2 - Fair</option>
                <option value={3}>3 - Good</option>
                <option value={4}>4 - Very Good</option>
                <option value={5}>5 - Excellent</option>
              </select>
              <label htmlFor="comment">Comment</label>
              <textarea
                id="comment"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary" disabled={reviewSubmitting}>
                Submit
              </button>
            </form>
          ) : (
            <Message variant="info">
              Please <Link to="/login">sign in</Link> to write a review.
            </Message>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
