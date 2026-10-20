import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, CircleAlert, FlaskConical, MessageCircle, PackageCheck, Search, ShieldCheck, Wheat } from 'lucide-react';
import { api, COMPANY_EMAIL, COMPANY_PHONE, COMPANY_WHATSAPP, imageSource } from './api';
import { ProductCard } from './components/ProductCard';

function Loading({ label = 'Chargement…' }) { return <div className="state-message" role="status"><span className="spinner" />{label}</div>; }
function ErrorMessage({ error }) { return <div className="error-message"><CircleAlert size={18} />{error}</div>; }

const HERO_SLIDES = [
  { src: '/hero/lait-en-poudre.jpg', alt: 'Lait en poudre et verre de lait', caption: 'Lait en poudre' },
  { src: '/hero/sucre.jpg', alt: 'Sucre en poudre avec des citrons', caption: 'Sucre' },
  { src: '/hero/paprika.jpg', alt: 'Paprika en poudre avec des poivrons rouges', caption: 'Paprika' },
  { src: '/hero/amidon-de-mais.jpg', alt: 'Amidon de maïs avec un épi de maïs', caption: 'Amidon de maïs' }
];

export function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const intervalId = window.setInterval(() => {
      setHeroSlideIndex((index) => (index + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => window.clearInterval(intervalId);
  }, []);
  useEffect(() => {
    let active = true;
    Promise.all([api('/products'), api('/categories')])
      .then(([p, c]) => { if (active) { setProducts(p); setCategories(c); } })
      .catch((e) => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const query = searchTerm.trim().toLocaleLowerCase();
  const visibleProducts = products.filter((product) => {
    const inCategory = !activeCategory || product.category_slug === activeCategory;
    const searchable = `${product.name} ${product.description} ${product.format} ${product.category_name}`.toLocaleLowerCase();
    return inCategory && (!query || searchable.includes(query));
  });
  const categoryVisuals = [
    { icon: Wheat, note: 'Ingrédients à découvrir pour la cuisine et la pâtisserie.' },
    { icon: FlaskConical, note: 'Acides et ingrédients pour différents usages.' },
    { icon: PackageCheck, note: 'Produits spécifiques, à utiliser selon les précautions indiquées.' }
  ];
  return <>
    <Link className="home-promo-banner" to="/catalogue" aria-label="Découvrir les produits dans le catalogue Food Transfert Tunisia">
      <img src="/hero/food-transfert-banner-fhd.jpg" alt="Food Transfert Tunisia : ingrédients alimentaires, livraison partout en Tunisie et découverte des produits." />
    </Link>
    <section className="hero home-hero">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-line" /> FOOD TRANSFERT TUNISIA · BIENVENUE</div>
        <h1>Les bons produits pour vos recettes et vos <em>envies.</em></h1>
        <p>Découvrez nos ingrédients pour la cuisine et la pâtisserie. Consultez les formats, puis contactez-nous pour connaître les prix ou poser une question.</p>
        <div className="hero-actions"><Link className="button button-primary" to="/catalogue">Explorer tout le catalogue <ArrowUpRight size={17} /></Link></div>
      </div>
      <div className="hero-visual home-hero-visual" role="region" aria-roledescription="carrousel" aria-label="Photos de nos ingrédients">
        <img key={HERO_SLIDES[heroSlideIndex].src} src={HERO_SLIDES[heroSlideIndex].src} alt={HERO_SLIDES[heroSlideIndex].alt} />
        <div className="hero-image-caption">
          <span>{HERO_SLIDES[heroSlideIndex].caption}</span>
          <div className="hero-slide-indicators" aria-label="Choisir une photo">
            {HERO_SLIDES.map((slide, index) => <button key={slide.src} type="button" aria-label={`Afficher la photo : ${slide.caption}`} aria-pressed={heroSlideIndex === index} onClick={() => setHeroSlideIndex(index)} />)}
          </div>
        </div>
        <div className="hero-stamp"><span>FOOD</span><b>FT</b><span>EN TUNISIE</span></div>
      </div>
    </section>
    <section className="home-catalog section-shell" aria-labelledby="store-title">
      <div className="store-heading">
        <div className="store-heading-copy">
          <span className="eyebrow">FOOD TRANSFERT TUNISIA · CATALOGUE</span>
          <h2 id="store-title">Tout pour vos recettes,<br /><em>à portée de main.</em></h2>
          <p>Parcourez nos produits, comparez les formats et contactez-nous pour les prix et disponibilités.</p>
        </div>
      </div>
      <div className="store-filter-panel">
        <div className="store-controls">
          <label className="store-search"><Search size={20} /><input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Rechercher un produit, un format…" aria-label="Rechercher un produit" /></label>
          <span className="store-count">{loading ? 'Chargement du catalogue…' : `${visibleProducts.length} produit${visibleProducts.length === 1 ? '' : 's'}`}</span>
        </div>
        <div className="store-categories" role="group" aria-label="Filtrer par catégorie">
          <button type="button" aria-pressed={!activeCategory} className={!activeCategory ? 'store-category active' : 'store-category'} onClick={() => setActiveCategory('')}>Tout voir</button>
          {categories.map((category) => <button type="button" key={category.id} aria-pressed={activeCategory === category.slug} className={activeCategory === category.slug ? 'store-category active' : 'store-category'} onClick={() => setActiveCategory(category.slug)}>{category.name}</button>)}
        </div>
      </div>
      {activeCategory && <div className="store-results-heading"><h2>{categories.find((item) => item.slug === activeCategory)?.name}</h2></div>}
      {error ? <ErrorMessage error={error} /> : loading ? <Loading label="Chargement du catalogue…" /> : visibleProducts.length ? <div className="product-grid home-product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><PackageCheck size={28} /><h2>Aucun produit trouvé</h2><p>Essayez un autre nom ou une autre catégorie.</p><button className="text-link" onClick={() => { setSearchTerm(''); setActiveCategory(''); }}>Effacer les filtres <ArrowRight size={16} /></button></div>}
    </section>
    <section className="category-section section-shell" id="gammes">
      <div className="section-heading"><div><span className="eyebrow">NOS PRODUITS</span><h2>Pour la cuisine,<br /><em>la pâtisserie et plus.</em></h2></div><p>Parcourez les catégories, découvrez les formats et trouvez les produits qu’il vous faut.</p></div>
      <div className="category-grid">
        {categories.map((category, index) => {
          const Visual = categoryVisuals[index]?.icon || PackageCheck;
          return <Link to={`/catalogue?category=${category.slug}`} className={`category-card category-${index + 1}`} key={category.id}>
            <div className="category-symbol"><Visual size={26} strokeWidth={1.5} /></div><span className="category-number">0{index + 1}</span>
            <h3>{category.name}</h3><p>{categoryVisuals[index]?.note || 'Une offre adaptée à vos besoins'}</p><span className="category-link">Découvrir <ArrowUpRight size={16} /></span>
          </Link>;
        })}
      </div>
    </section>
    <section className="how-section" id="distribution">
      <div className="section-shell">
        <div className="section-heading"><div><span className="eyebrow">C’EST SIMPLE</span><h2>Trouvez ce qu’il vous faut,<br /><em>en quelques étapes.</em></h2></div><p>Parcourez le catalogue, vérifiez les informations du produit et contactez-nous pour connaître son prix ou sa disponibilité.</p></div>
        <div className="steps-grid">
          <article className="step-card"><span className="step-icon"><Search size={23} /></span><span className="step-number">01 / PARCOURIR</span><h3>Découvrez les produits</h3><p>Explorez les catégories et trouvez les ingrédients qui vous intéressent.</p></article>
          <article className="step-card"><span className="step-icon"><PackageCheck size={23} /></span><span className="step-number">02 / CHOISIR</span><h3>Consultez les formats</h3><p>Regardez les détails et les formats disponibles pour chaque produit.</p></article>
          <article className="step-card"><span className="step-icon"><MessageCircle size={23} /></span><span className="step-number">03 / NOUS ÉCRIRE</span><h3>Demandez le prix</h3><p>Écrivez-nous pour connaître le prix, la disponibilité ou les précautions d’usage.</p></article>
        </div>
      </div>
    </section>
    <section className="quote-band"><div className="quote-band-inner"><div><span className="eyebrow">UNE QUESTION ?</span><h2>Nous sommes là<br /><em>pour vous répondre.</em></h2></div><div className="quote-band-actions"><Link className="button button-light" to="/contact">Nous contacter <ArrowUpRight size={17} /></Link><a className="button button-whatsapp" href={`https://wa.me/${COMPANY_WHATSAPP}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp</a></div></div></section>
  </>;
}

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  useEffect(() => { api('/categories').then(setCategories).catch((e) => setError(e.message)); }, []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    const query = new URLSearchParams();
    if (category) query.set('category', category);
    if (search) query.set('search', search);
    api(`/products?${query}`).then((items) => { if (active) setProducts(items); }).catch((e) => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [category, search]);
  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    setSearchParams(next);
  };
  return <section className="catalog-page section-shell">
    <div className="page-intro"><span className="eyebrow">FOOD TRANSFERT TUNISIA / PRODUITS</span><h1>Le catalogue <em>en détail.</em></h1><p>Des ingrédients à découvrir pour la cuisine, la pâtisserie et d’autres usages indiqués.</p></div>
    <div className="catalog-toolbar">
      <div className="catalog-search-group">
        <span className="catalog-control-label">RECHERCHER UN PRODUIT</span>
        <label className="search-field"><Search size={19} /><input type="search" value={search} onChange={(event) => updateParam('search', event.target.value)} placeholder="Nom du produit…" aria-label="Rechercher un produit" /></label>
      </div>
      <div className="catalog-category-group">
        <span className="catalog-control-label">CATÉGORIES</span>
        <div className="filter-pills" role="group" aria-label="Filtrer par catégorie">
          <button type="button" className={!category ? 'filter-pill active' : 'filter-pill'} aria-pressed={!category} onClick={() => updateParam('category', '')}>Tout voir</button>
          {categories.map((item) => <button type="button" key={item.id} className={category === item.slug ? 'filter-pill active' : 'filter-pill'} aria-pressed={category === item.slug} onClick={() => updateParam('category', item.slug)}>{item.name}</button>)}
        </div>
      </div>
    </div>
    <div className="catalog-count">{loading ? 'Recherche en cours…' : `${products.length} produit${products.length === 1 ? '' : 's'} disponible${products.length === 1 ? '' : 's'}`}</div>
    {error ? <ErrorMessage error={error} /> : loading ? <Loading label="Chargement du catalogue…" /> : products.length ? <div className="product-grid catalog-grid">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <div className="empty-state"><PackageCheck size={28} /><h2>Aucun produit trouvé</h2><p>Essayez un autre nom ou une autre catégorie.</p><button className="text-link" onClick={() => setSearchParams({})}>Effacer les filtres <ArrowRight size={16} /></button></div>}
  </section>;
}

export function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { setProduct(null); setError(''); api(`/products/${slug}`).then(setProduct).catch((e) => setError(e.message)); }, [slug]);
  if (error) return <section className="section-shell product-error"><ErrorMessage error={error} /><Link className="text-link" to="/catalogue"><ArrowLeft size={16} /> Retour au catalogue</Link></section>;
  if (!product) return <Loading label="Chargement du produit…" />;
  return <section className="product-detail section-shell">
    <div className="breadcrumb"><Link to="/catalogue">Catalogue</Link><span>/</span><span>{product.category_name}</span></div>
    <div className="detail-layout"><div className="detail-image"><img src={imageSource(product)} alt={product.name} /><span className="detail-image-note">FOOD TRANSFERT / SÉLECTION</span></div>
      <div className="detail-copy"><span className="eyebrow">{product.category_name}</span><h1>{product.name}</h1><div className="format-line"><PackageCheck size={18} /> Format disponible <b>{product.format}</b></div><p className="detail-description">{product.description}</p>
        {product.safety_note && <div className="safety-note"><ShieldCheck size={20} /><div><b>Consignes de sécurité</b><p>{product.safety_note}</p></div></div>}
        <Link className="button button-primary" to={`/contact?product=${product.id}`}>Demander le prix <ArrowUpRight size={17} /></Link><p className="detail-footnote">Écrivez-nous pour connaître le prix et la disponibilité.</p>
      </div></div>
    <Link className="text-link back-link" to="/catalogue"><ArrowLeft size={16} /> Tous les produits</Link>
  </section>;
}

export function ContactPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState(searchParams.get('product') || '');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  useEffect(() => { api('/products').then((items) => { setProducts(items); if (searchParams.get('product')) setProductId(searchParams.get('product')); }).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, [searchParams]);
  async function submit(event) {
    event.preventDefault();
    setError(''); setSending(true);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const body = Object.fromEntries(form.entries());
    body.productId = productId ? Number(productId) : null;
    const selectedProduct = products.find((product) => String(product.id) === String(productId));
    const whatsappMessage = [
      'Bonjour, voici ma demande envoyée depuis votre site.',
      `Nom : ${body.name}`,
      `Téléphone : ${body.phone}`,
      `Produit : ${selectedProduct?.name || 'Non précisé'}`,
      `Quantité : ${body.quantity?.trim() || 'Non précisée'}`,
      body.message?.trim() ? `Message : ${body.message.trim()}` : ''
    ].filter(Boolean).join('\n');
    const nextWhatsappUrl = `https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;
    const whatsappWindow = window.open('about:blank', '_blank');
    if (whatsappWindow) whatsappWindow.opener = null;
    try {
      const response = await api('/quotes', { method: 'POST', body: JSON.stringify(body) });
      setEmailSent(Boolean(response.emailSent));
      setWhatsappUrl(nextWhatsappUrl);
      setSuccess(true);
      if (whatsappWindow) whatsappWindow.location.href = nextWhatsappUrl;
      formElement.reset(); setProductId('');
    } catch (e) {
      whatsappWindow?.close();
      setError(e.message);
    }
    finally { setSending(false); }
  }
  return <section className="contact-page section-shell">
    <div className="page-intro"><span className="eyebrow">À VOTRE ÉCOUTE</span><h1>Une question ? <em>Écrivez-nous.</em></h1><p>Demandez un prix, vérifiez la disponibilité d’un produit ou posez-nous une question.</p></div>
    <div className="contact-layout"><div className="contact-aside"><div className="aside-label">CONTACT</div><h2>Nous sommes<br />là pour <em>vous.</em></h2><p>Nous répondons à vos questions sur les produits, les formats et leur utilisation.</p><a className="contact-channel" href={`mailto:${COMPANY_EMAIL}`}><span><ArrowUpRight size={15} /></span>{COMPANY_EMAIL}</a><a className="contact-channel" href={`tel:${COMPANY_PHONE.replace(/[^\d+]/g, '')}`}><span><ArrowUpRight size={15} /></span>{COMPANY_PHONE}</a><a className="contact-channel whatsapp-channel" href={`https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent('Bonjour, je souhaite obtenir des informations sur vos produits.')}`} target="_blank" rel="noreferrer"><span><MessageCircle size={15} /></span>Écrire sur WhatsApp</a><div className="aside-rule" /><span className="aside-label">FOOD TRANSFERT TUNISIA</span><p className="aside-small">Des ingrédients et des produits à découvrir pour vos recettes et vos besoins.</p></div>
      <div className="form-panel"><div className="form-title"><div><span className="eyebrow">INFORMATIONS & PRIX</span><h2>Votre demande</h2></div><span className="required-note">* Champs obligatoires</span></div>
        {success ? <div className="success-state"><span className="success-icon"><Check size={28} /></span><h3>Demande bien reçue.</h3><p>{emailSent ? 'Votre demande est enregistrée. Nous vous répondrons au numéro indiqué. Un e-mail de notification a également été envoyé.' : 'Votre demande est enregistrée, mais l’e-mail de notification interne n’a pas été envoyé. WhatsApp s’ouvre avec les détails : appuyez sur Envoyer pour nous écrire.'}</p><a className="button button-whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer"><MessageCircle size={17} /> Ouvrir WhatsApp</a><button className="text-link" onClick={() => setSuccess(false)}>Envoyer une autre demande <ArrowRight size={16} /></button></div> : <form className="quote-form" onSubmit={submit}>
          {error && <ErrorMessage error={error} />}
          <div className="form-row"><label>Nom et prénom *<input name="name" required minLength="2" maxLength="120" autoComplete="name" placeholder="Votre nom" /></label><label>Téléphone *<input name="phone" type="tel" inputMode="tel" required minLength="6" maxLength="40" autoComplete="tel" placeholder="+216 22 066 284" /></label></div>
          <div className="form-row"><label>Produit concerné<select value={productId} onChange={(e) => setProductId(e.target.value)} disabled={loading}><option value="">Sélectionner un produit</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}</select></label><label>Quantité souhaitée (facultatif)<input name="quantity" maxLength="100" placeholder="Ex. 1 sac" /></label></div>
          <label>Votre message<textarea name="message" rows="4" maxLength="2000" placeholder="Votre question ou les détails utiles…" /></label>
          <div className="form-submit-row"><span>Nous vous répondrons au numéro indiqué.</span><button className="button button-primary" disabled={sending}>{sending ? 'Envoi en cours…' : 'Envoyer'} <ArrowUpRight size={17} /></button></div>
        </form>}
      </div></div>
  </section>;
}

export function AdminGate() {
  const [token, setToken] = useState(() => localStorage.getItem('ftt-admin-token'));
  return token
    ? <AdminPage onLogout={() => setToken(null)} />
    : <AdminLogin onAuthenticated={setToken} />;
}

function AdminLogin({ onAuthenticated }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    const form = new FormData(event.currentTarget);
    try {
      const data = await api('/admin/login', { method: 'POST', body: JSON.stringify(Object.fromEntries(form.entries())) });
      localStorage.setItem('ftt-admin-token', data.token);
      onAuthenticated(data.token);
      navigate('/admin', { replace: true });
    }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  return <section className="admin-login section-shell"><div className="admin-login-card"><span className="eyebrow">ESPACE ÉQUIPE</span><h1>Administration <em>Food Transfert.</em></h1><p>Connectez-vous pour gérer les produits et les demandes reçues.</p>{error && <ErrorMessage error={error} />}<form onSubmit={submit}><label>E-mail<input name="email" type="email" required autoComplete="username" /></label><label>Mot de passe<input name="password" type="password" required autoComplete="current-password" /></label><button className="button button-primary" disabled={busy}>{busy ? 'Connexion…' : 'Se connecter'} <ArrowRight size={17} /></button></form></div></section>;
}

function AdminPage({ onLogout }) {
  const [view, setView] = useState('quotes');
  const [quotes, setQuotes] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  async function refresh() {
    setLoading(true); setError('');
    try {
      const [p, c, q] = await Promise.all([api('/admin/products'), api('/categories'), api(`/admin/quotes${status ? `?status=${status}` : ''}`)]);
      setProducts(p); setCategories(c); setQuotes(q);
    } catch (e) { setError(e.message); if (e.message.includes('Session')) { localStorage.removeItem('ftt-admin-token'); onLogout(); navigate('/admin/login', { replace: true }); } }
    finally { setLoading(false); }
  }
  useEffect(() => { refresh(); }, [status]);
  async function changeStatus(id, nextStatus) {
    try { await api(`/admin/quotes/${id}`, { method: 'PATCH', body: JSON.stringify({ status: nextStatus }) }); await refresh(); }
    catch (e) { setError(e.message); }
  }
  async function removeQuote(quote) {
    if (!window.confirm(`Supprimer définitivement la demande de ${quote.name} ?`)) return;
    try { await api(`/admin/quotes/${quote.id}`, { method: 'DELETE' }); await refresh(); }
    catch (e) { setError(e.message); }
  }
  async function removeProduct(product) {
    if (!window.confirm(`Supprimer « ${product.name} » ?`)) return;
    try { await api(`/admin/products/${product.id}`, { method: 'DELETE' }); await refresh(); }
    catch (e) { setError(e.message); }
  }
  async function toggleProduct(product) {
    try { await api(`/admin/products/${product.id}`, { method: 'PUT', body: JSON.stringify({ ...product, is_active: !product.is_active }) }); await refresh(); }
    catch (e) { setError(e.message); }
  }
  function logout() { localStorage.removeItem('ftt-admin-token'); onLogout(); navigate('/admin/login', { replace: true }); }
  return <section className="admin-page section-shell">
    <div className="admin-heading"><div><span className="eyebrow">FOOD TRANSFERT / GESTION</span><h1>Bonjour, <em>équipe.</em></h1></div><button className="button button-outline" onClick={logout}>Déconnexion</button></div>
    <div className="admin-tabs"><button className={view === 'quotes' ? 'admin-tab active' : 'admin-tab'} onClick={() => setView('quotes')}>Demandes reçues <span>{quotes.filter((q) => q.status === 'new').length}</span></button><button className={view === 'products' ? 'admin-tab active' : 'admin-tab'} onClick={() => setView('products')}>Produits <span>{products.length}</span></button></div>
    {error && <ErrorMessage error={error} />}
    {view === 'quotes' ? <div className="admin-content"><div className="admin-toolbar"><div><h2>Demandes reçues</h2><p>Suivi des questions et demandes de prix envoyées depuis le site.</p></div><label className="select-filter">Statut <span><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Tous les statuts</option><option value="new">Nouvelles</option><option value="contacted">Contactées</option><option value="closed">Clôturées</option></select><ChevronDown size={15} /></span></label></div>
      {loading ? <Loading /> : <div className="table-scroll"><table className="admin-table"><thead><tr><th>Demande</th><th>Produit / quantité</th><th>Reçue le</th><th>Statut</th><th>Action</th></tr></thead><tbody>{quotes.map((quote) => <tr key={quote.id}><td><b>{quote.name}</b>{quote.email && <a href={`mailto:${quote.email}`}>{quote.email}</a>}<a href={`tel:${quote.phone.replace(/[^\d+]/g, '')}`}>{quote.phone}</a>{quote.message && <small>{quote.message}</small>}</td><td>{quote.product_name || 'Produit non précisé'}<span>{quote.quantity}</span></td><td>{new Date(quote.created_at).toLocaleDateString('fr-FR')}</td><td><span className={`status-badge ${quote.status}`}>{quote.status === 'new' ? 'Nouvelle' : quote.status === 'contacted' ? 'Contactée' : 'Clôturée'}</span></td><td className="table-actions"><select className="status-select" value={quote.status} onChange={(e) => changeStatus(quote.id, e.target.value)} aria-label={`Changer le statut de la demande ${quote.id}`}><option value="new">Nouvelle</option><option value="contacted">Contactée</option><option value="closed">Clôturée</option></select><button className="danger-action" onClick={() => removeQuote(quote)} aria-label={`Supprimer la demande de ${quote.name}`}>Supprimer</button></td></tr>)}</tbody></table>{!quotes.length && <div className="empty-state"><p>Aucune demande pour ce filtre.</p></div>}</div>}</div>
    : <div className="admin-content"><div className="admin-toolbar"><div><h2>Catalogue produits</h2><p>Gérez les fiches visibles sur le site.</p></div><button className="button button-primary" onClick={() => { setEditing(null); setShowForm(true); }}>Ajouter un produit <ArrowUpRight size={16} /></button></div>
      {loading ? <Loading /> : <div className="table-scroll"><table className="admin-table product-admin-table"><thead><tr><th>Produit</th><th>Catégorie</th><th>Format</th><th>Visibilité</th><th>Actions</th></tr></thead><tbody>{products.map((product) => <tr key={product.id}><td><b>{product.name}</b><span>/{product.slug}</span></td><td>{product.category_name}</td><td>{product.format}</td><td><button className={product.is_active ? 'visibility active' : 'visibility'} onClick={() => toggleProduct(product)}>{product.is_active ? 'En ligne' : 'Masqué'}</button></td><td className="table-actions"><button onClick={() => { setEditing(product); setShowForm(true); }}>Modifier</button><button className="danger-action" onClick={() => removeProduct(product)}>Supprimer</button></td></tr>)}</tbody></table>{!products.length && <div className="empty-state"><p>Aucun produit.</p></div>}</div>}</div>}
    {showForm && <ProductEditor product={editing} categories={categories} onClose={() => setShowForm(false)} onSaved={async () => { setShowForm(false); await refresh(); }} />}
  </section>;
}

function ProductEditor({ product, categories, onClose, onSaved }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(product?.image_url || '');
  const [imagePreview, setImagePreview] = useState(product?.image_url ? imageSource(product) : '');
  const previewObjectUrl = useRef(null);

  useEffect(() => () => {
    if (previewObjectUrl.current) URL.revokeObjectURL(previewObjectUrl.current);
  }, []);

  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError('');
    if (previewObjectUrl.current) URL.revokeObjectURL(previewObjectUrl.current);
    const localPreview = URL.createObjectURL(file);
    previewObjectUrl.current = localPreview;
    setImagePreview(localPreview);
    setUploadingImage(true);
    const body = new FormData(); body.append('image', file);
    try {
      const result = await api('/admin/upload', { method: 'POST', body });
      setImageUrl(result.image_url);
      setImagePreview(imageSource(result));
      URL.revokeObjectURL(localPreview);
      previewObjectUrl.current = null;
    } catch (e) {
      setError(e.message);
      setImagePreview(imageUrl ? imageSource({ image_url: imageUrl }) : '');
      URL.revokeObjectURL(localPreview);
      previewObjectUrl.current = null;
    } finally { setUploadingImage(false); }
  }
  async function submit(event) {
    event.preventDefault();
    if (uploadingImage) return;
    setError(''); setBusy(true);
    const form = new FormData(event.currentTarget);
    const data = Object.fromEntries(form.entries());
    data.slug = data.slug || data.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    data.category_id = Number(data.category_id); data.image_url = imageUrl || null; data.safety_note = data.safety_note || null; data.is_active = form.get('is_active') === 'on';
    try { await api(product ? `/admin/products/${product.id}` : '/admin/products', { method: product ? 'PUT' : 'POST', body: JSON.stringify(data) }); await onSaved(); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  return <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}><div className="editor-modal" role="dialog" aria-modal="true" aria-labelledby="editor-title"><div className="modal-heading"><div><span className="eyebrow">CATALOGUE</span><h2 id="editor-title">{product ? 'Modifier le produit' : 'Nouveau produit'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Fermer">×</button></div>
    {error && <ErrorMessage error={error} />}<form className="editor-form" onSubmit={submit}><div className="form-row"><label>Nom du produit *<input name="name" required defaultValue={product?.name || ''} /></label><label>Slug URL<input name="slug" defaultValue={product?.slug || ''} placeholder="généré automatiquement" /></label></div>
      <div className="form-row"><label>Catégorie *<select name="category_id" required defaultValue={product?.category_id || ''}><option value="" disabled>Choisir</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label>Format *<input name="format" required defaultValue={product?.format || ''} placeholder="Sac de 25 kg" /></label></div>
      <label>Description *<textarea name="description" required minLength="10" rows="4" defaultValue={product?.description || ''} /></label><label>Consignes de sécurité<textarea name="safety_note" rows="3" defaultValue={product?.safety_note || ''} /></label>
      <label className="upload-field">Image du produit<input type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={upload} disabled={uploadingImage} /><span>{uploadingImage ? 'Téléversement de l’image…' : `JPEG, PNG, WebP ou AVIF · 5 Mo max${imageUrl ? ' · image chargée' : ''}`}</span></label>
      {imagePreview && <div className="image-preview"><img src={imagePreview} alt={`Aperçu de ${product?.name || 'l’image du produit'}`} /><span>Aperçu de l’image</span></div>}
      <label className="check-field"><input name="is_active" type="checkbox" defaultChecked={product?.is_active ?? true} /> Visible dans le catalogue</label>
      <div className="modal-actions"><button type="button" className="button button-outline" onClick={onClose}>Annuler</button><button className="button button-primary" disabled={busy || uploadingImage}>{uploadingImage ? 'Téléversement…' : busy ? 'Enregistrement…' : 'Enregistrer'} <Check size={16} /></button></div>
    </form></div></div>;
}

export function NotFoundPage() { return <section className="empty-state not-found"><span className="eyebrow">404 / PAGE INTROUVABLE</span><h1>Cette page n’existe pas.</h1><Link className="button button-primary" to="/">Retour à l’accueil <ArrowLeft size={16} /></Link></section>; }
