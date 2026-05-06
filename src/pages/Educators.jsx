import { Link } from 'react-router-dom';
import { Asterisk, Arc, Burst, Dot } from '../components/Decoration.jsx';
import shapablePink from '../assets/shapable-pink.png';
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
        <Arc color="#0c8ce9" size={120} style={{ position: 'absolute', left: -40, top: -10, zIndex: 0 }} />
        <h1>A look into your<br />child&rsquo;s inner world.</h1>
        <div className="row-center hero-buttons">
          <Link to="/parents" className="btn btn-primary btn-uppercase">Parents</Link>
          <Link to="/educators" className="btn btn-primary btn-uppercase">Educators</Link>
        </div>
      </div>

      <section className="advice-block">
        <div className="card advice-card">
          <Burst color="#ff7138" size={42} style={{ position: 'absolute', top: -10, left: 16, zIndex: 1 }} />
          <Dot color="#ffd338" size={22} style={{ position: 'absolute', top: 10, left: 60, zIndex: 1 }} />
          <h2 className="advice-card-title">Setup Tips<br />for an Educator</h2>
        </div>
        <div className="advice-block-cta">
          <Link to="/prompts" className="btn btn-primary btn-uppercase">Prompts</Link>
          <div className="advice-cta-deco" aria-hidden>
            <Arc color="#f5d51c" size={100} style={{ position: 'absolute', right: -28, top: -22 }} />
            <Asterisk color="#0dae52" size={28} style={{ position: 'absolute', right: 6, top: 16 }} />
          </div>
        </div>

        <div className="list-group">
          <h3>Mindset Checks</h3>
          <ul className="bullet-list">
            {MINDSET_CHECKS.map((m, i) => (
              <li key={i}><span className="bullet" /><p>{m}</p></li>
            ))}
          </ul>
          <span className="list-arrow" aria-hidden>→</span>
        </div>
      </section>

      <div className="banner">For problem-solving and cause-and-effect</div>

      <section className="advice-block">
        <div className="list-group">
          <h3>Ways to Play</h3>
          <ul className="bullet-list">
            {WAYS_TO_PLAY.map((w, i) => (
              <li key={i}><span className="bullet" /><p><strong className="orange">{w.title}</strong><br />{w.body}</p></li>
            ))}
          </ul>
          <span className="list-arrow" aria-hidden>→</span>
          <Asterisk color="#ff7138" size={36} style={{ position: 'absolute', right: 16, top: -8, zIndex: 1 }} />
          <Dot color="#f5d51c" size={22} style={{ position: 'absolute', right: 22, top: 60, zIndex: 1 }} />
        </div>
      </section>

      <div className="banner">For story, symbols, and meaning</div>

      <section className="advice-block">
        <div className="list-group">
          <h3>Tips for Parallel Play</h3>
          <ul className="bullet-list">
            {PARALLEL_TIPS.map((t, i) => (
              <li key={i}><span className="bullet" /><p>{t}</p></li>
            ))}
          </ul>
          <Dot color="#bee3e0" size={48} style={{ position: 'absolute', left: -10, bottom: -20, zIndex: 1 }} />
        </div>
      </section>

      <div className="card advice-quote">
        <p className="quote">&ldquo;How did you make that work?&rdquo;</p>
        <img src={shapablePink} alt="" className="quote-photo" />
      </div>

      <div className="row advice-footer">
        <Link to="/" className="btn btn-ghost">return to main</Link>
      </div>
    </div>
  );
}
