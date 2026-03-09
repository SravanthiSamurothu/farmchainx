import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════════════════════
   DESIGN SYSTEM
═══════════════════════════════════════════════════════════════ */
const C = {
  forest:    "#1a3a2a", pine:   "#2d5a3d", moss:   "#3d7a52",
  fern:      "#4e9b66", sage:   "#6ab87f", mint:   "#9dd4ab",
  mist:      "#c8ecd2", dew:    "#e8f7ed", snow:   "#f9fbfa",
  amber:     "#d4860a", amberS: "#fef3dc",
  sky:       "#2e7ab8", skyS:   "#deeef9",
  rose:      "#c0392b", roseS:  "#fde8e7",
  grape:     "#7b4fa0", grapeS: "#f0e8f8",
  ink:       "#1c2b22", charcoal:"#2f3e35", slate:  "#5a7060",
  fog:       "#8fa898", silver: "#c4d4c9", pearl:  "#f0f5f2",
  white:     "#ffffff",
};

const injectAssets = () => {
  if (!document.getElementById("fcx-fonts")) {
    const l = document.createElement("link");
    l.id = "fcx-fonts"; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap";
    document.head.appendChild(l);
  }
  if (!document.getElementById("fcx-css")) {
    const s = document.createElement("style"); s.id = "fcx-css";
    s.textContent = `
      *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
      body{font-family:'DM Sans',system-ui,sans-serif;background:${C.pearl};color:${C.ink};-webkit-font-smoothing:antialiased}
      ::-webkit-scrollbar{width:5px;height:5px}
      ::-webkit-scrollbar-track{background:${C.dew}}
      ::-webkit-scrollbar-thumb{background:${C.mint};border-radius:99px}
      input,select,button,textarea{font-family:inherit}
      table{border-collapse:collapse;width:100%}
      @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
      @keyframes scaleIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
      @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
      @keyframes pulseGlow{0%,100%{box-shadow:0 0 0 0 rgba(78,155,102,.35)}70%{box-shadow:0 0 0 8px rgba(78,155,102,0)}}
      .fu{animation:fadeUp .45s cubic-bezier(.22,1,.36,1) both}
      .si{animation:scaleIn .3s cubic-bezier(.22,1,.36,1) both}
      .d1{animation-delay:.07s}.d2{animation-delay:.14s}.d3{animation-delay:.21s}.d4{animation-delay:.28s}.d5{animation-delay:.35s}
      .hc{transition:transform .2s ease,box-shadow .2s ease}
      .hc:hover{transform:translateY(-2px);box-shadow:0 10px 36px rgba(26,58,42,.13)!important}
      .hb{transition:filter .15s ease,transform .12s ease}
      .hb:hover{filter:brightness(1.07);transform:translateY(-1px)}
      .hb:active{filter:brightness(.96);transform:none}
      .hr{transition:background .15s ease}
      .hr:hover{background:${C.dew}}
      .ni{transition:background .15s ease,color .15s ease}
      .ifl{transition:border-color .2s ease,box-shadow .2s ease;outline:none}
      .ifl:focus{border-color:${C.fern}!important;box-shadow:0 0 0 3px rgba(78,155,102,.14)}
    `;
    document.head.appendChild(s);
  }
};

/* ═══════════════════════════════════════════════════════════════
   BASE COMPONENTS
═══════════════════════════════════════════════════════════════ */
function Card({ children, style, cls = "", onClick }) {
  return (
    <div onClick={onClick} className={`hc ${cls}`} style={{
      background: C.white, borderRadius: 16,
      boxShadow: "0 2px 14px rgba(26,58,42,.07)",
      border: `1px solid ${C.mist}`, overflow: "hidden", ...style,
    }}>{children}</div>
  );
}

function Btn({ children, v = "primary", sz = "md", icon, onClick, style, disabled }) {
  const sizes = { xs:"5px 11px", sm:"7px 16px", md:"10px 20px", lg:"13px 26px" };
  const fSize = { xs:11, sm:13, md:14, lg:15 };
  const variants = {
    primary: { background:`linear-gradient(135deg,${C.moss},${C.fern})`, color:C.white, border:"none", boxShadow:`0 4px 14px rgba(61,122,82,.3)` },
    secondary: { background:C.dew, color:C.pine, border:`1.5px solid ${C.mist}` },
    ghost: { background:"transparent", color:C.moss, border:`1.5px solid ${C.mist}` },
    danger: { background:C.roseS, color:C.rose, border:`1.5px solid #f0b8b5` },
    dark: { background:C.forest, color:C.white, border:"none", boxShadow:`0 4px 14px rgba(26,58,42,.28)` },
    white: { background:C.white, color:C.pine, border:`1.5px solid ${C.mist}` },
  };
  return (
    <button onClick={onClick} disabled={disabled} className="hb" style={{
      display:"inline-flex", alignItems:"center", gap:6,
      padding:sizes[sz], fontSize:fSize[sz], fontWeight:600,
      borderRadius:10, cursor: disabled?"not-allowed":"pointer",
      opacity:disabled?.6:1, letterSpacing:"-.01em", whiteSpace:"nowrap",
      ...variants[v], ...style,
    }}>
      {icon && <span style={{fontSize:fSize[sz]+1,lineHeight:1}}>{icon}</span>}
      {children}
    </button>
  );
}

function Badge({ status }) {
  const map = {
    Harvested:   {bg:C.dew,    fg:C.pine,    dot:C.fern},
    "In Transit":{bg:C.amberS, fg:"#7a4800", dot:C.amber},
    Processing:  {bg:C.grapeS, fg:"#4a1e80", dot:C.grape},
    Stored:      {bg:C.skyS,   fg:"#164880", dot:C.sky},
    Delivered:   {bg:"#e6f4e6",fg:C.pine,    dot:C.moss},
    Active:      {bg:C.dew,    fg:C.pine,    dot:C.sage},
    Inactive:    {bg:C.roseS,  fg:C.rose,    dot:C.rose},
    Pending:     {bg:C.amberS, fg:"#7a4800", dot:C.amber},
    Premium:     {bg:C.amberS, fg:"#7a4800", dot:C.amber},
    Standard:    {bg:C.skyS,   fg:"#164880", dot:C.sky},
  };
  const s = map[status] || map.Active;
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600,
      background:s.bg, color:s.fg,
    }}>
      <span style={{width:6,height:6,borderRadius:"50%",background:s.dot,flexShrink:0}}/>
      {status}
    </span>
  );
}

