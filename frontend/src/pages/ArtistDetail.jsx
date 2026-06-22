import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';

export default function ArtistDetail() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);

  useEffect(() => {
    api.get(`/artists/${id}`)
      .then((res) => setArtist(res.data))
      .catch((err) => console.log('failed to load artist', err));
  }, [id]);

  if (!artist) return <p>Loading...</p>;

  return (
    <div className="artist-detail">
      <img src={artist.image_url || '/placeholder-artist.png'} alt={artist.name} />
      <h1>{artist.name}</h1>
      <p className="genre">{artist.genre} • {artist.city}</p>
      <p>{artist.bio}</p>

      {artist.preview_track_url && (
        <div className="preview-player">
          <h3>Preview track</h3>
          <audio controls src={artist.preview_track_url} />
        </div>
      )}

      {artist.spotify_url && (
        <a href={artist.spotify_url} target="_blank" rel="noreferrer">Listen on Spotify</a>
      )}

      <h3>This month's merch</h3>
      <div className="merch-grid">
        {artist.merch?.map((item) => (
          <div key={item.id} className="merch-item">
            <img src={item.image_url || '/placeholder-merch.png'} alt={item.name} />
            <p>{item.name}</p>
            <span className="merch-type">{item.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
