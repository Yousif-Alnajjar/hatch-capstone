import { Link } from 'react-router-dom';
import { Asterisk, Burst, HalfMoon, Arc, Dot } from '../components/Decoration.jsx';
import bagHero from '../assets/bag-hero.png';
import './Bag.css';

export default function BagIntro() {
  return (
    <div className="page bag-intro">
      <div className="card bag-card">
        <HalfMoon color="#bee3e0" size={70} style={{ position: 'absolute', top: -20, left: -16 }} rotate={180} />
        <HalfMoon color="#0dae52" size={42} rotate={180} style={{ position: 'absolute', top: -2, left: 6, opacity: 0.7 }} />

        <h1 className="text-center">Shake the bag!</h1>
        <p className="muted-15 text-center" style={{ margin: '14px 28px 0' }}>
          Click on the bag below to learn more about what&rsquo;s inside!
        </p>

        <Link to="/bag/contents" className="bag-photo-link" aria-label="See bag contents">
          <img src={bagHero} alt="Hatch Play Kit bag" className="bag-photo" />
        </Link>

        <Arc color="#f5d51c" size={120} style={{ position: 'absolute', right: -30, bottom: 80, opacity: 0.9 }} />
        <Burst color="#ffb1a8" size={70} style={{ position: 'absolute', right: 30, bottom: 30 }} />
        <Dot color="#f5d51c" size={36} style={{ position: 'absolute', right: 40, bottom: -10 }} />
      </div>

      <div className="row-center" style={{ marginTop: 28 }}>
        <Link to="/" className="btn btn-ghost">return to main</Link>
      </div>
    </div>
  );
}
