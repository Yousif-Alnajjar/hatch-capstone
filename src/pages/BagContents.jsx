import { Link } from 'react-router-dom';
import bagHero from '../assets/bag-hero.png';
import itemFeather from '../assets/item-feather.png';
import itemGiraffe from '../assets/item-giraffe.png';
import itemPink from '../assets/item-pink.png';
import itemFoil from '../assets/item-foil.png';
import itemDisks from '../assets/item-disks.png';
import itemPegs from '../assets/item-pegs.png';
import './Bag.css';

// Spread the kit items across the cream card as a tappable "contents key".
const ITEMS = [
  { src: itemFeather, to: '/bag/sparks',    style: { top:   0,  left:  -8,  width: 100, transform: 'rotate(-15deg)' } },
  { src: itemGiraffe, to: '/bag/sparks',    style: { top:   0,  right: 16,  width:  86 } },
  { src: bagHero,     to: '/bag/intro',     style: { top: 130,  left:  16,  width: 240 } },
  { src: itemFoil,    to: '/bag/shapables', style: { top: 270,  left:  90,  width: 150, transform: 'rotate(-30deg)' } },
  { src: itemPink,    to: '/bag/shapables', style: { top: 290,  right: -8,  width: 100 } },
  { src: itemDisks,   to: '/bag/symbols',   style: { top: 410,  left:   0,  width:  90 } },
  { src: itemPegs,    to: '/bag/symbols',   style: { top: 410,  right: 30,  width: 110, transform: 'rotate(40deg)' } },
];

export default function BagContents() {
  return (
    <div className="bag-contents">
      <div className="items-card">
        <div className="items">
          {ITEMS.map((item, i) => (
            <Link key={i} to={item.to} className="item" style={item.style}>
              <img src={item.src} alt="" />
            </Link>
          ))}
        </div>
      </div>

      <h2>if you&rsquo;ve viewed all the items&hellip;</h2>
      <div className="play-cta">
        <Link to="/timer" className="btn btn-orange btn-lg">play now?</Link>
        <Link to="/" className="btn btn-ghost">return to main</Link>
      </div>
    </div>
  );
}
