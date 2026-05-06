import { Link } from 'react-router-dom';
import itemFeather from '../assets/item-feather.png';
import itemGiraffe from '../assets/item-giraffe.png';
import pegsDouble from '../assets/pegs-double.png';
import shapablePink from '../assets/shapable-pink.png';
import foilSticks from '../assets/foil-sticks.png';
import woodDisk from '../assets/wood-disk.png';
import sparksGroup from '../assets/sparks-group.png';
import kitTray from '../assets/kit-tray.png';
import './Bag.css';

const CATEGORIES = {
  sparks: {
    title: 'Sparks',
    desc: 'Familiar objects that invite stories, wondering, and play.',
    photoTL: { src: itemFeather, w: 80,  rotate: -10, top: -50, left: -8 },
    photoTR: { src: itemGiraffe, w: 86,  rotate: 0,   top: -56, right: -10 },
    photoBR: { src: pegsDouble,  w: 130, rotate: 0,   bottom: -52, right: -8 },
  },
  shapables: {
    title: 'Shapables',
    desc: 'Materials that bend, hold, connect, and transform.',
    photoTR: { src: foilSticks,   w: 110, rotate: 25,  top: -48, right: -16 },
    photoBL: { src: shapablePink, w: 130, rotate: 0,   bottom: -32, left: -10 },
  },
  symbols: {
    title: 'Symbols',
    desc: 'Loose parts that stand in for ideas, people, places, and feelings.',
    photoTL: { src: woodDisk,    w: 86,  rotate: 0,  top: -44, left:   2 },
    photoBL: { src: sparksGroup, w: 140, rotate: -15, bottom: -36, left: -16 },
    photoBR: { src: kitTray,     w: 130, rotate: 0,   bottom: -40, right: -10 },
  },
};

function CornerPhoto({ pos, className }) {
  if (!pos) return null;
  const style = {
    width: pos.w,
    transform: pos.rotate ? `rotate(${pos.rotate}deg)` : undefined,
    top: pos.top,
    left: pos.left,
    right: pos.right,
    bottom: pos.bottom,
  };
  return <img src={pos.src} alt="" className={className} style={style} />;
}

export default function BagCategory({ slug }) {
  const cat = CATEGORIES[slug];
  if (!cat) return null;
  return (
    <div className="bag-category">
      <div className="card cat-card">
        <CornerPhoto pos={cat.photoTL} className="cat-photo" />
        <CornerPhoto pos={cat.photoTR} className="cat-photo" />

        <h2 className="cat-title">{cat.title}</h2>
        <p className="cat-desc">{cat.desc}</p>
        <Link to="/bag/contents" className="view-more">view more</Link>

        <CornerPhoto pos={cat.photoBL} className="cat-photo" />
        <CornerPhoto pos={cat.photoBR} className="cat-photo" />
      </div>

      <div className="row cat-footer">
        <Link to="/bag/contents" className="btn btn-ghost">back</Link>
        <Link to="/" className="btn btn-ghost">return to main</Link>
      </div>
    </div>
  );
}
