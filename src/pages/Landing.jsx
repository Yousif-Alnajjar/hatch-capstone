import { Link } from 'react-router-dom';
import { Asterisk, Burst, HalfMoon, Arc, Dot, Stripe } from '../components/Decoration.jsx';
import bagHero from '../assets/bag-hero.png';
import kid1 from '../assets/kid-1.jpg';
import kid2 from '../assets/kid-2.jpg';
import sparksGroup from '../assets/sparks-group.png';
import './Landing.css';

export default function Landing() {
  return (
    <div className="landing">
      {/* HERO — Hatch Play Kits */}
      <section className="card hero">
        <div className="hero-deco-tl" aria-hidden>
          <HalfMoon color="#bee3e0" size={56} rotate={180} />
          <HalfMoon color="#6fcf97" size={36} rotate={180} style={{ position: 'absolute', top: 14, left: 6, opacity: 0.95 }} />
        </div>
        <div className="hero-deco-tr" aria-hidden>
          <Arc color="#0c8ce9" size={110} />
          <HalfMoon color="#6fcf97" size={48} rotate={-30} style={{ position: 'absolute', top: 28, left: 22 }} />
        </div>

        <h1 className="hero-title"><span className="dot-y" />Hatch Play Kits</h1>
        <p className="muted-15 text-center hero-sub">A guide for parents and educators, feel free to take a look with your kids or alone.</p>

        <div className="hero-image-wrap">
          <img src={bagHero} alt="Hatch Play Kit" className="hero-bag" />
        </div>

        <div className="hero-cta-wrap">
          <Link to="/bag/intro" className="btn btn-primary btn-uppercase btn-cta">Learn what&rsquo;s inside!</Link>
        </div>
      </section>

      {/* TIMED PLAY */}
      <section className="card timed">
        <h2 className="timed-title">Timed Play</h2>
        <p className="muted-15 timed-copy">For the adults! Get familiar with the kit yourself, or skip straight to our advice.</p>
        <Link to="/before-play" className="btn btn-primary btn-uppercase timed-cta">Start</Link>
        <img src={sparksGroup} alt="" className="deco timed-deco" />
      </section>

      {/* RECOMMENDATIONS */}
      <section className="card recs">
        <Asterisk color="#0dae52" size={28} style={{ position: 'absolute', top: -6, left: 24, zIndex: 1 }} />
        <h2 className="recs-title">Recommendations</h2>
        <div className="row-center recs-buttons">
          <Link to="/parents" className="btn btn-primary btn-uppercase">Parents</Link>
          <Link to="/educators" className="btn btn-primary btn-uppercase">Educators</Link>
        </div>
      </section>

      {/* FEELING STUCK */}
      <section className="card stuck">
        <h2>Feeling Stuck?</h2>
        <p className="muted-15 stuck-copy">We have put together some prompts to help you get started with your children!</p>
        <Link to="/prompts" className="btn btn-primary btn-uppercase btn-prompts">Prompts</Link>
        <Arc color="#f5d51c" size={130} style={{ position: 'absolute', right: -36, bottom: -28, zIndex: 1 }} />
        <Asterisk color="#0dae52" size={38} style={{ position: 'absolute', right: 30, bottom: 22, zIndex: 1 }} />
      </section>

      {/* COMMUNITY */}
      <section className="community">
        <Asterisk color="#0dae52" size={28} style={{ position: 'absolute', top: 4, right: 24, zIndex: 1 }} />
        <h2 className="community-title">Share photos or<br />browse from<br />the community</h2>

        <Burst color="#ffb1a8" size={56} style={{ position: 'absolute', top: 188, left: -14, transform: 'rotate(20deg)', zIndex: 1 }} />

        <div className="community-photos">
          <Link to="/gallery" className="community-photo c-photo-1">
            <img src={kid2} alt="Community photo" />
          </Link>
          <Link to="/gallery" className="community-photo c-photo-2">
            <img src={kid1} alt="Community photo" />
          </Link>
        </div>

        <div className="community-cta">
          <Link to="/gallery/upload" className="btn btn-primary btn-lg btn-uppercase">Add to gallery</Link>
        </div>
      </section>
    </div>
  );
}
