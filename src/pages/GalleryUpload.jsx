import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TAGS } from '../lib/tags.js';
import { uploadImage, submitPost, isConfigured } from '../lib/api.js';
import { Asterisk, Burst, HalfMoon } from '../components/Decoration.jsx';
import './GalleryUpload.css';

export default function GalleryUpload() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const fileInput = useRef(null);
  const navigate = useNavigate();

  const onPick = () => fileInput.current?.click();

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const toggleTag = (t) => {
    setSelectedTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!file) { setError('Please pick a photo first.'); return; }
    if (!description.trim()) { setError('Please add a description.'); return; }
    if (!isConfigured()) {
      setError('Backend not configured yet. See README to set up Cloudinary + Apps Script.');
      return;
    }
    setSubmitting(true);
    try {
      const { url } = await uploadImage(file);
      await submitPost({ imageUrl: url, description: description.trim(), tags: selectedTags, name: name.trim() });
      setSubmitted(true);
      setTimeout(() => navigate('/gallery'), 1500);
    } catch (err) {
      setError(err.message || 'Submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="page upload-page">
        <div className="card" style={{ textAlign: 'center', padding: 36 }}>
          <h2>Thanks!</h2>
          <p className="muted-15" style={{ marginTop: 12 }}>
            Your post is queued for review. It will appear in the community gallery once approved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page upload-page">
      <Burst color="#ff7138" size={50} style={{ position: 'absolute', top: 40, left: -10, opacity: 0.7 }} />
      <Asterisk color="#0dae52" size={36} style={{ position: 'absolute', top: 90, left: 18, opacity: 0.9 }} />
      <HalfMoon color="#f5e090" size={70} rotate={210} style={{ position: 'absolute', top: 30, left: -28, opacity: 0.7 }} />

      <div className="card upload-banner">
        <h1>Document your work!</h1>
        <p className="muted-15 text-center" style={{ marginTop: 8 }}>
          Add to your own personal gallery.<br />Upload a photo below and add a description.
        </p>
      </div>

      <div className="upload-bg">
        <button type="button" onClick={onPick} className="upload-box">
          {previewUrl ? (
            <img src={previewUrl} alt="Selected" />
          ) : (
            <div className="upload-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>Click to upload a photo</span>
            </div>
          )}
        </button>
        <input ref={fileInput} type="file" accept="image/*" onChange={onFile} hidden />

        <textarea
          className="field"
          placeholder="Add a description ..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <p className="text-center label-md" style={{ marginTop: 22 }}>Select Tags</p>
      <div className="row-center upload-tags">
        {TAGS.map((t) => (
          <button
            key={t}
            type="button"
            className={`tag tag-${t} is-toggle ${selectedTags.includes(t) ? 'is-on' : ''}`}
            onClick={() => toggleTag(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="upload-name">
        <label htmlFor="up-name" className="label-md">Your name (optional)</label>
        <input
          id="up-name"
          className="field upload-name-field"
          type="text"
          placeholder="e.g. Avan (age 3)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {error && <p className="upload-error">{error}</p>}
      {!isConfigured() && (
        <p className="upload-hint">
          Backend not yet configured — see the README for the 5-minute setup
          (Cloudinary unsigned upload preset + Google Apps Script).
        </p>
      )}

      <div className="upload-actions">
        <button type="button" onClick={onSubmit} disabled={submitting} className="btn btn-primary btn-lg upload-post">
          {submitting ? 'Posting…' : 'Post'}
        </button>
      </div>

      <div className="row-center" style={{ marginTop: 16 }}>
        <Link to="/gallery" className="btn btn-ghost">back</Link>
      </div>
    </div>
  );
}
