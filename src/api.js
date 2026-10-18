const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const API_ORIGIN = new URL(API_URL, window.location.origin).origin;
export const COMPANY_EMAIL = import.meta.env.VITE_COMPANY_EMAIL || 'yassinebs987@gmail.com';
export const COMPANY_PHONE = import.meta.env.VITE_COMPANY_PHONE || '+216 95 504 773';
export const COMPANY_WHATSAPP = (import.meta.env.VITE_COMPANY_WHATSAPP || COMPANY_PHONE).replace(/\D/g, '');

export async function api(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData) && options.body) headers.set('Content-Type', 'application/json');
  const token = localStorage.getItem('ftt-admin-token');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new Error('Le serveur est momentanément inaccessible. Réessayez dans un instant.');
  }
  if (response.status === 204) return null;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401 && path !== '/admin/login') localStorage.removeItem('ftt-admin-token');
    throw new Error(payload.error || 'Une erreur est survenue.');
  }
  return payload;
}

export function imageSource(product) {
  if (product.image_url) return new URL(product.image_url, `${API_ORIGIN}/`).toString();
  const photos = {
    'lait-en-poudre': 'lait.jpg',
    'cacao-en-poudre-premium': 'cacao.jpg',
    'amidon-de-mais': 'amidon.jpg',
    'dextrose-en-poudre': 'dextrose.jpg',
    'acide-citrique-en-vrac': 'acide-citrique.jpg',
    'acide-acetique-glacial-alimentaire': 'acide-acetique.jpg',
    'sorbate-de-potassium-alimentaire': 'sorbate.jpg',
    'phosphate-disodique-anhydre-dsp-alimentaire': 'dsp.jpg',
    'soude-caustique-en-paillettes': 'soude.jpg'
  };
  return `/products/${photos[product.slug] || 'lait.jpg'}`;
}
