import { useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowDownLeft, ArrowUpRight, Bell, CalendarDays, ChartNoAxesCombined,
  ChevronDown, CircleHelp, CreditCard, LayoutDashboard, LogOut, Menu,
  Plus, Search, Settings, Wallet, X, Trash2, Pencil, Filter
} from 'lucide-react';
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip,
  XAxis, YAxis, PieChart, Pie, Cell
} from 'recharts';
import { api } from './api.js';

const money = (value) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0
}).format(Number(value || 0));

const seedTransactions = [
  { _id: '1', title: 'Monthly salary', category: 'Salary', type: 'income', amount: 52000, date: '2026-10-01', note: 'October salary' },
  { _id: '2', title: 'Grocery shopping', category: 'Food', type: 'expense', amount: 1850, date: '2026-10-03', note: '' },
  { _id: '3', title: 'Electricity bill', category: 'Bills', type: 'expense', amount: 1240, date: '2026-10-05', note: '' },
  { _id: '4', title: 'Freelance website', category: 'Freelance', type: 'income', amount: 7500, date: '2026-10-08', note: '' },
  { _id: '5', title: 'Transport', category: 'Transport', type: 'expense', amount: 760, date: '2026-10-11', note: '' },
  { _id: '6', title: 'Lunch with friends', category: 'Food', type: 'expense', amount: 680, date: '2026-10-13', note: '' },
  { _id: '7', title: 'Internet bill', category: 'Bills', type: 'expense', amount: 799, date: '2026-10-16', note: '' },
  { _id: '8', title: 'Course subscription', category: 'Education', type: 'expense', amount: 1499, date: '2026-10-20', note: '' }
];

