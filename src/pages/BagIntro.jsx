import { Link } from 'react-router-dom';
import { Burst, HalfMoon, Arc, Dot } from '../components/Decoration.jsx';
import bagHero from '../assets/bag-hero.png';
import './Bag.css';

export default function BagIntro() {
  return (
    <div className="bag-intro">
      <div className="card bag-card">
        <HalfMoon color="#bee3e0" size={64} rotate={180}
                  style={{ position: 'absolute', top: -20, left: -18, zIndex: 0 }} />
        <HalfMoon color="#6fcf97" size={36} rotate={180}
                  style={{ position: 'absolute', top: -2, left: 6, zIndex: 1, opacity: 0.95 }} />

        <h1 className="bag-card-title">Shake the bag!</h1>
        <p className="muted-15 text-center bag-card-sub">
          Click on the bag below to learn more about what&rsquo;s inside!
        </p>

        <Link to="/bag/contents" className="bag-photo-link" aria-label="See bag contents">
          <img src={bagHero} alt="Hatch Play Kit bag" className="bag-photo" />
        </Link>

        <Arc color="#f5d51c" size={92}
             style={{ position: 'absolute', right: -28, bottom: 70, zIndex: 0 }} />
        <Dot color="#f5d51c" size={22}
             style={{ position: 'absolute', right: 28, bottom: 14, zIndex: 1 }} />
      </div>

      <div className="bag-intro-deco" aria-hidden>
        <Burst color="#ffb1a8" size={56}
               style={{ position: 'absolute', right: 22, bottom: 96 }} />
        <HalfMoon color="#f5e090" size={120} rotate={210}
                  style={{ position: 'absolute', right: -28, bottom: -18 }} />
      </div>

      <div className="row bag-intro-cta">
        <Link to="/" className="btn btn-ghost">return to main</Link>
      </div>
    </div>
  );
}
