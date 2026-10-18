import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { imageSource } from '../api';

export function ProductCard({ product }) {
  return <article className="product-card">
    <Link to={`/produit/${product.slug}`} className="product-image-wrap" aria-label={`Voir ${product.name}`}>
      <img src={imageSource(product)} alt={product.name} loading="lazy" />
      <span className="image-arrow"><ArrowUpRight size={18} /></span>
    </Link>
    <div className="product-meta"><span>{product.category_name}</span><span>{product.format}</span></div>
    <h3><Link to={`/produit/${product.slug}`}>{product.name}</Link></h3>
    <p>{product.description}</p>
  </article>;
}