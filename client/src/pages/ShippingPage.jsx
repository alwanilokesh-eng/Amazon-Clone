import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import FormContainer from '../components/FormContainer.jsx';
import CheckoutSteps from '../components/CheckoutSteps.jsx';

function ShippingPage() {
  const { shippingAddress, setShippingAddress } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const submitHandler = (e) => {
    e.preventDefault();
    setShippingAddress({ address, city, postalCode, country });
    navigate('/payment');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping Address</h1>
      <form onSubmit={submitHandler}>
        <label htmlFor="address">Address</label>
        <input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
        <label htmlFor="city">City</label>
        <input id="city" value={city} onChange={(e) => setCity(e.target.value)} required />
        <label htmlFor="postalCode">Postal Code</label>
        <input
          id="postalCode"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          required
        />
        <label htmlFor="country">Country</label>
        <input id="country" value={country} onChange={(e) => setCountry(e.target.value)} required />
        <button type="submit" className="btn btn-primary">
          Continue
        </button>
      </form>
    </FormContainer>
  );
}

export default ShippingPage;
