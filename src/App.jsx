import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';

import Landing from './pages/Landing.jsx';
import BagIntro from './pages/BagIntro.jsx';
import BagContents from './pages/BagContents.jsx';
import BagCategory from './pages/BagCategory.jsx';
import BeforePlay from './pages/BeforePlay.jsx';
import Timer from './pages/Timer.jsx';
import Prompts from './pages/Prompts.jsx';
import Parents from './pages/Parents.jsx';
import Educators from './pages/Educators.jsx';
import GalleryUpload from './pages/GalleryUpload.jsx';
import CommunityGallery from './pages/CommunityGallery.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/bag/intro" element={<BagIntro />} />
        <Route path="/bag/contents" element={<BagContents />} />
        <Route path="/bag/sparks" element={<BagCategory slug="sparks" />} />
        <Route path="/bag/shapables" element={<BagCategory slug="shapables" />} />
        <Route path="/bag/symbols" element={<BagCategory slug="symbols" />} />
        <Route path="/before-play" element={<BeforePlay />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/prompts" element={<Prompts />} />
        <Route path="/parents" element={<Parents />} />
        <Route path="/educators" element={<Educators />} />
        <Route path="/gallery" element={<CommunityGallery />} />
        <Route path="/gallery/upload" element={<GalleryUpload />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </div>
  );
}
