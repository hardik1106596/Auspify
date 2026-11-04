import { useEffect ,useMemo, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import AdminDashboard from './admin/AdminDashboard.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import Orders from './pages/Orders.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './auth/AuthContext.jsx';
import { apiRequest } from './api.js';
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Grid2X2,
  Headset,
  Heart,
  Menu,
  Minus,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Trash2,
  Truck,
  UserRound,
  X,
} from 'lucide-react';

import { categories } from './data';

const navigationLinks = [
  ['Home', '#home'],
  ['Shop', '#products'],
  ['Categories', '#categories'],
  ['Deals', '#deals'],
  ['About', '#why'],
];

const formatPrice = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

function Header({ cartCount, onCart, search, setSearch }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <header className="header">
        <button
          className="mobile-menu icon-button"
          aria-label="Toggle menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>

        <Link className="brand" to="/">
          <span className="brand-mark">
            <ShoppingBag size={24} />
          </span>
          <span>
            Shop<span>Verse</span>
          </span>
        </Link>

        <nav className={isMobileMenuOpen ? 'nav nav-open' : 'nav'}>
          {navigationLinks.map(([label, href], index) => (
            <a
              key={label}
              className={index === 0 ? 'active' : ''}
              href={href}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>

        <label className="searchbox">
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products, brands and more..."
            aria-label="Search products"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </label>

        <div className="header-actions">
          <button className="icon-button desktop-only" aria-label="Wishlist">
            <Heart />
          </button>
          <button
            className="icon-button cart-button"
            aria-label="Open cart"
            onClick={onCart}
          >
            <ShoppingCart />
            <span className="cart-count">{cartCount}</span>
          </button>
          <Link className="profile-button" to={user ? '/profile' : '/login'}>
            <span className="avatar">
              <UserRound size={17} />
            </span>
            <span>Hi, {user?.name?.split(' ')[0] || 'Shopper'}</span>
            <ChevronDown size={14} />
          </Link>
        </div>
      </header>

      <div className="mobile-search">
        <label className="searchbox">
          <Search size={17} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products..."
            aria-label="Search products"
          />
        </label>
      </div>
    </>
  );
}

function ProductCard({ product, onAdd, onWish, wished }) {
  const tagClass =
    product.tag === 'Best seller'
      ? 'blue'
      : product.tag === 'New'
        ? 'green'
        : '';

  return (
    <article className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.tag && (
          <span className={`product-tag ${tagClass}`}>{product.tag}</span>
        )}
        <button
          className={`wish-button ${wished ? 'wished' : ''}`}
          onClick={() => onWish(product.id)}
          aria-label="Toggle wishlist"
        >
          <Heart size={16} fill={wished ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3>{product.name}</h3>
        <div className="rating">
          <Star size={13} fill="currentColor" />
          <b>{product.rating}</b>
          <span>({product.reviews})</span>
        </div>
        <div className="product-bottom">
          <div>
            <strong>{formatPrice(product.price)}</strong>
            <del>{formatPrice(product.oldPrice)}</del>
          </div>
          <button
            className="add-cart"
            onClick={() => onAdd(product)}
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}

function CartDrawer({
  open,
  onClose,
  cart,
  updateQty,
  removeItem,
  onCheckout,
}) {
  if (!open) {
    return null;
  }

  const itemCount = cart.reduce((total, item) => total + item.qty, 0);
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0,
  );

  return (
    <div
      className="overlay"
      onMouseDown={(event) =>
        event.target === event.currentTarget && onClose()
      }
    >
      <aside className="cart-drawer">
        <div className="drawer-head">
          <div>
            <span className="eyebrow">YOUR BAG</span>
            <h2>
              Shopping cart <span className="muted">({itemCount})</span>
            </h2>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close cart"
          >
            <X />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <span className="empty-icon">
              <ShoppingBag size={32} />
            </span>
            <h3>Your cart is waiting</h3>
            <p>Looks like you haven't added anything yet.</p>
            <button className="btn btn-dark" onClick={onClose}>
              Explore products <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img src={item.image} alt={item.name} />
                  <div className="cart-item-info">
                    <b>{item.name}</b>
                    <span>{formatPrice(item.price)}</span>
                    <div className="qty-control">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span>{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                  <button
                    className="remove-item"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div>
                <span>Subtotal</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <p>Shipping and taxes calculated at checkout.</p>
              <button
                className="btn btn-dark full"
                onClick={onCheckout}
              >
                Continue to checkout <ArrowRight size={16} />
              </button>
              <button className="text-button full" onClick={onClose}>
                Continue shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function HeroSection() {
  return (
    <section className="hero" id="home">
      <div className="hero-copy">
        <span className="eyebrow">
          <Sparkles size={13} /> THE EVERYDAY EDIT · 2026
        </span>
        <h1>
          Good things.
          <br />
          Great <em>finds.</em>
        </h1>
        <p>
          Discover pieces you'll love, from everyday essentials to little
          luxuries. All in one place.
        </p>
        <div className="hero-actions">
          <a className="btn btn-dark" href="#products">
            Shop the collection <ArrowRight size={17} />
          </a>
          <a className="btn btn-light" href="#categories">
            <Grid2X2 size={16} /> Explore categories
          </a>
        </div>
        <div className="hero-perks">
          <span>
            <Truck size={17} /> Free shipping over ₹999
          </span>
          <span>
            <RefreshCw size={17} /> Easy 7-day returns
          </span>
        </div>
      </div>

      <div className="hero-art">
        <div className="hero-image-main">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1100&q=90"
            alt="Friends exploring fashion together"
          />
        </div>
        <div className="hero-note">
          <span className="note-kicker">A LITTLE SOMETHING EXTRA</span>
          <strong>
            Find your
            <br />
            <em>next favourite.</em>
          </strong>
          <span>Thoughtful picks. Everyday prices.</span>
          <a href="#products">
            Explore now <ArrowRight size={15} />
          </a>
        </div>
        <div className="floating-sticker">
          <span>CURATED</span>
          <strong>for you</strong>
          <Sparkles size={17} />
        </div>
      </div>
    </section>
  );
}

function CategorySection({ category, setCategory }) {
  return (
    <section className="category-section section-wrap" id="categories">
      <div className="section-heading">
        <div>
          <span className="eyebrow">A WORLD OF CHOICE</span>
          <h2>Browse by category</h2>
        </div>
        <p>A little inspiration for every corner of life.</p>
      </div>

      <div className="category-list">
        <button
          className={`category-item ${category === 'All' ? 'selected' : ''}`}
          onClick={() => setCategory('All')}
        >
          <span className="category-image all-category">
            <Grid2X2 size={24} />
          </span>
          <b>All finds</b>
        </button>
        {categories.map((item) => (
          <button
            key={item.name}
            className={`category-item ${
              category === item.name ? 'selected' : ''
            }`}
            onClick={() => setCategory(item.name)}
          >
            <span className="category-image">
              <img src={item.image} alt="" />
            </span>
            <b>{item.name}</b>
          </button>
        ))}
      </div>
    </section>
  );
}

function ProductsSection({
  category,
  filteredProducts,
  onAdd,
  onWish,
  wishes,
  search,
  setCategory,
  setSearch,
}) {
  const title = search
    ? 'Search results'
    : category === 'All'
      ? 'Trending right now'
      : category;
  const description = search
    ? `Showing matches for “${search}”`
    : 'Customer favourites, handpicked for your everyday.';

  return (
    <section className="products-section section-wrap" id="products">
      <div className="section-heading products-heading">
        <div>
          <span className="eyebrow">THE GOOD STUFF</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className="section-side">
          <span className="result-count">
            {filteredProducts.length} products
          </span>
          <a
            href="#products"
            onClick={() => {
              setCategory('All');
              setSearch('');
            }}
          >
            View all <ArrowRight size={15} />
          </a>
        </div>
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={onAdd}
            onWish={onWish}
            wished={wishes.includes(product.id)}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-results">
          <Search size={30} />
          <h3>No products found</h3>
          <p>Try another search or explore all categories.</p>
          <button
            className="btn btn-dark"
            onClick={() => {
              setSearch('');
              setCategory('All');
            }}
          >
            Show all products
          </button>
        </div>
      )}
    </section>
  );
}

function PromoSection({ setCategory }) {
  return (
    <section className="promo-section section-wrap" id="deals">
      <div className="promo-card promo-dark">
        <div>
          <span className="eyebrow">SMARTER EVERYDAY</span>
          <h2>
            Small upgrades.
            <br />
            <em>Big difference.</em>
          </h2>
          <p>Discover tech and accessories that make life flow.</p>
          <a
            className="btn btn-white"
            href="#products"
            onClick={() => setCategory('Electronics')}
          >
            Shop electronics <ArrowRight size={16} />
          </a>
        </div>
        <img
          src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85"
          alt="Premium headphones"
        />
      </div>

      <div className="promo-card promo-sand">
        <div>
          <span className="eyebrow">YOUR SPACE, YOUR STYLE</span>
          <h2>
            Make room for
            <br />
            <em>the lovely things.</em>
          </h2>
          <p>Comfortable pieces to make home feel like you.</p>
          <a
            className="btn btn-dark"
            href="#products"
            onClick={() => setCategory('Home & Living')}
          >
            Shop home <ArrowRight size={16} />
          </a>
        </div>
        <img
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=85"
          alt="Warm modern home interior"
        />
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="benefits section-wrap" id="why">
      <div className="benefit">
        <span>
          <BadgeCheck />
        </span>
        <div>
          <b>Good stuff, always</b>
          <p>Quality picks you can feel good about.</p>
        </div>
      </div>
      <div className="benefit">
        <span>
          <Sparkles />
        </span>
        <div>
          <b>Prices that make sense</b>
          <p>Little luxuries, without the fuss.</p>
        </div>
      </div>
      <div className="benefit">
        <span>
          <RefreshCw />
        </span>
        <div>
          <b>Easy does it</b>
          <p>Simple returns, no drama.</p>
        </div>
      </div>
      <div className="benefit">
        <span>
          <Headset />
        </span>
        <div>
          <b>Here when you need us</b>
          <p>Real help, whenever you need it.</p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <Link className="brand" to="/">
        <span className="brand-mark">
          <ShoppingBag size={22} />
        </span>
        <span>
          Shop<span>Verse</span>
        </span>
      </Link>
      <p>Good finds for the everyday.</p>
      <div className="footer-links">
        <a href="#products">Shop</a>
        <a href="#categories">Categories</a>
        <a href="#why">About</a>
        <a href="mailto:hello@shopverse.example">Contact</a>
      </div>
      <small>
        © 2026 ShopVerse. Demo storefront for learning and development.
      </small>
    </footer>
  );
}

function CheckoutModal({
  subtotal,
  orderPlaced,
  onClose,
  onPlaceOrder,
}) {
  return (
    <div
      className="overlay"
      onMouseDown={(event) =>
        event.target === event.currentTarget && onClose()
      }
    >
      <div className="checkout-modal">
        <div className="drawer-head">
          <div>
            <span className="eyebrow">DEMO CHECKOUT</span>
            <h2>{orderPlaced ? 'Order confirmed!' : 'Almost yours.'}</h2>
          </div>
          <button
            className="icon-button"
            onClick={onClose}
            aria-label="Close checkout"
          >
            <X />
          </button>
        </div>

        {orderPlaced ? (
          <div className="success-state">
            <span className="success-icon">
              <BadgeCheck size={34} />
            </span>
            <h3>Thanks for trying ShopVerse.</h3>
            <p>Your demo order has been placed. No payment was collected.</p>
            <button className="btn btn-dark full" onClick={onClose}>
              Back to shopping
            </button>
          </div>
        ) : (
          <form onSubmit={onPlaceOrder} className="checkout-form">
            <div className="checkout-total">
              <span>Order total</span>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            <label>
              Full name
              <input
                name="fullName"
                required
                placeholder="Your name"
              />
            </label>

            <label>
              Email address
              <input
                name="email"
                required
                type="email"
                placeholder="you@example.com"
              />
            </label>

            <label>
              Delivery address
              <textarea
                name="shippingAddress"
                required
                placeholder="House number, street, city, PIN code"
                rows="3"
              />
            </label>

            <div className="demo-notice">
              <ShieldCheck size={16} /> Demo checkout only. No real payment is
              processed.
            </div>
            <button className="btn btn-dark full" type="submit">
              Place demo order <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Storefront() {
  const { token } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState('');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishes, setWishes] = useState([]);
  const [toast, setToast] = useState('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = cart.reduce(
  (total, item) => total + item.price * (item.qty || 1),
  0
);

const cartCount = cart.reduce(
  (total, item) => total + (item.qty || 1),
  0
);

useEffect(() => {
    let active = true;
    apiRequest('/products')
      .then((data) => {
        if (!active) return;
        setProducts(
          data.map((product) => ({
            ...product,
            id: product._id,
            oldPrice: product.oldPrice ?? product.price,
            rating: product.rating ?? 4.5,
            reviews: product.reviews ?? 0,
            tag: product.featured ? 'Featured' : '',
          })),
        );
        setProductsError('');
      })
      .catch((error) => {
        if (active) setProductsError(error.message);
      })
      .finally(() => {
        if (active) setProductsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);


 const filteredProducts = useMemo(
  () =>
    products.filter(
      (product) =>
        (category === 'All' || product.category === category) &&
        product.name.toLowerCase().includes(search.toLowerCase()),
    ),
  [products, category, search],
);


  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  }



  function addToCart(product) {
    setCart((currentCart) =>
      currentCart.some((item) => item.id === product.id)
        ? currentCart.map((item) =>
            item.id === product.id
              ? { ...item, qty: item.qty + 1 }
              : item,
          )
        : [...currentCart, { ...product, qty: 1 }],
    );
    notify(`${product.name} added to your cart`);
  }

  function updateQty(id, change) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty + change } : item,
        )
        .filter((item) => item.qty > 0),
    );
  }

  function checkout() {
    if (cart.length > 0) {
      setCartOpen(false);
      setCheckoutOpen(true);
      setOrderPlaced(false);
    }
  }


async function placeOrder(event)
{
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const fullName = formData.get("fullName")?.trim();
    const email = formData.get("email")?.trim();
    const shippingAddress = formData.get("shippingAddress")?.trim();

    if (!token) {
      setCheckoutOpen(false);
      window.location.href = "/login";
      return;
    }

    if (!fullName || !email || !shippingAddress || cart.length === 0) {
      notify("Please complete checkout details and add items.");
      return;
    }

    try {
      await apiRequest('/orders', {
        method: "POST",
        token,
        body: {
          items: cart.map((item) => ({
            product: item.id,
            quantity: item.qty,
          })),
          shippingAddress,
        },
      });

      setOrderPlaced(true);
      setCart([]);
      notify("Order saved successfully!");
    } catch (error) {
      notify(error.message || "Could not place order.");
    }
  }


  function toggleWishlist(id) {
    setWishes((currentWishes) =>
      currentWishes.includes(id)
        ? currentWishes.filter((itemId) => itemId !== id)
        : [...currentWishes, id],
    );
  }

  return (
    <div className="site-shell">
      <Header
        cartCount={cartCount}
        onCart={() => setCartOpen(true)}
        search={search}
        setSearch={setSearch}
      />
      <main>
        <HeroSection />
        <CategorySection category={category} setCategory={setCategory} />
        {productsLoading ?
        (
          <section className="products-section section-wrap">
            <h2>Loading products...</h2>
          </section>
        ) :
        productsError ?
        (
          <section className="products-section section-wrap">
            <h2>Could not load products</h2>
            <p>{productsError}</p>
          </section>
        ):
        (
          <ProductsSection
            category={category}
            filteredProducts={filteredProducts}
            onAdd={addToCart}
            onWish={toggleWishlist}
            wishes={wishes}
            search={search}
            setCategory={setCategory}
            setSearch={setSearch}
          />
        )}
        <PromoSection setCategory={setCategory} />
        <BenefitsSection />
      </main>
      <Footer />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        updateQty={updateQty}
        removeItem={(id) =>
          setCart((currentCart) =>
            currentCart.filter((item) => item.id !== id),
          )
        }
        onCheckout={checkout}
      />

      {checkoutOpen && (
        <CheckoutModal
          subtotal={subtotal}
          orderPlaced={orderPlaced}
          onClose={() => setCheckoutOpen(false)}
          onPlaceOrder={placeOrder}
        />
      )}

      {toast && (
        <div className="toast">
          <span>
            <BadgeCheck size={17} />
          </span>
          {toast}
        </div>
      )}
    </div>
  );
}



export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Storefront />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
      </Route>
    </Routes>
  );
}
