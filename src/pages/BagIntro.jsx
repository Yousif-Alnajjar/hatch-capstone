import { Link } from 'react-router-dom';
import { Burst, HalfMoon, Arc, Dot } from '../components/Decoration.jsx';
import bagHero from '../assets/bag-hero.png';
import './Bag.css';

export default function BagIntro() {
  return (
    <div className="page bag-intro">
      <div className="card bag-card">
        <HalfMoon color="#bee3e0" size={70} rotate={180} style={{ position: 'absolute', top: -22, left: -20, zIndex: 0 }} />
        <HalfMoon color="#6fcf97" size={42} rotate={180} style={{ position: 'absolute', top: -2, left: 4, zIndex: 1, opacity: 0.95 }} />

        <h1 className="bag-card-title text-center">Shake the bag!</h1>
        <p className="muted-15 text-center bag-card-sub">
          Click on the bag below to learn more about what&rsquo;s inside!
        </p>

        <Link to="/bag/contents" className="bag-photo-link" aria-label="See bag contents">
          <img src={bagHero} alt="Hatch Play Kit bag" className="bag-photo" />
        </Link>

        <Arc color="#f5d51c" size={120} style={{ position: 'absolute', right: -38, bottom: 70, zIndex: 0 }} />
        <Dot color="#f5d51c" size={26} style={{ position: 'absolute', right: 28, bottom: 12, zIndex: 1 }} />
      </div>

      <Burst color="#ffb1a8" size={70} style={{ position: 'absolute', right: 18, bottom: 80, zIndex: 0 }} />
      <HalfMoon color="#f5e090" size={130} rotate={210} style={{ position: 'absolute', right: -20, bottom: 0, zIndex: 0 }} />

      <div className="row-center bag-intro-cta">
        <Link to="/" className="btn btn-ghost">return to main</Link>
      </div>
    </div>
  );
}
