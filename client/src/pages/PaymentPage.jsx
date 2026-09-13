import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import FormContainer from '../components/FormContainer.jsx';
import CheckoutSteps from '../components/CheckoutSteps.jsx';

function PaymentPage() {
  const { paymentMethod, setPaymentMethod, shippingAddress } = useCart();
  const navigate = useNavigate();
  const [method, setMethod] = useState(paymentMethod);

  if (!shippingAddress.address) {
    navigate('/shipping');
  }

  const submitHandler = (e) => {
    e.preventDefault();
    setPaymentMethod(method);
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <form onSubmit={submitHandler}>
        <fieldset>
          <legend>Select method</legend>
          <label className="radio-option">
            <input
              type="radio"
              name="paymentMethod"
              value="Cash on Delivery"
              checked={method === 'Cash on Delivery'}
              onChange={(e) => setMethod(e.target.value)}
            />
            Cash on Delivery
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="paymentMethod"
              value="Credit Card (Demo)"
              checked={method === 'Credit Card (Demo)'}
              onChange={(e) => setMethod(e.target.value)}
            />
            Credit Card (Demo — no real charge)
          </label>
          <label className="radio-option">
            <input
              type="radio"
              name="paymentMethod"
              value="PayPal (Demo)"
              checked={method === 'PayPal (Demo)'}
              onChange={(e) => setMethod(e.target.value)}
            />
            PayPal (Demo — no real charge)
          </label>
        </fieldset>
        <button type="submit" className="btn btn-primary">
          Continue
        </button>
      </form>
    </FormContainer>
  );
}

export default PaymentPage;
