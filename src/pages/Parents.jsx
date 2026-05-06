import { Link } from 'react-router-dom';
import { Asterisk, Arc, Burst, Dot } from '../components/Decoration.jsx';
import itemGiraffe from '../assets/item-giraffe.png';
import itemPink from '../assets/item-pink.png';
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
        <Arc color="#0c8ce9" size={130} style={{ position: 'absolute', left: -42, top: -10, opacity: 0.95 }} />
        <h1>A look into your<br />child&rsquo;s inner world.</h1>
        <div className="row-center" style={{ marginTop: 18 }}>
          <Link to="/parents" className="btn btn-primary btn-uppercase">Parents</Link>
          <Link to="/educators" className="btn btn-primary btn-uppercase">Educators</Link>
        </div>
      </div>

      <div className="card advice-card">
        <Burst color="#ff7138" size={56} style={{ position: 'absolute', top: -14, left: 12 }} />
        <Dot color="#ffd338" size={28} style={{ position: 'absolute', top: -2, left: 90 }} />
        <h2>Look, Listen,<br />and Wonder</h2>
        <Link to="/prompts" className="btn btn-primary btn-uppercase" style={{ marginTop: 16 }}>Prompts</Link>
        <Asterisk color="#0dae52" size={42} style={{ position: 'absolute', right: 18, bottom: -16 }} />
        <Arc color="#f5d51c" size={120} style={{ position: 'absolute', right: -50, bottom: -50 }} />
      </div>

      <div className="advice-list">
        <h3>Questions to Consider</h3>
        <ul>
          {QUESTIONS.map((q, i) => (
            <li key={i}><span className="bullet" /><p>{q}</p></li>
          ))}
        </ul>
      </div>

      <div className="banner">For new ideas and creativity</div>

      <div className="advice-list">
        <h3>Ways to Play</h3>
        <ul>
          {WAYS_TO_PLAY.map((w, i) => (
            <li key={i}>
              <span className="bullet" />
              <p><strong className="orange">{w.title}</strong><br />{w.body}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="banner">For confidence and persistence</div>

      <div className="card advice-quote">
        <p className="quote">&ldquo;Will you tell me the story of what you made?&rdquo;</p>
        <img src={itemGiraffe} alt="" className="quote-photo" />
      </div>

      <div className="row-center" style={{ marginTop: 24 }}>
        <Link to="/" className="btn btn-ghost">return to main</Link>
      </div>
    </div>
  );
}