const categories = {
  expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Education', 'Health', 'Entertainment', 'Other'],
  income: ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other']
};

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pennywiseUser')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('pennywiseToken'));
  const [transactions, setTransactions] = useState(seedTransactions);
  const [usingDemo, setUsingDemo] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [notice, setNotice] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const refreshTransactions = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await api('/transactions', { token });
      setTransactions(data);
      setUsingDemo(false);
    } catch (error) {
      setNotice(`${error.message} Showing demo data.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) refreshTransactions();
  }, [token]);

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(''), 3500);
    return () => clearTimeout(id);
  }, [notice]);

  const totals = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
    return { income, expenses, balance: income - expenses };
  }, [transactions]);

  const filtered = useMemo(() => transactions.filter(t => {
    const matchesSearch = `${t.title} ${t.category}`.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && (filterType === 'all' || t.type === filterType);
  }).sort((a, b) => new Date(b.date) - new Date(a.date)), [transactions, searchTerm, filterType]);

  const chartData = useMemo(() => {
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setDate(1);
      date.setMonth(date.getMonth() - i);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const total = transactions.filter(t => t.type === 'expense' && String(t.date).slice(0, 7) === key)
        .reduce((sum, t) => sum + Number(t.amount), 0);
      result.push({ month: date.toLocaleDateString('en-IN', { month: 'short' }), expenses: total });
    }
    return result;
  }, [transactions]);

  const categoryData = useMemo(() => {
    const totalsByCategory = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      totalsByCategory[t.category] = (totalsByCategory[t.category] || 0) + Number(t.amount);
    });
    return Object.entries(totalsByCategory).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const saveTransaction = async (form) => {
    try {
      if (token) {
        const saved = editing
          ? await api(`/transactions/${editing._id}`, { method: 'PUT', token, body: form })
          : await api('/transactions', { method: 'POST', token, body: form });
        setTransactions(current => editing
          ? current.map(t => t._id === saved._id ? saved : t)
          : [saved, ...current]);
        setUsingDemo(false);
      } else {
        const saved = { ...form, _id: editing?._id || crypto.randomUUID() };
        setTransactions(current => editing
          ? current.map(t => t._id === editing._id ? saved : t)
          : [saved, ...current]);
      }
      setModalOpen(false);
      setEditing(null);
      setNotice(editing ? 'Transaction updated.' : 'Transaction added.');
    } catch (error) { setNotice(error.message); }
  };

  const deleteTransaction = async (transaction) => {
    if (!window.confirm(`Delete "${transaction.title}"?`)) return;
    try {
      if (token) await api(`/transactions/${transaction._id}`, { method: 'DELETE', token });
      setTransactions(current => current.filter(t => t._id !== transaction._id));
      setNotice('Transaction deleted.');
    } catch (error) { setNotice(error.message); }
  };

  const handleAuth = async (mode, form) => {
    const data = await api(`/auth/${mode}`, { method: 'POST', body: form });
    localStorage.setItem('pennywiseToken', data.token);
    localStorage.setItem('pennywiseUser', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    navigate('/');
    setNotice(`Welcome${data.user.name ? `, ${data.user.name}` : ''}!`);
  };

  const logout = () => {
    localStorage.removeItem('pennywiseToken');
    localStorage.removeItem('pennywiseUser');
    setToken(null);
    setUser(null);
    setTransactions(seedTransactions);
    setUsingDemo(true);
    navigate('/login');
  };

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<AuthPage mode="login" onSubmit={handleAuth} />} />
        <Route path="/register" element={<AuthPage mode="register" onSubmit={handleAuth} />} />
      </Routes>
    );
  }

  const page = location.pathname;
  const title = page === '/transactions' ? 'Transactions' : page === '/reports' ? 'Reports' : page === '/settings' ? 'Settings' : 'Overview';

  return (
    <div className="app-shell">
      {sidebarOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="brand"><span className="brand-mark"><Wallet size={20} /></span><span>Pennywise<small>PERSONAL FINANCE</small></span><button className="icon-button sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X size={18} /></button></div>
        <div className="nav-caption">WORKSPACE</div>
        <nav className="main-nav">
          <NavLink to="/" active={page === '/'} icon={<LayoutDashboard size={18} />} label="Overview" onClick={() => setSidebarOpen(false)} />
          <NavLink to="/transactions" active={page === '/transactions'} icon={<CreditCard size={18} />} label="Transactions" onClick={() => setSidebarOpen(false)} />
          <NavLink to="/reports" active={page === '/reports'} icon={<ChartNoAxesCombined size={18} />} label="Reports" onClick={() => setSidebarOpen(false)} />
        </nav>
        <div className="nav-caption nav-caption--spaced">PREFERENCES</div>
        <nav className="main-nav">
          <NavLink to="/settings" active={page === '/settings'} icon={<Settings size={18} />} label="Settings" onClick={() => setSidebarOpen(false)} />
        </nav>
        <div className="sidebar-bottom">
          <div className="help-box"><CircleHelp size={18} /><div><strong>Need a hand?</strong><span>Keep your finances organized.</span></div></div>
          <div className="profile-row"><div className="avatar">{(user?.name || 'H').slice(0, 1).toUpperCase()}</div><div className="profile-copy"><strong>{user?.name || 'Guest User'}</strong><span>{user?.email || 'Demo account'}</span></div><button className="icon-button" onClick={logout} title={token ? 'Log out' : 'Sign in'} aria-label={token ? 'Log out' : 'Sign in'}>{token ? <LogOut size={17} /> : <ChevronDown size={17} />}</button></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={21} /></button>
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><strong>{title}</strong></div>
          <div className="topbar-actions">
            <div className="today-label"><CalendarDays size={16} /><span>{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
            <button className="icon-button notification-button" aria-label="Notifications" onClick={() => setNotice('You are all caught up.')}><Bell size={18} /><i /></button>
            {!token && <button className="button button--light top-login" onClick={() => navigate('/login')}>Sign in</button>}
            <button className="button button--primary top-add" onClick={() => { setEditing(null); setModalOpen(true); }}><Plus size={17} /> Add transaction</button>
          </div>
        </header>

        <div className="page-content">
          {notice && <div className="toast" role="status">{notice}<button className="icon-button" onClick={() => setNotice('')} aria-label="Dismiss"><X size={15} /></button></div>}
          {usingDemo && <div className="demo-notice"><span className="demo-dot" /> Demo mode — sample data is stored in this browser only. <button onClick={() => navigate('/register')}>Create an account</button> to save records to the database.</div>}
          {page === '/' && <Dashboard totals={totals} transactions={filtered} chartData={chartData} categoryData={categoryData} onAdd={() => setModalOpen(true)} onEdit={(t) => { setEditing(t); setModalOpen(true); }} onDelete={deleteTransaction} />}
          {page === '/transactions' && <Transactions transactions={filtered} searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterType={filterType} setFilterType={setFilterType} onAdd={() => { setEditing(null); setModalOpen(true); }} onEdit={(t) => { setEditing(t); setModalOpen(true); }} onDelete={deleteTransaction} />}
          {page === '/reports' && <Reports totals={totals} chartData={chartData} categoryData={categoryData} />}
          {page === '/settings' && <SettingsPage user={user} token={token} onLogout={logout} />}
          {loading && <div className="loading-note">Loading your transactions…</div>}
          <footer className="footer">Pennywise <span>•</span> A simple way to stay on top of your money.</footer>
        </div>
      </main>

      {modalOpen && <TransactionModal initial={editing} onClose={() => { setModalOpen(false); setEditing(null); }} onSave={saveTransaction} />}
    </div>
  );
}

function NavLink({ to, active, icon, label, onClick }) {
  const navigate = useNavigate();
  return <button className={`nav-item ${active ? 'nav-item--active' : ''}`} onClick={() => { navigate(to); onClick?.(); }}>{icon}<span>{label}</span>{active && <span className="nav-active-indicator" />}</button>;
}

function MetricCard({ label, value, change, icon, tone, helper }) {
  return <article className="metric-card"><div className="metric-top"><span className="metric-label">{label}</span><span className={`metric-icon metric-icon--${tone}`}>{icon}</span></div><div className="metric-value">{money(value)}</div><div className="metric-bottom"><span className="metric-helper">{helper}</span>{change && <span className={`metric-change ${change.startsWith('-') ? 'metric-change--down' : ''}`}>{change}</span>}</div></article>;
}

function Dashboard({ totals, transactions, chartData, categoryData, onAdd, onEdit, onDelete }) {
  const recent = transactions.slice(0, 5);
  return <>
    <section className="welcome-row"><div><p className="eyebrow">YOUR MONEY, AT A GLANCE</p><h1>Good to see you.</h1><p className="page-subtitle">Here’s what’s happening with your finances.</p></div><button className="button button--primary" onClick={onAdd}><Plus size={17} /> New transaction</button></section>
    <section className="metrics-grid">
      <MetricCard label="Total balance" value={totals.balance} helper="Income minus expenses" icon={<Wallet size={19} />} tone="blue" />
      <MetricCard label="Total income" value={totals.income} change="+ Money in" helper="Across all records" icon={<ArrowDownLeft size={19} />} tone="green" />
      <MetricCard label="Total expenses" value={totals.expenses} change="- Money out" helper="Across all records" icon={<ArrowUpRight size={19} />} tone="orange" />
    </section>
    <section className="dashboard-grid">
      <article className="panel spending-panel"><div className="panel-heading"><div><h2>Expense overview</h2><p>Your spending over the last six months</p></div><span className="panel-tag">6 months</span></div><div className="chart-area"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 12, right: 8, left: -16, bottom: 0 }}><defs><linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4f7fe8" stopOpacity={0.22} /><stop offset="95%" stopColor="#4f7fe8" stopOpacity={0.01} /></linearGradient></defs><CartesianGrid stroke="#edf0f5" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8791a2', fontSize: 12 }} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#8791a2', fontSize: 11 }} tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v} /><Tooltip formatter={(v) => money(v)} contentStyle={{ borderRadius: 10, border: '1px solid #e6eaf1', boxShadow: '0 6px 20px #16233b12' }} /><Area type="monotone" dataKey="expenses" name="Expenses" stroke="#4f7fe8" strokeWidth={2.5} fill="url(#expenseFill)" activeDot={{ r: 5 }} /></AreaChart></ResponsiveContainer></div></article>
      <article className="panel category-panel"><div className="panel-heading"><div><h2>Spending categories</h2><p>Where your money goes</p></div></div>{categoryData.length ? <><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={54} outerRadius={78} paddingAngle={3} stroke="none">{categoryData.map((entry, i) => <Cell key={entry.name} fill={['#4f7fe8', '#55b78a', '#f3ad58', '#9a83df', '#e47b86', '#65b9c9', '#8b9bb1'][i % 7]} />)}</Pie><Tooltip formatter={(v) => money(v)} /></PieChart></ResponsiveContainer><div className="donut-center"><strong>{money(totals.expenses)}</strong><span>Total spent</span></div></div><div className="category-legend">{categoryData.slice(0, 4).map((item, i) => <div className="legend-row" key={item.name}><span className="legend-name"><i style={{ background: ['#4f7fe8', '#55b78a', '#f3ad58', '#9a83df'][i % 4] }} />{item.name}</span><strong>{money(item.value)}</strong></div>)}</div></> : <EmptyState title="No expenses yet" text="Add an expense to see your category breakdown." />}</article>
    </section>
    <section className="panel transactions-panel"><div className="panel-heading"><div><h2>Recent transactions</h2><p>A quick look at your latest activity</p></div><a href="/transactions" className="text-link">View all transactions <span>→</span></a></div><TransactionTable transactions={recent} onEdit={onEdit} onDelete={onDelete} compact /></section>
  </>;
}

function Transactions({ transactions, searchTerm, setSearchTerm, filterType, setFilterType, onAdd, onEdit, onDelete }) {
  return <><section className="welcome-row"><div><p className="eyebrow">YOUR ACTIVITY</p><h1>Transactions</h1><p className="page-subtitle">Keep track of every rupee coming in and going out.</p></div><button className="button button--primary" onClick={onAdd}><Plus size={17} /> Add transaction</button></section>
    <section className="panel transactions-panel"><div className="toolbar"><label className="search-box"><Search size={17} /><input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search transactions..." /></label><label className="filter-select"><Filter size={16} /><select value={filterType} onChange={e => setFilterType(e.target.value)}><option value="all">All types</option><option value="income">Income</option><option value="expense">Expenses</option></select></label></div><TransactionTable transactions={transactions} onEdit={onEdit} onDelete={onDelete} /></section>
  </>;
}

function TransactionTable({ transactions, onEdit, onDelete, compact = false }) {
  if (!transactions.length) return <EmptyState title="Nothing to show" text="Try a different search or add your first transaction." />;
  return <div className="table-scroll"><table className="transactions-table"><thead><tr><th>TRANSACTION</th><th>CATEGORY</th><th>DATE</th><th>AMOUNT</th><th className="actions-head">ACTIONS</th></tr></thead><tbody>{transactions.map(t => <tr key={t._id}><td><div className="transaction-title"><span className={`transaction-type-icon transaction-type-icon--${t.type}`}>{t.type === 'income' ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}</span><span><strong>{t.title}</strong><small>{t.note || (t.type === 'income' ? 'Money received' : 'Money spent')}</small></span></div></td><td><span className="category-pill">{t.category}</span></td><td className="date-cell">{new Date(`${String(t.date).slice(0, 10)}T12:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td><td className={`amount-cell amount-cell--${t.type}`}>{t.type === 'income' ? '+' : '−'}{money(t.amount)}</td><td><div className="row-actions"><button className="icon-button" onClick={() => onEdit(t)} title="Edit transaction" aria-label={`Edit ${t.title}`}><Pencil size={15} /></button><button className="icon-button icon-button--danger" onClick={() => onDelete(t)} title="Delete transaction" aria-label={`Delete ${t.title}`}><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div>;
}

function Reports({ totals, chartData, categoryData }) {
  return <><section className="welcome-row"><div><p className="eyebrow">YOUR FINANCIAL PICTURE</p><h1>Reports</h1><p className="page-subtitle">Understand your habits and spot spending patterns.</p></div></section><section className="metrics-grid metrics-grid--two"><MetricCard label="Income recorded" value={totals.income} helper="All recorded income" icon={<ArrowDownLeft size={19} />} tone="green" /><MetricCard label="Expenses recorded" value={totals.expenses} helper="All recorded expenses" icon={<ArrowUpRight size={19} />} tone="orange" /></section><section className="panel report-chart"><div className="panel-heading"><div><h2>Monthly expenses</h2><p>Compare spending across the last six months</p></div></div><div className="chart-area chart-area--large"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 15, right: 16, left: 0, bottom: 0 }}><CartesianGrid stroke="#edf0f5" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8791a2', fontSize: 12 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#8791a2', fontSize: 12 }} tickFormatter={v => v >= 1000 ? `${v / 1000}k` : v} /><Tooltip formatter={v => money(v)} /><Area type="monotone" dataKey="expenses" stroke="#4f7fe8" fill="#eaf0ff" strokeWidth={2.5} /></AreaChart></ResponsiveContainer></div></section><section className="panel report-categories"><div className="panel-heading"><div><h2>Expense breakdown</h2><p>Total by category</p></div></div>{categoryData.length ? categoryData.sort((a,b) => b.value-a.value).map((item, i) => { const percent = totals.expenses ? Math.round(item.value / totals.expenses * 100) : 0; return <div className="breakdown-row" key={item.name}><div className="breakdown-top"><span>{item.name}</span><strong>{money(item.value)} <small>{percent}%</small></strong></div><div className="progress-track"><div className="progress-fill" style={{ width: `${percent}%`, background: ['#4f7fe8', '#55b78a', '#f3ad58', '#9a83df', '#e47b86'][i % 5] }} /></div></div>; }) : <EmptyState title="No report data yet" text="Your expense report will appear when you add expenses." />}</section></>;
}

