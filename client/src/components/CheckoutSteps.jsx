import { Link } from 'react-router-dom';

function CheckoutSteps({ step1, step2, step3, step4 }) {
  const steps = [
    { label: 'Sign In', done: step1, path: '/login' },
    { label: 'Shipping', done: step2, path: '/shipping' },
    { label: 'Payment', done: step3, path: '/payment' },
    { label: 'Place Order', done: step4, path: '/placeorder' },
  ];

  return (
    <nav className="checkout-steps">
      {steps.map((s) => (
        <span key={s.label} className={s.done ? 'step done' : 'step disabled'}>
          {s.done ? <Link to={s.path}>{s.label}</Link> : s.label}
        </span>
      ))}
    </nav>
  );
}

export default CheckoutSteps;
