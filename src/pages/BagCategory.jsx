import { Link } from 'react-router-dom';
import { Asterisk } from '../components/Decoration.jsx';
import itemFeather from '../assets/item-feather.png';
import itemGiraffe from '../assets/item-giraffe.png';
import itemPink from '../assets/item-pink.png';
import itemFoil from '../assets/item-foil.png';
import itemDisks from '../assets/item-disks.png';
import kitTray from '../assets/kit-tray.png';
import itemPegs from '../assets/item-pegs.png';
import sparksGroup from '../assets/sparks-group.png';
import './Bag.css';

const CATEGORIES = {
  sparks: {
    title: 'Sparks',
    desc: 'Familiar objects that invite stories, wondering, and play.',
    photoTL: itemFeather,
    photoTR: itemGiraffe,
    photoBR: kitTray,
  },
  shapables: {
    title: 'Shapables',
    desc: 'Materials that bend, hold, connect, and transform.',
    photoTL: itemFoil,
    photoTR: itemPegs,
    photoBR: itemPink,
  },
  symbols: {
    title: 'Symbols',
    desc: 'Loose parts that stand in for ideas, people, places, and feelings.',
    photoTL: itemDisks,
    photoTR: sparksGroup,
    photoBR: kitTray,
  },
};

export default function BagCategory({ slug }) {
  const cat = CATEGORIES[slug];
  if (!cat) return null;
  return (
    <div className="bag-category">
      <div className="card cat-card">
        <img src={cat.photoTL} alt="" className="cat-photo-tl" />
        <img src={cat.photoTR} alt="" className="cat-photo-tr" />

        <h2>{cat.title}</h2>
        <p>{cat.desc}</p>

        <Link to="/bag/contents" className="view-more">view more</Link>

        <img src={cat.photoBR} alt="" className="cat-photo-br" />
      </div>

      <div className="row-center" style={{ marginTop: 60 }}>
        <Link to="/bag/contents" className="btn btn-ghost">back</Link>
        <Link to="/" className="btn btn-ghost">return to main</Link>
      </div>
    </div>
  );
}