function SettingsPage({ user, token, onLogout }) {
  return <><section className="welcome-row"><div><p className="eyebrow">YOUR ACCOUNT</p><h1>Settings</h1><p className="page-subtitle">Manage your account and preferences.</p></div></section><section className="panel settings-panel"><h2>Profile information</h2><p className="settings-description">These details are associated with your Pennywise account.</p><div className="settings-field"><span>Name</span><strong>{user?.name || 'Guest User'}</strong></div><div className="settings-field"><span>Email address</span><strong>{user?.email || 'Not signed in'}</strong></div><div className="settings-field"><span>Account status</span><strong>{token ? 'Signed in' : 'Demo mode'}</strong></div>{token ? <button className="button button--light settings-logout" onClick={onLogout}><LogOut size={16} /> Log out</button> : <p className="settings-description">Create an account to store your transactions securely in the database.</p>}</section></>;
}

function EmptyState({ title, text }) {
  return <div className="empty-state"><span className="empty-icon"><Wallet size={21} /></span><strong>{title}</strong><p>{text}</p></div>;
}

function TransactionModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial ? { ...initial, date: String(initial.date).slice(0, 10) } : { title: '', category: 'Food', type: 'expense', amount: '', date: new Date().toISOString().slice(0, 10), note: '' });
  const [error, setError] = useState('');
  const update = (key, value) => setForm(current => ({ ...current, [key]: value, ...(key === 'type' ? { category: value === 'income' ? 'Salary' : 'Food' } : {}) }));
  const submit = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.amount || Number(form.amount) <= 0 || !form.date) { setError('Enter a title, a positive amount, and a date.'); return; }
    try { await onSave({ ...form, title: form.title.trim(), amount: Number(form.amount), date: form.date }); }
    catch (e) { setError(e.message || 'Unable to save transaction.'); }
  };
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="transaction-modal-title"><div className="modal-heading"><div><p className="eyebrow">{initial ? 'UPDATE RECORD' : 'NEW RECORD'}</p><h2 id="transaction-modal-title">{initial ? 'Edit transaction' : 'Add transaction'}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={19} /></button></div><form onSubmit={submit} className="transaction-form"><label className="field-label">Transaction type<div className="type-toggle"><button type="button" className={form.type === 'expense' ? 'type-option type-option--expense selected' : 'type-option'} onClick={() => update('type', 'expense')}><ArrowUpRight size={16} /> Expense</button><button type="button" className={form.type === 'income' ? 'type-option type-option--income selected' : 'type-option'} onClick={() => update('type', 'income')}><ArrowDownLeft size={16} /> Income</button></div></label><label className="field-label">Title<input autoFocus maxLength="100" value={form.title} onChange={e => update('title', e.target.value)} placeholder="e.g. Grocery shopping" /></label><div className="form-two-columns"><label className="field-label">Amount (₹)<input type="number" min="0.01" step="0.01" value={form.amount} onChange={e => update('amount', e.target.value)} placeholder="0.00" /></label><label className="field-label">Date<input type="date" value={form.date} onChange={e => update('date', e.target.value)} /></label></div><label className="field-label">Category<select value={form.category} onChange={e => update('category', e.target.value)}>{categories[form.type].map(category => <option key={category}>{category}</option>)}</select></label><label className="field-label">Note <span className="optional-label">Optional</span><textarea maxLength="300" rows="2" value={form.note || ''} onChange={e => update('note', e.target.value)} placeholder="Add a short note..." /></label>{error && <p className="form-error">{error}</p>}<div className="modal-actions"><button type="button" className="button button--light" onClick={onClose}>Cancel</button><button className="button button--primary" type="submit">{initial ? 'Save changes' : 'Save transaction'}</button></div></form></section></div>;
}

