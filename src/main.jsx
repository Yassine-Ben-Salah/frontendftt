import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AdminGate, CatalogPage, ContactPage, HomePage, NotFoundPage, ProductPage } from './pages';
import './styles.css';

function App() {
  return <BrowserRouter><Routes><Route element={<Layout />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/catalogue" element={<CatalogPage />} />
    <Route path="/produit/:slug" element={<ProductPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/admin" element={<AdminGate />} />
    <Route path="/admin/login" element={<AdminGate />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route></Routes></BrowserRouter>;
}

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);