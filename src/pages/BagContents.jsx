import { Link } from 'react-router-dom';
import bagHero from '../assets/bag-hero.png';
import itemFeather from '../assets/item-feather.png';
import itemGiraffe from '../assets/item-giraffe.png';
import itemPink from '../assets/item-pink.png';
import itemFoil from '../assets/item-foil.png';
import itemDisks from '../assets/item-disks.png';
import kitTray from '../assets/kit-tray.png';
import './Bag.css';

// Spread the kit items across the screen as a "contents key" — like the Figma frame.
const ITEMS = [
  { src: itemFeather,  to: '/bag/sparks',     style: { top:   0, left:  -8, width: 110, transform: 'rotate(-10deg)' } },
  { src: itemGiraffe,  to: '/bag/sparks',     style: { top:   0, right:  20, width:  90 } },
  { src: bagHero,      to: '/bag/intro',      style: { top: 130, left:  20, width: 260 } },
  { src: itemPink,     to: '/bag/shapables',  style: { top: 300, right: -10, width: 110 } },
  { src: itemFoil,     to: '/bag/shapables',  style: { top: 280, left:  90, width: 180, transform: 'rotate(-25deg)' } },
  { src: itemDisks,    to: '/bag/symbols',    style: { top: 410, left:  -8, width:  90 } },
  { src: kitTray,      to: '/bag/symbols',    style: { top: 410, left:  90, width: 110 } },
];

export default function BagContents() {
  return (
    <div className="bag-contents">
      <div className="items">
        {ITEMS.map((item, i) => (
          <Link key={i} to={item.to} className="item" style={item.style}>
            <img src={item.src} alt="" />
          </Link>
        ))}
      </div>

      <h2>if you&rsquo;ve viewed all the items&hellip;</h2>
      <div className="play-cta">
        <Link to="/timer" className="btn btn-orange btn-lg">play now?</Link>
        <Link to="/" className="btn btn-ghost">return to main</Link>
      </div>
    </div>
  );
}