function AuthPage({ mode, onSubmit }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const register = mode === 'register';
  const submit = async (e) => {
    e.preventDefault(); setError(''); setBusy(true);
    try { await onSubmit(mode, form); } catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  return <main className="auth-page"><div className="auth-brand"><span className="brand-mark"><Wallet size={20} /></span><span>Pennywise<small>PERSONAL FINANCE</small></span></div><section className="auth-card"><div className="auth-icon"><Wallet size={23} /></div><p className="eyebrow">{register ? 'GET STARTED' : 'WELCOME BACK'}</p><h1>{register ? 'Create your account' : 'Sign in to Pennywise'}</h1><p className="auth-subtitle">{register ? 'Start building healthier money habits today.' : 'Enter your details to access your finances.'}</p><form className="auth-form" onSubmit={submit}>{register && <label className="field-label">Full name<input required autoComplete="name" minLength="2" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></label>}<label className="field-label">Email address<input required type="email" autoComplete="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label><label className="field-label">Password<input required type="password" minLength="8" autoComplete={register ? 'new-password' : 'current-password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" /></label>{error && <p className="form-error">{error}</p>}<button className="button button--primary auth-submit" disabled={busy}>{busy ? 'Please wait…' : register ? 'Create account' : 'Sign in'}</button></form><p className="auth-switch">{register ? 'Already have an account?' : 'New to Pennywise?'} <button onClick={() => navigate(register ? '/login' : '/register')}>{register ? 'Sign in' : 'Create account'}</button></p><button className="back-home" onClick={() => navigate('/')}>← Back to dashboard</button></section><p className="auth-footnote">Your finances, clearly organized.</p></main>;
}

export default App;
