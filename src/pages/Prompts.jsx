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
      <Link to="/" className="btn btn-ghost prompts-back">back</Link>

      <div className="prompts-banner">
        <h1>Prompts</h1>
        <Burst color="#ffb1a8" size={56} style={{ position: 'absolute', bottom: -22, left: 24 }} />
        <HalfMoon color="#f5e090" size={70} rotate={210} style={{ position: 'absolute', top: -12, left: -28 }} />
        <Dot color="#f5d51c" size={26} style={{ position: 'absolute', top: 8, left: 70 }} />
      </div>

      <div className="card prompt-card">
        <Dot color="#f5d51c" size={26} style={{ position: 'absolute', top: 16, right: 22 }} />
        <p className="prompt-text">{p.text}</p>
        <Asterisk color="#0dae52" size={48} style={{ position: 'absolute', bottom: -22, left: -10 }} />
      </div>

      <p className="prompt-category">{p.category}</p>

      <button onClick={next} className="btn btn-primary btn-uppercase prompt-generate">Generate</button>

      <Burst color="#ffd0b8" size={120} style={{ position: 'absolute', right: -10, bottom: 30, opacity: 0.9 }} />
      <HalfMoon color="#f5e090" size={120} rotate={210} style={{ position: 'absolute', right: -30, bottom: 0, opacity: 0.7 }} />
    </div>
  );
}
