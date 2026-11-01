const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const API_ORIGIN = new URL(API_URL, window.location.origin).origin;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.replace(/\/+$/, '');
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const PUBLIC_PRODUCT_FIELDS = 'id,name,slug,format,description,safety_note,image_url,is_available,created_at,category_name,category_slug';
export const COMPANY_EMAIL = import.meta.env.VITE_COMPANY_EMAIL || 'Foodtransferttunisia@outlook.fr';
export const COMPANY_PHONE = import.meta.env.VITE_COMPANY_PHONE || '+216 22 066 284';
export const COMPANY_WHATSAPP = (import.meta.env.VITE_COMPANY_WHATSAPP || '21622066284').replace(/\D/g, '');
export const COMPANY_ADDRESS = 'Cité El Hadab, Kalaa Kebira, Sousse 4060';

async function supabaseGet(table, parameters) {
  const query = new URLSearchParams(parameters);
  let response;
  try {
    response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY
      }
    });
  } catch {
    throw new Error('Impossible de joindre Supabase pour charger le catalogue.');
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || 'Impossible de charger le catalogue depuis Supabase.');
  }
  return payload;
}

async function readPublicCatalogue(path, options) {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY || (options.method || 'GET').toUpperCase() !== 'GET') return undefined;

  const requestUrl = new URL(path, window.location.origin);
  const pathname = requestUrl.pathname.replace(/\/+$/, '') || '/';
  if (pathname !== '/categories' && pathname !== '/products' && !pathname.startsWith('/products/')) return undefined;

  if (pathname === '/categories') {
    return supabaseGet('public_catalogue_categories', { select: 'id,name,slug', order: 'id.asc' });
  }

  const products = await supabaseGet('public_catalogue_products', {
    select: PUBLIC_PRODUCT_FIELDS,
    order: 'created_at.desc,name.asc'
  });

  if (pathname.startsWith('/products/')) {
    const slug = decodeURIComponent(pathname.slice('/products/'.length));
    const product = products.find((item) => item.slug === slug);
    if (!product) throw new Error('Produit introuvable.');
    return product;
  }

  const category = requestUrl.searchParams.get('category');
  const search = (requestUrl.searchParams.get('search') || '').trim().toLocaleLowerCase();
  return products.filter((product) => {
    const matchesCategory = !category || product.category_slug === category;
    const matchesSearch = !search || product.name.toLocaleLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  });
}

export async function api(path, options = {}) {
  const catalogueData = await readPublicCatalogue(path, options);
  if (catalogueData !== undefined) return catalogueData;

  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData) && options.body) headers.set('Content-Type', 'application/json');
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: 'include' });
  } catch {
    throw new Error('Le serveur est momentanément inaccessible. Réessayez dans un instant.');
  }
  if (response.status === 204) return null;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
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
