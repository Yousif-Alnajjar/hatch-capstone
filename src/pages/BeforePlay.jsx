import { Link } from 'react-router-dom';
import { HalfMoon, Stripe, Dot } from '../components/Decoration.jsx';
import kitTray from '../assets/kit-tray.png';
import './BeforePlay.css';

export default function BeforePlay() {
  return (
    <div className="page before-play">
      <div className="card intro-card">
        <h1>Before you play,</h1>
        <p className="muted-15 intro-copy">
          Parents and educators, take a moment to play with the Kit yourselves.
          Use the timer, and explore some learning recommendations.
        </p>
        <div className="intro-deco" aria-hidden>
          <HalfMoon color="#ff7138" size={56} rotate={180} style={{ position: 'absolute', top: 110, left: -16 }} />
          <Stripe color="#ffd0b8" width={120} height={18} rotate={-25} style={{ position: 'absolute', top: 138, left: -22 }} />
        </div>
        <Dot color="#f5d51c" size={24} style={{ position: 'absolute', right: 30, bottom: 18, zIndex: 2 }} />
      </div>

      <div className="timer-card">
        <Link to="/timer" className="btn btn-primary timer-start" aria-label="Start timer">START</Link>
        <div className="timer-photo">
          <img src={kitTray} alt="" />
          <span className="timer-label">Timer for 2:00</span>
        </div>
      </div>

      <div className="card read-more-card">
        <h2>Or read more&hellip;</h2>
        <p className="muted-15 read-more-copy">
          The timer will ring automatically, you can always come back for a reset.
        </p>
        <div className="row-center read-more-buttons">
          <Link to="/parents" className="btn btn-primary btn-uppercase">Parents</Link>
          <Link to="/educators" className="btn btn-primary btn-uppercase">Educators</Link>
        </div>
      </div>

      <div className="row before-play-footer">
        <Link to="/" className="btn btn-ghost">return to main</Link>
      </div>
    </div>
  );
}
