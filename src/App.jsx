import { useState, useEffect, createContext, useContext, useMemo, useCallback } from "react";
import "./App.css";

// ─── Router ──────────────────────────────────────────────────────────────────
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
    <a href={`#${to}`} className={className} style={style}
      onClick={e => { e.preventDefault(); window.location.hash = to; }}>
      {children}
    </a>
  );
}

// ─── Contexts ────────────────────────────────────────────────────────────────
const AuthCtx = createContext(null);
function useAuth() { return useContext(AuthCtx); }
const CartCtx = createContext(null);
function useCart() { return useContext(CartCtx); }
const ProductsCtx = createContext(null);
function useProducts() { return useContext(ProductsCtx); }

// ─── Constants ───────────────────────────────────────────────────────────────
const CATEGORY_ICONS = { Grains:"🌾", Fruits:"🍎", Vegetables:"🥬", Spices:"🌿", Dairy:"🥛", Herbs:"🍃", Other:"" };
const CATEGORIES = Object.keys(CATEGORY_ICONS);

const SEED_PRODUCTS = [
  { id:1, name:"Organic Basmati Rice", farmer:"Ravi Kumar Farm", farmerName:"Ravi Kumar Farm", price:85, unit:"kg", icon:"🌾", category:"Grains", rating:"4.8", origin:"Punjab", certified:true, stock:450, desc:"Premium long-grain basmati rice grown without pesticides. Aged 2 years for superior aroma.", image:null },
  { id:2, name:"Alphonso Mangoes", farmer:"Devgad Farms", farmerName:"Devgad Farms", price:320, unit:"dozen", icon:"🥭", category:"Fruits", rating:"4.9", origin:"Ratnagiri", certified:true, stock:120, desc:"GI-tagged Alphonso mangoes from Ratnagiri. Hand-picked at perfect ripeness.", image:null },
  { id:3, name:"Fresh Spinach", farmer:"GreenLeaf Co-op", farmerName:"GreenLeaf Co-op", price:28, unit:"bundle", icon:"🥬", category:"Vegetables", rating:"4.6", origin:"Nashik", certified:false, stock:80, desc:"Tender baby spinach leaves harvested daily at dawn. Perfect for salads and cooking.", image:null },
  { id:4, name:"Turmeric Powder", farmer:"Spice Valley", farmerName:"Spice Valley", price:160, unit:"500g", icon:"🌿", category:"Spices", rating:"4.7", origin:"Erode", certified:true, stock:300, desc:"High-curcumin Lakadong turmeric, stone-ground to preserve natural oils.", image:null },
  { id:5, name:"Red Onions", farmer:"Nasik Onion Farm", farmerName:"Nasik Onion Farm", price:35, unit:"kg", icon:"🧅", category:"Vegetables", rating:"4.5", origin:"Nashik", certified:false, stock:600, desc:"Large, pungent red onions perfect for Indian cooking.", image:null },
  { id:6, name:"A2 Cow Ghee", farmer:"Gir Gaushala", farmerName:"Gir Gaushala", price:850, unit:"liter", icon:"🫙", category:"Dairy", rating:"5.0", origin:"Gujarat", certified:true, stock:90, desc:"Traditionally churned ghee from free-grazing Gir cows. Bilona method.", image:null },
  { id:7, name:"Finger Millet", farmer:"Sahyadri Organics", farmerName:"Sahyadri Organics", price:72, unit:"kg", icon:"🌱", category:"Grains", rating:"4.7", origin:"Karnataka", certified:true, stock:200, desc:"Nutrient-dense ragi grown using traditional methods in Karnataka highlands.", image:null },
  { id:8, name:"Moringa Leaves", farmer:"TropiFarm", farmerName:"TropiFarm", price:45, unit:"250g", icon:"🍃", category:"Herbs", rating:"4.8", origin:"Tamil Nadu", certified:true, stock:150, desc:"Freshly dried moringa drumstick leaves, packed with nutrients.", image:null },
];

const SEED_SHIPMENTS = [
  { id:"SHP-101", shipmentCode:"SHP-101", batchCode:"BCH-001", fromLocation:"Punjab", toLocation:"Delhi Hub", status:"DELIVERED", eta:"2024-03-07", weight:"500 kg", updatedAt:"2024-03-07 14:00" },
  { id:"SHP-102", shipmentCode:"SHP-102", batchCode:"BCH-002", fromLocation:"Erode", toLocation:"Mumbai DC", status:"IN_TRANSIT", eta:"2024-03-12", weight:"200 kg", updatedAt:"2024-03-10 09:30" },
  { id:"SHP-103", shipmentCode:"SHP-103", batchCode:"BCH-004", fromLocation:"Karnataka", toLocation:"Bangalore DC", status:"PENDING", eta:"2024-03-15", weight:"350 kg", updatedAt:"2024-03-10 11:00" },
];

// ─── Storage Helpers ──────────────────────────────────────────────────────────
const storage = {
  get: (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

// ─── Role-specific FarmBot data ──────────────────────────────────────────────
const FARMBOT_DATA = {
  farmer: [
    { q: "How do I add a new product?", a: "Go to 'Add Product' in the sidebar, fill in name, category, price, stock and origin, then click Submit. Your product will immediately appear in the marketplace." },
    { q: "How do I create a batch?", a: "Navigate to 'Create Batch', select one of your products from the dropdown, enter quantity and price, then submit. The batch will appear in 'My Batches'." },
    { q: "How do I generate a QR code?", a: "Go to 'QR Codes', select a batch from the dropdown, and click Generate. A scannable QR code will appear that you can download." },
    { q: "How do I track my revenue?", a: "Check your 'Analytics' page for revenue trends, product mix breakdown, and delivery rates across all your batches." },
    { q: "When do I get paid?", a: "Payments are processed within 3–5 business days after the retailer confirms delivery of your batch." },
  ],
  distributor: [
    { q: "How do I start a shipment?", a: "On the Shipments page, find a PENDING shipment and click 'Start Transit'. The status will update to IN_TRANSIT immediately." },
    { q: "How do I mark a delivery complete?", a: "Find the IN_TRANSIT shipment and click 'Mark Delivered'. This notifies the retailer and updates the supply chain." },
    { q: "Where can I see all shipments?", a: "The Shipments page lists all your assigned shipments with status, route, weight and ETA." },
    { q: "How is tracking updated?", a: "Each status change (Pending → In Transit → Delivered) is timestamped and visible to all parties in the supply chain." },
    { q: "What if a shipment is delayed?", a: "Update the status notes on the shipment record and contact the farmer and retailer through the help center." },
  ],
  retailer: [
    { q: "How do I add inventory?", a: "Go to 'Inventory' and click '+ Add Item'. Fill in the product details and it will be added to your stock table." },
    { q: "How do I process an order?", a: "Go to 'Orders', find the PENDING order, and click 'Process'. Then 'Ship' when dispatched, and 'Delivered' on completion." },
    { q: "How do I reorder stock?", a: "On the Inventory page, click 'Reorder' next to a low-stock item, enter the quantity, and submit the reorder request." },
    { q: "Can I edit my product listings?", a: "Yes! On 'Product Listings', click 'Edit' on any product to modify its name, price, or description." },
    { q: "How do I see low stock alerts?", a: "Your dashboard shows a Low Stock Alerts card. Items with stock below 100 units are highlighted in red." },
  ],
  consumer: [
    { q: "How do I place an order?", a: "Browse the Marketplace, add items to your cart, then go to Cart and click 'Proceed to Checkout'. Fill in delivery details and confirm." },
    { q: "How do I track my order?", a: "Go to 'My Orders' in the sidebar to see all your past orders and their current status." },
    { q: "Are products organic certified?", a: "Products with the 🌿 badge are FSSAI-certified organic. You can verify by scanning the QR code on the packaging." },
    { q: "How do I scan a product QR?", a: "Use the 'QR Scan' page in your sidebar. You can point your camera at a product QR code to see its full supply chain journey." },
    { q: "Can I remove items from cart?", a: "Yes! In your Cart page, click the ✕ button next to any item to remove it, or use − to reduce quantity." },
  ],
};

// ─── ChatBot ──────────────────────────────────────────────────────────────────
function ChatBot() {
  const { user } = useAuth();
  const role = user?.role || "consumer";
  const questions = FARMBOT_DATA[role] || FARMBOT_DATA.consumer;
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { from: "bot", text: `Hi! I'm FarmBot 🌱 I'm here to help you as a ${role}. Click a question below or type your own!` },
  ]);
  const [input, setInput] = useState("");

  const sendMsg = (text) => {
    if (!text.trim()) return;
    const found = questions.find(q => q.q === text);
    const reply = found ? found.a : "I'm not sure about that. Please check the Help Center or contact support.";
    setMsgs(m => [...m, { from: "user", text }, { from: "bot", text: reply }]);
    setInput("");
  };

  return (
    <div className="chatbot">
      {open && (
        <div className="chatbot-panel">
          <div className="chatbot-header">
            <span style={{ fontSize:14, fontWeight:700 }}></span>
            <div><div style={{ fontWeight: 700, fontSize: 14 }}>FarmBot</div><div style={{ fontSize: 11, opacity: 0.7 }}>Always online</div></div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: "white", cursor: "pointer", fontSize: 18 }}>✕</button>
          </div>
          <div className="chatbot-messages" id="chatbot-msgs">
            {msgs.map((m, i) => <div key={i} className={`chat-msg ${m.from}`}>{m.text}</div>)}
          </div>
          <div style={{ padding: "8px 10px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 4 }}>
            {questions.map((q, i) => (
              <button key={i} onClick={() => sendMsg(q.q)}
                style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6, padding: "5px 8px", fontSize: 11, cursor: "pointer", textAlign: "left", color: "var(--ink)" }}>
                {q.q}
              </button>
            ))}
          </div>
          <div className="chatbot-input">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg(input)} placeholder="Type a message..." />
            <button className="btn btn-primary btn-sm" onClick={() => sendMsg(input)}>↑</button>
          </div>
        </div>
      )}
      <button className="chatbot-btn" onClick={() => setOpen(o => !o)}>💬</button>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ role, nav, user }) {
  const { path } = useRouter();
  const { setUser } = useAuth();
  const { clearCart } = useCart();
  const handleSignOut = () => {
    localStorage.removeItem("fcx_token");
    localStorage.removeItem("role");
    setUser(null);
    clearCart();
    window.location.hash = "/login";
  };
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">F</div>
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
          <div className="sidebar-avatar">{(user?.name || "U")[0].toUpperCase()}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name || "User"}</div>
            <div className="sidebar-user-role">{role}</div>
          </div>
        </div>
        <button onClick={handleSignOut} style={{ marginTop: 10, width: "100%", padding: "8px", borderRadius: 8, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
          ↩ Sign Out
        </button>
      </div>
    </div>
  );
}

// ─── Topbar ──────────────────────────────────────────────────────────────────
function Topbar({ title, cartCount = 0 }) {
  return (
    <div className="topbar">
      <div className="topbar-title">{title}</div>
      <div className="topbar-actions">
        
        {cartCount > 0 && (
          <Link to="/consumer/cart">
            <button className="topbar-btn">🛒<span className="badge">{cartCount}</span></button>
          </Link>
        )}
      </div>
    </div>
  );
}