function Field({ label, type="text", placeholder, value, onChange, icon }) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      {label && <label style={{fontSize:13,fontWeight:600,color:C.charcoal}}>{label}</label>}
      <div style={{position:"relative"}}>
        {icon && <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:15,color:C.fog,pointerEvents:"none"}}>{icon}</span>}
        <input type={type} placeholder={placeholder} value={value} onChange={onChange}
          className="ifl" style={{
            width:"100%", padding:icon?"10px 14px 10px 38px":"10px 14px",
            border:`1.5px solid ${C.silver}`, borderRadius:10,
            fontSize:14, color:C.ink, background:C.snow,
          }}/>
      </div>
    </div>
  );
}

function Sel({ label, value, onChange, opts }) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      {label && <label style={{fontSize:13,fontWeight:600,color:C.charcoal}}>{label}</label>}
      <select value={value} onChange={onChange} className="ifl" style={{
        padding:"10px 36px 10px 14px", border:`1.5px solid ${C.silver}`,
        borderRadius:10, fontSize:14, color:C.ink, background:C.snow,
        appearance:"none",
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235a7060' stroke-width='1.8' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat:"no-repeat", backgroundPosition:"right 14px center", cursor:"pointer",
      }}>
        {opts.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function StatCard({ icon, label, value, chg, color=C.fern, cls="" }) {
  const pos = chg > 0;
  return (
    <Card cls={`fu ${cls}`} style={{padding:22}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
        <div style={{
          width:46,height:46,borderRadius:12,
          background:`linear-gradient(135deg,${color}22,${color}10)`,
          border:`1.5px solid ${color}28`,
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
        }}>{icon}</div>
        {chg !== undefined && (
          <span style={{fontSize:12,fontWeight:600,color:pos?C.moss:C.rose,background:pos?C.dew:C.roseS,padding:"3px 8px",borderRadius:20}}>
            {pos?"↑":"↓"} {Math.abs(chg)}%
          </span>
        )}
      </div>
      <div style={{fontSize:28,fontWeight:700,color:C.ink,letterSpacing:"-1px",lineHeight:1}}>{value}</div>
      <div style={{fontSize:13,color:C.slate,marginTop:5}}>{label}</div>
    </Card>
  );
}

function TopBar({ title, sub, actions }) {
  return (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:28,flexWrap:"wrap",gap:12}}>
      <div>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:600,color:C.ink,letterSpacing:"-.04em",lineHeight:1.1}}>{title}</h1>
        {sub && <p style={{fontSize:13,color:C.slate,marginTop:4}}>{sub}</p>}
      </div>
      {actions && <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{actions}</div>}
    </div>
  );
}

