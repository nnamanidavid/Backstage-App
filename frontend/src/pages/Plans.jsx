import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/subscriptions/plans')
      .then((res) => setPlans(res.data))
      .catch((err) => console.log('failed to load plans', err));
  }, []);

  function handleSelect(planId) {
    if (!user) {
      navigate('/signup');
      return;
    }
    // payment flow TODO - founders haven't wired up stripe elements on frontend yet
    console.log('selected plan', planId);
  }

  return (
    <div className="plans-page">
      <h1>Choose your plan</h1>
      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.id} className="plan-card">
            <h2>{plan.name}</h2>
            <p className="price">₦{plan.price_naira?.toLocaleString()}/{plan.billing_interval}</p>
            <p>{plan.description}</p>
            <button onClick={() => handleSelect(plan.id)}>Subscribe</button>
          </div>
        ))}
      </div>
    </div>
  );
}
