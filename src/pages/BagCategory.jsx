import { Link } from 'react-router-dom';
import itemFeather from '../assets/item-feather.png';
import itemPink from '../assets/item-pink.png';
import itemFoil from '../assets/item-foil.png';
import itemDisks from '../assets/item-disks.png';
import itemPegs from '../assets/item-pegs.png';
import itemGiraffe from '../assets/item-giraffe.png';
import './Bag.css';

const CATEGORIES = {
  sparks: {
    title: 'Sparks',
    desc: 'Familiar objects that invite stories, wondering, and play.',
    photoTR: itemGiraffe,
    photoBL: itemFeather,
  },
  shapables: {
    title: 'Shapables',
    desc: 'Materials that bend, hold, connect, and transform.',
    photoTR: itemPegs,
    photoBL: itemPink,
  },
  symbols: {
    title: 'Symbols',
    desc: 'Loose parts that stand in for ideas, people, places, and feelings.',
    photoTR: itemFoil,
    photoBL: itemDisks,
  },
};

export default function BagCategory({ slug }) {
  const cat = CATEGORIES[slug];
  if (!cat) return null;
  return (
    <div className="bag-category">
      <div className="card cat-card">
        <img src={cat.photoTR} alt="" className="cat-photo-tr" />
        <h2>{cat.title}</h2>
        <p>{cat.desc}</p>
        <Link to="/bag/contents" className="view-more">view more</Link>
      </div>

      <img src={cat.photoBL} alt="" className="cat-photo-bl" />

      <div className="return-row">
        <Link to="/bag/contents" className="btn btn-ghost">back</Link>
        <Link to="/" className="btn btn-ghost">return to main</Link>
      </div>
    </div>
  );
}
