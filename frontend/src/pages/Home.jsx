import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import ArtistCard from '../components/ArtistCard';

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/artists/featured/current')
      .then((res) => setFeatured(res.data))
      .catch((err) => console.log('failed to load featured artist', err));
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <h1>Indie Nigerian sound, in your hands every month.</h1>
        <p>
          A vinyl or cassette from an up-and-coming artist, plus exclusive merch,
          delivered monthly. Discover your next favorite act before anyone else does.
        </p>
        <Link to="/plans" className="cta-button">Start your subscription</Link>
      </section>

      <section className="featured">
        <h2>This month's artist</h2>
        <div className="artist-grid">
          {featured.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>
    </div>
  );
}
