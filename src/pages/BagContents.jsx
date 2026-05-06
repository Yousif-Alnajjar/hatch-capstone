import { Link } from 'react-router-dom';
import bagHero from '../assets/bag-hero.png';
import itemFeather from '../assets/item-feather.png';
import itemGiraffe from '../assets/item-giraffe.png';
import pegsDouble from '../assets/pegs-double.png';
import shapablePink from '../assets/shapable-pink.png';
import foilSticks from '../assets/foil-sticks.png';
import woodDisk from '../assets/wood-disk.png';
import kitTray from '../assets/kit-tray.png';
import './Bag.css';

// Items spread inside the cream card. Positions are percentages so the layout
// scales with the card width. Each item links to its category page.
const ITEMS = [
  { src: itemFeather,  to: '/bag/sparks',    style: { top:  '2%', left:  '0%', width: '24%', transform: 'rotate(-10deg)' } },
  { src: itemGiraffe,  to: '/bag/sparks',    style: { top:  '2%', left: '38%', width: '22%' } },
  { src: pegsDouble,   to: '/bag/sparks',    style: { top:  '4%', right:  '0%', width: '24%' } },
  { src: bagHero,      to: '/bag/intro',     style: { top: '32%', left: '12%', width: '70%' } },
  { src: foilSticks,   to: '/bag/shapables', style: { top: '60%', left:  '4%', width: '36%', transform: 'rotate(-22deg)' } },
  { src: shapablePink, to: '/bag/shapables', style: { top: '64%', right: '4%', width: '34%' } },
  { src: woodDisk,     to: '/bag/symbols',   style: { bottom: '2%', left: '14%', width: '28%' } },
  { src: kitTray,      to: '/bag/symbols',   style: { bottom: '2%', right: '4%', width: '32%' } },
];

export default function BagContents() {
  return (
    <div className="bag-contents">
      <div className="items-card">
        <div className="items">
          {ITEMS.map((item, i) => (
            <Link key={i} to={item.to} className="item" style={item.style} aria-label={`Item ${i + 1}`}>
              <img src={item.src} alt="" />
            </Link>
          ))}
        </div>
      </div>

      <h2 className="bag-contents-cta-title">if you&rsquo;ve viewed all the items&hellip;</h2>
      <div className="play-cta">
        <Link to="/timer" className="btn btn-orange btn-lg">play now?</Link>
        <Link to="/" className="btn btn-ghost">return to main</Link>
      </div>
    </div>
  );
}
