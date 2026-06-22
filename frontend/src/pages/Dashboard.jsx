import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    if (!user) return;
    api.get('/subscriptions/me')
      .then((res) => setSubscription(res.data))
      .catch((err) => console.log('failed to load subscription', err));

    api.get('/shipments/me')
      .then((res) => setShipments(res.data))
      .catch((err) => console.log('failed to load shipments', err));
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  async function handlePause() {
    await api.post('/subscriptions/pause');
    setSubscription({ ...subscription, status: 'paused' });
  }

  async function handleCancel() {
    await api.post('/subscriptions/cancel');
    setSubscription(null);
  }

  return (
    <div className="dashboard">
      <h1>Welcome back, {user.full_name}</h1>

      <section className="subscription-status">
        <h2>Your subscription</h2>
        {subscription ? (
          <div>
            <p>Plan: {subscription.plan_name}</p>
            <p>Status: {subscription.status}</p>
            <button onClick={handlePause}>Pause</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <p>You don't have an active subscription.</p>
        )}
      </section>

      <section className="shipment-history">
        <h2>Box history</h2>
        {shipments.length === 0 ? (
          <p>No shipments yet.</p>
        ) : (
          <ul>
            {shipments.map((s) => (
              <li key={s.id}>
                {s.box_month} — {s.artist_name} — {s.status}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
