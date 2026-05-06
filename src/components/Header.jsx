import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="app-header">
      <button className="icon-btn cart-btn" aria-label="Cart">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
          <path d="M2 3h3l2.5 12.5a1.5 1.5 0 0 0 1.5 1.2h9a1.5 1.5 0 0 0 1.5-1.2L21 8H6" />
        </svg>
        <span>0</span>
      </button>
      <Link to="/" className="brand">
        Partners<br />in Play<sup>™</sup>
      </Link>
      <button className="icon-btn" aria-label="Menu">
        <svg width="22" height="14" viewBox="0 0 22 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <line x1="1" y1="2"  x2="21" y2="2" />
          <line x1="1" y1="12" x2="21" y2="12" />
        </svg>
      </button>
    </header>
  );
}
