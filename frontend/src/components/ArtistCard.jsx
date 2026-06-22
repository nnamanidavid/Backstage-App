import { Link } from 'react-router-dom';

export default function ArtistCard({ artist }) {
  return (
    <div className="artist-card">
      <img src={artist.image_url || '/placeholder-artist.png'} alt={artist.name} />
      <h3>{artist.name}</h3>
      <p className="genre">{artist.genre} • {artist.city}</p>
      <p className="bio">{artist.bio}</p>
      {artist.preview_track_url && (
        <audio controls src={artist.preview_track_url}>
          Your browser does not support audio playback.
        </audio>
      )}
      <Link to={`/artists/${artist.id}`}>View profile</Link>
    </div>
  );
}
