import { useEffect, useState } from 'react';
import api from '../api/client';
import ArtistCard from '../components/ArtistCard';

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/artists')
      .then((res) => setArtists(res.data))
      .catch((err) => console.log('failed to load artists', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading artists...</p>;

  return (
    <div className="artists-page">
      <h1>All artists</h1>
      <div className="artist-grid">
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    </div>
  );
}
