import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PROMPTS } from '../lib/prompts.js';
import { Asterisk, Burst, HalfMoon, Dot } from '../components/Decoration.jsx';
import './Prompts.css';

export default function Prompts() {
  const [i, setI] = useState(0);
  const next = () => setI((n) => (n + 1) % PROMPTS.length);
  const p = PROMPTS[i];

  return (
    <div className="page prompts-page">
      <div className="prompts-top">
        <Link to="/" className="btn btn-ghost">back</Link>
      </div>

      <div className="prompts-banner-wrap">
        <HalfMoon color="#f5e090" size={120} rotate={210} style={{ position: 'absolute', top: -16, left: -38, zIndex: 0 }} />
        <Dot color="#f5d51c" size={26} style={{ position: 'absolute', top: 8, left: 80, zIndex: 1 }} />
        <Burst color="#ffd0b8" size={56} style={{ position: 'absolute', bottom: -30, left: 80, zIndex: 0 }} />
        <div className="prompts-banner">
          <h1>Prompts</h1>
        </div>
      </div>

      <div className="card prompt-card">
        <Dot color="#f5d51c" size={22} style={{ position: 'absolute', top: 22, right: 26, zIndex: 2 }} />
        <p className="prompt-text">{p.text}</p>
      </div>
      <Asterisk color="#0dae52" size={42} style={{ position: 'absolute', left: 8, top: 410, zIndex: 2 }} />

      <p className="prompt-category">{p.category}</p>

      <div className="prompt-cta-wrap">
        <button onClick={next} className="btn btn-primary btn-uppercase prompt-generate">Generate</button>
      </div>

      <div className="prompts-deco-br" aria-hidden>
        <HalfMoon color="#f5e090" size={130} rotate={210} style={{ position: 'absolute', right: -30, bottom: -10 }} />
        <Burst color="#ffd0b8" size={80} style={{ position: 'absolute', right: 24, bottom: 60 }} />
      </div>
    </div>
  );
}
