import { Link } from 'react-router-dom';
import { Asterisk, Arc, Burst, Dot } from '../components/Decoration.jsx';
import itemGiraffe from '../assets/item-giraffe.png';
import './Advice.css';

const QUESTIONS = [
  'What am I learning about this child as a person as I observe them at play?',
  'What connections, themes, ideas, concepts are evident in the play?',
  'How can I support the child in their learning as they play? How can I respond to interests, strengths, needs, curiosities?',
];

const WAYS_TO_PLAY = [
  { title: 'Transform Materials', body: 'Re-purposing materials invites creative thinking.' },
  { title: 'Build Small Worlds',  body: 'World-building supports expression and narrative thinking.' },
  { title: 'Combine & Recombine', body: 'Unexpected pairings encourage innovation.' },
  { title: 'Tell Stories (without words)', body: 'Materials allow stories to emerge.' },
];

export default function Parents() {
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
          <h2 className="advice-card-title">Look, Listen,<br />and Wonder</h2>
        </div>
        <div className="advice-block-cta">
          <Link to="/prompts" className="btn btn-primary btn-uppercase">Prompts</Link>
          <div className="advice-cta-deco" aria-hidden>
            <Arc color="#f5d51c" size={100} style={{ position: 'absolute', right: -28, top: -22 }} />
            <Asterisk color="#0dae52" size={28} style={{ position: 'absolute', right: 6, top: 16 }} />
          </div>
        </div>

        <div className="list-group">
          <h3>Questions to Consider</h3>
          <ul className="bullet-list">
            {QUESTIONS.map((q, i) => (
              <li key={i}><span className="bullet" /><p>{q}</p></li>
            ))}
          </ul>
          <span className="list-arrow" aria-hidden>→</span>
        </div>
      </section>

      <div className="banner">For new ideas and creativity</div>

      <section className="advice-block">
        <div className="list-group">
          <h3>Ways to Play</h3>
          <ul className="bullet-list">
            {WAYS_TO_PLAY.map((w, i) => (
              <li key={i}>
                <span className="bullet" />
                <p><strong className="orange">{w.title}</strong><br />{w.body}</p>
              </li>
            ))}
          </ul>
          <span className="list-arrow" aria-hidden>→</span>
          <Asterisk color="#0dae52" size={32} style={{ position: 'absolute', right: 16, top: -4, zIndex: 1, opacity: 0.95 }} />
        </div>
      </section>

      <div className="banner">For confidence and persistence</div>

      <div className="card advice-quote">
        <p className="quote">&ldquo;Will you tell me the story of what you made?&rdquo;</p>
        <img src={itemGiraffe} alt="" className="quote-photo" />
      </div>

      <div className="row advice-footer">
        <Link to="/" className="btn btn-ghost">return to main</Link>
      </div>
    </div>
  );
}
