import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchApprovedPosts, isConfigured } from '../lib/api.js';
import { TAGS } from '../lib/tags.js';
import { Asterisk, HalfMoon } from '../components/Decoration.jsx';
import kid1 from '../assets/kid-1.png';
import kid2 from '../assets/kid-2.png';
import './CommunityGallery.css';

const FALLBACK_POSTS = [
  { imageUrl: kid2, description: 'Avan (age 3) created a star fish aquarium.', tags: 'Storytelling,Creative' },
  { imageUrl: kid1, description: 'Eva (age 4) created a seesaw for her mom.',  tags: 'Storytelling,Engineering' },
];

export default function CommunityGallery() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [index, setIndex] = useState(0);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      if (!isConfigured()) {
        if (live) { setPosts(FALLBACK_POSTS); setUsingFallback(true); setLoading(false); }
        return;
      }
      try {
        const fetched = await fetchApprovedPosts();
        if (!live) return;
        if (fetched.length === 0) { setPosts(FALLBACK_POSTS); setUsingFallback(true); }
        else setPosts(fetched);
      } catch {
        if (live) { setPosts(FALLBACK_POSTS); setUsingFallback(true); }
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => { live = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter((p) => {
      const tags = (p.tags || '').toString().toLowerCase();
      const desc = (p.description || '').toString().toLowerCase();
      return tags.includes(q) || desc.includes(q);
    });
  }, [posts, search]);

  useEffect(() => { setIndex(0); }, [search, posts]);

  const post = filtered[index];

  const next = () => setIndex((i) => (i + 1) % Math.max(filtered.length, 1));
  const prev = () => setIndex((i) => (i - 1 + filtered.length) % Math.max(filtered.length, 1));

  return (
    <div className="page gallery-page">
      <h1 className="gallery-title">Community Gallery</h1>
      <p className="text-center muted-15 gallery-sub">See creations others have made!</p>

      <input
        className="field-search gallery-search"
        type="search"
        placeholder="search for a tag…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="gallery-stage">
        <button onClick={prev} className="nav-arrow nav-prev" aria-label="Previous">‹</button>
        <button onClick={next} className="nav-arrow nav-next" aria-label="Next">›</button>

        {loading ? (
          <div className="stage-empty">Loading…</div>
        ) : !post ? (
          <div className="stage-empty">No posts match.</div>
        ) : (
          <img src={post.imageUrl} alt={post.description || ''} className="stage-photo" />
        )}
        <Asterisk color="#0dae52" size={36} style={{ position: 'absolute', top: -12, left: 6 }} />
        <HalfMoon color="#ff7138" size={70} rotate={170} style={{ position: 'absolute', bottom: -20, right: -10 }} />
      </div>

      <div className="dots">
        {filtered.map((_, i) => (
          <span key={i} className={`dot ${i === index ? 'active' : ''}`} />
        ))}
      </div>

      {post && (
        <div className="caption-card">
          <p>{post.description}</p>
          {post.tags && (
            <div className="row" style={{ gap: 6, marginTop: 8 }}>
              {post.tags.toString().split(',').filter(Boolean).map((t) => {
                const trimmed = t.trim();
                const known = TAGS.includes(trimmed);
                return <span key={trimmed} className={known ? `tag tag-${trimmed}` : 'tag'} style={!known ? { background: '#999' } : undefined}>{trimmed}</span>;
              })}
            </div>
          )}
        </div>
      )}

      <div className="row-center gallery-cta">
        <Link to="/gallery/upload" className="btn btn-primary btn-lg add-btn">
          <span className="add-plus">+</span> Add to the Gallery!
        </Link>
        <Link to="/" className="btn btn-ghost">return to main</Link>
      </div>

      {usingFallback && (
        <p className="gallery-hint">Showing sample posts (backend not yet configured — see README).</p>
      )}
    </div>
  );
}
