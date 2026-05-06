import { Link } from 'react-router-dom';
import { Asterisk, Arc, Burst, Dot } from '../components/Decoration.jsx';
import itemPink from '../assets/item-pink.png';
import './Advice.css';

const MINDSET_CHECKS = [
  'How to play is up to you!',
  'Let kids lead the way and discover the fun on their own',
  'Side-by-side play helps build comfort, confidence, and classroom readiness',
];

const WAYS_TO_PLAY = [
  { title: 'Transform Materials', body: 'Re-purposing materials invites creative thinking.' },
  { title: 'Build Small Worlds',  body: 'World-building supports expression and narrative thinking.' },
  { title: 'Combine & Recombine', body: 'Unexpected pairings encourage innovation.' },
  { title: 'Tell Stories (without words)', body: 'Materials allow stories to emerge.' },
];

const PARALLEL_TIPS = [
  'Make sure there is enough space for everyone to play comfortably',
  'Create a space that is easy to navigate, clean up, and promotes sharing with boundaries',
  'Avoid forcing conversation, sharing, or group play',
  'Avoid rushing sharing or turn-taking',
  'Let observation and imitation happen naturally',
  'Revisit the kits often so play can deepen over time',
];

export default function Educators() {
  return (
    <div className="page advice-page">
      <Link to="/" className="btn btn-ghost advice-back">back</Link>

      <div className="advice-hero">
        <Arc color="#0c8ce9" size={130} style={{ position: 'absolute', left: -42, top: -10, opacity: 0.95 }} />
        <h1>A look into your<br />child&rsquo;s inner world.</h1>
        <div className="row-center" style={{ marginTop: 18 }}>
          <Link to="/parents" className="btn btn-primary btn-uppercase">Parents</Link>
          <Link to="/educators" className="btn btn-primary btn-uppercase">Educators</Link>
        </div>
      </div>

      <div className="card advice-card">
        <Burst color="#ff7138" size={56} style={{ position: 'absolute', top: -14, left: 12 }} />
        <h2>Setup Tips<br />for an Educator</h2>
        <Link to="/prompts" className="btn btn-primary btn-uppercase" style={{ marginTop: 16 }}>Prompts</Link>
        <Asterisk color="#0dae52" size={42} style={{ position: 'absolute', right: 18, bottom: -16 }} />
        <Arc color="#f5d51c" size={120} style={{ position: 'absolute', right: -50, bottom: -50 }} />
      </div>

      <div className="advice-list">
        <h3>Mindset Checks</h3>
        <ul>
          {MINDSET_CHECKS.map((m, i) => (
            <li key={i}><span className="bullet" /><p>{m}</p></li>
          ))}
        </ul>
      </div>
      <div className="banner">For problem-solving and cause-and-effect</div>

      <div className="advice-list">
        <h3>Ways to Play</h3>
        <ul>
          {WAYS_TO_PLAY.map((w, i) => (
            <li key={i}><span className="bullet" /><p><strong className="orange">{w.title}</strong><br />{w.body}</p></li>
          ))}
        </ul>
      </div>
      <div className="banner">For story, symbols, and meaning</div>

      <div className="advice-list">
        <h3>Tips for Parallel Play</h3>
        <ul>
          {PARALLEL_TIPS.map((t, i) => (
            <li key={i}><span className="bullet" /><p>{t}</p></li>
          ))}
        </ul>
      </div>

      <div className="card advice-quote">
        <p className="quote">&ldquo;How did you make that work?&rdquo;</p>
        <img src={itemPink} alt="" className="quote-photo" />
      </div>

      <div className="row-center" style={{ marginTop: 24 }}>
        <Link to="/" className="btn btn-ghost">return to main</Link>
      </div>
    </div>
  );
}
