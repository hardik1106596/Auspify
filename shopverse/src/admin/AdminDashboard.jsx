
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  X,
  Search,
  ArrowLeft,
} from "lucide-react";
import "./AdminDashboard.css";

const API_URL = "http://localhost:5000/api/products";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "Electronics",
  image: "",
  stock: "0",
  featured: false,
};

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function loadProducts() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Could not load products.");

      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err.message || "Unable to connect to the API.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setNotice("");
    setShowForm(true);
  }

  function openEditForm(product) {
    setEditingId(product._id);
    setForm({
      name: product.name ?? "",
      description: product.description ?? "",
      price: String(product.price ?? ""),
      category: product.category ?? "Electronics",
      image: product.image ?? "",
      stock: String(product.stock ?? 0),
      featured: Boolean(product.featured),
    });
    setError("");
    setNotice("");
    setShowForm(true);
  }

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function saveProduct(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");

    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
      };

      if (
        !payload.name ||
        !payload.category.trim() ||
        form.price.trim() === "" ||
        !Number.isFinite(payload.price) ||
        payload.price < 0 ||
        !Number.isInteger(payload.stock) ||
        payload.stock < 0
      ) {
        throw new Error(
          "Enter a product name, category, valid price, and whole-number stock."
        );
      }

      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not save product.");
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      setNotice(editingId ? "Product updated." : "Product added.");
      await loadProducts();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(product) {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
      const response = await fetch(`${API_URL}/${product._id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not delete product.");
      }

      setNotice("Product deleted.");
      await loadProducts();
    } catch (err) {
      setError(err.message || "Could not delete product.");
    }
  }

  const visibleProducts = products.filter((product) =>
    `${product.name} ${product.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0
  );

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/">
          <span className="admin-brand-icon">S</span>
          ShopVerse
          <span className="admin-brand-tag">ADMIN</span>
        </a>

        <div className="admin-nav-label">WORKSPACE</div>

        <div className="admin-nav-item active">
          <LayoutDashboard size={18} />
          Dashboard
        </div>

        <div className="admin-nav-item">
          <Package size={18} />
          Products
        </div>

        <div className="admin-sidebar-bottom">
          <a href="/" className="admin-back-link">
            <ArrowLeft size={17} />
            View storefront
          </a>
          <span>ShopVerse Admin · Development</span>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-eyebrow">STORE MANAGEMENT</p>
            <h1>Dashboard</h1>
          </div>

          <button
            className="admin-secondary-button"
            onClick={loadProducts}
            disabled={loading}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        <section className="admin-welcome">
          <div>
            <p className="admin-eyebrow">YOUR STORE AT A GLANCE</p>
            <h2>Make your next great find.</h2>
            <p>Manage your catalog and keep your storefront up to date.</p>
          </div>
          <Package size={54} strokeWidth={1.2} />
        </section>

        {error && <div className="admin-alert error">{error}</div>}
        {notice && <div className="admin-alert success">{notice}</div>}

        <section className="admin-stats">
          <article className="admin-stat-card">
            <span>Total products</span>
            <Package size={19} />
            <strong>{products.length}</strong>
            <small>Products in your catalog</small>
          </article>

          <article className="admin-stat-card">
            <span>Featured products</span>
            <LayoutDashboard size={19} />
            <strong>{products.filter((p) => p.featured).length}</strong>
            <small>Highlighted items</small>
          </article>

          <article className="admin-stat-card">
            <span>Inventory value</span>
            <Package size={19} />
            <strong>
              {totalValue.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
              })}
            </strong>
            <small>Price × stock quantity</small>
          </article>
        </section>

        <section className="admin-products-section">
          <div className="admin-section-heading">
            <div>
              <p className="admin-eyebrow">CATALOG</p>
              <h2>Product management</h2>
              <p>Add products and manage your existing collection.</p>
            </div>

            <button className="admin-primary-button" onClick={openAddForm}>
              <Plus size={18} />
              Add product
            </button>
          </div>

          <div className="admin-toolbar">
            <div className="admin-search">
              <Search size={17} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products or categories..."
              />
            </div>
            <span>{visibleProducts.length} products</span>
          </div>

          {loading ? (
            <div className="admin-empty">Loading products...</div>
          ) : visibleProducts.length === 0 ? (
            <div className="admin-empty">
              <Package size={36} />
              <h3>No products found</h3>
              <p>Add your first product or try another search.</p>
              <button
                className="admin-primary-button"
                onClick={openAddForm}
              >
                <Plus size={17} />
                Add your first product
              </button>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>PRODUCT</th>
                    <th>CATEGORY</th>
                    <th>PRICE</th>
                    <th>STOCK</th>
                    <th>FEATURED</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleProducts.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <div className="admin-product-cell">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                            />
                          ) : (
                            <div className="admin-product-placeholder">
                              <Package size={20} />
                            </div>
                          )}
                          <div>
                            <strong>{product.name}</strong>
                            <small>
                              {product.description || "No description"}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td className="admin-price">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </td>
                      <td>{product.stock}</td>
                      <td>
                        <span
                          className={
                            product.featured
                              ? "admin-pill featured"
                              : "admin-pill"
                          }
                        >
                          {product.featured ? "Featured" : "Standard"}
                        </span>
                      </td>
                      <td>
                        <div className="admin-row-actions">
                          <button
                            className="admin-icon-button"
                            aria-label={`Edit ${product.name}`}
                            title="Edit product"
                            onClick={() => openEditForm(product)}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            className="admin-icon-button danger"
                            aria-label={`Delete ${product.name}`}
                            title="Delete product"
                            onClick={() => deleteProduct(product)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {showForm && (
        <div
          className="admin-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowForm(false);
            }
          }}
        >
          <section
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-form-title"
          >
            <div className="admin-modal-heading">
              <div>
                <p className="admin-eyebrow">PRODUCT CATALOG</p>
                <h2 id="admin-form-title">
                  {editingId ? "Edit product" : "Add a product"}
                </h2>
              </div>
              <button
                className="admin-icon-button"
                onClick={() => setShowForm(false)}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <form className="admin-form" onSubmit={saveProduct}>
              <label>
                Product name *
                <input
                  name="name"
                  value={form.name}
                  onChange={updateField}
                  placeholder="e.g. Wireless Headphones"
                  required
                />
              </label>

              <label>
                Description
                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  placeholder="Describe your product..."
                  rows={3}
                />
              </label>

              <div className="admin-form-grid">
                <label>
                  Price (₹) *
                  <input
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={updateField}
                    required
                  />
                </label>

                <label>
                  Stock *
                  <input
                    name="stock"
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={updateField}
                    required
                  />
                </label>
              </div>

              <label>
                Category *
                <select
                  name="category"
                  value={form.category}
                  onChange={updateField}
                  required
                >
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home & Living</option>
                  <option>Beauty</option>
                  <option>Accessories</option>
                  <option>Sports</option>
                  <option>Other</option>
                </select>
              </label>

              <label>
                Product image URL
                <input
                  name="image"
                  type="url"
                  value={form.image}
                  onChange={updateField}
                  placeholder="https://..."
                />
              </label>

              {form.image && (
                <img
                  className="admin-image-preview"
                  src={form.image}
                  alt="Product preview"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                  onLoad={(event) => {
                    event.currentTarget.style.display = "block";
                  }}
                />
              )}

              <label className="admin-checkbox-label">
                <input
                  name="featured"
                  type="checkbox"
                  checked={form.featured}
                  onChange={updateField}
                />
                Feature this product in the store
              </label>

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={() => setShowForm(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save changes"
                      : "Add product"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
