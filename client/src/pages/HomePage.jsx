import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';
import Message from '../components/Message.jsx';
import Paginate from '../components/Paginate.jsx';

function HomePage() {
  const { keyword } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const pageNumber = searchParams.get('pageNumber') || 1;

  const [data, setData] = useState({ products: [], page: 1, pages: 1, count: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/products/categories').then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = { pageNumber };
        if (keyword) params.keyword = keyword;
        if (category) params.category = category;
        const { data } = await api.get('/products', { params });
        setData(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, category, pageNumber]);

  const selectCategory = (cat) => {
    const params = new URLSearchParams(searchParams);
    if (cat) {
      params.set('category', cat);
    } else {
      params.delete('category');
    }
    params.delete('pageNumber');
    setSearchParams(params);
  };

  return (
    <div className="home-page">
      <aside className="category-sidebar">
        <h3>Categories</h3>
        <ul>
          <li>
            <button
              type="button"
              className={!category ? 'active' : ''}
              onClick={() => selectCategory('')}
            >
              All
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat}>
              <button
                type="button"
                className={category === cat ? 'active' : ''}
                onClick={() => selectCategory(cat)}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="home-content">
        <h1>{keyword ? `Search results for "${keyword}"` : 'Featured Products'}</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : data.products.length === 0 ? (
          <Message variant="info">No products found.</Message>
        ) : (
          <>
            <div className="product-grid">
              {data.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <Paginate
              pages={data.pages}
              page={data.page}
              keyword={keyword}
              category={category}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;
