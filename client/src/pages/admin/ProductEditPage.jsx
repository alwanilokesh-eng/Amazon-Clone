import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios.js';
import FormContainer from '../../components/FormContainer.jsx';
import Loader from '../../components/Loader.jsx';
import Message from '../../components/Message.jsx';

function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImage(data.image);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await api.put(`/products/${id}`, {
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      });
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormContainer>
      <Link to="/admin/products" className="back-link">
        ← Back to products
      </Link>
      <h1>Edit Product</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading ? (
        <Loader />
      ) : (
        <form onSubmit={submitHandler}>
          <label htmlFor="name">Name</label>
          <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />

          <label htmlFor="price">Price</label>
          <input
            id="price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />

          <label htmlFor="image">Image</label>
          <input id="image" value={image} onChange={(e) => setImage(e.target.value)} required />
          <input type="file" accept="image/*" onChange={uploadFileHandler} />
          {uploading && <Loader />}
          {image && <img src={image} alt="preview" className="image-preview" />}

          <label htmlFor="brand">Brand</label>
          <input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} required />

          <label htmlFor="category">Category</label>
          <input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />

          <label htmlFor="countInStock">Count In Stock</label>
          <input
            id="countInStock"
            type="number"
            value={countInStock}
            onChange={(e) => setCountInStock(Number(e.target.value))}
            required
          />

          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <button type="submit" className="btn btn-primary" disabled={saving}>
            Update
          </button>
        </form>
      )}
    </FormContainer>
  );
}

export default ProductEditPage;
