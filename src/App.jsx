
import { useState, useEffect, createContext, useContext } from "react";

// ─── Router (hash-based for portability) ───────────────────────────────────
function useRouter() {
  const [path, setPath] = useState(() => window.location.hash.replace("#", "") || "/");
  useEffect(() => {
    const handler = () => setPath(window.location.hash.replace("#", "") || "/");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  const navigate = (to) => { window.location.hash = to; };
  return { path, navigate };
}

function Link({ to, children, className = "", style = {} }) {
  return (
    <a href={`#${to}`} className={className} style={style} onClick={e => { e.preventDefault(); window.location.hash = to; }}>
      {children}
    </a>
  );
}

// ─── Auth Context ────────────────────────────────────────────────────────────
const AuthCtx = createContext(null);
function useAuth() { return useContext(AuthCtx); }

// ─── Cart Context ────────────────────────────────────────────────────────────
const CartCtx = createContext(null);
function useCart() { return useContext(CartCtx); }

// ─── Design Tokens ──────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --forest: #1a3a2a;
    --pine: #2d5a3d;
    --sage: #4a8c5c;
    --mint: #6dbb7a;
    --lime: #a8d5a2;
    --cream: #f5f0e8;
    --sand: #e8dcc8;
    --bark: #8b6914;
    --gold: #d4a017;
    --amber: #f0c040;
    --white: #ffffff;
    --ink: #1a1f16;
    --muted: #5a6b5a;
    --border: #d0e0d0;
    --card: #ffffff;
    --bg: #f0f5f0;
    --sidebar-w: 240px;
    --topbar-h: 64px;
    --radius: 12px;
    --shadow: 0 2px 16px rgba(26,58,42,0.10);
    --shadow-lg: 0 8px 40px rgba(26,58,42,0.15);
  }

  html, body { height: 100%; font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--ink); }

  h1,h2,h3,h4,h5,h6 { font-family: 'Syne', sans-serif; }

  a { text-decoration: none; color: inherit; }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--lime); border-radius: 3px; }

  /* ── Layout ── */
  .app-shell { display: flex; min-height: 100vh; }
  .main-content { flex: 1; display: flex; flex-direction: column; min-width: 0; }
  .page-body { flex: 1; padding: 28px; overflow-y: auto; }

  /* ── Sidebar ── */
  .sidebar {
    width: var(--sidebar-w); background: var(--forest); color: var(--white);
    display: flex; flex-direction: column; position: fixed; top: 0; left: 0;
    height: 100vh; z-index: 100; transition: transform .3s;
  }
  .sidebar-logo {
    padding: 20px 20px 16px; border-bottom: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; gap: 10px;
  }
  .sidebar-logo-icon {
    width: 36px; height: 36px; background: var(--sage); border-radius: 8px;
    display: flex; align-items: center; justify-content: center; font-size: 18px;
  }
  .sidebar-logo-text { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 15px; line-height: 1.1; }
  .sidebar-logo-sub { font-size: 10px; opacity: 0.5; font-weight: 400; }
  .sidebar-section { padding: 16px 12px 4px; }
  .sidebar-section-label { font-size: 10px; letter-spacing: 1.5px; opacity: 0.4; font-weight: 600; text-transform: uppercase; padding: 0 8px; margin-bottom: 4px; }
  .sidebar-link {
    display: flex; align-items: center; gap: 10px; padding: 9px 12px;
    border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer;
    transition: all .15s; color: rgba(255,255,255,0.7); margin-bottom: 2px;
  }
  .sidebar-link:hover { background: rgba(255,255,255,0.08); color: var(--white); }
  .sidebar-link.active { background: var(--sage); color: var(--white); }
  .sidebar-link-icon { width: 18px; text-align: center; font-size: 16px; }
  .sidebar-footer { margin-top: auto; padding: 16px; border-top: 1px solid rgba(255,255,255,0.08); }
  .sidebar-user { display: flex; align-items: center; gap: 10px; }
  .sidebar-avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--sage); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; }
  .sidebar-user-info { flex: 1; min-width: 0; }
  .sidebar-user-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sidebar-user-role { font-size: 11px; opacity: 0.5; }

  /* ── Topbar ── */
  .topbar {
    height: var(--topbar-h); background: var(--white); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 16px; padding: 0 24px;
    position: sticky; top: 0; z-index: 50; margin-left: var(--sidebar-w);
  }
  .topbar-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; flex: 1; }
  .topbar-actions { display: flex; align-items: center; gap: 12px; }
  .topbar-btn {
    width: 38px; height: 38px; border-radius: 8px; border: 1px solid var(--border);
    background: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 16px; position: relative; transition: all .15s;
  }
  .topbar-btn:hover { background: var(--bg); }
  .badge {
    position: absolute; top: -4px; right: -4px; width: 16px; height: 16px;
    background: var(--sage); border-radius: 50%; font-size: 9px; color: white;
    display: flex; align-items: center; justify-content: center; font-weight: 700;
  }

  /* ── Content with sidebar offset ── */
  .with-sidebar { margin-left: var(--sidebar-w); }

  /* ── Public nav ── */
  .pub-nav {
    height: var(--topbar-h); background: var(--white); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 32px; gap: 32px; position: sticky; top: 0; z-index: 100;
  }
  .pub-nav-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px; color: var(--forest); display: flex; align-items: center; gap: 8px; }
  .pub-nav-links { display: flex; gap: 8px; flex: 1; }
  .pub-nav-link { padding: 7px 14px; border-radius: 8px; font-size: 14px; font-weight: 500; color: var(--muted); transition: all .15s; cursor: pointer; }
  .pub-nav-link:hover { color: var(--forest); background: var(--bg); }
  .pub-nav-link.active { color: var(--forest); font-weight: 600; }
  .pub-nav-actions { display: flex; gap: 8px; align-items: center; }

  /* ── Buttons ── */
  .btn {
    display: inline-flex; align-items: center; gap: 7px; padding: 9px 18px;
    border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;
    transition: all .15s; border: none; font-family: 'DM Sans', sans-serif; white-space: nowrap;
  }
  .btn-primary { background: var(--sage); color: white; }
  .btn-primary:hover { background: var(--pine); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(74,140,92,0.3); }
  .btn-secondary { background: var(--bg); color: var(--ink); border: 1px solid var(--border); }
  .btn-secondary:hover { background: var(--sand); }
  .btn-outline { background: transparent; color: var(--sage); border: 2px solid var(--sage); }
  .btn-outline:hover { background: var(--sage); color: white; }
  .btn-danger { background: #dc2626; color: white; }
  .btn-danger:hover { background: #b91c1c; }
  .btn-sm { padding: 6px 12px; font-size: 13px; }
  .btn-lg { padding: 14px 28px; font-size: 16px; }
  .btn-icon { padding: 9px; width: 38px; height: 38px; justify-content: center; }

  /* ── Cards ── */
  .card {
    background: var(--card); border-radius: var(--radius); box-shadow: var(--shadow);
    border: 1px solid var(--border);
  }
  .card-pad { padding: 24px; }
  .card-header { padding: 18px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .card-body { padding: 20px 24px; }

  /* ── Stat Cards ── */
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .stat-card {
    background: var(--card); border-radius: var(--radius); padding: 20px;
    border: 1px solid var(--border); box-shadow: var(--shadow);
    display: flex; flex-direction: column; gap: 8px;
  }
  .stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
  .stat-value { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; }
  .stat-label { font-size: 13px; color: var(--muted); font-weight: 500; }
  .stat-delta { font-size: 12px; font-weight: 600; }
  .stat-delta.up { color: #16a34a; }
  .stat-delta.down { color: #dc2626; }

  /* ── Product Cards ── */
  .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
  .product-card {
    background: var(--card); border-radius: var(--radius); border: 1px solid var(--border);
    box-shadow: var(--shadow); overflow: hidden; transition: all .2s; cursor: pointer;
  }
  .product-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); }
  .product-img {
    height: 160px; background: linear-gradient(135deg, var(--lime) 0%, var(--sage) 100%);
    display: flex; align-items: center; justify-content: center; font-size: 52px; position: relative;
  }
  .product-badge {
    position: absolute; top: 10px; left: 10px; background: var(--forest); color: white;
    font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 20px;
  }
  .product-info { padding: 16px; }
  .product-name { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; margin-bottom: 4px; }
  .product-farmer { font-size: 12px; color: var(--muted); margin-bottom: 8px; }
  .product-meta { display: flex; align-items: center; justify-content: space-between; }
  .product-price { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: var(--pine); }
  .product-rating { font-size: 12px; color: var(--bark); }

  /* ── Tables ── */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th { background: var(--bg); padding: 11px 16px; text-align: left; font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--border); }
  td { padding: 13px 16px; border-bottom: 1px solid var(--border); }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--bg); }

  /* ── Badges ── */
  .pill { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
  .pill-green { background: #dcfce7; color: #15803d; }
  .pill-yellow { background: #fef9c3; color: #854d0e; }
  .pill-red { background: #fee2e2; color: #991b1b; }
  .pill-blue { background: #dbeafe; color: #1d4ed8; }
  .pill-gray { background: #f3f4f6; color: #4b5563; }
  .pill-orange { background: #ffedd5; color: #9a3412; }

  /* ── Forms ── */
  .form-group { margin-bottom: 18px; }
  .form-label { display: block; font-size: 13px; font-weight: 600; color: var(--ink); margin-bottom: 6px; }
  .form-input {
    width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px;
    font-size: 14px; font-family: 'DM Sans', sans-serif; background: white; color: var(--ink);
    transition: border-color .15s; outline: none;
  }
  .form-input:focus { border-color: var(--sage); box-shadow: 0 0 0 3px rgba(74,140,92,0.12); }
  .form-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235a6b5a' stroke-width='1.5' fill='none'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px; }
  textarea.form-input { min-height: 100px; resize: vertical; }

  /* ── Timeline ── */
  .timeline { position: relative; padding-left: 28px; }
  .timeline::before { content: ''; position: absolute; left: 9px; top: 0; bottom: 0; width: 2px; background: var(--border); }
  .timeline-item { position: relative; margin-bottom: 20px; }
  .timeline-dot {
    position: absolute; left: -23px; top: 4px; width: 14px; height: 14px;
    border-radius: 50%; background: var(--sage); border: 3px solid white; box-shadow: 0 0 0 2px var(--sage);
  }
  .timeline-dot.done { background: var(--pine); }
  .timeline-dot.pending { background: var(--border); box-shadow: 0 0 0 2px var(--border); }
  .timeline-title { font-weight: 600; font-size: 14px; }
  .timeline-meta { font-size: 12px; color: var(--muted); margin-top: 2px; }

  /* ── Chart placeholder ── */
  .chart-bar-wrap { display: flex; align-items: flex-end; gap: 6px; height: 120px; padding-top: 8px; }
  .chart-bar { flex: 1; border-radius: 4px 4px 0 0; background: linear-gradient(180deg, var(--mint) 0%, var(--sage) 100%); transition: all .3s; cursor: pointer; min-width: 12px; }
  .chart-bar:hover { filter: brightness(1.1); }
  .chart-labels { display: flex; gap: 6px; margin-top: 6px; }
  .chart-label { flex: 1; text-align: center; font-size: 10px; color: var(--muted); }

  /* ── Misc ── */
  .page-header { margin-bottom: 24px; }
  .page-title { font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800; }
  .page-sub { color: var(--muted); font-size: 14px; margin-top: 4px; }
  .section-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; margin-bottom: 16px; }
  .divider { border: none; border-top: 1px solid var(--border); margin: 20px 0; }
  .flex { display: flex; }
  .flex-1 { flex: 1; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .gap-2 { gap: 8px; }
  .gap-3 { gap: 12px; }
  .gap-4 { gap: 16px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
  .mb-4 { margin-bottom: 16px; }
  .mb-6 { margin-bottom: 24px; }
  .mt-4 { margin-top: 16px; }
  .text-muted { color: var(--muted); font-size: 13px; }
  .text-sm { font-size: 13px; }
  .font-bold { font-weight: 700; }
  .w-full { width: 100%; }
  .rounded { border-radius: var(--radius); }
  .p-4 { padding: 16px; }
  .qr-box {
    width: 160px; height: 160px; border: 2px solid var(--border); border-radius: 12px;
    display: flex; align-items: center; justify-content: center; font-size: 72px;
    background: white; box-shadow: var(--shadow);
  }
  .hero { background: linear-gradient(135deg, var(--forest) 0%, var(--pine) 60%, var(--sage) 100%); color: white; padding: 80px 32px; text-align: center; }
  .hero-title { font-family: 'Syne', sans-serif; font-size: 48px; font-weight: 800; line-height: 1.1; margin-bottom: 16px; }
  .hero-sub { font-size: 18px; opacity: 0.8; max-width: 560px; margin: 0 auto 32px; }
  .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; padding: 48px 32px; }
  .feature-card { background: white; border-radius: var(--radius); padding: 28px; border: 1px solid var(--border); box-shadow: var(--shadow); }
  .feature-icon { font-size: 36px; margin-bottom: 14px; }
  .feature-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 8px; }
  .feature-desc { font-size: 14px; color: var(--muted); line-height: 1.6; }
  .chain-step { display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .chain-icon { width: 64px; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 28px; }
  .chain-arrow { font-size: 24px; color: var(--muted); }
  .chain-label { font-size: 13px; font-weight: 600; }
  .chatbot {
    position: fixed; bottom: 24px; right: 24px; z-index: 999;
  }
  .chatbot-btn {
    width: 56px; height: 56px; border-radius: 50%; background: var(--sage); color: white;
    display: flex; align-items: center; justify-content: center; font-size: 22px;
    cursor: pointer; box-shadow: 0 4px 20px rgba(74,140,92,0.4); border: none; transition: all .2s;
  }
  .chatbot-btn:hover { transform: scale(1.08); background: var(--pine); }
  .chatbot-panel {
    position: absolute; bottom: 64px; right: 0; width: 300px; background: white;
    border-radius: 16px; box-shadow: var(--shadow-lg); border: 1px solid var(--border);
    overflow: hidden;
  }
  .chatbot-header { background: var(--forest); color: white; padding: 14px 16px; display: flex; align-items: center; gap: 10px; }
  .chatbot-messages { height: 220px; overflow-y: auto; padding: 12px; display: flex; flex-direction: column; gap: 8px; }
  .chat-msg { padding: 8px 12px; border-radius: 10px; font-size: 13px; max-width: 85%; }
  .chat-msg.bot { background: var(--bg); align-self: flex-start; }
  .chat-msg.user { background: var(--sage); color: white; align-self: flex-end; }
  .chatbot-input { display: flex; padding: 10px; border-top: 1px solid var(--border); gap: 6px; }
  .chatbot-input input { flex: 1; border: 1px solid var(--border); border-radius: 8px; padding: 7px 10px; font-size: 13px; outline: none; }
  .chatbot-input input:focus { border-color: var(--sage); }
  .empty-state { text-align: center; padding: 60px 20px; }
  .empty-icon { font-size: 48px; margin-bottom: 12px; }
  .empty-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 8px; }
  .empty-desc { color: var(--muted); font-size: 14px; }
  .inventory-bar { height: 6px; border-radius: 3px; background: var(--border); overflow: hidden; margin-top: 4px; }
  .inventory-fill { height: 100%; border-radius: 3px; background: linear-gradient(90deg, var(--sage), var(--mint)); }
  .tag { display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; background: var(--lime); color: var(--forest); margin-right: 4px; }
  .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--forest) 0%, var(--pine) 100%); padding: 20px; }
  .login-card { background: white; border-radius: 20px; padding: 40px; width: 100%; max-width: 420px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
  .login-logo { text-align: center; margin-bottom: 28px; }
  .login-title { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; margin-bottom: 6px; }
  .role-btn { width: 100%; padding: 12px; border-radius: 10px; border: 2px solid var(--border); background: white; cursor: pointer; text-align: left; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; transition: all .15s; display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .role-btn:hover { border-color: var(--sage); background: #f0faf2; }
  .role-btn.selected { border-color: var(--sage); background: #f0faf2; }
  .cart-item { display: flex; align-items: center; gap: 16px; padding: 14px 0; border-bottom: 1px solid var(--border); }
  .cart-item-img { width: 56px; height: 56px; background: linear-gradient(135deg, var(--lime), var(--sage)); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; }
  .qty-ctrl { display: flex; align-items: center; gap: 8px; }
  .qty-btn { width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border); background: white; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; }
  .qty-btn:hover { background: var(--bg); }
`;

// ─── Data ──────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1, name: "Organic Basmati Rice", farmer: "Ravi Kumar Farm", price: 85, unit: "kg", icon: "🌾", category: "Grains", rating: "4.8", origin: "Punjab", certified: true, stock: 450, desc: "Premium long-grain basmati rice grown without pesticides in the fertile fields of Punjab. Aged 2 years for superior aroma." },
  { id: 2, name: "Alphonso Mangoes", farmer: "Devgad Farms", price: 320, unit: "dozen", icon: "🥭", category: "Fruits", rating: "4.9", origin: "Ratnagiri", certified: true, stock: 120, desc: "GI-tagged Alphonso mangoes from Ratnagiri. Hand-picked at perfect ripeness for maximum sweetness." },
  { id: 3, name: "Fresh Spinach", farmer: "GreenLeaf Co-op", price: 28, unit: "bundle", icon: "🥬", category: "Vegetables", rating: "4.6", origin: "Nashik", certified: false, stock: 80, desc: "Tender baby spinach leaves harvested daily at dawn. Perfect for salads and cooking." },
  { id: 4, name: "Turmeric Powder", farmer: "Spice Valley", price: 160, unit: "500g", icon: "🌿", category: "Spices", rating: "4.7", origin: "Erode", certified: true, stock: 300, desc: "High-curcumin Lakadong turmeric, stone-ground to preserve natural oils and potency." },
  { id: 5, name: "Red Onions", farmer: "Nasik Onion Farm", price: 35, unit: "kg", icon: "🧅", category: "Vegetables", rating: "4.5", origin: "Nashik", certified: false, stock: 600, desc: "Large, pungent red onions perfect for Indian cooking. Directly from Nashik's best farms." },
  { id: 6, name: "A2 Cow Ghee", farmer: "Gir Gaushala", price: 850, unit: "liter", icon: "🫙", category: "Dairy", rating: "5.0", origin: "Gujarat", certified: true, stock: 90, desc: "Traditionally churned ghee from free-grazing Gir cows. Bilona method ensures premium quality." },
  { id: 7, name: "Finger Millet", farmer: "Sahyadri Organics", price: 72, unit: "kg", icon: "🌱", category: "Grains", rating: "4.7", origin: "Karnataka", certified: true, stock: 200, desc: "Nutrient-dense ragi (finger millet) grown using traditional methods in Karnataka highlands." },
  { id: 8, name: "Moringa Leaves", farmer: "TropiFarm", price: 45, unit: "250g", icon: "🍃", category: "Herbs", rating: "4.8", origin: "Tamil Nadu", certified: true, stock: 150, desc: "Freshly dried moringa drumstick leaves, packed with nutrients. Sustainably harvested." },
];

const BATCHES = [
  { id: "BCH-001", product: "Organic Basmati Rice", qty: "500 kg", date: "2024-03-01", status: "delivered", price: 42500 },
  { id: "BCH-002", product: "Turmeric Powder", qty: "200 kg", date: "2024-03-05", status: "in_transit", price: 32000 },
  { id: "BCH-003", product: "Fresh Spinach", qty: "80 bundles", date: "2024-03-08", status: "processing", price: 2240 },
  { id: "BCH-004", product: "Finger Millet", qty: "350 kg", date: "2024-03-10", status: "pending", price: 25200 },
];

const SHIPMENTS = [
  { id: "SHP-101", batch: "BCH-001", from: "Punjab", to: "Delhi Hub", status: "delivered", eta: "2024-03-07", weight: "500 kg" },
  { id: "SHP-102", batch: "BCH-002", from: "Erode", to: "Mumbai DC", status: "in_transit", eta: "2024-03-12", weight: "200 kg" },
  { id: "SHP-103", batch: "BCH-004", from: "Karnataka", to: "Bangalore DC", status: "pending", eta: "2024-03-15", weight: "350 kg" },
];

const USERS_LIST = [
  { id: 1, name: "Ravi Kumar", email: "ravi@farm.in", role: "Farmer", status: "active", joined: "Jan 2024" },
  { id: 2, name: "Priya Sharma", email: "priya@dist.in", role: "Distributor", status: "active", joined: "Feb 2024" },
  { id: 3, name: "Amit Patel", email: "amit@retail.in", role: "Retailer", status: "active", joined: "Feb 2024" },
  { id: 4, name: "Meera Nair", email: "meera@email.in", role: "Consumer", status: "active", joined: "Mar 2024" },
  { id: 5, name: "Suresh Reddy", email: "suresh@farm.in", role: "Farmer", status: "inactive", joined: "Jan 2024" },
  { id: 6, name: "Kavita Singh", email: "kavita@retail.in", role: "Retailer", status: "active", joined: "Mar 2024" },
];



// ─── Chatbot Widget ──────────────────────────────────────────────────────────
function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { from: "bot", text: "Hi! I'm FarmBot 🌱 How can I help you today?" },
    { from: "bot", text: "I can help with orders, batches, or supply chain queries." }
  ]);
  const [input, setInput] = useState("");
  const botReplies = [
    "I'm checking that for you... ✅",
    "Your batch BCH-002 is currently in transit and expected to arrive by Mar 12.",
    "To trace a product, scan the QR code on the packaging.",
    "Certified organic products are marked with the 🌿 badge.",
    "For urgent issues, please raise a support ticket."
  ];
  const send = () => {
    if (!input.trim()) return;
    setMsgs(m => [...m, { from: "user", text: input }]);
    const reply = botReplies[Math.floor(Math.random() * botReplies.length)];
    setTimeout(() => setMsgs(m => [...m, { from: "bot", text: reply }]), 800);
    setInput("");
  };
  return (
    <div className="chatbot">
      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <span style={{ fontSize: 20 }}>🤖</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>FarmBot AI</div>
              <div style={{ fontSize: 11, opacity: 0.7 }}>Always online</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 18 }}>✕</button>
          </div>
          <div className="chatbot-messages">
            {msgs.map((m, i) => <div key={i} className={`chat-msg ${m.from}`}>{m.text}</div>)}
          </div>
          <div className="chatbot-input">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Type a message..." />
            <button className="btn btn-primary btn-sm" onClick={send}>↑</button>
          </div>
        </div>
      )}
      <button className="chatbot-btn" onClick={() => setOpen(o => !o)}>🤖</button>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ role, nav, user }) {
  const { path } = useRouter();
  const icons = { "🏠": true, "📦": true, "🚚": true, "📊": true, "👥": true };
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🌾</div>
        <div>
          <div className="sidebar-logo-text">FarmChainX</div>
          <div className="sidebar-logo-sub">{role} Portal</div>
        </div>
      </div>
      {nav.map((section, si) => (
        <div className="sidebar-section" key={si}>
          {section.label && <div className="sidebar-section-label">{section.label}</div>}
          {section.items.map((item, ii) => (
            <Link key={ii} to={item.href}>
              <div className={`sidebar-link ${path === item.href ? "active" : ""}`}>
                <span className="sidebar-link-icon">{item.icon}</span>
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      ))}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{user.name[0]}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-role">{role}</div>
          </div>
          <Link to="/login"><span style={{ cursor: "pointer", opacity: 0.5, fontSize: 16 }}>↩</span></Link>
        </div>
      </div>
    </div>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────
function Topbar({ title, cartCount = 0 }) {
  return (
    <div className="topbar">
      <div className="topbar-title">{title}</div>
      <div className="topbar-actions">
        <button className="topbar-btn" title="Search">🔍</button>
        <button className="topbar-btn" title="Notifications">
          🔔<span className="badge">3</span>
        </button>
        {cartCount > 0 && (
          <Link to="/consumer/cart">
            <button className="topbar-btn">🛒<span className="badge">{cartCount}</span></button>
          </Link>
        )}
        <button className="topbar-btn">⚙️</button>
      </div>
    </div>
  );
}

// ─── Public Nav ───────────────────────────────────────────────────────────────
function PublicNav({ cartCount }) {
  const { path } = useRouter();
  return (
    <nav className="pub-nav">
      <Link to="/">
        <div className="pub-nav-logo">🌾 FarmChainX</div>
      </Link>
      <div className="pub-nav-links">
        {[["Home", "/"], ["Marketplace", "/marketplace"], ["About", "/about"], ["Help", "/help"]].map(([l, h]) => (
          <Link key={h} to={h}><div className={`pub-nav-link ${path === h ? "active" : ""}`}>{l}</div></Link>
        ))}
      </div>
      <div className="pub-nav-actions">
        <Link to="/consumer/cart">
          <button className="btn btn-secondary btn-sm">🛒 {cartCount > 0 ? `(${cartCount})` : "Cart"}</button>
        </Link>
        <Link to="/login">
          <button className="btn btn-primary btn-sm">Sign In →</button>
        </Link>
      </div>
    </nav>
  );
}

// ─── Mini Charts ──────────────────────────────────────────────────────────────
function BarChart({ data, labels }) {
  const max = Math.max(...data);
  return (
    <div>
      <div className="chart-bar-wrap">
        {data.map((v, i) => (
          <div key={i} className="chart-bar" style={{ height: `${(v / max) * 100}%` }} title={v} />
        ))}
      </div>
      <div className="chart-labels">
        {labels.map((l, i) => <div key={i} className="chart-label">{l}</div>)}
      </div>
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomePage() {
  return (
    <div>
      <PublicNav cartCount={0} />
      <div className="hero">
        <div style={{ fontSize: 48, marginBottom: 16 }}>🌾</div>
        <div className="hero-title">Transparent Farm-to-Fork<br />Supply Chain</div>
        <div className="hero-sub">FarmChainX connects farmers, distributors, retailers and consumers through blockchain-verified traceability. Know exactly where your food comes from.</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/marketplace"><button className="btn btn-primary btn-lg">Browse Marketplace</button></Link>
          <Link to="/login"><button className="btn" style={{ background: "rgba(255,255,255,0.15)", color: "white", fontSize: 16, padding: "14px 28px", borderRadius: 8, border: "2px solid rgba(255,255,255,0.3)", cursor: "pointer" }}>Get Started →</button></Link>
        </div>
      </div>

      {/* Chain flow */}
      <div style={{ background: "white", padding: "48px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800 }}>How It Works</h2>
          <p style={{ color: "var(--muted)", marginTop: 8 }}>End-to-end transparency from seed to shelf</p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          {[
            ["🧑‍🌾", "Farmer", "Creates batch, logs harvest data"],
            ["🚛", "Distributor", "Ships and tracks logistics"],
            ["🏪", "Retailer", "Lists on platform with trace"],
            ["👨‍👩‍👧", "Consumer", "Scans QR, verifies origin"],
          ].map(([icon, label, desc], i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div className="chain-step">
                <div className="chain-icon" style={{ background: `hsl(${140 - i * 15}, 50%, ${88 - i * 4}%)` }}>{icon}</div>
                <div className="chain-label">{label}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", maxWidth: 100 }}>{desc}</div>
              </div>
              {i < arr.length - 1 && <div className="chain-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="feature-grid" style={{ background: "var(--bg)" }}>
        {[
          ["🔗", "Blockchain Verified", "Every transaction recorded immutably. Full audit trail from farm to fork."],
          ["📱", "QR Traceability", "Consumers scan QR codes to instantly see product journey and certifications."],
          ["📊", "Real-time Analytics", "Farmers and distributors get actionable insights on sales and logistics."],
          ["🌿", "Certified Organic", "Verified certifications displayed prominently for conscious consumers."],
          ["🤖", "AI Assistant", "FarmBot answers queries 24/7 for all stakeholders in the chain."],
          ["🛒", "Seamless Commerce", "Integrated marketplace with secure payments and order tracking."],
        ].map(([icon, title, desc]) => (
          <div className="feature-card" key={title}>
            <div className="feature-icon">{icon}</div>
            <div className="feature-title">{title}</div>
            <div className="feature-desc">{desc}</div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ background: "var(--forest)", color: "white", padding: "48px 32px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800, marginBottom: 32 }}>Trusted by the Ecosystem</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: 60, flexWrap: "wrap" }}>
          {[["1,240+", "Farmers"], ["380+", "Distributors"], ["920+", "Retailers"], ["48,000+", "Consumers"]].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontFamily: "Syne", fontSize: 36, fontWeight: 800, color: "var(--mint)" }}>{v}</div>
              <div style={{ opacity: 0.7, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "32px", textAlign: "center", borderTop: "1px solid var(--border)", background: "white", color: "var(--muted)", fontSize: 13 }}>
        © 2024 FarmChainX · Transparent Agricultural Supply Chain · Made with 🌱
      </div>
      <ChatBot />
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginPage() {
  const { setUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState("farmer");
  const [email, setEmail] = useState("demo@farmchainx.in");
  const [password, setPassword] = useState("demo1234");
  const { navigate } = useRouter();

  const roleMap = {
    farmer: { name: "Ravi Kumar", icon: "🧑‍🌾", dest: "/farmer/dashboard" },
    distributor: { name: "Priya Sharma", icon: "🚛", dest: "/distributor/dashboard" },
    retailer: { name: "Amit Patel", icon: "🏪", dest: "/retailer/dashboard" },
    consumer: { name: "Meera Nair", icon: "👤", dest: "/consumer/cart" },

  };

  const handleLogin = () => {
    const r = roleMap[selectedRole];
    setUser({ name: r.name, role: selectedRole, icon: r.icon });
    navigate(r.dest);
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">
          <div style={{ fontSize: 40 }}>🌾</div>
          <div className="login-title">FarmChainX</div>
          <div style={{ color: "var(--muted)", fontSize: 14 }}>Sign in to your account</div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <div className="form-label" style={{ marginBottom: 10 }}>Select your role</div>
          {Object.entries(roleMap).map(([k, v]) => (
            <button key={k} className={`role-btn ${selectedRole === k ? "selected" : ""}`} onClick={() => setSelectedRole(k)}>
              <span style={{ fontSize: 20 }}>{v.icon}</span>
              <span style={{ textTransform: "capitalize", fontWeight: 600 }}>{k}</span>
              {selectedRole === k && <span style={{ marginLeft: "auto", color: "var(--sage)" }}>✓</span>}
            </button>
          ))}
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary w-full btn-lg" style={{ marginTop: 8 }} onClick={handleLogin}>
          Sign In as {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} →
        </button>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "var(--muted)" }}>
          Demo credentials pre-filled. Just click Sign In.
        </div>
      </div>
    </div>
  );
}

// ─── MARKETPLACE ──────────────────────────────────────────────────────────────
function MarketplacePage() {
  const { addToCart } = useCart();
  const { cartItems } = useCart();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", "Grains", "Fruits", "Vegetables", "Spices", "Dairy", "Herbs"];
  const filtered = PRODUCTS.filter(p =>
    (category === "All" || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <PublicNav cartCount={cartItems.length} />
      <div style={{ padding: "28px 32px" }}>
        <div className="page-header flex items-center justify-between">
          <div>
            <div className="page-title">Marketplace</div>
            <div className="page-sub">{filtered.length} products available from verified farms</div>
          </div>
          <div className="flex gap-2">
            <input className="form-input" style={{ width: 220 }} placeholder="🔍 Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-2 mb-6" style={{ flexWrap: "wrap" }}>
          {categories.map(c => (
            <button key={c} className={`btn btn-sm ${category === c ? "btn-primary" : "btn-secondary"}`} onClick={() => setCategory(c)}>{c}</button>
          ))}
        </div>
        <div className="products-grid">
          {filtered.map(p => (
            <div key={p.id} className="product-card">
              <Link to={`/product/${p.id}`}>
                <div className="product-img">
                  {p.certified && <div className="product-badge">🌿 Certified</div>}
                  {p.icon}
                </div>
                <div className="product-info">
                  <div className="product-name">{p.name}</div>
                  <div className="product-farmer">by {p.farmer} · {p.origin}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>⭐ {p.rating} · In stock: {p.stock} {p.unit}</div>
                  <div className="product-meta">
                    <div className="product-price">₹{p.price}<span style={{ fontSize: 12, fontWeight: 400 }}>/{p.unit}</span></div>
                    <button className="btn btn-primary btn-sm" onClick={e => { e.preventDefault(); addToCart(p); }}>+ Cart</button>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <ChatBot />
    </div>
  );
}

// ─── PRODUCT DETAIL ───────────────────────────────────────────────────────────
function ProductDetailPage({ id }) {
  const { addToCart } = useCart();
  const { cartItems } = useCart();
  const p = PRODUCTS.find(x => x.id === parseInt(id)) || PRODUCTS[0];
  return (
    <div>
      <PublicNav cartCount={cartItems.length} />
      <div style={{ padding: "28px 32px", maxWidth: 960, margin: "0 auto" }}>
        <Link to="/marketplace"><button className="btn btn-secondary btn-sm" style={{ marginBottom: 20 }}>← Back to Marketplace</button></Link>
        <div className="grid-2" style={{ gap: 32 }}>
          <div>
            <div style={{ background: `linear-gradient(135deg, var(--lime), var(--sage))`, borderRadius: 16, height: 280, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 100 }}>
              {p.icon}
            </div>
            <div style={{ marginTop: 16, padding: "16px", background: "white", borderRadius: 12, border: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>🔗 Supply Chain Trace</div>
              <div className="timeline">
                {[
                  { label: "Harvested at farm", meta: `${p.farmer} · ${p.origin}`, done: true },
                  { label: "Quality tested & certified", meta: "FSSAI Lab · Batch verified", done: true },
                  { label: "Shipped by distributor", meta: "TransAgri Logistics · Cold chain", done: true },
                  { label: "Received at retailer", meta: "FreshMart Delhi · Mar 9", done: false },
                  { label: "Available for purchase", meta: "Est. Mar 11", done: false, pending: true },
                ].map((t, i) => (
                  <div className="timeline-item" key={i}>
                    <div className={`timeline-dot ${t.done ? "done" : t.pending ? "pending" : ""}`} />
                    <div className="timeline-title">{t.label}</div>
                    <div className="timeline-meta">{t.meta}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="flex gap-2 mb-4" style={{ flexWrap: "wrap" }}>
              <span className="tag">{p.category}</span>
              {p.certified && <span className="tag" style={{ background: "#dcfce7", color: "#15803d" }}>🌿 Organic Certified</span>}
              <span className="tag" style={{ background: "#dbeafe", color: "#1d4ed8" }}>FSSAI</span>
            </div>
            <h1 style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800, marginBottom: 8 }}>{p.name}</h1>
            <div style={{ color: "var(--muted)", marginBottom: 4 }}>by <strong>{p.farmer}</strong></div>
            <div style={{ marginBottom: 16 }}>⭐ {p.rating} · Origin: {p.origin}</div>
            <div style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, marginBottom: 20 }}>{p.desc}</div>
            <div style={{ fontFamily: "Syne", fontSize: 36, fontWeight: 800, color: "var(--pine)", marginBottom: 20 }}>
              ₹{p.price}<span style={{ fontSize: 16, fontWeight: 400, color: "var(--muted)" }}>/{p.unit}</span>
            </div>
            <div className="flex gap-3 mb-6">
              <button className="btn btn-primary btn-lg" onClick={() => addToCart(p)}>🛒 Add to Cart</button>
              <Link to="/consumer/cart"><button className="btn btn-outline btn-lg">Buy Now</button></Link>
            </div>
            <div className="card card-pad" style={{ marginTop: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>📦 Product Details</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 13 }}>
                {[["In Stock", `${p.stock} ${p.unit}`], ["Batch No", "BCH-001"], ["Harvest Date", "Feb 28, 2024"], ["Expiry", "Dec 2024"]].map(([k, v]) => (
                  <div key={k}><span style={{ color: "var(--muted)" }}>{k}:</span> <strong>{v}</strong></div>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 16 }}>
              <div className="qr-box" style={{ width: 90, height: 90, fontSize: 40 }}>▦</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Scan QR to Verify</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>Scan the QR code on packaging to instantly verify product origin and certifications</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChatBot />
    </div>
  );
}

// ─── FARMER DASHBOARD ─────────────────────────────────────────────────────────
const FARMER_NAV = [
  { label: "Main", items: [
    { icon: "🏠", label: "Dashboard", href: "/farmer/dashboard" },
    { icon: "📦", label: "My Batches", href: "/farmer/batches" },
    { icon: "➕", label: "Create Batch", href: "/farmer/create-batch" },
    { icon: "📊", label: "Analytics", href: "/farmer/analytics" },
    { icon: "▦", label: "QR Codes", href: "/farmer/qr" },
  ]},
  { label: "Account", items: [
    { icon: "❓", label: "Help Center", href: "/help" },
  ]},
];

function FarmerLayout({ title, children }) {
  const { user } = useAuth();
  const { cartItems } = useCart();
  return (
    <div className="app-shell">
      <Sidebar role="Farmer" nav={FARMER_NAV} user={user || { name: "Ravi Kumar" }} />
      <div className="main-content with-sidebar">
        <Topbar title={title} cartCount={cartItems.length} />
        <div className="page-body">{children}</div>
      </div>
      <ChatBot />
    </div>
  );
}

function FarmerDashboard() {
  return (
    <FarmerLayout title="Farmer Dashboard">
      <div className="page-header">
        <div className="page-title">Welcome back, Ravi 👋</div>
        <div className="page-sub">Here's what's happening with your farm today</div>
      </div>
      <div className="stats-grid">
        {[
          { icon: "📦", label: "Active Batches", value: "12", delta: "+3 this week", up: true, bg: "#e8f5e9" },
          { icon: "💰", label: "Revenue (Mar)", value: "₹1.2L", delta: "+18%", up: true, bg: "#fff3e0" },
          { icon: "🚚", label: "In Transit", value: "4", delta: "2 arriving today", up: true, bg: "#e3f2fd" },
          { icon: "⭐", label: "Avg Rating", value: "4.8", delta: "+0.2 vs last month", up: true, bg: "#fce4ec" },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div className={`stat-delta ${s.up ? "up" : "down"}`}>{s.delta}</div>
          </div>
        ))}
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-header"><span style={{ fontWeight: 700 }}>📊 Monthly Revenue</span></div>
          <div className="card-body">
            <BarChart data={[45000, 62000, 38000, 91000, 78000, 110000, 95000]} labels={["Sep","Oct","Nov","Dec","Jan","Feb","Mar"]} />
          </div>
        </div>
        <div className="card">
          <div className="card-header"><span style={{ fontWeight: 700 }}>📦 Recent Batches</span><Link to="/farmer/batches"><span style={{ fontSize: 13, color: "var(--sage)", cursor: "pointer" }}>View all →</span></Link></div>
          <div className="card-body" style={{ padding: 0 }}>
            {BATCHES.slice(0, 3).map(b => (
              <div key={b.id} style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{b.product}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>{b.id} · {b.qty}</div>
                </div>
                <span className={`pill ${b.status === "delivered" ? "pill-green" : b.status === "in_transit" ? "pill-blue" : b.status === "processing" ? "pill-yellow" : "pill-gray"}`} style={{ marginLeft: "auto" }}>
                  {b.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
}

function FarmerBatches() {
  return (
    <FarmerLayout title="My Batches">
      <div className="page-header flex items-center justify-between">
        <div><div className="page-title">My Batches</div><div className="page-sub">Track all your product batches</div></div>
        <Link to="/farmer/create-batch"><button className="btn btn-primary">+ New Batch</button></Link>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Batch ID</th><th>Product</th><th>Quantity</th><th>Date</th><th>Revenue</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {BATCHES.map(b => (
                <tr key={b.id}>
                  <td><strong>{b.id}</strong></td>
                  <td>{b.product}</td>
                  <td>{b.qty}</td>
                  <td>{b.date}</td>
                  <td>₹{b.price.toLocaleString()}</td>
                  <td><span className={`pill ${b.status === "delivered" ? "pill-green" : b.status === "in_transit" ? "pill-blue" : b.status === "processing" ? "pill-yellow" : "pill-gray"}`}>{b.status.replace("_", " ")}</span></td>
                  <td><button className="btn btn-secondary btn-sm">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </FarmerLayout>
  );
}

function FarmerCreateBatch() {
  return (
    <FarmerLayout title="Create New Batch">
      <div style={{ maxWidth: 640 }}>
        <div className="page-header"><div className="page-title">Create New Batch</div><div className="page-sub">Log a new product batch to the supply chain</div></div>
        <div className="card card-pad">
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Product Name</label><input className="form-input" placeholder="e.g. Organic Basmati Rice" /></div>
            <div className="form-group"><label className="form-label">Category</label><select className="form-input form-select"><option>Grains</option><option>Fruits</option><option>Vegetables</option><option>Spices</option><option>Dairy</option></select></div>
            <div className="form-group"><label className="form-label">Quantity (kg)</label><input className="form-input" type="number" placeholder="500" /></div>
            <div className="form-group"><label className="form-label">Price per kg (₹)</label><input className="form-input" type="number" placeholder="85" /></div>
            <div className="form-group"><label className="form-label">Harvest Date</label><input className="form-input" type="date" /></div>
            <div className="form-group"><label className="form-label">Expiry Date</label><input className="form-input" type="date" /></div>
          </div>
          <div className="form-group"><label className="form-label">Farm Location</label><input className="form-input" placeholder="Village, District, State" /></div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" placeholder="Describe growing methods, soil type, any certifications..." /></div>
          <div className="form-group">
            <label className="form-label">Organic Certified?</label>
            <div className="flex gap-3 mt-2">
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}><input type="radio" name="cert" defaultChecked /> Yes, FSSAI Certified</label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}><input type="radio" name="cert" /> No</label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="btn btn-primary">Submit Batch</button>
            <button className="btn btn-secondary">Save Draft</button>
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
}

function FarmerAnalytics() {
  return (
    <FarmerLayout title="Sales Analytics">
      <div className="page-header"><div className="page-title">Sales Analytics</div><div className="page-sub">Track performance across products and seasons</div></div>
      <div className="stats-grid">
        {[["₹6.8L", "Total Revenue", "FY 2024"], ["48 MT", "Total Volume", "All products"], ["94%", "Delivery Rate", "On-time"], ["4.8⭐", "Avg Rating", "Consumer feedback"]].map(([v, l, s]) => (
          <div className="stat-card" key={l}><div className="stat-value">{v}</div><div className="stat-label">{l}</div><div className="text-muted">{s}</div></div>
        ))}
      </div>
      <div className="grid-2 mb-6">
        <div className="card"><div className="card-header"><span style={{ fontWeight: 700 }}>Revenue Trend (Monthly)</span></div><div className="card-body"><BarChart data={[42000, 58000, 71000, 63000, 88000, 95000, 110000, 102000, 118000, 125000, 108000, 142000]} labels={["A","M","J","J","A","S","O","N","D","J","F","M"]} /></div></div>
        <div className="card"><div className="card-header"><span style={{ fontWeight: 700 }}>Product Mix</span></div>
          <div className="card-body">
            {[["🌾 Basmati Rice", 42], ["🌿 Turmeric", 28], ["🌱 Ragi", 18], ["🥬 Spinach", 12]].map(([n, pct]) => (
              <div key={n} style={{ marginBottom: 14 }}>
                <div className="flex justify-between mb-4" style={{ marginBottom: 4 }}><span style={{ fontSize: 14 }}>{n}</span><span style={{ fontWeight: 700 }}>{pct}%</span></div>
                <div className="inventory-bar"><div className="inventory-fill" style={{ width: `${pct}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
}

function FarmerQR() {
  return (
    <FarmerLayout title="QR Code Generator">
      <div className="page-header"><div className="page-title">QR Code Generator</div><div className="page-sub">Generate QR codes for product traceability</div></div>
      <div className="grid-2">
        <div className="card card-pad">
          <div className="section-title">Generate QR Code</div>
          <div className="form-group"><label className="form-label">Select Batch</label><select className="form-input form-select">{BATCHES.map(b => <option key={b.id}>{b.id} – {b.product}</option>)}</select></div>
          <div className="form-group"><label className="form-label">QR Content</label><select className="form-input form-select"><option>Full Trace URL</option><option>Batch Summary</option><option>Farm Certificate</option></select></div>
          <button className="btn btn-primary w-full">Generate QR Code</button>
        </div>
        <div className="card card-pad" style={{ textAlign: "center" }}>
          <div className="section-title">Preview</div>
          <div style={{ display: "flex", justifyContent: "center", margin: "24px 0" }}>
            <div className="qr-box">▦</div>
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>BCH-001 · Organic Basmati Rice</div>
          <div className="flex gap-2" style={{ justifyContent: "center" }}>
            <button className="btn btn-primary btn-sm">📥 Download PNG</button>
            <button className="btn btn-secondary btn-sm">🖨️ Print</button>
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
}

// ─── DISTRIBUTOR ──────────────────────────────────────────────────────────────
const DIST_NAV = [
  { label: "Main", items: [
    { icon: "🏠", label: "Dashboard", href: "/distributor/dashboard" },
    { icon: "🚚", label: "Shipments", href: "/distributor/shipments" },
    { icon: "📍", label: "Tracking", href: "/distributor/tracking" },
  ]},
  { label: "Account", items: [
    { icon: "❓", label: "Help", href: "/help" },
  ]},
];

function DistLayout({ title, children }) {
  const { user } = useAuth();
  return (
    <div className="app-shell">
      <Sidebar role="Distributor" nav={DIST_NAV} user={user || { name: "Priya Sharma" }} />
      <div className="main-content with-sidebar">
        <Topbar title={title} />
        <div className="page-body">{children}</div>
      </div>
      <ChatBot />
    </div>
  );
}

function DistributorDashboard() {
  return (
    <DistLayout title="Distributor Dashboard">
      <div className="page-header"><div className="page-title">Distributor Dashboard</div><div className="page-sub">Manage shipments across the supply chain</div></div>
      <div className="stats-grid">
        {[["🚚", "Active Shipments", "8", "#e3f2fd"], ["📦", "Batches Received", "23", "#e8f5e9"], ["✅", "Delivered Today", "5", "#f3e5f5"], ["⏱️", "Avg Transit Days", "3.2", "#fff3e0"]].map(([i, l, v, bg]) => (
          <div className="stat-card" key={l}><div className="stat-icon" style={{ background: bg }}>{i}</div><div className="stat-value">{v}</div><div className="stat-label">{l}</div></div>
        ))}
      </div>
      <div className="grid-2">
        <div className="card"><div className="card-header"><span style={{ fontWeight: 700 }}>🚚 Active Shipments</span><Link to="/distributor/shipments"><span style={{ fontSize: 13, color: "var(--sage)" }}>All →</span></Link></div>
          <div className="card-body" style={{ padding: 0 }}>
            {SHIPMENTS.map(s => (
              <div key={s.id} style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)" }}>
                <div className="flex justify-between items-center">
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{s.id}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{s.from} → {s.to} · {s.weight}</div>
                  </div>
                  <span className={`pill ${s.status === "delivered" ? "pill-green" : s.status === "in_transit" ? "pill-blue" : "pill-gray"}`}>{s.status.replace("_", " ")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card"><div className="card-header"><span style={{ fontWeight: 700 }}>📊 Shipment Volume</span></div><div className="card-body"><BarChart data={[12, 18, 14, 22, 19, 28, 24]} labels={["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]} /></div></div>
      </div>
    </DistLayout>
  );
}

function DistributorShipments() {
  return (
    <DistLayout title="Shipment Management">
      <div className="page-header flex items-center justify-between">
        <div><div className="page-title">Shipments</div><div className="page-sub">Manage all logistics operations</div></div>
        <button className="btn btn-primary">+ New Shipment</button>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Shipment ID</th><th>Batch</th><th>Route</th><th>Weight</th><th>ETA</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {SHIPMENTS.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.id}</strong></td>
                  <td>{s.batch}</td>
                  <td>{s.from} → {s.to}</td>
                  <td>{s.weight}</td>
                  <td>{s.eta}</td>
                  <td><span className={`pill ${s.status === "delivered" ? "pill-green" : s.status === "in_transit" ? "pill-blue" : "pill-gray"}`}>{s.status.replace("_", " ")}</span></td>
                  <td className="flex gap-2"><button className="btn btn-secondary btn-sm">Track</button><button className="btn btn-secondary btn-sm">Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DistLayout>
  );
}

function DistributorTracking() {
  return (
    <DistLayout title="Shipment Tracking">
      <div className="page-header"><div className="page-title">Live Tracking</div><div className="page-sub">Real-time shipment positions</div></div>
      <div className="grid-2">
        <div>
          {SHIPMENTS.map(s => (
            <div className="card card-pad mb-4" key={s.id}>
              <div className="flex justify-between items-center mb-4">
                <div><div style={{ fontWeight: 700 }}>{s.id}</div><div style={{ fontSize: 13, color: "var(--muted)" }}>Batch {s.batch}</div></div>
                <span className={`pill ${s.status === "delivered" ? "pill-green" : s.status === "in_transit" ? "pill-blue" : "pill-gray"}`}>{s.status.replace("_", " ")}</span>
              </div>
              <div className="timeline" style={{ marginLeft: 8 }}>
                <div className="timeline-item"><div className="timeline-dot done" /><div className="timeline-title">Picked up from {s.from}</div><div className="timeline-meta">Mar 5, 6:00 AM</div></div>
                <div className="timeline-item"><div className={`timeline-dot ${s.status !== "pending" ? "done" : "pending"}`} /><div className="timeline-title">In Transit</div><div className="timeline-meta">ETA: {s.eta}</div></div>
                <div className="timeline-item"><div className={`timeline-dot ${s.status === "delivered" ? "done" : "pending"}`} /><div className="timeline-title">Delivered at {s.to}</div><div className="timeline-meta">{s.status === "delivered" ? "Completed" : "Pending"}</div></div>
              </div>
            </div>
          ))}
        </div>
        <div className="card" style={{ height: "fit-content" }}>
          <div className="card-header"><span style={{ fontWeight: 700 }}>🗺️ Route Map</span></div>
          <div style={{ background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)", height: 320, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 48 }}>🗺️</div>
            <div style={{ fontWeight: 600, color: "var(--forest)" }}>Interactive Map</div>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>Live GPS tracking active</div>
            <div style={{ display: "flex", gap: 8 }}>
              {["🚚 SHP-101", "🚚 SHP-102"].map(l => <span key={l} className="pill pill-green">{l}</span>)}
            </div>
          </div>
        </div>
      </div>
    </DistLayout>
  );
}

// ─── RETAILER ─────────────────────────────────────────────────────────────────
const RETAIL_NAV = [
  { label: "Main", items: [
    { icon: "🏠", label: "Dashboard", href: "/retailer/dashboard" },
    { icon: "📋", label: "Inventory", href: "/retailer/inventory" },
    { icon: "🏷️", label: "Product Listings", href: "/retailer/listings" },
    { icon: "📬", label: "Orders", href: "/retailer/orders" },
  ]},
  { label: "Account", items: [{ icon: "❓", label: "Help", href: "/help" }] },
];

function RetailLayout({ title, children }) {
  const { user } = useAuth();
  return (
    <div className="app-shell">
      <Sidebar role="Retailer" nav={RETAIL_NAV} user={user || { name: "Amit Patel" }} />
      <div className="main-content with-sidebar">
        <Topbar title={title} />
        <div className="page-body">{children}</div>
      </div>
      <ChatBot />
    </div>
  );
}

function RetailerDashboard() {
  return (
    <RetailLayout title="Retailer Dashboard">
      <div className="page-header"><div className="page-title">Retailer Dashboard</div><div className="page-sub">Manage your store's supply chain presence</div></div>
      <div className="stats-grid">
        {[["🛍️", "Orders Today", "47", "#e8f5e9"], ["💰", "Revenue (Mar)", "₹3.8L", "#fff3e0"], ["📦", "Low Stock Items", "6", "#fee2e2"], ["⭐", "Store Rating", "4.6", "#fce4ec"]].map(([i, l, v, bg]) => (
          <div className="stat-card" key={l}><div className="stat-icon" style={{ background: bg }}>{i}</div><div className="stat-value">{v}</div><div className="stat-label">{l}</div></div>
        ))}
      </div>
      <div className="grid-2">
        <div className="card"><div className="card-header"><span style={{ fontWeight: 700 }}>📊 Sales This Week</span></div><div className="card-body"><BarChart data={[38000, 45000, 41000, 62000, 58000, 71000, 55000]} labels={["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]} /></div></div>
        <div className="card"><div className="card-header"><span style={{ fontWeight: 700 }}>⚠️ Low Stock Alerts</span></div>
          <div className="card-body" style={{ padding: 0 }}>
            {PRODUCTS.filter(p => p.stock < 150).map(p => (
              <div key={p.id} style={{ padding: "10px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 22 }}>{p.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: p.stock < 100 ? "#dc2626" : "var(--muted)" }}>Stock: {p.stock} {p.unit}</div>
                  <div className="inventory-bar"><div className="inventory-fill" style={{ width: `${(p.stock / 200) * 100}%`, background: p.stock < 100 ? "#ef4444" : undefined }} /></div>
                </div>
                <button className="btn btn-primary btn-sm">Reorder</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </RetailLayout>
  );
}

function RetailerInventory() {
  return (
    <RetailLayout title="Inventory">
      <div className="page-header flex items-center justify-between">
        <div><div className="page-title">Inventory</div><div className="page-sub">Manage your product stock levels</div></div>
        <div className="flex gap-2"><button className="btn btn-secondary">📥 Import</button><button className="btn btn-primary">+ Add Item</button></div>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Product</th><th>Category</th><th>Stock</th><th>Level</th><th>Price</th><th>Origin</th><th>Status</th></tr></thead>
            <tbody>
              {PRODUCTS.map(p => (
                <tr key={p.id}>
                  <td><div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontSize: 20 }}>{p.icon}</span><strong>{p.name}</strong></div></td>
                  <td>{p.category}</td>
                  <td>{p.stock} {p.unit}</td>
                  <td style={{ width: 120 }}><div className="inventory-bar"><div className="inventory-fill" style={{ width: `${Math.min(100, (p.stock / 500) * 100)}%`, background: p.stock < 100 ? "#ef4444" : undefined }} /></div></td>
                  <td>₹{p.price}/{p.unit}</td>
                  <td>{p.origin}</td>
                  <td><span className={`pill ${p.stock > 200 ? "pill-green" : p.stock > 100 ? "pill-yellow" : "pill-red"}`}>{p.stock > 200 ? "Good" : p.stock > 100 ? "Low" : "Critical"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RetailLayout>
  );
}

function RetailerListings() {
  return (
    <RetailLayout title="Product Listings">
      <div className="page-header flex items-center justify-between">
        <div><div className="page-title">Product Listings</div><div className="page-sub">Manage what appears in the marketplace</div></div>
        <button className="btn btn-primary">+ New Listing</button>
      </div>
      <div className="products-grid">
        {PRODUCTS.slice(0, 6).map(p => (
          <div key={p.id} className="product-card" style={{ cursor: "default" }}>
            <div className="product-img">{p.icon}</div>
            <div className="product-info">
              <div className="product-name">{p.name}</div>
              <div className="product-farmer">{p.origin}</div>
              <div className="product-meta">
                <div className="product-price">₹{p.price}</div>
                <span className="pill pill-green" style={{ fontSize: 11 }}>Listed ✓</span>
              </div>
              <div className="flex gap-2 mt-4"><button className="btn btn-secondary btn-sm">Edit</button><button className="btn btn-danger btn-sm">Delist</button></div>
            </div>
          </div>
        ))}
      </div>
    </RetailLayout>
  );
}

function RetailerOrders() {
  const orders = [
    { id: "ORD-4501", customer: "Meera Nair", product: "Alphonso Mangoes", qty: 2, amount: 640, status: "delivered", date: "Mar 9" },
    { id: "ORD-4502", customer: "Rajan S.", product: "Organic Rice", qty: 5, amount: 425, status: "processing", date: "Mar 9" },
    { id: "ORD-4503", customer: "Anita K.", product: "A2 Cow Ghee", qty: 1, amount: 850, status: "shipped", date: "Mar 8" },
    { id: "ORD-4504", customer: "Vikram R.", product: "Turmeric Powder", qty: 3, amount: 480, status: "pending", date: "Mar 8" },
  ];
  return (
    <RetailLayout title="Order Management">
      <div className="page-header"><div className="page-title">Orders</div><div className="page-sub">Manage customer orders</div></div>
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Qty</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td><strong>{o.id}</strong></td><td>{o.customer}</td><td>{o.product}</td><td>{o.qty}</td>
                  <td>₹{o.amount}</td><td>{o.date}</td>
                  <td><span className={`pill ${o.status === "delivered" ? "pill-green" : o.status === "shipped" ? "pill-blue" : o.status === "processing" ? "pill-yellow" : "pill-gray"}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RetailLayout>
  );
}

// ─── CONSUMER ─────────────────────────────────────────────────────────────────
function CartPage() {
  const { cartItems, removeFromCart, updateQty } = useCart();
  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div>
      <PublicNav cartCount={cartItems.length} />
      <div style={{ padding: "28px 32px", maxWidth: 900, margin: "0 auto" }}>
        <div className="page-header"><div className="page-title">Shopping Cart 🛒</div><div className="page-sub">{cartItems.length} items</div></div>
        <div className="grid-2" style={{ alignItems: "start" }}>
          <div className="card card-pad">
            {cartItems.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">🛒</div><div className="empty-title">Cart is Empty</div><div className="empty-desc">Browse the marketplace to add products</div><Link to="/marketplace"><button className="btn btn-primary" style={{ marginTop: 16 }}>Shop Now</button></Link></div>
            ) : cartItems.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-img">{item.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)" }}>{item.farmer}</div>
                  <div style={{ fontWeight: 700, color: "var(--pine)", marginTop: 4 }}>₹{item.price}/{item.unit}</div>
                </div>
                <div className="qty-ctrl">
                  <button className="qty-btn" onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                  <span style={{ fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                  <button className="qty-btn" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                </div>
                <div style={{ fontWeight: 700, minWidth: 70, textAlign: "right" }}>₹{item.price * item.qty}</div>
                <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.id)}>✕</button>
              </div>
            ))}
          </div>
          <div className="card card-pad">
            <div className="section-title">Order Summary</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              <div className="flex justify-between"><span>Subtotal</span><strong>₹{total}</strong></div>
              <div className="flex justify-between"><span>Delivery</span><strong style={{ color: "#16a34a" }}>FREE</strong></div>
              <div className="flex justify-between"><span>Platform Fee</span><strong>₹10</strong></div>
              <hr className="divider" />
              <div className="flex justify-between"><span style={{ fontWeight: 700, fontSize: 16 }}>Total</span><strong style={{ fontSize: 20, color: "var(--pine)" }}>₹{total + 10}</strong></div>
            </div>
            <Link to="/consumer/checkout"><button className="btn btn-primary w-full btn-lg">Proceed to Checkout →</button></Link>
            <Link to="/marketplace"><button className="btn btn-secondary w-full" style={{ marginTop: 10 }}>Continue Shopping</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutPage() {
  const { cartItems } = useCart();
  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div>
      <PublicNav cartCount={cartItems.length} />
      <div style={{ padding: "28px 32px", maxWidth: 900, margin: "0 auto" }}>
        <div className="page-header"><div className="page-title">Checkout</div></div>
        <div className="grid-2" style={{ alignItems: "start" }}>
          <div>
            <div className="card card-pad mb-4">
              <div className="section-title">📍 Delivery Address</div>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" placeholder="Meera Nair" /></div>
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="+91 98xxx xxxxx" /></div>
              </div>
              <div className="form-group"><label className="form-label">Address</label><input className="form-input" placeholder="House No, Street, Area" /></div>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">City</label><input className="form-input" placeholder="Mumbai" /></div>
                <div className="form-group"><label className="form-label">Pincode</label><input className="form-input" placeholder="400001" /></div>
              </div>
            </div>
            <div className="card card-pad">
              <div className="section-title">💳 Payment</div>
              <div className="flex gap-3 mb-4" style={{ flexWrap: "wrap" }}>
                {["UPI", "Card", "Net Banking", "Cash on Delivery"].map(m => (
                  <label key={m} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
                    <input type="radio" name="pay" defaultChecked={m === "UPI"} /> {m}
                  </label>
                ))}
              </div>
              <div className="form-group"><label className="form-label">UPI ID</label><input className="form-input" placeholder="name@upi" /></div>
            </div>
          </div>
          <div className="card card-pad">
            <div className="section-title">Order Items ({cartItems.length})</div>
            {cartItems.map(i => (
              <div key={i.id} className="flex justify-between items-center" style={{ padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 20 }}>{i.icon}</span>
                  <div><div style={{ fontWeight: 600, fontSize: 13 }}>{i.name}</div><div style={{ fontSize: 12, color: "var(--muted)" }}>x{i.qty}</div></div>
                </div>
                <strong>₹{i.price * i.qty}</strong>
              </div>
            ))}
            <div className="flex justify-between mt-4"><span style={{ fontWeight: 700 }}>Total</span><strong style={{ color: "var(--pine)", fontSize: 18 }}>₹{total + 10}</strong></div>
            <Link to="/consumer/order-tracking"><button className="btn btn-primary w-full btn-lg" style={{ marginTop: 16 }}>Place Order ✓</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderTrackingPage() {
  return (
    <div>
      <PublicNav cartCount={0} />
      <div style={{ padding: "28px 32px", maxWidth: 700, margin: "0 auto" }}>
        <div className="page-header"><div className="page-title">Order Tracking 📍</div><div className="page-sub">Order #ORD-4508 · Placed Mar 10, 2024</div></div>
        <div className="card card-pad mb-4">
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🚚</div>
            <div style={{ fontFamily: "Syne", fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Your Order is on the Way!</div>
            <div style={{ color: "var(--muted)" }}>Expected delivery: <strong>March 12, 2024</strong></div>
          </div>
        </div>
        <div className="card card-pad">
          <div className="section-title">📦 Tracking Timeline</div>
          <div className="timeline">
            {[
              { label: "Order Placed", meta: "Mar 10, 2:30 PM · Payment confirmed", done: true },
              { label: "Farmer Dispatched", meta: "Ravi Kumar Farm, Punjab", done: true },
              { label: "Picked by Distributor", meta: "TransAgri Logistics", done: true },
              { label: "In Transit to Your City", meta: "Expected: Mar 11", done: false },
              { label: "Out for Delivery", meta: "Expected: Mar 12", done: false, pending: true },
              { label: "Delivered", meta: "Expected: Mar 12, 6 PM", done: false, pending: true },
            ].map((t, i) => (
              <div className="timeline-item" key={i}>
                <div className={`timeline-dot ${t.done ? "done" : t.pending ? "pending" : ""}`} />
                <div className="timeline-title">{t.label}</div>
                <div className="timeline-meta">{t.meta}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function QRScanPage() {
  return (
    <div>
      <PublicNav cartCount={0} />
      <div style={{ padding: "28px 32px", maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <div className="page-header"><div className="page-title">QR Traceability</div><div className="page-sub">Scan or enter batch ID to trace product origin</div></div>
        <div className="card card-pad" style={{ marginBottom: 20 }}>
          <div style={{ background: "linear-gradient(135deg, var(--lime), var(--sage))", borderRadius: 12, height: 200, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12, marginBottom: 20 }}>
            <div style={{ fontSize: 48 }}>📷</div>
            <div style={{ color: "white", fontWeight: 700 }}>Camera Scanner</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>Point camera at product QR code</div>
          </div>
          <div className="form-group" style={{ display: "flex", gap: 10 }}>
            <input className="form-input" placeholder="Or enter Batch ID e.g. BCH-001" style={{ flex: 1 }} />
            <button className="btn btn-primary">Trace</button>
          </div>
        </div>
        <div className="card card-pad" style={{ textAlign: "left" }}>
          <div className="section-title">🌾 Trace Result: BCH-001</div>
          <div className="grid-2">
            {[["Product", "Organic Basmati Rice"], ["Farmer", "Ravi Kumar"], ["Farm", "Amritsar, Punjab"], ["Harvest", "Feb 28, 2024"], ["Certified", "FSSAI + Organic"], ["Journey", "Farm → Delhi → Retailer"]].map(([k, v]) => (
              <div key={k} style={{ marginBottom: 10 }}><div style={{ fontSize: 12, color: "var(--muted)" }}>{k}</div><div style={{ fontWeight: 600 }}>{v}</div></div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: 12, background: "#dcfce7", borderRadius: 8, color: "#15803d", fontWeight: 600, fontSize: 14 }}>
            ✅ Verified — This product's supply chain is fully transparent and certified
          </div>
        </div>
      </div>
      <ChatBot />
    </div>
  );
}



// ─── HELP CENTER ──────────────────────────────────────────────────────────────
function HelpPage() {
  const faqs = [
    ["How do I create a new batch?", "Go to Farmer Dashboard → Create Batch, fill in product details and submit. Your batch will appear in My Batches once approved."],
    ["How does QR traceability work?", "Each batch generates a unique QR code. Consumers scan it to see the complete farm-to-fork journey including certifications."],
    ["When do I receive payment?", "Payments are settled within 3-5 business days after delivery confirmation by the retailer."],
    ["How do I become certified organic?", "Upload FSSAI or organic certification documents in your profile. Our team verifies and adds the badge within 48 hours."],
    ["What if my shipment is delayed?", "Contact your assigned distributor through the messaging system or raise a support ticket for assistance."],
  ];
  return (
    <div>
      <PublicNav cartCount={0} />
      <div style={{ background: "var(--forest)", color: "white", padding: "48px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>❓</div>
        <h1 style={{ fontFamily: "Syne", fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Help Center</h1>
        <p style={{ opacity: 0.8, marginBottom: 20 }}>Find answers to common questions</p>
        <div style={{ display: "flex", gap: 8, maxWidth: 480, margin: "0 auto" }}>
          <input className="form-input" placeholder="Search help articles..." style={{ flex: 1 }} />
          <button className="btn btn-primary">Search</button>
        </div>
      </div>
      <div style={{ padding: "48px 32px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginBottom: 40 }}>
          {[["📦", "Batches"], ["🚚", "Shipments"], ["💰", "Payments"], ["🌿", "Certifications"], ["📱", "QR Codes"], ["🎫", "Tickets"]].map(([i, l]) => (
            <div key={l} style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 16px", textAlign: "center", cursor: "pointer", transition: "all .15s" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{i}</div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{l}</div>
            </div>
          ))}
        </div>
        <h2 style={{ fontFamily: "Syne", fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Frequently Asked Questions</h2>
        {faqs.map(([q, a]) => (
          <div key={q} style={{ background: "white", border: "1px solid var(--border)", borderRadius: 12, padding: "20px", marginBottom: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Q: {q}</div>
            <div style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7 }}>{a}</div>
          </div>
        ))}
        <div style={{ background: "var(--forest)", color: "white", borderRadius: 16, padding: "32px", textAlign: "center", marginTop: 32 }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>🤖</div>
          <h3 style={{ fontFamily: "Syne", fontWeight: 800, marginBottom: 8 }}>Still need help? Chat with FarmBot</h3>
          <p style={{ opacity: 0.8, fontSize: 14, marginBottom: 16 }}>Our AI assistant is available 24/7</p>
          <button className="btn" style={{ background: "var(--sage)", color: "white", padding: "12px 24px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600 }}>Open Chat →</button>
        </div>
      </div>
      <ChatBot />
    </div>
  );
}

// ─── 404 ──────────────────────────────────────────────────────────────────────
function NotFound() {
  return (
    <div>
      <PublicNav cartCount={0} />
      <div className="empty-state" style={{ padding: "100px 20px" }}>
        <div className="empty-icon">🌾</div>
        <div className="empty-title" style={{ fontSize: 28 }}>Page Not Found</div>
        <div className="empty-desc" style={{ marginBottom: 20 }}>This field is empty. Let's get you back on track.</div>
        <Link to="/"><button className="btn btn-primary btn-lg">Go Home</button></Link>
      </div>
    </div>
  );
}

// ─── ROUTER ───────────────────────────────────────────────────────────────────
function AppRouter() {
  const { path } = useRouter();

  // Simple param extraction
  const productMatch = path.match(/^\/product\/(\d+)$/);
  if (productMatch) return <ProductDetailPage id={productMatch[1]} />;

  const routes = {
    "/": <HomePage />,
    "/login": <LoginPage />,
    "/marketplace": <MarketplacePage />,
    "/help": <HelpPage />,
    "/farmer/dashboard": <FarmerDashboard />,
    "/farmer/batches": <FarmerBatches />,
    "/farmer/create-batch": <FarmerCreateBatch />,
    "/farmer/analytics": <FarmerAnalytics />,
    "/farmer/qr": <FarmerQR />,
    "/distributor/dashboard": <DistributorDashboard />,
    "/distributor/shipments": <DistributorShipments />,
    "/distributor/tracking": <DistributorTracking />,
    "/retailer/dashboard": <RetailerDashboard />,
    "/retailer/inventory": <RetailerInventory />,
    "/retailer/listings": <RetailerListings />,
    "/retailer/orders": <RetailerOrders />,
    "/consumer/cart": <CartPage />,
    "/consumer/checkout": <CheckoutPage />,
    "/consumer/order-tracking": <OrderTrackingPage />,
    "/consumer/qr-scan": <QRScanPage />,

  };

  return routes[path] || <NotFound />;
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(items => {
      const existing = items.find(i => i.id === product.id);
      if (existing) return items.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...items, { ...product, qty: 1 }];
    });
  };
  const removeFromCart = (id) => setCartItems(items => items.filter(i => i.id !== id));
  const updateQty = (id, qty) => {
    if (qty <= 0) removeFromCart(id);
    else setCartItems(items => items.map(i => i.id === id ? { ...i, qty } : i));
  };

  return (
    <AuthCtx.Provider value={{ user, setUser }}>
      <CartCtx.Provider value={{ cartItems, addToCart, removeFromCart, updateQty }}>
        <style>{CSS}</style>
        <AppRouter />
      </CartCtx.Provider>
    </AuthCtx.Provider>
  );
}
