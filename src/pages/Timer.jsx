import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { HalfMoon, Asterisk, Arc, Stripe } from '../components/Decoration.jsx';
import kitTray from '../assets/kit-tray.png';
import './Timer.css';

const DURATION = 120; // 2:00

function format(s) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

export default function Timer() {
  const [seconds, setSeconds] = useState(DURATION);
  const [done, setDone] = useState(false);
  const intRef = useRef();

  useEffect(() => {
    intRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(intRef.current);
          setDone(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intRef.current);
  }, []);

  return (
    <div className="timer-page">
      <div className="timer-top">
        <Link to="/before-play" className="btn btn-ghost">back</Link>
      </div>

      <div className="timer-display">
        <img src={kitTray} alt="Play kit items" />
        <span className="timer-time">{format(seconds)}</span>
      </div>

      {!done ? (
        <h2 className="focus-text">Take a moment to focus here.</h2>
      ) : (
        <div className="card read-more-inline">
          <h2>Or read more&hellip;</h2>
          <p className="muted-15" style={{ marginTop: 8 }}>The timer rang. You can always come back for a reset.</p>
          <div className="row-center" style={{ marginTop: 18 }}>
            <Link to="/parents" className="btn btn-primary btn-uppercase">Parents</Link>
            <Link to="/educators" className="btn btn-primary btn-uppercase">Educators</Link>
          </div>
        </div>
      )}

      <Arc color="#f5d51c" size={140} style={{ position: 'absolute', right: -30, top: 320, opacity: 0.85 }} />
      <Asterisk color="#0dae52" size={42} style={{ position: 'absolute', right: 40, top: 380 }} />
      <HalfMoon color="#ff7138" size={70} rotate={170} style={{ position: 'absolute', bottom: 80, left: -10 }} />
      <Stripe color="#ffd0b8" width={130} height={18} rotate={-22} style={{ position: 'absolute', bottom: 150, left: 0 }} />
    </div>
  );
}
