import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AccountLayout({ children, eyebrow, title, description }) {
  return (
    <main className="account-page">
      <header className="account-topbar">
        <Link className="brand" to="/">
          <span className="brand-mark">
            <ShoppingBag size={22} />
          </span>
          <span>
            Shop<span>Verse</span>
          </span>
        </Link>
        <Link className="account-back-link" to="/">
          <ArrowLeft size={15} /> Back to shop
        </Link>
      </header>
      <div className="account-content">
        <div className="account-heading">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        {children}
      </div>
      <footer className="account-footer">© 2026 ShopVerse. Good finds for the everyday.</footer>
    </main>
  );
}
