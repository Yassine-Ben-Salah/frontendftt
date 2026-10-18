import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { ArrowUpRight, Mail, Menu, MessageCircle, Phone, X } from 'lucide-react';
import { COMPANY_EMAIL, COMPANY_PHONE, COMPANY_WHATSAPP } from '../api';

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const closeMenu = () => setMenuOpen(false);
  useEffect(() => {
    if (!location.hash) return;
    document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [location.pathname, location.hash]);
  return <>
    <div className="topbar">
      <div className="topbar-inner">
        <span>DES INGRÉDIENTS POUR VOS RECETTES</span>
        <div className="topbar-contacts">
          <a href={`tel:${COMPANY_PHONE.replace(/[^\d+]/g, '')}`}><Phone size={13} /> {COMPANY_PHONE}</a>
          <a href={`https://wa.me/${COMPANY_WHATSAPP}`} target="_blank" rel="noreferrer"><MessageCircle size={14} /> WhatsApp</a>
        </div>
      </div>
    </div>
    <header className="site-header">
      <div className="nav-wrap">
        <Link className="brand" to="/" onClick={closeMenu} aria-label="Food Transfert Tunisia, accueil">
          <img className="brand-image" src="/food-transfert-logo.png" alt="Logo Food Transfert Tunisia" />
        </Link>
        <button className="icon-button mobile-menu" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={menuOpen ? 'main-nav open' : 'main-nav'}>
          <NavLink to="/" end onClick={closeMenu}>Accueil</NavLink>
          <NavLink to="/catalogue" onClick={closeMenu}>Nos produits</NavLink>
          <Link to="/#distribution" onClick={closeMenu}>Comment ça marche</Link>
          <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
          <Link to="/contact" className="nav-cta" onClick={closeMenu}>Demander un prix <ArrowUpRight size={16} /></Link>
        </nav>
      </div>
    </header>
    <main><Outlet /></main>
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-company">
          <Link to="/" className="footer-brand" aria-label="Food Transfert Tunisia, accueil"><img src="/food-transfert-logo.png" alt="Food Transfert Tunisia" /></Link>
          <p>Des ingrédients et des produits à découvrir pour vos recettes et vos besoins.</p>
        </div>
        <div className="footer-column"><span className="footer-title">Explorer</span><Link to="/catalogue">Nos produits</Link><Link to="/#distribution">Comment ça marche</Link><Link to="/contact">Demander un prix</Link></div>
        <div className="footer-column footer-contact"><span className="footer-title">Nous contacter</span><a href={`mailto:${COMPANY_EMAIL}`}><Mail size={15} />{COMPANY_EMAIL}</a><a href={`tel:${COMPANY_PHONE.replace(/[^\d+]/g, '')}`}><Phone size={15} />{COMPANY_PHONE}</a><a href={`https://wa.me/${COMPANY_WHATSAPP}`} target="_blank" rel="noreferrer"><MessageCircle size={15} />Écrire sur WhatsApp</a></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Food Transfert Tunisia</span><span>Découvrez nos produits en Tunisie</span></div>
      </div>
    </footer>
  </>;
}
