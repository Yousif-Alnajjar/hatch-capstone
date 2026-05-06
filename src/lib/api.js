// Cloudinary unsigned upload + Google Apps Script gallery API.
// All env vars are exposed via Vite's import.meta.env (must be prefixed VITE_).

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const GALLERY_API = import.meta.env.VITE_GALLERY_API;

export function isConfigured() {
  return Boolean(CLOUD_NAME && UPLOAD_PRESET && GALLERY_API);
}

export async function uploadImage(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.');
  }
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: fd,
  });
  if (!res.ok) throw new Error(`Cloudinary upload failed (${res.status})`);
  const json = await res.json();
  return { url: json.secure_url, publicId: json.public_id, width: json.width, height: json.height };
}

export async function submitPost({ imageUrl, description, tags, name }) {
  if (!GALLERY_API) throw new Error('Gallery API not configured. Set VITE_GALLERY_API.');
  // Apps Script Web Apps require text/plain to avoid CORS preflight.
  const res = await fetch(GALLERY_API, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      action: 'submit',
      imageUrl,
      description,
      tags: Array.isArray(tags) ? tags.join(',') : '',
      name: name || '',
    }),
  });
  if (!res.ok) throw new Error(`Submit failed (${res.status})`);
  return res.json();
}

export async function fetchApprovedPosts() {
  if (!GALLERY_API) return [];
  const res = await fetch(`${GALLERY_API}?action=list`);
  if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
  const json = await res.json();
  return json.posts || [];
}