function Table({ cols, rows, onRow }) {
  return (
    <div style={{overflowX:"auto"}}>
      <table>
        <thead>
          <tr style={{borderBottom:`2px solid ${C.dew}`}}>
            {cols.map(c => (
              <th key={c.k||c.l} style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:C.fog,letterSpacing:".06em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{c.l}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row,i) => (
            <tr key={i} className="hr" onClick={() => onRow&&onRow(row)} style={{borderBottom:`1px solid ${C.pearl}`,cursor:onRow?"pointer":"default"}}>
              {cols.map(c => (
                <td key={c.k} style={{padding:"12px 14px",fontSize:13,color:C.charcoal,whiteSpace:"nowrap"}}>
                  {c.r ? c.r(row[c.k], row) : row[c.k]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Ring({ score, size=110 }) {
  const r = size/2 - 11;
  const circ = 2*Math.PI*r;
  const fill = (score/100)*circ;
  const col = score>=85?C.fern:score>=65?C.amber:C.rose;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C.dew} strokeWidth={9}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col} strokeWidth={9}
        strokeDasharray={`${fill} ${circ-fill}`} strokeDashoffset={circ/4} strokeLinecap="round"/>
      <text x={size/2} y={size/2+1} textAnchor="middle" dominantBaseline="middle"
        style={{fontSize:size<70?13:19,fontWeight:700,fill:C.ink,fontFamily:"DM Sans"}}>{score}%</text>
    </svg>
  );
}

function Spark({ data, color=C.fern, h=64 }) {
  const W=360; const mn=Math.min(...data)-4; const mx=Math.max(...data)+4;
  const pts = data.map((v,i) => `${(i/(data.length-1))*W},${h-((v-mn)/(mx-mn))*h}`).join(" ");
  const area = `0,${h} ${pts} ${W},${h}`;
  return (
    <svg viewBox={`0 0 ${W} ${h}`} width="100%" height={h} preserveAspectRatio="none" style={{display:"block"}}>
      <defs><linearGradient id="sg2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity=".22"/>
        <stop offset="100%" stopColor={color} stopOpacity=".01"/>
      </linearGradient></defs>
      <polygon points={area} fill="url(#sg2)"/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════════════════ */
function Sidebar({ role, active, setPage, logout }) {
  const navs = {
    Farmer: [
      {icon:"🏠",label:"Dashboard",   page:"farmer-dash"},
      {icon:"📦",label:"Batches",     page:"farmer-batches"},
      {icon:"🔗",label:"Supply Chain",page:"supply-chain"},
      {icon:"📷",label:"QR Codes",    page:"qr-scan"},
      {icon:"📊",label:"Reports",     page:"reports"},
    ],
    Distributor: [
      {icon:"🏠",label:"Dashboard", page:"dist-dash"},
      {icon:"🚚",label:"Shipments", page:"dist-ships"},
      {icon:"🏪",label:"Inventory", page:"dist-inv"},
    ],
    Admin: [
      {icon:"🏠",label:"Dashboard",page:"admin-dash"},
      {icon:"👥",label:"Users",    page:"admin-users"},
      {icon:"⚙️",label:"Settings", page:"admin-settings"},
    ],
  };
  const items = navs[role] || [];
  const names = { Farmer:"John Kamau", Distributor:"Mary Odhiambo", Admin:"Susan Mwangi" };

  return (
    <aside style={{
      width:228, minHeight:"100vh",
      background:`linear-gradient(180deg,${C.forest} 0%,${C.pine} 100%)`,
      display:"flex", flexDirection:"column", flexShrink:0,
      position:"sticky", top:0, height:"100vh", overflowY:"auto",
    }}>
      {/* Brand */}
      <div style={{padding:"26px 20px 18px",borderBottom:`1px solid rgba(255,255,255,.08)`}}>
        <div style={{display:"flex",alignItems:"center",gap:11}}>
          <div style={{
            width:40,height:40,borderRadius:10,flexShrink:0,
            background:`linear-gradient(135deg,${C.sage},${C.fern})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:22,boxShadow:`0 4px 12px rgba(106,184,127,.38)`,
          }}>🌾</div>
          <div>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:17,fontWeight:600,color:C.white,letterSpacing:"-.02em"}}>FarmChainX</div>
            <div style={{fontSize:9,color:C.mint,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase",marginTop:1}}>{role} Portal</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{flex:1,padding:"12px 10px",display:"flex",flexDirection:"column",gap:2}}>
        {items.map(item => {
          const on = active===item.page;
          return (
            <button key={item.page} onClick={()=>setPage(item.page)} className="ni" style={{
              display:"flex",alignItems:"center",gap:10,
              padding:"9px 12px",borderRadius:10,border:"none",
              background:on?"rgba(255,255,255,.15)":"transparent",
              color:on?C.white:"rgba(255,255,255,.58)",
              fontSize:13,fontWeight:on?600:400,textAlign:"left",cursor:"pointer",
              borderLeft:on?`3px solid ${C.sage}`:"3px solid transparent",
            }}>
              <span style={{fontSize:15,opacity:on?1:.7}}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div style={{padding:"12px 10px",borderTop:`1px solid rgba(255,255,255,.08)`}}>
        <div style={{
          display:"flex",alignItems:"center",gap:10,
          padding:"9px 12px",borderRadius:10,background:"rgba(255,255,255,.07)",marginBottom:6,
        }}>
          <div style={{
            width:30,height:30,borderRadius:"50%",flexShrink:0,
            background:`linear-gradient(135deg,${C.sage},${C.fern})`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:12,fontWeight:700,color:C.white,
          }}>{role?.[0]}</div>
          <div>
            <div style={{fontSize:12,color:C.white,fontWeight:600}}>{names[role]}</div>
            <div style={{fontSize:10,color:C.mint}}>user@farmchainx.io</div>
          </div>
        </div>
        <button onClick={logout} className="ni" style={{
          width:"100%",display:"flex",alignItems:"center",gap:8,
          padding:"8px 12px",borderRadius:8,background:"transparent",
          color:"rgba(255,255,255,.45)",fontSize:12,border:"none",cursor:"pointer",
        }}>
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════ */
const BATCHES = [
  {id:"FCX-0241",crop:"Organic Tomatoes",qty:"1,200 kg",status:"Delivered",  score:94,variety:"Roma F1",     location:"Nakuru, Kenya",  date:"Feb 14, 2026",farmer:"John Kamau"},
  {id:"FCX-0242",crop:"Sweet Corn",       qty:"2,400 kg",status:"In Transit",score:88,variety:"Golden Gem",  location:"Meru, Kenya",    date:"Feb 22, 2026",farmer:"John Kamau"},
  {id:"FCX-0243",crop:"French Beans",     qty:"800 kg",  status:"Processing",score:91,variety:"Serengeti",   location:"Nakuru, Kenya",  date:"Mar 1, 2026", farmer:"John Kamau"},
  {id:"FCX-0244",crop:"Avocado",          qty:"3,600 kg",status:"Harvested", score:97,variety:"Hass",        location:"Muranga, Kenya", date:"Mar 3, 2026", farmer:"John Kamau"},
  {id:"FCX-0245",crop:"Spinach",          qty:"450 kg",  status:"Stored",    score:82,variety:"Bloomsdale",  location:"Kiambu, Kenya",  date:"Mar 4, 2026", farmer:"John Kamau"},
];
const SHIPMENTS = [
  {id:"FCX-0241",crop:"Organic Tomatoes",from:"Nakuru Farm",  to:"Nairobi Depot", status:"Delivered",  eta:"Feb 16"},
  {id:"FCX-0242",crop:"Sweet Corn",       from:"Meru Farm",   to:"Mombasa Port",  status:"In Transit", eta:"Mar 8"},
  {id:"FCX-0243",crop:"French Beans",     from:"Nakuru Farm", to:"Eldoret Hub",   status:"Processing", eta:"Mar 10"},
  {id:"FCX-0246",crop:"Potatoes",         from:"Nyandarua",   to:"Nairobi Depot", status:"In Transit", eta:"Mar 7"},
];
const USERS_DATA = [
  {name:"John Kamau",    email:"john@farmchainx.io",  role:"Farmer",      status:"Active",  joined:"Jan 12"},
  {name:"Mary Odhiambo", email:"mary@farmchainx.io",  role:"Distributor", status:"Active",  joined:"Jan 18"},
  {name:"Peter Njoroge", email:"peter@farmchainx.io", role:"Farmer",      status:"Inactive",joined:"Feb 2"},
  {name:"Grace Wanjiku", email:"grace@farmchainx.io", role:"Farmer",      status:"Active",  joined:"Feb 10"},
  {name:"Ahmed Hassan",  email:"ahmed@farmchainx.io", role:"Distributor", status:"Pending", joined:"Feb 22"},
  {name:"Susan Mwangi",  email:"susan@farmchainx.io", role:"Admin",       status:"Active",  joined:"Jan 5"},
];

/* ═══════════════════════════════════════════════════════════════
   PAGES
═══════════════════════════════════════════════════════════════ */

/* ── LOGIN ── */
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("john@farmchainx.io");
  const [pass, setPass] = useState("password");
  const [role, setRole] = useState("Farmer");
  const [rem, setRem] = useState(true);

  return (
    <div style={{
      minHeight:"100vh", display:"flex",
      background:`linear-gradient(145deg,${C.forest} 0%,${C.pine} 45%,${C.moss} 100%)`,
      position:"relative", overflow:"hidden",
    }}>
      {/* Decorative */}
      {[["-80px","-60px",360,.06],["55%","68%",260,.04],["82%","-30px",190,.05]].map(([t,l,s,o],i)=>(
        <div key={i} style={{position:"absolute",top:t,left:l,width:s,height:s,borderRadius:"50%",border:`1px solid rgba(255,255,255,${o})`,pointerEvents:"none"}}/>
      ))}
      <div style={{position:"absolute",bottom:-80,right:-80,width:480,height:480,background:`radial-gradient(circle,rgba(106,184,127,.18) 0%,transparent 70%)`,pointerEvents:"none"}}/>

      {/* Left – brand */}
      <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",padding:"60px 72px",color:C.white}}>
        <div className="fu">
          <div style={{
            display:"inline-flex",alignItems:"center",justifyContent:"center",
            width:62,height:62,borderRadius:16,marginBottom:26,
            background:`linear-gradient(135deg,${C.sage},${C.fern})`,
            fontSize:34,boxShadow:`0 8px 26px rgba(106,184,127,.42)`,
          }}>🌾</div>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:56,fontWeight:600,color:C.white,letterSpacing:"-1.8px",lineHeight:1.02,marginBottom:14}}>
            Farm<span style={{color:C.sage}}>Chain</span>X
          </h1>
          <p style={{fontSize:16,color:"rgba(255,255,255,.62)",lineHeight:1.72,maxWidth:350,marginBottom:38}}>
            AI-driven agricultural traceability from farm to table. Track every batch, verify every harvest.
          </p>
          <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
            {[["🌱","Blockchain\nTraceability"],["🤖","AI Quality\nPrediction"],["📱","QR Scanning"]].map(([ic,lb])=>(
              <div key={lb} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                <div style={{
                  width:44,height:44,borderRadius:12,
                  background:"rgba(255,255,255,.1)",backdropFilter:"blur(6px)",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,
                }}>{ic}</div>
                <span style={{fontSize:10,color:"rgba(255,255,255,.46)",textAlign:"center",whiteSpace:"pre-line",lineHeight:1.4}}>{lb}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right – form */}
      <div style={{
        width:440,display:"flex",alignItems:"center",justifyContent:"center",
        padding:"40px 44px",
        background:"rgba(255,255,255,.06)",backdropFilter:"blur(14px)",
        borderLeft:"1px solid rgba(255,255,255,.1)",
      }}>
        <div className="si" style={{width:"100%"}}>
          <Card style={{padding:34,borderRadius:20,border:"none",boxShadow:"0 20px 72px rgba(0,0,0,.24)"}}>
            <div style={{marginBottom:26}}>
              <h2 style={{fontSize:21,fontWeight:700,color:C.ink,letterSpacing:"-.04em"}}>Welcome back</h2>
              <p style={{fontSize:13,color:C.slate,marginTop:3}}>Sign in to your FarmChainX account</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:15}}>
              <Sel label="Sign in as" value={role} onChange={e=>setRole(e.target.value)} opts={["Farmer","Distributor","Admin"]}/>
              <Field label="Email" type="email" icon="✉️" placeholder="you@farmchainx.io" value={email} onChange={e=>setEmail(e.target.value)}/>
              <Field label="Password" type="password" icon="🔒" placeholder="Password" value={pass} onChange={e=>setPass(e.target.value)}/>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <label style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer",fontSize:13,color:C.slate}}>
                  <input type="checkbox" checked={rem} onChange={e=>setRem(e.target.checked)} style={{accentColor:C.fern,width:14,height:14}}/>
                  Remember me
                </label>
                <button style={{background:"none",border:"none",color:C.moss,fontSize:13,fontWeight:600,cursor:"pointer"}}>Forgot password?</button>
              </div>
              <Btn sz="lg" onClick={()=>onLogin(role)} style={{width:"100%",justifyContent:"center",marginTop:2}}>Sign In →</Btn>
            </div>
            <div style={{
              display:"flex",alignItems:"center",gap:8,
              marginTop:22,padding:"11px 14px",borderRadius:10,
              background:C.dew,border:`1px solid ${C.mist}`,
            }}>
              <span>🔒</span>
              <span style={{fontSize:12,color:C.moss,fontWeight:500}}>Secured by blockchain-verified traceability</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ── FARMER DASHBOARD ── */
function FarmerDash({ setPage, setBatch }) {
  const trend = [72,78,75,82,80,85,83,88,86,91,89,94];
  return (
    <div>
      <TopBar
        title="Farmer Dashboard"
        sub="Good morning, John Kamau 👋"
        actions={[
          <Btn key="qr" v="ghost" icon="📷" onClick={()=>setPage("qr-scan")}>Scan QR</Btn>,
          <Btn key="nb" icon="➕" onClick={()=>setPage("farmer-batches")}>New Batch</Btn>,
        ]}
      />
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
        <StatCard icon="📦" label="Total Batches"     value="47"  chg={8}  color={C.fern}  cls="d1"/>
        <StatCard icon="🌱" label="Active Batches"    value="12"  chg={4}  color={C.sky}   cls="d2"/>
        <StatCard icon="⭐" label="Avg Quality Score" value="91%" chg={3}  color={C.amber} cls="d3"/>
        <StatCard icon="⏳" label="Pending Transfers" value="4"   chg={-1} color={C.grape} cls="d4"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 300px",gap:16,alignItems:"start"}}>
        <Card cls="fu d3" style={{padding:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
            <div>
              <h2 style={{fontSize:16,fontWeight:700,color:C.ink}}>Recent Batches</h2>
              <p style={{fontSize:12,color:C.slate,marginTop:2}}>Click a row for full detail</p>
            </div>
            <Btn v="ghost" sz="sm" onClick={()=>setPage("farmer-batches")}>View all →</Btn>
          </div>
          <Table
            cols={[
              {k:"id",  l:"Batch ID", r:v=><span style={{fontFamily:"monospace",fontSize:12,fontWeight:600,color:C.moss}}>{v}</span>},
              {k:"crop",l:"Crop"},
              {k:"status",l:"Status",r:v=><Badge status={v}/>},
              {k:"score",l:"Quality",r:v=>(
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{flex:1,height:4,background:C.pearl,borderRadius:4,minWidth:56}}>
                    <div style={{height:"100%",borderRadius:4,width:`${v}%`,background:v>=85?C.fern:v>=65?C.amber:C.rose}}/>
                  </div>
                  <span style={{fontSize:12,fontWeight:600,color:C.charcoal,minWidth:30}}>{v}%</span>
                </div>
              )},
            ]}
            rows={BATCHES}
            onRow={row=>{setBatch(row);setPage("batch-detail");}}
          />
        </Card>
        <Card cls="fu d4" style={{padding:24}}>
          <div style={{marginBottom:14}}>
            <h2 style={{fontSize:16,fontWeight:700,color:C.ink}}>Quality Trend</h2>
            <p style={{fontSize:12,color:C.slate,marginTop:2}}>Last 12 batches</p>
          </div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:30,fontWeight:700,color:C.ink,letterSpacing:"-1px"}}>94%</div>
            <div style={{fontSize:12,color:C.moss,fontWeight:500,marginTop:2}}>↑ 3.2% vs last month</div>
          </div>
          <Spark data={trend} color={C.fern} h={70}/>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
            {["Feb 1","Feb 15","Mar 4"].map(d=><span key={d} style={{fontSize:10,color:C.fog}}>{d}</span>)}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ── FARMER BATCHES ── */
function FarmerBatches({ setPage, setBatch }) {
  return (
    <div>
      <TopBar title="My Batches" sub="Manage and track all your crop batches" actions={[<Btn key="nb" icon="➕">Create New Batch</Btn>]}/>
      <Card cls="fu" style={{padding:24}}>
        <Table
          cols={[
            {k:"id",  l:"Batch ID",     r:v=><span style={{fontFamily:"monospace",fontSize:12,fontWeight:600,color:C.moss}}>{v}</span>},
            {k:"crop",l:"Crop"},
            {k:"qty", l:"Quantity"},
            {k:"location",l:"Location"},
            {k:"date",l:"Harvest Date"},
            {k:"status",l:"Status",r:v=><Badge status={v}/>},
            {k:"score",l:"AI Score",r:v=><Ring score={v} size={38}/>},
            {k:"id",l:"Action",r:(v,row)=>(
              <Btn sz="xs" v="ghost" onClick={e=>{e.stopPropagation();setBatch(row);setPage("batch-detail");}}>View →</Btn>
            )},
          ]}
          rows={BATCHES}
          onRow={row=>{setBatch(row);setPage("batch-detail");}}
        />
      </Card>
    </div>
  );
}

/* ── BATCH DETAIL ── */
function BatchDetail({ batch, setPage }) {
  const b = batch || BATCHES[1];
  const grade = b.score>=85?"Premium":b.score>=65?"Standard":"Below Standard";
  const stages = [
    {label:"Farm",        icon:"🌾",done:true,  date:b.date},
    {label:"Processing",  icon:"⚙️",done:true,  date:"T+2 days"},
    {label:"Storage",     icon:"🏭",done:!["Harvested"].includes(b.status),date:"T+4 days"},
    {label:"Distributor", icon:"🚚",done:["In Transit","Delivered"].includes(b.status),date:"T+8 days"},
    {label:"Retailer",    icon:"🛒",done:b.status==="Delivered",date:"T+10 days"},
  ];
  return (
    <div>
      <div style={{marginBottom:18}}>
        <button onClick={()=>setPage("farmer-batches")} style={{background:"none",border:"none",color:C.moss,fontSize:13,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:5}}>← Back to Batches</button>
      </div>
      <TopBar title={b.crop} sub={`Batch ${b.id} · Harvested ${b.date}`} actions={[
        <Btn key="c" v="secondary" icon="🛒" onClick={()=>setPage("consumer")}>Consumer View</Btn>,
        <Btn key="q" v="ghost" icon="📷" onClick={()=>setPage("qr-scan")}>Scan</Btn>,
      ]}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 268px",gap:16,alignItems:"start"}}>
        {/* Info */}
        <Card cls="fu" style={{padding:24}}>
          <h3 style={{fontSize:11,fontWeight:700,color:C.fog,letterSpacing:".07em",textTransform:"uppercase",marginBottom:18}}>Batch Information</h3>
          {[["🌱","Crop",b.crop],["🌿","Variety",b.variety],["⚖️","Quantity",b.qty],["📍","Location",b.location],["📅","Harvest Date",b.date],["👤","Farmer",b.farmer],["📊","Status",null]].map(([ic,k,val])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`1px solid ${C.pearl}`}}>
              <span style={{fontSize:13,color:C.slate,display:"flex",alignItems:"center",gap:7}}><span>{ic}</span>{k}</span>
              {k==="Status"?<Badge status={b.status}/>:<span style={{fontSize:13,fontWeight:500,color:C.ink}}>{val}</span>}
            </div>
          ))}
        </Card>
        {/* AI Quality */}
        <Card cls="fu d1" style={{padding:24}}>
          <h3 style={{fontSize:11,fontWeight:700,color:C.fog,letterSpacing:".07em",textTransform:"uppercase",marginBottom:18}}>AI Quality Analysis</h3>
          <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:22}}>
            <Ring score={b.score} size={110}/>
            <div>
              <Badge status={grade}/>
              <div style={{fontSize:26,fontWeight:700,color:C.ink,letterSpacing:"-1px",marginTop:10}}>{b.score}/100</div>
              <div style={{fontSize:12,color:C.slate}}>AI Confidence: High</div>
            </div>
          </div>
          {[["Moisture Level","12.4%",96],["Nutrient Density","High",89],["Visual Quality","Excellent",b.score],["Pesticide Residue","None",100]].map(([lbl,val,pct])=>(
            <div key={lbl} style={{marginBottom:11}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:12,color:C.slate}}>{lbl}</span>
                <span style={{fontSize:12,fontWeight:600,color:C.charcoal}}>{val}</span>
              </div>
              <div style={{height:4,background:C.pearl,borderRadius:4,overflow:"hidden"}}>
                <div style={{height:"100%",borderRadius:4,width:`${pct}%`,background:pct>=85?C.fern:pct>=65?C.amber:C.rose}}/>
              </div>
            </div>
          ))}
        </Card>
        {/* QR */}
        <Card cls="fu d2" style={{padding:24}}>
          <h3 style={{fontSize:11,fontWeight:700,color:C.fog,letterSpacing:".07em",textTransform:"uppercase",marginBottom:18}}>QR Code</h3>
          <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>
            <div style={{padding:14,background:C.white,border:`2px solid ${C.mist}`,borderRadius:12,boxShadow:`0 4px 14px rgba(26,58,42,.09)`}}>
              <svg width={116} height={116} viewBox="0 0 37 37">
                {/* TL finder */}
                <rect x="1" y="1" width="7" height="7" rx="1" fill={C.forest}/>
                <rect x="2" y="2" width="5" height="5" rx=".5" fill={C.white}/>
                <rect x="3" y="3" width="3" height="3" fill={C.forest}/>
                {/* TR finder */}
                <rect x="29" y="1" width="7" height="7" rx="1" fill={C.forest}/>
                <rect x="30" y="2" width="5" height="5" rx=".5" fill={C.white}/>
                <rect x="31" y="3" width="3" height="3" fill={C.forest}/>
                {/* BL finder */}
                <rect x="1" y="29" width="7" height="7" rx="1" fill={C.forest}/>
                <rect x="2" y="30" width="5" height="5" rx=".5" fill={C.white}/>
                <rect x="3" y="31" width="3" height="3" fill={C.forest}/>
                {/* Data */}
                {[[10,1],[12,1],[15,1],[18,2],[21,1],[24,1],[26,1],[10,3],[14,3],[17,3],[20,3],[24,3],[10,5],[13,5],[16,5],[20,5],[24,5],[26,5],[10,7],[13,7],[16,7],[19,7],[22,7],[25,7],[1,10],[4,10],[7,10],[10,10],[13,10],[16,10],[19,10],[22,10],[25,10],[28,10],[31,10],[34,10],[2,12],[5,12],[8,12],[11,12],[14,12],[17,12],[20,12],[23,12],[26,12],[29,12],[32,12],[35,12],[1,14],[4,14],[7,14],[10,14],[14,14],[17,14],[20,14],[24,14],[27,14],[30,14],[34,14],[2,16],[6,16],[9,16],[12,16],[15,16],[19,16],[22,16],[25,16],[28,16],[32,16],[35,16],[1,18],[4,18],[8,18],[11,18],[14,18],[18,18],[21,18],[24,18],[27,18],[31,18],[34,18],[2,20],[5,20],[8,20],[12,20],[15,20],[18,20],[22,20],[25,20],[29,20],[32,20],[1,22],[5,22],[9,22],[12,22],[16,22],[19,22],[23,22],[26,22],[30,22],[33,22],[2,24],[6,24],[10,24],[13,24],[17,24],[20,24],[24,24],[27,24],[31,24],[9,26],[12,26],[16,26],[19,26],[22,26],[26,26],[29,26],[33,26],[9,28],[13,28],[17,28],[20,28],[24,28],[27,28],[31,28],[9,30],[12,30],[15,30],[19,30],[22,30],[26,30],[29,30],[33,30],[9,32],[13,32],[17,32],[21,32],[24,32],[28,32],[31,32],[35,32],[9,34],[12,34],[16,34],[19,34],[23,34],[26,34],[30,34],[33,34]].map(([x,y],i)=>(
                  <rect key={i} x={x} y={y} width="1.5" height="1.5" rx=".2" fill={C.forest}/>
                ))}
              </svg>
            </div>
          </div>
          <div style={{textAlign:"center",marginBottom:14}}>
            <div style={{fontSize:10,fontFamily:"monospace",color:C.slate,fontWeight:600}}>{b.id}</div>
          </div>
          <div style={{display:"flex",gap:7}}>
            <Btn v="secondary" sz="sm" style={{flex:1,justifyContent:"center"}} icon="📥">Download</Btn>
            <Btn v="ghost" sz="sm" style={{flex:1,justifyContent:"center"}} icon="🖨️">Print</Btn>
          </div>
        </Card>
      </div>

      {/* Timeline */}
      <Card cls="fu d3" style={{padding:26,marginTop:16}}>
        <h3 style={{fontSize:11,fontWeight:700,color:C.fog,letterSpacing:".07em",textTransform:"uppercase",marginBottom:24}}>Supply Chain Timeline</h3>
        <div style={{display:"flex",alignItems:"center",overflowX:"auto",paddingBottom:6}}>
          {stages.map((s,i)=>(
            <div key={s.label} style={{display:"flex",alignItems:"center",flex:i<stages.length-1?1:0}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:7,minWidth:84}}>
                <div style={{
                  width:50,height:50,borderRadius:"50%",
                  background:s.done?`linear-gradient(135deg,${C.moss},${C.fern})`:C.pearl,
                  border:s.done?"none":`2px dashed ${C.silver}`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
                  boxShadow:s.done?`0 4px 14px rgba(61,122,82,.28)`:"none",
                  animation:s.done?"pulseGlow 2.5s infinite":"none",
                }}>{s.done?"✓":s.icon}</div>
                <div style={{fontSize:12,fontWeight:s.done?600:400,color:s.done?C.pine:C.fog,textAlign:"center"}}>{s.label}</div>
                <div style={{fontSize:10,color:C.fog}}>{s.date}</div>
              </div>
              {i<stages.length-1&&(
                <div style={{flex:1,height:3,marginBottom:38,background:s.done?C.mint:C.pearl,borderRadius:2,minWidth:24}}/>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ── DISTRIBUTOR DASHBOARD ── */
function DistDash() {
  return (
    <div>
      <TopBar title="Distributor Dashboard" sub="Logistics and shipment overview" actions={[<Btn key="ns" icon="➕">New Shipment</Btn>]}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
        <StatCard icon="📥" label="Received Batches"      value="28" chg={6}  color={C.fern}/>
        <StatCard icon="🚚" label="In-Transit Shipments"  value="7"  chg={-2} color={C.amber} cls="d1"/>
        <StatCard icon="✅" label="Delivered Batches"     value="19" chg={12} color={C.sky}   cls="d2"/>
      </div>
      <Card cls="fu d2" style={{padding:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
          <div>
            <h2 style={{fontSize:16,fontWeight:700,color:C.ink}}>Active Shipments</h2>
            <p style={{fontSize:12,color:C.slate,marginTop:2}}>Real-time supply chain tracking</p>
          </div>
          <Btn v="ghost" sz="sm">Filter</Btn>
        </div>
        <Table
          cols={[
            {k:"id",  l:"Batch ID",r:v=><span style={{fontFamily:"monospace",fontSize:12,fontWeight:600,color:C.moss}}>{v}</span>},
            {k:"crop",l:"Product"},
            {k:"from",l:"From"},
            {k:"to",  l:"To"},
            {k:"eta", l:"ETA"},
            {k:"status",l:"Status",r:v=><Badge status={v}/>},
            {k:"id",l:"Action",r:()=><Btn sz="xs" v="secondary">Update</Btn>},
          ]}
          rows={SHIPMENTS}
        />
      </Card>
    </div>
  );
}

/* ── ADMIN DASHBOARD ── */
function AdminDash() {
  const [users, setUsers] = useState(USERS_DATA);
  const toggle = email => setUsers(us=>us.map(u=>u.email===email?{...u,status:u.status==="Active"?"Inactive":"Active"}:u));
  return (
    <div>
      <TopBar title="Admin Dashboard" sub="System overview and user management" actions={[<Btn key="au" icon="➕">Add User</Btn>]}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}}>
        <StatCard icon="👥" label="Total Users"    value="124"   chg={9}  color={C.fern}/>
        <StatCard icon="📦" label="Total Batches"  value="1,847" chg={14} color={C.sky}   cls="d1"/>
        <StatCard icon="⚡" label="Active Sessions" value="38"   chg={4}  color={C.amber} cls="d2"/>
      </div>
      <Card cls="fu d2" style={{padding:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18}}>
          <div>
            <h2 style={{fontSize:16,fontWeight:700,color:C.ink}}>User Management</h2>
            <p style={{fontSize:12,color:C.slate,marginTop:2}}>Click to activate/deactivate accounts</p>
          </div>
          <Btn v="ghost" sz="sm">Export</Btn>
        </div>
        <Table
          cols={[
            {k:"name",l:"Name",r:(v)=>(
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${C.sage},${C.fern})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:C.white,flexShrink:0}}>{v[0]}</div>
                <span style={{fontWeight:500}}>{v}</span>
              </div>
            )},
            {k:"email",l:"Email",r:v=><span style={{color:C.slate,fontSize:13}}>{v}</span>},
            {k:"role",l:"Role",r:v=><span style={{fontSize:12,fontWeight:600,color:C.pine,background:C.dew,padding:"2px 8px",borderRadius:6}}>{v}</span>},
            {k:"joined",l:"Joined"},
            {k:"status",l:"Status",r:v=><Badge status={v}/>},
            {k:"email",l:"Action",r:(v,row)=>(
              <Btn sz="xs" v={row.status==="Active"?"danger":"secondary"} onClick={()=>toggle(v)}>
                {row.status==="Active"?"Deactivate":"Activate"}
              </Btn>
            )},
          ]}
          rows={users}
        />
      </Card>
    </div>
  );
}

/* ── CONSUMER PAGE ── */
function ConsumerPage({ batch }) {
  const b = batch || BATCHES[0];
  const grade = b.score>=85?"Premium":"Standard";
  const stages = [
    {label:"Harvested",  icon:"🌾",date:b.date,   loc:b.location,           done:true},
    {label:"Processed",  icon:"⚙️",date:"T+2",    loc:"Nakuru Processing",  done:true},
    {label:"In Storage", icon:"🏭",date:"T+4",    loc:"Nairobi Cold Store", done:true},
    {label:"Dispatched", icon:"🚚",date:"T+8",    loc:"Nairobi Depot",      done:["In Transit","Delivered"].includes(b.status)},
    {label:"At Retailer",icon:"🛒",date:"T+10",   loc:"Westgate Market",    done:b.status==="Delivered"},
  ];
  return (
    <div style={{maxWidth:480,margin:"0 auto"}}>
      {/* Hero card */}
      <Card cls="si" style={{padding:0,marginBottom:14,background:`linear-gradient(135deg,${C.forest},${C.pine})`,border:"none"}}>
        <div style={{padding:"28px 24px 22px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontSize:10,color:C.mint,fontWeight:600,letterSpacing:".06em",textTransform:"uppercase",marginBottom:6}}>Verified Product</div>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600,color:C.white,letterSpacing:"-.04em"}}>{b.crop}</h1>
              <div style={{fontSize:13,color:"rgba(255,255,255,.55)",marginTop:4}}>Batch {b.id}</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:34,fontWeight:800,color:C.white,lineHeight:1}}>{b.score}%</div>
              <div style={{fontSize:9,color:C.mint,letterSpacing:".05em",marginTop:2}}>AI SCORE</div>
              <div style={{marginTop:8}}><Badge status={grade}/></div>
            </div>
          </div>
        </div>
        <div style={{padding:"11px 24px",background:"rgba(255,255,255,.06)",borderTop:"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:18}}>🛡️</span>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:700,color:C.white}}>Blockchain Verified</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.5)"}}>Fully traceable on FarmChainX network</div>
          </div>
          <span style={{fontSize:10,color:C.mint,fontWeight:700}}>✓ AUTHENTICATED</span>
        </div>
      </Card>

      {/* Info grid */}
      <Card cls="fu d1" style={{padding:20,marginBottom:14}}>
        <h3 style={{fontSize:11,fontWeight:700,color:C.fog,textTransform:"uppercase",letterSpacing:".07em",marginBottom:14}}>Batch Information</h3>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[["Harvest Date",b.date],["Farm Location",b.location],["Farmer",b.farmer],["Variety",b.variety],["Quantity",b.qty],["Quality Grade",grade]].map(([k,v])=>(
            <div key={k} style={{background:C.pearl,padding:"10px 12px",borderRadius:10}}>
              <div style={{fontSize:10,color:C.fog,fontWeight:600,textTransform:"uppercase",letterSpacing:".04em",marginBottom:3}}>{k}</div>
              <div style={{fontSize:13,fontWeight:600,color:C.ink}}>{v}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Journey */}
      <Card cls="fu d2" style={{padding:20}}>
        <h3 style={{fontSize:11,fontWeight:700,color:C.fog,textTransform:"uppercase",letterSpacing:".07em",marginBottom:18}}>Product Journey</h3>
        {stages.map((s,i)=>(
          <div key={s.label} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              <div style={{
                width:38,height:38,borderRadius:"50%",flexShrink:0,
                background:s.done?`linear-gradient(135deg,${C.moss},${C.fern})`:C.pearl,
                border:s.done?"none":`2px dashed ${C.silver}`,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,
              }}>{s.done?"✓":s.icon}</div>
              {i<stages.length-1&&<div style={{width:2,height:26,background:s.done?C.mint:C.pearl,margin:"3px 0"}}/>}
            </div>
            <div style={{paddingTop:8,flex:1}}>
              <div style={{fontSize:13,fontWeight:600,color:s.done?C.ink:C.fog}}>{s.label}</div>
              <div style={{fontSize:11,color:C.slate,marginTop:1}}>{s.loc} · {s.date}</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ── QR SCAN PAGE ── */
function QRScan({ setPage, setBatch }) {
  const [mode, setMode] = useState("idle");
  const [scanning, setScanning] = useState(false);

  const simulate = () => {
    setScanning(true);
    setTimeout(()=>{ setScanning(false); setBatch(BATCHES[0]); setMode("scanned"); }, 1800);
  };

  return (
    <div>
      <TopBar title="QR Scanner" sub="Scan a product QR code to access full traceability"/>
      <div style={{maxWidth:500,margin:"0 auto"}}>
        {mode==="idle"&&(
          <Card cls="si" style={{padding:44,textAlign:"center"}}>
            <div style={{width:80,height:80,borderRadius:20,margin:"0 auto 22px",background:`linear-gradient(135deg,${C.dew},${C.mist})`,border:`2px solid ${C.mint}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40}}>📷</div>
            <h2 style={{fontSize:21,fontWeight:700,color:C.ink,marginBottom:8}}>Scan Product QR</h2>
            <p style={{fontSize:14,color:C.slate,marginBottom:28,lineHeight:1.65}}>
              Use your camera or upload an image to access full product traceability and AI quality scores.
            </p>
            <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
              <Btn icon="📷" sz="lg" onClick={()=>setMode("camera")}>Open Camera</Btn>
              <Btn icon="📁" v="ghost" sz="lg">Upload Image</Btn>
            </div>
          </Card>
        )}
        {mode==="camera"&&(
          <Card cls="si" style={{padding:24}}>
            <div style={{marginBottom:18}}>
              <h2 style={{fontSize:17,fontWeight:700,color:C.ink}}>Camera Active</h2>
              <p style={{fontSize:12,color:C.slate,marginTop:2}}>Position QR code within the frame</p>
            </div>
            <div style={{position:"relative",background:C.ink,borderRadius:12,overflow:"hidden",marginBottom:20,paddingTop:"70%"}}>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}>
                {scanning?(
                  <>
                    <div style={{width:32,height:32,borderRadius:"50%",border:`3px solid ${C.sage}`,borderTopColor:"transparent",animation:"spin .7s linear infinite"}}/>
                    <span style={{color:C.mint,fontSize:13}}>Scanning…</span>
                  </>
                ):(
                  <>
                    {[{top:"22%",left:"22%",borderTop:`3px solid ${C.sage}`,borderLeft:`3px solid ${C.sage}`},{top:"22%",right:"22%",borderTop:`3px solid ${C.sage}`,borderRight:`3px solid ${C.sage}`},{bottom:"22%",left:"22%",borderBottom:`3px solid ${C.sage}`,borderLeft:`3px solid ${C.sage}`},{bottom:"22%",right:"22%",borderBottom:`3px solid ${C.sage}`,borderRight:`3px solid ${C.sage}`}].map((s,i)=>(
                      <div key={i} style={{position:"absolute",width:28,height:28,borderRadius:3,...s}}/>
                    ))}
                    <span style={{color:"rgba(255,255,255,.35)",fontSize:12,position:"absolute",bottom:"16%"}}>Align QR code within the frame</span>
                  </>
                )}
              </div>
            </div>
            <div style={{display:"flex",gap:10}}>
              <Btn style={{flex:1,justifyContent:"center"}} onClick={simulate} disabled={scanning}>{scanning?"Scanning…":"Simulate Scan"}</Btn>
              <Btn v="ghost" style={{flex:1,justifyContent:"center"}} onClick={()=>setMode("idle")}>Cancel</Btn>
            </div>
          </Card>
        )}
        {mode==="scanned"&&(
          <Card cls="si" style={{padding:28}}>
            <div style={{textAlign:"center",padding:"8px 0 18px",borderBottom:`1px solid ${C.pearl}`,marginBottom:18}}>
              <div style={{fontSize:48,marginBottom:10}}>✅</div>
              <div style={{fontSize:18,fontWeight:700,color:C.pine}}>QR Code Scanned!</div>
              <div style={{fontSize:13,color:C.slate,marginTop:4}}>Batch identified successfully</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:22}}>
              {[["Batch ID",BATCHES[0].id],["Product",BATCHES[0].crop],["Farm",BATCHES[0].location],["AI Quality",`${BATCHES[0].score}% · Premium`],["Status",BATCHES[0].status]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 12px",background:C.pearl,borderRadius:8}}>
                  <span style={{fontSize:13,color:C.slate}}>{k}</span>
                  <span style={{fontSize:13,fontWeight:600,color:C.ink}}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:10}}>
              <Btn style={{flex:1,justifyContent:"center"}} onClick={()=>setPage("consumer")}>Full Traceability →</Btn>
              <Btn v="ghost" style={{flex:1,justifyContent:"center"}} onClick={()=>setMode("idle")}>Scan Another</Btn>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ── PLACEHOLDER ── */
function Placeholder({ icon, title, desc }) {
  return (
    <div>
      <TopBar title={title} sub={desc}/>
      <Card cls="si" style={{padding:60,textAlign:"center"}}>
        <div style={{fontSize:52,marginBottom:16}}>{icon}</div>
        <h2 style={{fontSize:20,fontWeight:700,color:C.ink,marginBottom:8}}>{title}</h2>
        <p style={{fontSize:14,color:C.slate}}>{desc}</p>
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════════════ */
export default function App() {
  useEffect(() => { injectAssets(); }, []);

  const [role, setRole] = useState(null);
  const [page, setPage] = useState(null);
  const [batch, setBatch] = useState(null);

  const login = r => {
    setRole(r);
    setPage(r==="Farmer"?"farmer-dash":r==="Distributor"?"dist-dash":"admin-dash");
  };
  const logout = () => { setRole(null); setPage(null); };

  const renderPage = () => {
    switch(page) {
      case "farmer-dash":    return <FarmerDash setPage={setPage} setBatch={setBatch}/>;
      case "farmer-batches": return <FarmerBatches setPage={setPage} setBatch={setBatch}/>;
      case "batch-detail":   return <BatchDetail batch={batch} setPage={setPage}/>;
      case "consumer":       return <ConsumerPage batch={batch}/>;
      case "qr-scan":        return <QRScan setPage={setPage} setBatch={setBatch}/>;
      case "dist-dash":      return <DistDash/>;
      case "admin-dash":     return <AdminDash/>;
      case "supply-chain":   return <Placeholder icon="🔗" title="Supply Chain" desc="End-to-end supply chain visualization coming soon."/>;
      case "reports":        return <Placeholder icon="📊" title="Reports" desc="Batch analytics and export reports coming soon."/>;
      case "dist-ships":     return <Placeholder icon="🚚" title="Shipments" desc="Detailed shipment management coming soon."/>;
      case "dist-inv":       return <Placeholder icon="🏪" title="Inventory" desc="Inventory tracking coming soon."/>;
      case "admin-settings": return <Placeholder icon="⚙️" title="Settings" desc="System configuration coming soon."/>;
      default:               return <Placeholder icon="🌾" title="Coming Soon" desc="This page is under construction."/>;
    }
  };

  if (!role) return <LoginPage onLogin={login}/>;

  return (
    <div style={{display:"flex",minHeight:"100vh"}}>
      <Sidebar role={role} active={page} setPage={setPage} logout={logout}/>
      <main style={{flex:1,padding:"34px 30px",overflowY:"auto",minWidth:0}}>
        {renderPage()}
        {/* Demo nav */}
        <div style={{marginTop:44,padding:"18px 22px",background:C.white,border:`1px solid ${C.mist}`,borderRadius:16,boxShadow:`0 2px 14px rgba(26,58,42,.05)`}}>
          <div style={{fontSize:10,fontWeight:700,color:C.fog,textTransform:"uppercase",letterSpacing:".07em",marginBottom:11}}>🗺️ Demo Navigation</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[
              ["📦","Batch Detail","batch-detail","Farmer"],
              ["🛒","Consumer View","consumer","Farmer"],
              ["📷","QR Scanner","qr-scan","Farmer"],
              ["🚚","Distributor","dist-dash","Distributor"],
              ["🛠","Admin","admin-dash","Admin"],
            ].map(([ic,lb,pg,r])=>(
              <Btn key={pg} sz="sm" v="secondary" icon={ic} onClick={()=>{
                if(r!==role){setRole(r);}
                setPage(pg);
              }}>{lb}</Btn>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