// ─── Public Nav ──────────────────────────────────────────────────────────────
function PublicNav({ cartCount = 0 }) {
  const { path } = useRouter();
  const { user, setUser } = useAuth();
  const { clearCart } = useCart();
  const role = user?.role;

  const handleSignOut = () => {
    localStorage.removeItem("fcx_token");
    localStorage.removeItem("role");
    setUser(null);
    clearCart();
    window.location.hash = "/login";
  };

  return (
    <nav className="pub-nav">
      <Link to="/"><div className="pub-nav-logo">FarmChainX</div></Link>
      <div className="pub-nav-links">
        {[["Home", "/"], ["Marketplace", "/marketplace"], ["Help", "/help"]].map(([l, h]) => (
          <Link key={h} to={h}><div className={`pub-nav-link ${path === h ? "active" : ""}`}>{l}</div></Link>
        ))}
      </div>
      <div className="pub-nav-actions">
        {(role === "consumer" || role === "retailer") && (
          <Link to="/consumer/cart">
            <button className="btn btn-secondary btn-sm">
  {cartCount > 0 ? `Cart (${cartCount})` : "Cart"}
</button>
          </Link>
        )}
        {user ? (
          <button className="btn btn-secondary btn-sm" onClick={handleSignOut}>Sign Out</button>
        ) : (
          <>
            <Link to="/register"><button className="btn btn-secondary btn-sm">Register</button></Link>
            <Link to="/login"><button className="btn btn-primary btn-sm">Sign In →</button></Link>
          </>
        )}
      </div>
    </nav>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────
function BarChart({ data, labels }) {
  const max = Math.max(...data, 1);
  return (
    <div>
      <div className="chart-bar-wrap">
        {data.map((v, i) => <div key={i} className="chart-bar" style={{ height: `${(v / max) * 100}%` }} title={v} />)}
      </div>
      <div className="chart-labels">
        {labels.map((l, i) => <div key={i} className="chart-label">{l}</div>)}
      </div>
    </div>
  );
}

// ─── Product Image Component ──────────────────────────────────────────────────
function ProductImage({ product, size = 52, height = 160 }) {
  if (product.image) {
    return <img src={product.image} alt={product.name} style={{ width: "100%", height, objectFit: "cover" }} />;
  }
  return <span style={{ fontSize: size }}>{CATEGORY_ICONS[product.category] || product.icon || "🌾"}</span>;
}

// ─── Status Pill Helper ───────────────────────────────────────────────────────
function statusClass(s) {
  const u = (s || "").toUpperCase();
  return u === "DELIVERED" ? "pill-green" : u === "IN_TRANSIT" ? "pill-blue" : u === "PROCESSING" || u === "SHIPPED" ? "pill-yellow" : u === "PENDING" ? "pill-gray" : "pill-gray";
}

// ══════════════════════════════════════════════════════════════════════════════
// HOME PAGE
// ══════════════════════════════════════════════════════════════════════════════
function HomePage() {
  const { cartItems } = useCart();
  return (
    <div>
      <PublicNav cartCount={cartItems.length} />
      <div className="hero">
        
        <div className="hero-title">Transparent Farm-to-Fork Supply Chain</div>
        <div className="hero-sub">FarmChainX connects farmers, distributors, retailers and consumers through blockchain-verified traceability.</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/marketplace"><button className="btn btn-primary btn-lg">Browse Marketplace</button></Link>
          <Link to="/login"><button className="btn" style={{ background: "rgba(255,255,255,0.15)", color: "white", fontSize: 16, padding: "14px 28px", borderRadius: 8, border: "2px solid rgba(255,255,255,0.3)", cursor: "pointer" }}>Get Started →</button></Link>
        </div>
      </div>
      <div style={{ background: "white", padding: "48px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontFamily: "Syne", fontSize: 28, fontWeight: 800 }}>How It Works</h2>
          <p style={{ color: "var(--muted)", marginTop: 8 }}>End-to-end transparency from seed to shelf</p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          {[["👨","Farmer","Creates & logs harvest"],["→","Distributor","Ships and tracks"],["→","Retailer","Lists with trace"],["→","Consumer","Scans QR, verifies"]].map(([icon,label,desc],i,arr)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:16 }}>
              <div className="chain-step">
                <div className="chain-icon" style={{ background:`hsl(${140-i*15},50%,${88-i*4}%)` }}>{icon}</div>
                <div className="chain-label">{label}</div>
                <div style={{ fontSize:12, color:"var(--muted)", textAlign:"center", maxWidth:100 }}>{desc}</div>
              </div>
              {i<arr.length-1 && <div className="chain-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>
      <div className="feature-grid" style={{ background:"var(--bg)" }}>
        {[["","Blockchain Verified","Every transaction recorded immutably."],["","QR Traceability","Scan to see full product journey."],["","Real-time Analytics","Actionable insights for all roles."],["","Certified Organic","Verified certifications displayed."],[""," Assistant","FarmBot answers queries 24/7."],["","Seamless Commerce","Integrated marketplace with order tracking."]].map(([icon,title,desc])=>(
          <div className="feature-card" key={title}><div className="feature-icon">{icon}</div><div className="feature-title">{title}</div><div className="feature-desc">{desc}</div></div>
        ))}
      </div>
      <div style={{ background:"var(--forest)", color:"white", padding:"48px 32px", textAlign:"center" }}>
        <h2 style={{ fontFamily:"Syne", fontSize:28, fontWeight:800, marginBottom:32 }}>Trusted by the Ecosystem</h2>
        <div style={{ display:"flex", justifyContent:"center", gap:60, flexWrap:"wrap" }}>
          {[["1,240+","Farmers"],["380+","Distributors"],["920+","Retailers"],["48,000+","Consumers"]].map(([v,l])=>(
            <div key={l}><div style={{ fontFamily:"Syne", fontSize:36, fontWeight:800, color:"var(--mint)" }}>{v}</div><div style={{ opacity:0.7, marginTop:4 }}>{l}</div></div>
          ))}
        </div>
      </div>
      <div style={{ padding:"24px 32px", textAlign:"center", borderTop:"1px solid var(--border)", background:"white", color:"var(--muted)", fontSize:13 }}>© 2024 FarmChainX · Transparent Agricultural Supply Chain</div>
      <ChatBot />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// LOGIN / REGISTER
// ══════════════════════════════════════════════════════════════════════════════
function LoginPage() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { navigate } = useRouter();

  const ROLE_DEST = { FARMER:"/farmer/dashboard", DISTRIBUTOR:"/distributor/dashboard", RETAILER:"/retailer/dashboard", CONSUMER:"/marketplace" };

  const handleLogin = async () => {
    if (!email || !password) { setError("Please enter email and password"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }), mode: "cors",
      });
      const json = await res.json();
      if (!res.ok) { setError(json.message || "Invalid credentials"); return; }
      const data = json.data;
      localStorage.setItem("fcx_token", data.token);
      localStorage.setItem("role", data.role.toLowerCase());
      localStorage.setItem("farmerName", data.name);
      setUser({ name: data.name, role: data.role.toLowerCase(), email: data.email, id: data.id });
      navigate(ROLE_DEST[data.role] || "/");
    } catch {
      setError("⚠️ Cannot connect to server. Make sure the backend is running on port 8080.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", background:"linear-gradient(135deg, var(--forest) 0%, var(--pine) 60%, var(--sage) 100%)" }}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"60px", color:"white" }} className="hide-mobile">
        <h1 style={{ fontFamily:"Syne", fontSize:52, fontWeight:800, marginBottom:20, lineHeight:1.05, letterSpacing:"-1px" }}>FarmChainX</h1>
  <p style={{ fontSize:18, opacity:0.75, maxWidth:380, lineHeight:1.8, fontWeight:400 }}>
    A transparent agricultural supply chain platform connecting farmers, distributors, retailers and consumers.
  </p>
      </div>
      <div style={{ width:460, display:"flex", alignItems:"center", justifyContent:"center", padding:32, background:"rgba(255,255,255,0.07)", backdropFilter:"blur(10px)" }}>
        <div style={{ background:"white", borderRadius:20, padding:40, width:"100%", maxWidth:400, boxShadow:"0 20px 60px rgba(0,0,0,0.25)" }}>
          <div style={{ textAlign:"center", marginBottom:28 }}>
            
            <h2 style={{ fontFamily:"Syne", fontSize:24, fontWeight:800, marginBottom:6 }}>Welcome Back</h2>
            <p style={{ color:"var(--muted)", fontSize:14 }}>Sign in to your FarmChainX account</p>
          </div>
          {error && <div style={{ background:"#fee2e2", color:"#991b1b", padding:"12px 16px", borderRadius:10, marginBottom:20, fontSize:13 }}>⚠️ {error}</div>}
          <div className="form-group"><label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="Enter your email" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} /></div>
          <div className="form-group"><label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Enter your password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} /></div>
          <button className="btn btn-primary w-full btn-lg" style={{ marginTop:8, borderRadius:10 }} onClick={handleLogin} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <div style={{ textAlign:"center", marginTop:16, fontSize:14, color:"var(--muted)" }}>
            Don't have an account? <Link to="/register" style={{ color:"var(--sage)", fontWeight:700 }}>Register here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterPage() {
  const { setUser } = useAuth();
  const { navigate } = useRouter();
  const [form, setForm] = useState({ name:"", email:"", password:"", confirmPassword:"", role:"CONSUMER" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const ROLE_DEST = { FARMER:"/farmer/dashboard", DISTRIBUTOR:"/distributor/dashboard", RETAILER:"/retailer/dashboard", CONSUMER:"/marketplace" };
  const roles = [{ value:"FARMER", label:"🧑‍🌾 Farmer" },{ value:"DISTRIBUTOR", label:"🚛 Distributor" },{ value:"RETAILER", label:"🏪 Retailer" },{ value:"CONSUMER", label:"👤 Consumer" }];

  const handleRegister = async () => {
    if (!form.name||!form.email||!form.password||!form.role) { setError("Please fill in all fields"); return; }
    if (form.password!==form.confirmPassword) { setError("Passwords do not match"); return; }
    if (form.password.length<6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method:"POST", headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ name:form.name.trim(), email:form.email.trim(), password:form.password, role:form.role }), mode:"cors",
      });
      const json = await res.json();
      if (!res.ok) { setError(json.message||"Registration failed"); return; }
      const data = json.data;
      localStorage.setItem("fcx_token", data.token);
      localStorage.setItem("role", data.role.toLowerCase());
      localStorage.setItem("farmerName", data.name);
      setUser({ name:data.name, role:data.role.toLowerCase(), email:data.email, id:data.id });
      navigate(ROLE_DEST[data.role]||"/");
    } catch { setError("⚠️ Cannot connect to server."); } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", background:"linear-gradient(135deg, var(--forest) 0%, var(--pine) 60%, var(--sage) 100%)" }}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"60px", color:"white" }} className="hide-mobile">
        
        <h1 style={{ fontFamily:"Syne", fontSize:42, fontWeight:800, marginBottom:16 }}>Join FarmChainX</h1>
        <p style={{ fontSize:18, opacity:0.85, maxWidth:420, lineHeight:1.7, marginBottom:32 }}>Be part of India's most transparent agricultural supply chain.</p>
      </div>
      <div style={{ width:480, display:"flex", alignItems:"center", justifyContent:"center", padding:32, background:"rgba(255,255,255,0.07)", backdropFilter:"blur(10px)" }}>
        <div style={{ background:"white", borderRadius:20, padding:40, width:"100%", maxWidth:420, boxShadow:"0 20px 60px rgba(0,0,0,0.25)" }}>
          <div style={{ textAlign:"center", marginBottom:24 }}>
            
            <h2 style={{ fontFamily:"Syne", fontSize:22, fontWeight:800 }}>Create Account</h2>
          </div>
          {error && <div style={{ background:"#fee2e2", color:"#991b1b", padding:"10px 14px", borderRadius:8, marginBottom:16, fontSize:13 }}>⚠️ {error}</div>}
          <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" placeholder="Your full name" value={form.name} onChange={e=>set("name",e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="Your email" value={form.email} onChange={e=>set("email",e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="Min 6 characters" value={form.password} onChange={e=>set("password",e.target.value)} /></div>
          <div className="form-group"><label className="form-label">Confirm Password</label><input className="form-input" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={e=>set("confirmPassword",e.target.value)} /></div>
          <div className="form-group">
            <label className="form-label">I am a...</label>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:6 }}>
              {roles.map(r=>(
                <button key={r.value} onClick={()=>set("role",r.value)}
                  style={{ padding:"10px", borderRadius:10, border:`2px solid ${form.role===r.value?"var(--sage)":"var(--border)"}`, background:form.role===r.value?"#f0faf2":"white", cursor:"pointer", fontSize:13, fontWeight:600, color:form.role===r.value?"var(--pine)":"var(--ink)" }}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <button className="btn btn-primary w-full btn-lg" style={{ borderRadius:10 }} onClick={handleRegister} disabled={loading}>
            {loading?"Creating...":"Create Account"}
          </button>
          <div style={{ textAlign:"center", marginTop:14, fontSize:14, color:"var(--muted)" }}>
            Already have an account? <Link to="/login" style={{ color:"var(--sage)", fontWeight:700 }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MARKETPLACE
// ══════════════════════════════════════════════════════════════════════════════
function MarketplacePage() {
  const { addToCart } = useCart();
  const { cartItems } = useCart();
  const { allProducts } = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    return allProducts.filter(p => {
      const matchCat = category === "All" || p.category === category;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [allProducts, category, search]);

  return (
    <div>
      <PublicNav cartCount={cartItems.length} />
      <div style={{ padding:"28px 32px" }}>
        <div className="page-header flex items-center justify-between">
          <div><div className="page-title">Marketplace</div><div className="page-sub">{filtered.length} products from verified farms</div></div>
          <input className="form-input" style={{ width:220 }} placeholder="🔍 Search products..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 mb-6" style={{ flexWrap:"wrap" }}>
          {["All",...CATEGORIES].map(c=>(
            <button key={c} className={`btn btn-sm ${category===c?"btn-primary":"btn-secondary"}`} onClick={()=>setCategory(c)}>{c}</button>
          ))}
        </div>
        {filtered.length===0 ? (
          <div className="empty-state"><div className="empty-icon">🌾</div><div className="empty-title">No products found</div></div>
        ) : (
          <div className="products-grid">
            {filtered.map(p=>(
              <div key={p.id} className="product-card">
                <Link to={`/product/${p.id}`}>
                  <div className="product-img">
                    {p.certified && <div className="product-badge">🌿 Certified</div>}
                    <ProductImage product={p} />
                  </div>
                  <div className="product-info">
                    <div className="product-name">{p.name}</div>
                    <div className="product-farmer">by {p.farmerName||p.farmer} · {p.origin}</div>
                    <div style={{ fontSize:12, color:"var(--muted)", marginBottom:8 }}>⭐ {p.rating||"4.5"} · {p.category}</div>
                    <div className="product-meta">
                      <div className="product-price">₹{p.price}<span style={{ fontSize:12, fontWeight:400 }}>/{p.unit}</span></div>
                      <button className="btn btn-primary btn-sm" onClick={e=>{e.preventDefault();addToCart(p);}}>+ Cart</button>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <ChatBot />
    </div>
  );
}

// ─── Product Detail ───────────────────────────────────────────────────────────
function ProductDetailPage({ id }) {
  const { addToCart } = useCart();
  const { cartItems } = useCart();
  const { allProducts } = useProducts();
  const p = allProducts.find(x => String(x.id) === String(id)) || allProducts[0];
  if (!p) return <div style={{ padding:40, textAlign:"center" }}>Product not found. <Link to="/marketplace">← Back</Link></div>;
  return (
    <div>
      <PublicNav cartCount={cartItems.length} />
      <div style={{ padding:"28px 32px", maxWidth:960, margin:"0 auto" }}>
        <Link to="/marketplace"><button className="btn btn-secondary btn-sm" style={{ marginBottom:20 }}>← Back to Marketplace</button></Link>
        <div className="grid-2" style={{ gap:32 }}>
          <div>
            <div style={{ background:"linear-gradient(135deg, var(--lime), var(--sage))", borderRadius:16, height:280, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
              <ProductImage product={p} size={100} height={280} />
            </div>
            <div style={{ marginTop:16, padding:16, background:"white", borderRadius:12, border:"1px solid var(--border)" }}>
              <div style={{ fontWeight:700, marginBottom:8 }}>🔗 Supply Chain Journey</div>
              <div className="timeline">
                {[
                  { label:`Harvested at ${p.farmerName||p.farmer}`, meta:`${p.origin} · ${p.certified?"FSSAI Certified":"Conventional"}`, done:true },
                  { label:"Quality tested", meta:"Lab verified · Batch approved", done:true },
                  { label:"Shipped by distributor", meta:"Cold chain logistics", done:true },
                  { label:"Received at retailer", meta:"Stock updated", done:false },
                  { label:"Available for purchase", meta:"On marketplace", done:false, pending:true },
                ].map((t,i)=>(
                  <div className="timeline-item" key={i}>
                    <div className={`timeline-dot ${t.done?"done":t.pending?"pending":""}`} />
                    <div className="timeline-title">{t.label}</div>
                    <div className="timeline-meta">{t.meta}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <div className="flex gap-2 mb-4" style={{ flexWrap:"wrap" }}>
              <span className="tag">{p.category}</span>
              {p.certified && <span className="tag" style={{ background:"#dcfce7", color:"#15803d" }}>🌿 Certified</span>}
            </div>
            <h1 style={{ fontFamily:"Syne", fontSize:28, fontWeight:800, marginBottom:8 }}>{p.name}</h1>
            <div style={{ color:"var(--muted)", marginBottom:4 }}>by <strong>{p.farmerName||p.farmer}</strong></div>
            <div style={{ marginBottom:12 }}>⭐ {p.rating||"4.5"} · Origin: {p.origin}</div>
            <div style={{ fontSize:14, color:"var(--muted)", lineHeight:1.7, marginBottom:20 }}>{p.desc}</div>
            <div style={{ fontFamily:"Syne", fontSize:36, fontWeight:800, color:"var(--pine)", marginBottom:20 }}>
              ₹{p.price}<span style={{ fontSize:16, fontWeight:400, color:"var(--muted)" }}>/{p.unit}</span>
            </div>
            <div className="flex gap-3 mb-6">
              <button className="btn btn-primary btn-lg" onClick={()=>addToCart(p)}>🛒 Add to Cart</button>
              <Link to="/consumer/cart"><button className="btn btn-outline btn-lg">Buy Now</button></Link>
            </div>
            <div className="card card-pad">
              <div style={{ fontWeight:700, marginBottom:12 }}>📦 Product Details</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, fontSize:13 }}>
                {[["Category",p.category],["In Stock",`${p.stock} ${p.unit}`],["Origin",p.origin],["Certified",p.certified?"Yes ✅":"No"]].map(([k,v])=>(
                  <div key={k}><span style={{ color:"var(--muted)" }}>{k}:</span> <strong>{v}</strong></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChatBot />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// FARMER
// ══════════════════════════════════════════════════════════════════════════════
const FARMER_NAV = [
  { label:"Main", items:[
    { icon:"⊞", label:"Dashboard", href:"/farmer/dashboard" },
    { icon:"", label:"My Products", href:"/farmer/products" }, 
    { icon:"◫", label:"My Batches", href:"/farmer/batches" },
    { icon:"+", label:"Add Product", href:"/farmer/add-product" },
    { icon:"+", label:"Create Batch", href:"/farmer/create-batch" },
    { icon:"▣", label:"Analytics", href:"/farmer/analytics" },
    { icon:"▣", label:"QR Codes", href:"/farmer/qr" },
  ]},
  { label:"Account", items:[{ icon:"?", label:"Help Center", href:"/help" }] },
];

function FarmerLayout({ title, children }) {
  const { user } = useAuth();
  const { cartItems } = useCart();
  return (
    <div className="app-shell">
      <Sidebar role="Farmer" nav={FARMER_NAV} user={user||{ name:"Farmer" }} />
      <div className="main-content with-sidebar">
        <Topbar title={title} cartCount={cartItems.length} />
        <div className="page-body">{children}</div>
      </div>
      <ChatBot />
    </div>
  );
}

function FarmerDashboard() {
  const { user } = useAuth();
  const { allProducts } = useProducts();
  const myBatches = storage.get("demo_batches", []);
  const myProducts = allProducts.filter(p => p.addedByFarmer);
  const totalRevenue = myBatches.reduce((s,b)=>s+Number(b.price||0),0);

  return (
    <FarmerLayout title="Farmer Dashboard">
      <div className="page-header">
        <div className="page-title">Welcome back, {user?.name||"Farmer"} </div>
        <div className="page-sub">Here's your farm overview</div>
      </div>
      <div className="stats-grid">
        {[
          { icon:"◫", label:"My Products", value:myProducts.length, bg:"#e8f5e9" },
          { icon:"🗂️", label:"Total Batches", value:myBatches.length, bg:"#fff3e0" },
          { icon:"💰", label:"Total Revenue", value:`₹${totalRevenue.toLocaleString("en-IN")}`, bg:"#e3f2fd" },
          { icon:"✅", label:"Delivered", value:myBatches.filter(b=>(b.status||"").toUpperCase()==="DELIVERED").length, bg:"#fce4ec" },
        ].map(s=>(
          <div className="stat-card" key={s.label}>
            <div className="stat-icon" style={{ background:s.bg }}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="grid-2">
        <div className="card">
          <div className="card-header"><span style={{ fontWeight:700 }}> Revenue (Monthly)</span></div>
          <div className="card-body"><BarChart data={[45000,62000,38000,91000,78000,110000,95000]} labels={["Sep","Oct","Nov","Dec","Jan","Feb","Mar"]} /></div>
        </div>
        <div className="card">
          <div className="card-header"><span style={{ fontWeight:700 }}> Recent Batches</span><Link to="/farmer/batches"><span style={{ fontSize:13, color:"var(--sage)" }}>View all →</span></Link></div>
          <div className="card-body" style={{ padding:0 }}>
            {myBatches.length===0 ? (
              <div style={{ padding:20, textAlign:"center", color:"var(--muted)", fontSize:14 }}>No batches yet. <Link to="/farmer/create-batch" style={{ color:"var(--sage)" }}>Create one →</Link></div>
            ) : myBatches.slice(0,4).map(b=>(
              <div key={b.id||b.batchCode} style={{ padding:"12px 20px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:14 }}>{b.productName}</div>
                  <div style={{ fontSize:12, color:"var(--muted)" }}>{b.batchCode} · {b.quantity}</div>
                </div>
                <span className={`pill ${statusClass(b.status)}`}>{(b.status||"pending").toLowerCase()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
}

function FarmerAddProduct() {
  const { refreshProducts } = useProducts();
  const [form, setForm] = useState({ name:"", category:"Grains", price:"", unit:"kg", stock:"", origin:"", certified:false, desc:"", image:null, imagePreview:null });
  const [msg, setMsg] = useState({ type:"", text:"" });
  const [submitting, setSubmitting] = useState(false);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set("imagePreview", ev.target.result);
    reader.readAsDataURL(file);
    set("image", file);
  };

  const handleSubmit = () => {
    if (!form.name||!form.price||!form.stock||!form.origin) { setMsg({ type:"error", text:"Please fill in all required fields." }); return; }
    setSubmitting(true);
    const existing = storage.get("products", []);
    const newProduct = {
      id: Date.now(),
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      unit: form.unit,
      stock: Number(form.stock),
      origin: form.origin.trim(),
      certified: form.certified,
      desc: form.desc.trim(),
      icon: CATEGORY_ICONS[form.category]||"",
      image: form.imagePreview||null,
      farmer: localStorage.getItem("farmerName")||"My Farm",
      farmerName: localStorage.getItem("farmerName")||"My Farm",
      rating: "4.5",
      addedByFarmer: true,
    };
    existing.unshift(newProduct);
    storage.set("products", existing);
    refreshProducts();
    setMsg({ type:"success", text:`✅ "${newProduct.name}" added to marketplace!` });
    setForm({ name:"", category:"Grains", price:"", unit:"kg", stock:"", origin:"", certified:false, desc:"", image:null, imagePreview:null });
    setSubmitting(false);
  };

  return (
    <FarmerLayout title="Add Product">
      <div style={{ maxWidth:640 }}>
        <div className="page-header"><div className="page-title">Add New Product</div><div className="page-sub">Add a product to the marketplace</div></div>
        {msg.text && <div style={{ padding:"10px 16px", borderRadius:8, marginBottom:16, background:msg.type==="success"?"#dcfce7":"#fee2e2", color:msg.type==="success"?"#15803d":"#991b1b", fontSize:14 }}>{msg.text}</div>}
        <div className="card card-pad">
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input className="form-input" placeholder="e.g. Organic Basmati Rice" value={form.name} onChange={e=>set("name",e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Category *</label>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
              {CATEGORIES.map(cat=>(
                <button key={cat} onClick={()=>set("category",cat)}
                  style={{ padding:"10px 6px", borderRadius:10, border:`2px solid ${form.category===cat?"var(--sage)":"var(--border)"}`, background:form.category===cat?"#f0faf2":"white", cursor:"pointer", fontSize:12, fontWeight:600, color:form.category===cat?"var(--pine)":"var(--ink)", textAlign:"center" }}>
                  <div style={{ fontSize:20, marginBottom:3 }}>{CATEGORY_ICONS[cat]}</div>{cat}
                </button>
              ))}
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Price (₹) *</label><input className="form-input" type="number" placeholder="85" value={form.price} onChange={e=>set("price",e.target.value)} /></div>
            <div className="form-group">
              <label className="form-label">Unit *</label>
              <select className="form-input form-select" value={form.unit} onChange={e=>set("unit",e.target.value)}>
                {["kg","g","liter","ml","dozen","bundle","piece","500g","250g","100g"].map(u=><option key={u}>{u}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Stock *</label><input className="form-input" type="number" placeholder="500" value={form.stock} onChange={e=>set("stock",e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Origin *</label><input className="form-input" placeholder="e.g. Punjab" value={form.origin} onChange={e=>set("origin",e.target.value)} /></div>
          </div>
          <div className="form-group">
            <label className="form-label">Product Image</label>
            <input type="file" accept="image/*" onChange={handleImage} style={{ display:"none" }} id="img-upload" />
            <label htmlFor="img-upload" style={{ display:"flex", alignItems:"center", gap:12, cursor:"pointer" }}>
              {form.imagePreview ? (
                <img src={form.imagePreview} alt="preview" style={{ width:80, height:80, borderRadius:10, objectFit:"cover", border:"2px solid var(--sage)" }} />
              ) : (
                <div style={{ width:80, height:80, borderRadius:10, border:"2px dashed var(--border)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28 }}>{CATEGORY_ICONS[form.category]}</div>
              )}
              <span className="btn btn-secondary btn-sm"> Upload Image</span>
            </label>
          </div>
          <div className="form-group"><label className="form-label">Description</label>
            <textarea className="form-input" placeholder="Describe your product..." value={form.desc} onChange={e=>set("desc",e.target.value)} style={{ minHeight:80 }} />
          </div>
          <div className="form-group">
            <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer", fontSize:14, fontWeight:500 }}>
              <input type="checkbox" checked={form.certified} onChange={e=>set("certified",e.target.checked)} style={{ width:18, height:18, accentColor:"var(--sage)" }} />
              🌿 Organic Certified (FSSAI)
            </label>
          </div>
          {/* Preview */}
          <div style={{ background:"var(--bg)", borderRadius:10, padding:14, marginBottom:16, border:"1px solid var(--border)" }}>
            <div style={{ fontSize:12, fontWeight:700, color:"var(--muted)", marginBottom:8 }}>PREVIEW</div>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <div style={{ width:56, height:56, borderRadius:10, overflow:"hidden", background:"linear-gradient(135deg, var(--lime), var(--sage))", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>
                {form.imagePreview ? <img src={form.imagePreview} style={{ width:"100%", height:"100%", objectFit:"cover" }} /> : CATEGORY_ICONS[form.category]}
              </div>
              <div>
                <div style={{ fontFamily:"Syne", fontWeight:700 }}>{form.name||"Product Name"}</div>
                <div style={{ fontSize:12, color:"var(--muted)" }}>{form.category} · {form.origin||"Origin"}</div>
                <div style={{ fontWeight:800, color:"var(--pine)" }}>₹{form.price||0}/{form.unit} {form.certified&&<span style={{ fontSize:11, background:"#dcfce7", color:"#15803d", padding:"1px 6px", borderRadius:4 }}>🌿</span>}</div>
              </div>
            </div>
          </div>
          <button className="btn btn-primary w-full btn-lg" onClick={handleSubmit} disabled={submitting}>{submitting?"Adding...":"Add to Marketplace"}</button>
        </div>
      </div>
    </FarmerLayout>
  );
}

function FarmerMyProducts() {
  const { allProducts, refreshProducts } = useProducts();
  const myProducts = allProducts.filter(p => p.addedByFarmer);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
const deleteProduct = (id) => {
  const saved = storage.get("products", []);
  storage.set("products", saved.filter(p => p.id !== id));
  refreshProducts();
  setDeleteConfirm(null);
};

  return (
    <FarmerLayout title="My Products">
      <div className="page-header flex items-center justify-between">
        <div>
          <div className="page-title">My Products</div>
          <div className="page-sub">{myProducts.length} products listed on marketplace</div>
        </div>
        <Link to="/farmer/add-product">
          <button className="btn btn-primary">+ Add Product</button>
        </Link>
      </div>
      {myProducts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-title">No Products Yet</div>
          <div className="empty-desc">Add your first product to appear on the marketplace</div>
          <Link to="/farmer/add-product">
            <button className="btn btn-primary" style={{ marginTop: 16 }}>Add Product</button>
          </Link>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Origin</th>
                  <th>Certified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {myProducts.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        {p.image
                          ? <img src={p.image} style={{ width:36, height:36, borderRadius:8, objectFit:"cover" }} />
                          : <div style={{ width:36, height:36, borderRadius:8, background:"#e8f5e9", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>
                              {CATEGORY_ICONS[p.category]}
                            </div>
                        }
                        <strong>{p.name}</strong>
                      </div>
                    </td>
                    <td>{p.category}</td>
                    <td>₹{p.price}/{p.unit}</td>
                    <td>{p.stock} {p.unit}</td>
                    <td>{p.origin}</td>
                    <td>
                      {p.certified
                        ? <span className="pill pill-green">Certified</span>
                        : <span className="pill pill-gray">No</span>}
                    </td>
                    <td>
  {deleteConfirm === p.id ? (
    <div className="flex gap-2">
      <button className="btn btn-danger btn-sm"
        onClick={() => deleteProduct(p.id)}>
        Confirm
      </button>
      <button className="btn btn-secondary btn-sm"
        onClick={() => setDeleteConfirm(null)}>
        Cancel
      </button>
    </div>
  ) : (
    <button className="btn btn-danger btn-sm"
      onClick={() => setDeleteConfirm(p.id)}>
      Delete
    </button>
  )}
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </FarmerLayout>
  );
}

function FarmerBatches() {
  const { allProducts } = useProducts();
  const [batches, setBatches] = useState([]);
  const { path } = useRouter();

  const load = useCallback(() => {
  const data = storage.get("demo_batches", []);
  setBatches([...data]); // spread forces new array reference → triggers re-render
}, []);
  useEffect(()=>{ load(); },[path]);

  return (
    <FarmerLayout title="My Batches">
      <div className="page-header flex items-center justify-between">
        <div><div className="page-title">My Batches</div><div className="page-sub">{batches.length} batches total</div></div>
        <div className="flex gap-2">
          
          <Link to="/farmer/create-batch"><button className="btn btn-primary">+ New Batch</button></Link>
        </div>
      </div>
      <div className="card">
        <div className="table-wrap">
          {batches.length===0 ? (
            <div className="empty-state"><div className="empty-icon">📦</div><div className="empty-title">No Batches Yet</div>
              <Link to="/farmer/create-batch"><button className="btn btn-primary" style={{ marginTop:16 }}>+ Create Batch</button></Link></div>
          ) : (
            <table>
              <thead><tr><th>Batch Code</th><th>Product</th><th>Quantity</th><th>Location</th><th>Price</th><th>Status</th><th>Certified</th></tr></thead>
              <tbody>
                {batches.map(b=>(
                  <tr key={b.batchCode}>
                    <td><strong style={{ color:"var(--pine)" }}>{b.batchCode}</strong></td>
                    <td>{b.productName}</td>
                    <td>{b.quantity}</td>
                    <td>{b.farmLocation||"—"}</td>
                    <td><strong>₹{Number(b.price||0).toLocaleString("en-IN")}</strong></td>
                    <td><span className={`pill ${statusClass(b.status)}`}>{(b.status||"pending").toLowerCase()}</span></td>
                    <td>{b.certified?<span className="pill pill-green">🌿 Yes</span>:<span className="pill pill-gray">No</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </FarmerLayout>
  );
}

function FarmerCreateBatch() {
  const { allProducts } = useProducts();
  const { navigate } = useRouter();
  const [form, setForm] = useState({ productId:"", quantity:"", price:"", harvestDate:"", expiryDate:"", farmLocation:"", certified:true });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ type:"", text:"" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleSubmit = () => {
    if (!form.productId||!form.quantity||!form.price) { setMsg({ type:"error", text:"Product, quantity and price are required." }); return; }
    setSubmitting(true);
    const selected = allProducts.find(p=>String(p.id)===String(form.productId));
    const newBatch = {
      id: Date.now(),
      batchCode: "BCH-"+Math.random().toString(36).substr(2,6).toUpperCase(),
      productName: selected?selected.name:"Product",
      productId: form.productId,
      quantity: form.quantity,
      price: form.price,
      farmLocation: form.farmLocation,
      harvestDate: form.harvestDate,
      expiryDate: form.expiryDate,
      certified: form.certified,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
    const existing = storage.get("demo_batches",[]);
    existing.unshift(newBatch);
    storage.set("demo_batches", existing);
    setMsg({ type:"success", text:`✅ Batch ${newBatch.batchCode} created!` });
    setTimeout(()=>navigate("/farmer/batches"),1000);
    setSubmitting(false);
  };

  return (
    <FarmerLayout title="Create Batch">
      <div style={{ maxWidth:640 }}>
        <div className="page-header"><div className="page-title">Create New Batch</div><div className="page-sub">Log a product batch to the supply chain</div></div>
        {msg.text && <div style={{ padding:"10px 16px", borderRadius:8, marginBottom:16, background:msg.type==="success"?"#dcfce7":"#fee2e2", color:msg.type==="success"?"#15803d":"#991b1b", fontSize:14 }}>{msg.text}</div>}
        <div className="card card-pad">
          <div className="form-group">
            <label className="form-label">Select Product *</label>
            <select className="form-input form-select" value={form.productId} onChange={e=>set("productId",e.target.value)}>
              <option value="">— Choose a product —</option>
              {allProducts.map(p=><option key={p.id} value={p.id}>{CATEGORY_ICONS[p.category]||"🌾"} {p.name} ({p.category})</option>)}
            </select>
            {allProducts.length===0&&<div style={{ fontSize:12, color:"var(--muted)", marginTop:4 }}>No products yet. <Link to="/farmer/add-product" style={{ color:"var(--sage)" }}>Add a product first.</Link></div>}
          </div>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Quantity *</label><input className="form-input" placeholder="e.g. 500 kg" value={form.quantity} onChange={e=>set("quantity",e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Total Price (₹) *</label><input className="form-input" type="number" placeholder="42500" value={form.price} onChange={e=>set("price",e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Harvest Date</label><input className="form-input" type="date" value={form.harvestDate} onChange={e=>set("harvestDate",e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Expiry Date</label><input className="form-input" type="date" value={form.expiryDate} onChange={e=>set("expiryDate",e.target.value)} /></div>
          </div>
          <div className="form-group"><label className="form-label">Farm Location</label><input className="form-input" placeholder="Village, District, State" value={form.farmLocation} onChange={e=>set("farmLocation",e.target.value)} /></div>
          <div className="form-group">
            <label className="form-label">Organic Certified?</label>
            <div className="flex gap-3" style={{ marginTop:8 }}>
              <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}><input type="radio" name="cert" checked={form.certified} onChange={()=>set("certified",true)} /> Yes, FSSAI Certified</label>
              <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}><input type="radio" name="cert" checked={!form.certified} onChange={()=>set("certified",false)} /> No</label>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>{submitting?"Submitting...":"Submit Batch"}</button>
            <button className="btn btn-secondary" onClick={()=>navigate("/farmer/batches")}>Cancel</button>
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
}

function FarmerAnalytics() {
  const batches = storage.get("demo_batches",[]);
  const totalRevenue = batches.reduce((s,b)=>s+Number(b.price||0),0);
  return (
    <FarmerLayout title="Analytics">
      <div className="page-header"><div className="page-title">Sales Analytics</div><div className="page-sub">Track performance across products and seasons</div></div>
      <div className="stats-grid">
        {[[`₹${totalRevenue.toLocaleString("en-IN")}||₹6.8L`,"Total Revenue","FY 2024"],["48 MT","Total Volume","All products"],["94%","Delivery Rate","On-time"],["4.8⭐","Avg Rating","Consumer feedback"]].map(([v,l,s])=>(
          <div className="stat-card" key={l}><div className="stat-value">{v.split("||")[0]}</div><div className="stat-label">{l}</div><div className="text-muted">{s}</div></div>
        ))}
      </div>
      <div className="grid-2 mb-6">
        <div className="card"><div className="card-header"><span style={{ fontWeight:700 }}>Revenue Trend</span></div><div className="card-body"><BarChart data={[42000,58000,71000,63000,88000,95000,110000]} labels={["Sep","Oct","Nov","Dec","Jan","Feb","Mar"]} /></div></div>
        <div className="card"><div className="card-header"><span style={{ fontWeight:700 }}>Product Mix</span></div>
          <div className="card-body">
            {[["🌾 Grains",42],["🌿 Spices",28],["🌱 Others",18],["🥬 Veggies",12]].map(([n,pct])=>(
              <div key={n} style={{ marginBottom:14 }}>
                <div className="flex justify-between" style={{ marginBottom:4 }}><span style={{ fontSize:14 }}>{n}</span><span style={{ fontWeight:700 }}>{pct}%</span></div>
                <div className="inventory-bar"><div className="inventory-fill" style={{ width:`${pct}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
}

function FarmerQR() {
  const batches = storage.get("demo_batches",[]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const batch = batches.find(b=>b.batchCode===selectedBatch);

  const generateQR = () => {
    if (!selectedBatch) return;
    const data = `FarmChainX|Batch:${selectedBatch}|Product:${batch?.productName||""}|Date:${batch?.harvestDate||""}|Certified:${batch?.certified?"Yes":"No"}`;
    const encoded = encodeURIComponent(data);
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}`);
  };

  return (
    <FarmerLayout title="QR Codes">
      <div className="page-header"><div className="page-title">QR Code Generator</div><div className="page-sub">Generate scannable QR codes for product traceability</div></div>
      <div className="grid-2">
        <div className="card card-pad">
          <div className="section-title">Generate QR Code</div>
          <div className="form-group">
            <label className="form-label">Select Batch</label>
            <select className="form-input form-select" value={selectedBatch} onChange={e=>{ setSelectedBatch(e.target.value); setQrUrl(""); }}>
              <option value="">— Select a batch —</option>
              {batches.map(b=><option key={b.batchCode} value={b.batchCode}>{b.batchCode} – {b.productName}</option>)}
            </select>
          </div>
          {batch && (
            <div style={{ background:"var(--bg)", borderRadius:8, padding:12, marginBottom:16, fontSize:13 }}>
              <div><strong>Product:</strong> {batch.productName}</div>
              <div><strong>Quantity:</strong> {batch.quantity}</div>
              <div><strong>Location:</strong> {batch.farmLocation||"—"}</div>
              <div><strong>Certified:</strong> {batch.certified?"Yes":"No"}</div>
            </div>
          )}
          <button className="btn btn-primary w-full" onClick={generateQR} disabled={!selectedBatch}>Generate QR Code</button>
        </div>
        <div className="card card-pad" style={{ textAlign:"center" }}>
          <div className="section-title">Scannable QR Code</div>
          {qrUrl ? (
            <>
              <img src={qrUrl} alt="QR Code" style={{ width:200, height:200, margin:"16px auto", display:"block", borderRadius:8, border:"2px solid var(--border)" }} />
              <div style={{ fontSize:13, color:"var(--muted)", marginBottom:12 }}>{selectedBatch} · {batch?.productName}</div>
              <div style={{ fontSize:12, color:"var(--muted)", marginBottom:16 }}>📱 Scan with any QR reader to verify</div>
              <div className="flex gap-2" style={{ justifyContent:"center" }}>
                <a href={qrUrl} download={`${selectedBatch}-qr.png`}><button className="btn btn-primary btn-sm">Download</button></a>
                <button className="btn btn-secondary btn-sm" onClick={()=>window.print()}>🖨️ Print</button>
              </div>
            </>
          ) : (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:200, color:"var(--muted)", flexDirection:"column", gap:8 }}>
              <div style={{ fontSize:48 }}>▦</div>
              <div style={{ fontSize:13 }}>Select a batch and click Generate</div>
            </div>
          )}
        </div>
      </div>
    </FarmerLayout>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════════════════════════
// DISTRIBUTOR
// ══════════════════════════════════════════════════════════════════════════════
const DIST_NAV = [
  { label:"Main", items:[
    { icon:"⊞", label:"Dashboard", href:"/distributor/dashboard" },
    { icon:"»", label:"Shipments", href:"/distributor/shipments" },
    { icon:"+", label:"New Shipment", href:"/distributor/new-shipment" },
  ]},
  { label:"Account", items:[{ icon:"?", label:"Help", href:"/help" }] },
];

function DistLayout({ title, children }) {
  const { user } = useAuth();
  return (
    <div className="app-shell">
      <Sidebar role="Distributor" nav={DIST_NAV} user={user||{ name:"Distributor" }} />
      <div className="main-content with-sidebar">
        <Topbar title={title} />
        <div className="page-body">{children}</div>
      </div>
      <ChatBot />
    </div>
  );
}

function DistributorDashboard() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    setShipments(storage.get("shipments", SEED_SHIPMENTS));
  }, []);

  const active    = shipments.filter(s => s.status === "IN_TRANSIT").length;
  const delivered = shipments.filter(s => s.status === "DELIVERED").length;
  const pending   = shipments.filter(s => s.status === "PENDING").length;

  // weekly volume — count shipments created per day (mock last 7 days)
  const weekDays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const weekData = [2,3,2,4,3,5,shipments.length];

  return (
    <DistLayout title="Distributor Dashboard">
      <div className="page-header">
        <div className="page-title">Welcome, {user?.name||"Distributor"} </div>
        <div className="page-sub">Manage your shipments and logistics operations</div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          ["","Active (In Transit)", active,   "#e3f2fd"],
          ["","Pending",             pending,  "#fff3e0"],
          ["","Delivered",           delivered,"#e8f5e9"],
          ["","Total Shipments",     shipments.length,"#f3e5f5"],
        ].map(([i,l,v,bg])=>(
          <div className="stat-card" key={l}>
            <div className="stat-icon" style={{ background:bg }}>{i}</div>
            <div className="stat-value">{v}</div>
            <div className="stat-label">{l}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Recent Shipments */}
        <div className="card">
          <div className="card-header">
            <span style={{ fontWeight:700 }}> Recent Shipments</span>
            <Link to="/distributor/shipments"><span style={{ fontSize:13, color:"var(--sage)" }}>View all →</span></Link>
          </div>
          <div className="card-body" style={{ padding:0 }}>
            {shipments.length === 0 ? (
              <div style={{ padding:20, textAlign:"center", color:"var(--muted)" }}>No shipments yet.</div>
            ) : shipments.slice(0,5).map(s=>(
              <div key={s.id} style={{ padding:"12px 20px", borderBottom:"1px solid var(--border)" }}>
                <div className="flex justify-between items-center">
                  <div>
                    <div style={{ fontWeight:600, fontSize:14 }}>{s.shipmentCode}</div>
                    <div style={{ fontSize:12, color:"var(--muted)" }}>{s.fromLocation} → {s.toLocation}</div>
                    <div style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>
                      Batch: {s.batchCode} · {s.weight} · Updated: {s.updatedAt||s.eta}
                    </div>
                  </div>
                  <span className={`pill ${statusClass(s.status)}`}>
                    {s.status.replace(/_/g," ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Volume Chart */}
        <div className="card">
          <div className="card-header"><span style={{ fontWeight:700 }}> Weekly Volume</span></div>
          <div className="card-body">
            <BarChart data={weekData} labels={weekDays} />
            <div style={{ marginTop:16, display:"flex", flexDirection:"column", gap:8 }}>
              <div className="flex justify-between" style={{ fontSize:13 }}>
                <span style={{ color:"var(--muted)" }}>On-time delivery rate</span>
                <strong style={{ color:"#16a34a" }}>94%</strong>
              </div>
              <div className="inventory-bar">
                <div className="inventory-fill" style={{ width:"94%" }} />
              </div>
              <div className="flex justify-between" style={{ fontSize:13 }}>
                <span style={{ color:"var(--muted)" }}>Average transit days</span>
                <strong>3.2 days</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status breakdown */}
      <div className="card" style={{ marginTop:20 }}>
        <div className="card-header"><span style={{ fontWeight:700 }}> Shipment Status Breakdown</span></div>
        <div className="card-body">
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:16 }}>
            {[
              ["PENDING",    pending,   "#fff3e0","#854d0e"],
              ["IN TRANSIT", active,    "#dbeafe","#1d4ed8"],
              ["DELIVERED",  delivered, "#dcfce7","#15803d"],
            ].map(([label, count, bg, color])=>(
              <div key={label} style={{ background:bg, borderRadius:10, padding:16, textAlign:"center" }}>
                <div style={{ fontSize:24, fontWeight:800, color, fontFamily:"Syne" }}>{count}</div>
                <div style={{ fontSize:12, fontWeight:600, color, marginTop:4 }}>{label}</div>
                <div style={{ fontSize:11, color, opacity:0.7, marginTop:2 }}>
                  {shipments.length > 0 ? Math.round((count/shipments.length)*100) : 0}% of total
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DistLayout>
  );
}

function DistributorShipments() {
  const [shipments, setShipments]   = useState([]);
  const [filter, setFilter]         = useState("ALL");
  const [search, setSearch]         = useState("");
  const [selected, setSelected]     = useState(null);

  useEffect(() => {
    setShipments(storage.get("shipments", SEED_SHIPMENTS));
  }, []);

  const updateStatus = (id, newStatus) => {
    const updated = shipments.map(s =>
      s.id === id ? { ...s, status:newStatus, updatedAt:new Date().toLocaleString("en-IN") } : s
    );
    setShipments(updated);
    storage.set("shipments", updated);
    // update selected too
    if (selected?.id === id) setSelected(updated.find(s=>s.id===id));
  };

  const filtered = shipments.filter(s => {
    const matchFilter = filter === "ALL" || s.status === filter;
    const matchSearch = !search ||
      s.shipmentCode.toLowerCase().includes(search.toLowerCase()) ||
      s.batchCode.toLowerCase().includes(search.toLowerCase()) ||
      s.fromLocation.toLowerCase().includes(search.toLowerCase()) ||
      s.toLocation.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <DistLayout title="Shipment Management">
      <div className="page-header flex items-center justify-between">
        <div>
          <div className="page-title">Shipments</div>
          <div className="page-sub">{filtered.length} of {shipments.length} shipments</div>
        </div>
        <Link to="/distributor/new-shipment">
          <button className="btn btn-primary">+ New Shipment</button>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex gap-2 mb-6" style={{ flexWrap:"wrap", alignItems:"center" }}>
        {["ALL","PENDING","IN_TRANSIT","DELIVERED"].map(f=>(
          <button key={f}
            className={`btn btn-sm ${filter===f?"btn-primary":"btn-secondary"}`}
            onClick={()=>setFilter(f)}>
            {f.replace(/_/g," ")}
          </button>
        ))}
        <input className="form-input" style={{ width:220, marginLeft:"auto" }}
          placeholder="🔍 Search by ID, batch, route..."
          value={search} onChange={e=>setSearch(e.target.value)} />
      </div>

      <div className={selected ? "grid-2" : ""} style={{ gap:20, alignItems:"start" }}>
        {/* Shipments Table */}
        <div className="card">
          <div className="table-wrap">
            {filtered.length === 0 ? (
              <div style={{ padding:40, textAlign:"center", color:"var(--muted)" }}>
                No shipments found.
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Shipment ID</th>
                    <th>Batch</th>
                    <th>Route</th>
                    <th>Weight</th>
                    <th>Updated</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s=>(
                    <tr key={s.id}
                      style={{ cursor:"pointer", background: selected?.id===s.id ? "var(--bg)":undefined }}
                      onClick={()=>setSelected(selected?.id===s.id ? null : s)}>
                      <td><strong style={{ color:"var(--pine)" }}>{s.shipmentCode}</strong></td>
                      <td><span className="tag">{s.batchCode}</span></td>
                      <td>{s.fromLocation} → {s.toLocation}</td>
                      <td>{s.weight}</td>
                      <td>
                        <div style={{ fontSize:13 }}>{s.updatedAt||"—"}</div>
                        <div style={{ fontSize:11, color:"var(--muted)" }}>ETA: {s.eta}</div>
                      </td>
                      <td>
                        <span className={`pill ${statusClass(s.status)}`}>
                          {s.status.replace(/_/g," ")}
                        </span>
                      </td>
                      <td onClick={e=>e.stopPropagation()}>
                        {s.status==="PENDING" &&
                          <button className="btn btn-primary btn-sm"
                            onClick={()=>updateStatus(s.id,"IN_TRANSIT")}>
                            🚚 Start Transit
                          </button>}
                        {s.status==="IN_TRANSIT" &&
                          <button className="btn btn-primary btn-sm"
                            onClick={()=>updateStatus(s.id,"DELIVERED")}>
                            ✅ Mark Delivered
                          </button>}
                        {s.status==="DELIVERED" &&
                          <span className="pill pill-green">Done</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Shipment Detail Panel */}
        {selected && (
          <div className="card card-pad" style={{ position:"sticky", top:80 }}>
            <div className="flex justify-between items-center" style={{ marginBottom:16 }}>
              <div style={{ fontFamily:"Syne", fontWeight:700, fontSize:16 }}>
                {selected.shipmentCode}
              </div>
              <button onClick={()=>setSelected(null)}
                style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:"var(--muted)" }}>✕</button>
            </div>

            {/* Details */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16, fontSize:13 }}>
              {[
                ["Batch",    selected.batchCode],
                ["Weight",   selected.weight],
                ["From",     selected.fromLocation],
                ["To",       selected.toLocation],
                ["ETA",      selected.eta],
                ["Updated",  selected.updatedAt||"—"],
              ].map(([k,v])=>(
                <div key={k}>
                  <div style={{ color:"var(--muted)", fontSize:11 }}>{k}</div>
                  <div style={{ fontWeight:600 }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div style={{ fontWeight:700, fontSize:14, marginBottom:12 }}>📍 Journey Timeline</div>
            <div className="timeline">
              {[
                { label:"Shipment Created",   done: true },
                { label:"Picked up from "+selected.fromLocation,
                  done: ["IN_TRANSIT","DELIVERED"].includes(selected.status),
                  meta: ["IN_TRANSIT","DELIVERED"].includes(selected.status) ? selected.updatedAt : "Pending" },
                { label:"In Transit to "+selected.toLocation,
                  done: ["IN_TRANSIT","DELIVERED"].includes(selected.status),
                  pending: selected.status==="PENDING" },
                { label:"Delivered at "+selected.toLocation,
                  done: selected.status==="DELIVERED",
                  pending: selected.status!=="DELIVERED",
                  meta: selected.status==="DELIVERED" ? selected.updatedAt : "ETA: "+selected.eta },
              ].map((t,i)=>(
                <div className="timeline-item" key={i}>
                  <div className={`timeline-dot ${t.done?"done":t.pending?"pending":""}`} />
                  <div className="timeline-title">{t.label}</div>
                  {t.meta && <div className="timeline-meta">{t.meta}</div>}
                </div>
              ))}
            </div>

            {/* Action in panel too */}
            <div style={{ marginTop:16 }}>
              {selected.status==="PENDING" &&
                <button className="btn btn-primary w-full"
                  onClick={()=>updateStatus(selected.id,"IN_TRANSIT")}>
                  🚚 Start Transit
                </button>}
              {selected.status==="IN_TRANSIT" &&
                <button className="btn btn-primary w-full"
                  onClick={()=>updateStatus(selected.id,"DELIVERED")}>
                  ✅ Mark Delivered
                </button>}
              {selected.status==="DELIVERED" &&
                <div style={{ textAlign:"center", padding:12, background:"#dcfce7", borderRadius:8, color:"#15803d", fontWeight:600 }}>
                  ✅ Delivery Complete
                </div>}
            </div>
          </div>
        )}
      </div>
    </DistLayout>
  );
}

function DistributorNewShipment() {
  const { navigate } = useRouter();
  const batches = storage.get("demo_batches", []);
  const [form, setForm] = useState({
    batchCode:"", fromLocation:"", toLocation:"", weight:"", eta:""
  });
  const [msg, setMsg] = useState({ type:"", text:"" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handleSubmit = () => {
    if (!form.batchCode || !form.fromLocation || !form.toLocation || !form.weight || !form.eta) {
      setMsg({ type:"error", text:"Please fill in all fields." });
      return;
    }
    const newShipment = {
      id: "SHP-"+Math.random().toString(36).substr(2,6).toUpperCase(),
      shipmentCode: "SHP-"+Math.random().toString(36).substr(2,6).toUpperCase(),
      batchCode: form.batchCode,
      fromLocation: form.fromLocation,
      toLocation: form.toLocation,
      weight: form.weight,
      eta: form.eta,
      status: "PENDING",
      updatedAt: new Date().toLocaleString("en-IN"),
    };
    const existing = storage.get("shipments", SEED_SHIPMENTS);
    existing.unshift(newShipment);
    storage.set("shipments", existing);
    setMsg({ type:"success", text:`✅ Shipment ${newShipment.shipmentCode} created!` });
    setTimeout(()=>navigate("/distributor/shipments"), 1000);
  };

  return (
    <DistLayout title="New Shipment">
      <div style={{ maxWidth:600 }}>
        <div className="page-header">
          <div className="page-title">Create New Shipment</div>
          <div className="page-sub">Log a new shipment to the supply chain</div>
        </div>
        {msg.text && (
          <div style={{ padding:"10px 16px", borderRadius:8, marginBottom:16,
            background:msg.type==="success"?"#dcfce7":"#fee2e2",
            color:msg.type==="success"?"#15803d":"#991b1b", fontSize:14 }}>
            {msg.text}
          </div>
        )}
        <div className="card card-pad">
          <div className="form-group">
            <label className="form-label">Select Batch *</label>
            <select className="form-input form-select" value={form.batchCode} onChange={e=>set("batchCode",e.target.value)}>
              <option value="">— Choose a batch —</option>
              {batches.map(b=>(
                <option key={b.batchCode} value={b.batchCode}>
                  {b.batchCode} — {b.productName} ({b.quantity})
                </option>
              ))}
              {/* Also show seed batches */}
              {["BCH-001 — Organic Basmati Rice","BCH-002 — Turmeric Powder","BCH-003 — Fresh Spinach","BCH-004 — Finger Millet"].map(b=>(
                <option key={b} value={b.split(" ")[0]}>{b}</option>
              ))}
            </select>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">From Location *</label>
              <input className="form-input" placeholder="e.g. Punjab Farm" value={form.fromLocation} onChange={e=>set("fromLocation",e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">To Location *</label>
              <input className="form-input" placeholder="e.g. Delhi Hub" value={form.toLocation} onChange={e=>set("toLocation",e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Weight *</label>
              <input className="form-input" placeholder="e.g. 500 kg" value={form.weight} onChange={e=>set("weight",e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">ETA Date *</label>
              <input className="form-input" type="date" value={form.eta} onChange={e=>set("eta",e.target.value)} />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="btn btn-primary" onClick={handleSubmit}>Create Shipment</button>
            <button className="btn btn-secondary" onClick={()=>navigate("/distributor/shipments")}>Cancel</button>
          </div>
        </div>
      </div>
    </DistLayout>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// RETAILER
// ══════════════════════════════════════════════════════════════════════════════
const RETAIL_NAV = [
  { label:"Main", items:[
    { icon:"⊞", label:"Dashboard", href:"/retailer/dashboard" },
    { icon:"≡", label:"Inventory", href:"/retailer/inventory" },
    { icon:"#", label:"Product Listings", href:"/retailer/listings" },
    { icon:"✉", label:"Orders", href:"/retailer/orders" },
  ]},
  { label:"Account", items:[{ icon:"?", label:"Help", href:"/help" }] },
];

function RetailLayout({ title, children }) {
  const { user } = useAuth();
  return (
    <div className="app-shell">
      <Sidebar role="Retailer" nav={RETAIL_NAV} user={user||{ name:"Retailer" }} />
      <div className="main-content with-sidebar"><Topbar title={title} /><div className="page-body">{children}</div></div>
      <ChatBot />
    </div>
  );
}

function RetailerDashboard() {
  const { allProducts } = useProducts();
  const orders = storage.get("demo_orders",[]);
  const lowStock = allProducts.filter(p=>p.stock<150);
  const [reorderModal, setReorderModal] = useState(null);
  const [reorderQty, setReorderQty] = useState("");
  const [reorderMsg, setReorderMsg] = useState("");

  const submitReorder = () => {
    if (!reorderQty) return;
    setReorderMsg(`✅ Reorder of ${reorderQty} units for "${reorderModal.name}" submitted!`);
    setTimeout(()=>{ setReorderModal(null); setReorderQty(""); setReorderMsg(""); },2000);
  };

  return (
    <RetailLayout title="Retailer Dashboard">
      <div className="page-header"><div className="page-title">Retailer Dashboard</div><div className="page-sub">Manage your store's supply chain</div></div>
      <div className="stats-grid">
        {[["","Orders Total",orders.length,"#e8f5e9"],["","Revenue","₹3.8L","#fff3e0"],["","Low Stock",lowStock.length,"#fee2e2"],["","Store Rating","4.6","#fce4ec"]].map(([i,l,v,bg])=>(
          <div className="stat-card" key={l}><div className="stat-icon" style={{ background:bg }}>{i}</div><div className="stat-value">{v}</div><div className="stat-label">{l}</div></div>
        ))}
      </div>
      <div className="grid-2">
        <div className="card"><div className="card-header"><span style={{ fontWeight:700 }}> Sales This Week</span></div><div className="card-body"><BarChart data={[38000,45000,41000,62000,58000,71000,55000]} labels={["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]} /></div></div>
        <div className="card">
          <div className="card-header"><span style={{ fontWeight:700 }}> Low Stock Alerts</span></div>
          <div className="card-body" style={{ padding:0 }}>
            {lowStock.length===0 ? <div style={{ padding:20, textAlign:"center", color:"var(--muted)" }}>All stock levels are good ✅</div> :
              lowStock.slice(0,5).map(p=>(
                <div key={p.id} style={{ padding:"10px 20px", borderBottom:"1px solid var(--border)", display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:22 }}>{CATEGORY_ICONS[p.category]||"🌾"}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:14 }}>{p.name}</div>
                    <div style={{ fontSize:12, color:p.stock<100?"#dc2626":"var(--muted)" }}>Stock: {p.stock} {p.unit}</div>
                    <div className="inventory-bar"><div className="inventory-fill" style={{ width:`${Math.min(100,(p.stock/200)*100)}%`, background:p.stock<100?"#ef4444":undefined }} /></div>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={()=>setReorderModal(p)}>Reorder</button>
                </div>
              ))}
          </div>
        </div>
      </div>
      {/* Reorder Modal */}
      {reorderModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
          <div style={{ background:"white", borderRadius:16, padding:32, width:400, boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontFamily:"Syne", marginBottom:16 }}>Reorder: {reorderModal.name}</h3>
            {reorderMsg ? <div style={{ padding:12, background:"#dcfce7", borderRadius:8, color:"#15803d" }}>{reorderMsg}</div> : (
              <>
                <div className="form-group"><label className="form-label">Quantity to Order</label>
                  <input className="form-input" type="number" placeholder="e.g. 500" value={reorderQty} onChange={e=>setReorderQty(e.target.value)} autoFocus /></div>
                <div className="flex gap-2">
                  <button className="btn btn-primary" onClick={submitReorder}>Submit Reorder</button>
                  <button className="btn btn-secondary" onClick={()=>setReorderModal(null)}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </RetailLayout>
  );
}

function RetailerInventory() {
  const { allProducts } = useProducts();
  const [inventory, setInventory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:"", category:"Grains", stock:"", unit:"kg", price:"", origin:"" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  useEffect(()=>{ setInventory([...allProducts]); },[allProducts]);

  const addItem = () => {
    if (!form.name||!form.stock) return;
    const newItem = { id:Date.now(), ...form, price:Number(form.price), stock:Number(form.stock), icon:CATEGORY_ICONS[form.category]||"", farmerName:"My Stock", rating:"4.5", desc:"" };
    const updated = [newItem,...inventory];
    setInventory(updated);
    setShowForm(false);
    setForm({ name:"", category:"Grains", stock:"", unit:"kg", price:"", origin:"" });
  };

  return (
    <RetailLayout title="Inventory">
      <div className="page-header flex items-center justify-between">
        <div><div className="page-title">Inventory</div><div className="page-sub">{inventory.length} items</div></div>
        <button className="btn btn-primary" onClick={()=>setShowForm(v=>!v)}>+ Add Item</button>
      </div>
      {showForm && (
        <div className="card card-pad mb-6">
          <div className="section-title">Add Inventory Item</div>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={form.name} onChange={e=>set("name",e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Category</label>
              <select className="form-input form-select" value={form.category} onChange={e=>set("category",e.target.value)}>
                {CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Stock</label><input className="form-input" type="number" value={form.stock} onChange={e=>set("stock",e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Unit</label><input className="form-input" value={form.unit} onChange={e=>set("unit",e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Price (₹)</label><input className="form-input" type="number" value={form.price} onChange={e=>set("price",e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Origin</label><input className="form-input" value={form.origin} onChange={e=>set("origin",e.target.value)} /></div>
          </div>
          <div className="flex gap-2"><button className="btn btn-primary" onClick={addItem}>Add Item</button><button className="btn btn-secondary" onClick={()=>setShowForm(false)}>Cancel</button></div>
        </div>
      )}
      <div className="card">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Product</th><th>Category</th><th>Stock</th><th>Level</th><th>Price</th><th>Origin</th><th>Status</th></tr></thead>
            <tbody>
              {inventory.map(p=>(
                <tr key={p.id}>
                  <td><div style={{ display:"flex", alignItems:"center", gap:10 }}><span style={{ fontSize:20 }}>{CATEGORY_ICONS[p.category]||p.icon||"🌾"}</span><strong>{p.name}</strong></div></td>
                  <td>{p.category}</td>
                  <td>{p.stock} {p.unit}</td>
                  <td style={{ width:120 }}><div className="inventory-bar"><div className="inventory-fill" style={{ width:`${Math.min(100,(p.stock/500)*100)}%`, background:p.stock<100?"#ef4444":undefined }} /></div></td>
                  <td>₹{p.price}/{p.unit}</td>
                  <td>{p.origin}</td>
                  <td><span className={`pill ${p.stock>200?"pill-green":p.stock>100?"pill-yellow":"pill-red"}`}>{p.stock>200?"Good":p.stock>100?"Low":"Critical"}</span></td>
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
  const { allProducts, refreshProducts } = useProducts();
  const [editModal, setEditModal] = useState(null);
  const [editForm, setEditForm] = useState({});

  const openEdit = (p) => { setEditModal(p); setEditForm({ name:p.name, price:p.price, desc:p.desc||"" }); };

  const saveEdit = () => {
    const saved = storage.get("products",[]);
    const updated = saved.map(p=>p.id===editModal.id?{...p,...editForm,price:Number(editForm.price)}:p);
    storage.set("products",updated);
    refreshProducts();
    setEditModal(null);
  };

  const deleteProduct = (id) => {
    if (!confirm("Delete this product?")) return;
    const saved = storage.get("products",[]);
    storage.set("products", saved.filter(p=>p.id!==id));
    refreshProducts();
  };

  return (
    <RetailLayout title="Product Listings">
      <div className="page-header flex items-center justify-between">
        <div><div className="page-title">Product Listings</div><div className="page-sub">Manage marketplace products</div></div>
      </div>
      <div className="products-grid">
        {allProducts.map(p=>(
          <div key={p.id} className="product-card" style={{ cursor:"default" }}>
            <div className="product-img"><ProductImage product={p} /></div>
            <div className="product-info">
              <div className="product-name">{p.name}</div>
              <div className="product-farmer">{p.category} · {p.origin}</div>
              <div className="product-meta">
                <div className="product-price">₹{p.price}<span style={{ fontSize:12, fontWeight:400 }}>/{p.unit}</span></div>
                <span className="pill pill-green" style={{ fontSize:11 }}>Listed ✓</span>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="btn btn-secondary btn-sm" onClick={()=>openEdit(p)}>✏️ Edit</button>
                {p.addedByFarmer && <button className="btn btn-danger btn-sm" onClick={()=>deleteProduct(p.id)}>🗑️ Delete</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
      {editModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000 }}>
          <div style={{ background:"white", borderRadius:16, padding:32, width:440, boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontFamily:"Syne", marginBottom:16 }}>Edit: {editModal.name}</h3>
            <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={editForm.name} onChange={e=>setEditForm(f=>({...f,name:e.target.value}))} /></div>
            <div className="form-group"><label className="form-label">Price (₹)</label><input className="form-input" type="number" value={editForm.price} onChange={e=>setEditForm(f=>({...f,price:e.target.value}))} /></div>
            <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" value={editForm.desc} onChange={e=>setEditForm(f=>({...f,desc:e.target.value}))} style={{ minHeight:80 }} /></div>
            <div className="flex gap-2"><button className="btn btn-primary" onClick={saveEdit}>Save Changes</button><button className="btn btn-secondary" onClick={()=>setEditModal(null)}>Cancel</button></div>
          </div>
        </div>
      )}
    </RetailLayout>
  );
}

function RetailerOrders() {
  const [orders, setOrders] = useState([]);
  useEffect(()=>{ setOrders(storage.get("demo_orders",[]).reverse()); },[]);
  const update = (id, status) => {
    const updated = orders.map(o=>o.id===id?{...o,status}:o);
    setOrders(updated);
    storage.set("demo_orders",[...updated].reverse());
  };
  return (
    <RetailLayout title="Orders">
      <div className="page-header"><div className="page-title">Orders</div><div className="page-sub">Incoming customer orders</div></div>
      <div className="card">
        <div className="table-wrap">
          {orders.length===0 ? <div style={{ padding:40, textAlign:"center", color:"var(--muted)" }}>No orders yet.</div> : (
            <table>
              <thead><tr><th>Order ID</th><th>Items</th><th>Amount</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {orders.map(o=>(
                  <tr key={o.id}>
                    <td><strong>{o.orderCode}</strong></td>
                    <td>{(o.items||[]).map(i=>`${i.name} x${i.qty}`).join(", ")}</td>
                    <td>₹{Number(o.totalAmount||0).toLocaleString("en-IN")}</td>
                    <td>{o.createdAt?new Date(o.createdAt).toLocaleDateString("en-IN"):"—"}</td>
                    <td><span className={`pill ${statusClass(o.status)}`}>{(o.status||"").toLowerCase()}</span></td>
                    <td>
                      {(o.status||"").toUpperCase()==="PENDING"&&<button className="btn btn-primary btn-sm" onClick={()=>update(o.id,"PROCESSING")}>Process</button>}
                      {(o.status||"").toUpperCase()==="PROCESSING"&&<button className="btn btn-primary btn-sm" onClick={()=>update(o.id,"SHIPPED")}>Ship</button>}
                      {(o.status||"").toUpperCase()==="SHIPPED"&&<button className="btn btn-primary btn-sm" onClick={()=>update(o.id,"DELIVERED")}>Delivered</button>}
                      {(o.status||"").toUpperCase()==="DELIVERED"&&<span className="pill pill-green">Done</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </RetailLayout>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CONSUMER
// ══════════════════════════════════════════════════════════════════════════════
const CONSUMER_NAV = [
  { label:"Main", items:[
    { icon:"+", label:"Marketplace", href:"/marketplace" },
    { icon:"◈", label:"My Cart", href:"/consumer/cart" },
    { icon:"◫", label:"My Orders", href:"/consumer/orders" },
    { icon:"▣", label:"QR Scan", href:"/consumer/qr-scan" },
  ]},
  { label:"Account", items:[{ icon:"?", label:"Help", href:"/help" }] },
];

function ConsumerLayout({ title, children }) {
  const { user } = useAuth();
  const { cartItems } = useCart();
  return (
    <div className="app-shell">
      <Sidebar role="Consumer" nav={CONSUMER_NAV} user={user||{ name:"Consumer" }} />
      <div className="main-content with-sidebar"><Topbar title={title} cartCount={cartItems.length} /><div className="page-body">{children}</div></div>
      <ChatBot />
    </div>
  );
}

function CartPage() {
  const { cartItems, removeFromCart, updateQty } = useCart();
  const total = cartItems.reduce((s,i)=>s+i.price*i.qty,0);
  return (
    <div>
      <PublicNav cartCount={cartItems.length} />
      <div style={{ padding:"28px 32px", maxWidth:900, margin:"0 auto" }}>
        <div className="page-header"><div className="page-title">Shopping Cart </div><div className="page-sub">{cartItems.length} items</div></div>
        <div className="grid-2" style={{ alignItems:"start" }}>
          <div className="card card-pad">
            {cartItems.length===0 ? (
              <div className="empty-state"><div className="empty-icon">🛒</div><div className="empty-title">Cart is Empty</div>
                <Link to="/marketplace"><button className="btn btn-primary" style={{ marginTop:16 }}>Shop Now</button></Link></div>
            ) : cartItems.map(item=>(
              <div className="cart-item" key={item.id}>
                <div className="cart-item-img">
                  {item.image ? <img src={item.image} style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:10 }} /> : CATEGORY_ICONS[item.category]||""}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700 }}>{item.name}</div>
                  <div style={{ fontSize:13, color:"var(--muted)" }}>{item.farmerName||item.farmer}</div>
                  <div style={{ fontWeight:700, color:"var(--pine)", marginTop:4 }}>₹{item.price}/{item.unit}</div>
                </div>
                <div className="qty-ctrl">
                  <button className="qty-btn" onClick={()=>updateQty(item.id,item.qty-1)}>−</button>
                  <span style={{ fontWeight:700, minWidth:20, textAlign:"center" }}>{item.qty}</span>
                  <button className="qty-btn" onClick={()=>updateQty(item.id,item.qty+1)}>+</button>
                </div>
                <div style={{ fontWeight:700, minWidth:70, textAlign:"right" }}>₹{item.price*item.qty}</div>
                <button className="btn btn-danger btn-sm" onClick={()=>removeFromCart(item.id)}>✕</button>
              </div>
            ))}
          </div>
          <div className="card card-pad">
            <div className="section-title">Order Summary</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
              <div className="flex justify-between"><span>Subtotal</span><strong>₹{total}</strong></div>
              <div className="flex justify-between"><span>Delivery</span><strong style={{ color:"#16a34a" }}>FREE</strong></div>
              <hr className="divider" />
              <div className="flex justify-between"><span style={{ fontWeight:700, fontSize:16 }}>Total</span><strong style={{ fontSize:20, color:"var(--pine)" }}>₹{total}</strong></div>
            </div>
            <Link to="/consumer/checkout"><button className="btn btn-primary w-full btn-lg" disabled={cartItems.length===0}>Proceed to Checkout →</button></Link>
            <Link to="/marketplace"><button className="btn btn-secondary w-full" style={{ marginTop:10 }}>Continue Shopping</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { navigate } = useRouter();
  const total = cartItems.reduce((s,i)=>s+Number(i.price)*i.qty,0);
  const [form, setForm] = useState({ name:"", phone:"", address:"", city:"", pincode:"", payment:"UPI" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const handlePlaceOrder = () => {
    if (!form.name||!form.address||!form.city) { setError("Please fill in delivery details."); return; }
    if (cartItems.length===0) { setError("Your cart is empty."); return; }
    setSubmitting(true);
    const order = {
      id: Date.now(),
      orderCode: "ORD-"+Math.random().toString(36).substr(2,6).toUpperCase(),
      items: cartItems,
      totalAmount: total,
      deliveryAddress: `${form.name}, ${form.address}, ${form.city} - ${form.pincode}`,
      paymentMethod: form.payment,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
    const existing = storage.get("demo_orders",[]);
    existing.push(order);
    storage.set("demo_orders", existing);
    clearCart();
    setSubmitting(false);
    navigate("/consumer/orders");
  };

  return (
    <div>
      <PublicNav cartCount={cartItems.length} />
      <div style={{ padding:"28px 32px", maxWidth:900, margin:"0 auto" }}>
        <div className="page-header"><div className="page-title">Checkout</div></div>
        {error&&<div style={{ padding:"10px 16px", borderRadius:8, marginBottom:16, background:"#fee2e2", color:"#991b1b", fontSize:14 }}>{error}</div>}
        <div className="grid-2" style={{ alignItems:"start" }}>
          <div>
            <div className="card card-pad mb-4">
              <div className="section-title"> Delivery Address</div>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e=>set("name",e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e=>set("phone",e.target.value)} /></div>
              </div>
              <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={form.address} onChange={e=>set("address",e.target.value)} /></div>
              <div className="grid-2">
                <div className="form-group"><label className="form-label">City</label><input className="form-input" value={form.city} onChange={e=>set("city",e.target.value)} /></div>
                <div className="form-group"><label className="form-label">Pincode</label><input className="form-input" value={form.pincode} onChange={e=>set("pincode",e.target.value)} /></div>
              </div>
            </div>
            <div className="card card-pad">
              <div className="section-title"> Payment</div>
              <div className="flex gap-3 mb-4" style={{ flexWrap:"wrap" }}>
                {["UPI","Card","Net Banking","Cash on Delivery"].map(m=>(
                  <label key={m} style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", fontSize:14, fontWeight:500 }}>
                    <input type="radio" name="pay" checked={form.payment===m} onChange={()=>set("payment",m)} /> {m}
                  </label>
                ))}
              </div>
              {form.payment==="UPI"&&<div className="form-group"><label className="form-label">UPI ID</label><input className="form-input" placeholder="name@upi" /></div>}
            </div>
          </div>
          <div className="card card-pad">
            <div className="section-title">Order Items ({cartItems.length})</div>
            {cartItems.map(i=>(
              <div key={i.id} className="flex justify-between items-center" style={{ padding:"8px 0", borderBottom:"1px solid var(--border)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:20 }}>{CATEGORY_ICONS[i.category]||""}</span>
                  <div><div style={{ fontWeight:600, fontSize:13 }}>{i.name}</div><div style={{ fontSize:12, color:"var(--muted)" }}>x{i.qty}</div></div>
                </div>
                <strong>₹{Number(i.price)*i.qty}</strong>
              </div>
            ))}
            <div className="flex justify-between mt-4"><span style={{ fontWeight:700 }}>Total</span><strong style={{ color:"var(--pine)", fontSize:18 }}>₹{total}</strong></div>
            <button className="btn btn-primary w-full btn-lg" style={{ marginTop:16 }} onClick={handlePlaceOrder} disabled={submitting}>{submitting?"Placing Order...":"Place Order"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConsumerOrders() {
  const [orders, setOrders] = useState([]);
  useEffect(()=>{ setOrders([...storage.get("demo_orders",[])].reverse()); },[]);

  return (
    <ConsumerLayout title="My Orders">
      <div className="page-header"><div className="page-title">My Orders </div><div className="page-sub">{orders.length} order{orders.length!==1?"s":""} placed</div></div>
      {orders.length===0 ? (
        <div className="empty-state"><div className="empty-icon">📦</div><div className="empty-title">No Orders Yet</div><div className="empty-desc">Browse the marketplace and place your first order!</div>
          <Link to="/marketplace"><button className="btn btn-primary" style={{ marginTop:16 }}>Shop Now →</button></Link></div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {orders.map(o=>(
            <div key={o.id} className="card card-pad">
              <div className="flex justify-between items-center" style={{ marginBottom:12 }}>
                <div>
                  <div style={{ fontFamily:"Syne", fontWeight:700, fontSize:16 }}>{o.orderCode}</div>
                  <div style={{ fontSize:13, color:"var(--muted)" }}>{o.createdAt?new Date(o.createdAt).toLocaleDateString("en-IN",{ day:"numeric", month:"short", year:"numeric" }):"—"}</div>
                </div>
                <span className={`pill ${statusClass(o.status)}`}>{(o.status||"pending").toLowerCase()}</span>
              </div>
              <div style={{ borderTop:"1px solid var(--border)", paddingTop:12, marginBottom:12 }}>
                {(o.items||[]).map((item,i)=>(
                  <div key={i} className="flex justify-between items-center" style={{ padding:"6px 0" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                      <span style={{ fontSize:20 }}>{CATEGORY_ICONS[item.category]||""}</span>
                      <div><div style={{ fontWeight:600, fontSize:14 }}>{item.name}</div><div style={{ fontSize:12, color:"var(--muted)" }}>x{item.qty} · ₹{item.price}/{item.unit}</div></div>
                    </div>
                    <strong>₹{Number(item.price)*item.qty}</strong>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center" style={{ borderTop:"1px solid var(--border)", paddingTop:12 }}>
                <div style={{ fontSize:13, color:"var(--muted)" }}>📍 {o.deliveryAddress} · 💳 {o.paymentMethod}</div>
                <div style={{ fontFamily:"Syne", fontWeight:800, fontSize:18, color:"var(--pine)" }}>₹{Number(o.totalAmount||0).toLocaleString("en-IN")}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ConsumerLayout>
  );
}

function QRScanPage() {
  const [batchId, setBatchId] = useState("");
  const [result, setResult] = useState(null);
  const { cartItems } = useCart();
  const allBatches = storage.get("demo_batches",[]);

  const trace = () => {
    if (!batchId.trim()) return;
    const found = allBatches.find(b=>b.batchCode===batchId.trim().toUpperCase());
    setResult(found || { notFound:true });
  };

  return (
    <div>
      <PublicNav cartCount={cartItems.length} />
      <div style={{ padding:"28px 32px", maxWidth:600, margin:"0 auto" }}>
        <div className="page-header"><div className="page-title">QR Traceability</div><div className="page-sub">Scan or enter a batch ID to trace product origin</div></div>
        <div className="card card-pad" style={{ marginBottom:20 }}>
          <div style={{ background:"linear-gradient(135deg, var(--lime), var(--sage))", borderRadius:12, height:160, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:8, marginBottom:16 }}>
            <div style={{ fontSize:40 }}>📷</div>
            <div style={{ color:"white", fontWeight:700 }}>Camera Scanner</div>
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.8)" }}>Point camera at product QR code</div>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <input className="form-input" placeholder="Or enter Batch ID e.g. BCH-001" value={batchId} onChange={e=>setBatchId(e.target.value)} onKeyDown={e=>e.key==="Enter"&&trace()} style={{ flex:1 }} />
            <button className="btn btn-primary" onClick={trace}>Trace</button>
          </div>
        </div>
        {result && (
          <div className="card card-pad">
            {result.notFound ? (
              <div style={{ textAlign:"center", color:"#dc2626", padding:20 }}>❌ Batch "{batchId}" not found.</div>
            ) : (
              <>
                <div className="section-title"> Trace Result: {result.batchCode}</div>
                <div className="grid-2">
                  {[["Product",result.productName],["Batch",result.batchCode],["Quantity",result.quantity],["Location",result.farmLocation||"—"],["Harvest",result.harvestDate||"—"],["Certified",result.certified?"Yes":"No"]].map(([k,v])=>(
                    <div key={k} style={{ marginBottom:10 }}><div style={{ fontSize:12, color:"var(--muted)" }}>{k}</div><div style={{ fontWeight:600 }}>{v}</div></div>
                  ))}
                </div>
                <div style={{ marginTop:12, padding:12, background:"#dcfce7", borderRadius:8, color:"#15803d", fontWeight:600, fontSize:14 }}>
                  Verified — Supply chain transparent and certified
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <ChatBot />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// HELP PAGE
// ══════════════════════════════════════════════════════════════════════════════
function HelpPage() {
  const { cartItems } = useCart();
  const faqs = [
    ["How do I create a new batch?","Go to Farmer Dashboard → Create Batch, fill in product details and submit."],
    ["How does QR traceability work?","Each batch generates a unique QR code. Consumers scan it to see the full farm-to-fork journey."],
    ["When do I receive payment?","Payments are settled within 3-5 business days after delivery confirmation."],
    ["How do I become certified organic?","Upload FSSAI certification documents in your profile. Verified within 48 hours."],
    ["What if my shipment is delayed?","Contact your assigned distributor or raise a support ticket."],
  ];
  return (
    <div>
      <PublicNav cartCount={cartItems.length} />
      <div style={{ background:"var(--forest)", color:"white", padding:"48px 32px", textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>❓</div>
        <h1 style={{ fontFamily:"Syne", fontSize:32, fontWeight:800, marginBottom:8 }}>Help Center</h1>
        <p style={{ opacity:0.8 }}>Find answers to common questions</p>
      </div>
      <div style={{ padding:"48px 32px", maxWidth:800, margin:"0 auto" }}>
        <h2 style={{ fontFamily:"Syne", fontSize:22, fontWeight:800, marginBottom:20 }}>Frequently Asked Questions</h2>
        {faqs.map(([q,a])=>(
          <div key={q} style={{ background:"white", border:"1px solid var(--border)", borderRadius:12, padding:"20px", marginBottom:12 }}>
            <div style={{ fontWeight:700, marginBottom:8 }}>Q: {q}</div>
            <div style={{ color:"var(--muted)", fontSize:14, lineHeight:1.7 }}>{a}</div>
          </div>
        ))}
      </div>
      <ChatBot />
    </div>
  );
}

function NotFound() {
  const { cartItems } = useCart();
  return (
    <div>
      <PublicNav cartCount={cartItems.length} />
      <div className="empty-state" style={{ padding:"100px 20px" }}>
        <div className="empty-icon">🌾</div>
        <div className="empty-title" style={{ fontSize:28 }}>Page Not Found</div>
        <Link to="/"><button className="btn btn-primary btn-lg" style={{ marginTop:16 }}>Go Home</button></Link>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROUTER
// ══════════════════════════════════════════════════════════════════════════════
function AppRouter() {
  const { path } = useRouter();
  const productMatch = path.match(/^\/product\/(.+)$/);
  if (productMatch) return <ProductDetailPage id={productMatch[1]} />;

  const routes = {
    "/": <HomePage />,
    "/login": <LoginPage />,
    "/register": <RegisterPage />,
    "/marketplace": <MarketplacePage />,
    "/help": <HelpPage />,
    "/farmer/dashboard": <FarmerDashboard />,
    "/farmer/products": <FarmerMyProducts />,
    "/farmer/batches": <FarmerBatches />,
    "/farmer/add-product": <FarmerAddProduct />,
    "/farmer/create-batch": <FarmerCreateBatch />,
    "/farmer/analytics": <FarmerAnalytics />,
    "/farmer/qr": <FarmerQR />,
    "/distributor/dashboard": <DistributorDashboard />,
    "/distributor/shipments": <DistributorShipments />,
    "/distributor/new-shipment": <DistributorNewShipment />,
    "/retailer/dashboard": <RetailerDashboard />,
    "/retailer/inventory": <RetailerInventory />,
    "/retailer/listings": <RetailerListings />,
    "/retailer/orders": <RetailerOrders />,
    "/consumer/cart": <CartPage />,
    "/consumer/checkout": <CheckoutPage />,
    "/consumer/orders": <ConsumerOrders />,
    "/consumer/qr-scan": <QRScanPage />,
  };
  return routes[path] || <NotFound />;
}

// ══════════════════════════════════════════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState(() => storage.get("fcx_cart", []));
  const [products, setProducts] = useState(() => storage.get("products", []));

  // Persist cart
  useEffect(() => { storage.set("fcx_cart", cartItems); }, [cartItems]);

  // Restore session
  useEffect(() => {
    const token = localStorage.getItem("fcx_token");
    if (token && !user) {
      fetch("http://localhost:8080/api/auth/me", { headers:{ Authorization:`Bearer ${token}` } })
        .then(r=>r.json()).then(j=>{ if(j.data) setUser({ name:j.data.name, role:j.data.role.toLowerCase(), email:j.data.email, id:j.data.id }); }).catch(()=>{});
    }
  }, []);

  const refreshProducts = useCallback(() => {
    setProducts(storage.get("products",[]));
  }, []);

  const allProducts = useMemo(() => {
    const local = storage.get("products",[]);
    const localIds = new Set(local.map(p=>p.id));
    const seeds = SEED_PRODUCTS.filter(p=>!localIds.has(p.id));
    return [...local, ...seeds];
  }, [products]);

  const addToCart = useCallback((product) => {
    setCartItems(items => {
      const ex = items.find(i=>i.id===product.id);
      if (ex) return items.map(i=>i.id===product.id?{...i,qty:i.qty+1}:i);
      const { qty, ...rest } = product;
      return [...items, { ...rest, qty:1 }];
    });
  }, []);

  const removeFromCart = useCallback((id) => setCartItems(items=>items.filter(i=>i.id!==id)), []);

  const updateQty = useCallback((id, qty) => {
    if (qty<=0) removeFromCart(id);
    else setCartItems(items=>items.map(i=>i.id===id?{...i,qty}:i));
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCartItems([]), []);

  const authValue = useMemo(()=>({ user, setUser }),[user]);
  const cartValue = useMemo(()=>({ cartItems, addToCart, removeFromCart, updateQty, clearCart }),[cartItems]);
  const productsValue = useMemo(()=>({ allProducts, refreshProducts }),[allProducts, refreshProducts]);

  return (
    <AuthCtx.Provider value={authValue}>
      <CartCtx.Provider value={cartValue}>
        <ProductsCtx.Provider value={productsValue}>
          <AppRouter />
        </ProductsCtx.Provider>
      </CartCtx.Provider>
    </AuthCtx.Provider>
  );
}

// Append nothing - just verify file is good
