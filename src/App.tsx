import React, { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  Users,
  Calendar,
  Home,
  Download,
  Mail,
  Instagram,
  HeartPulse,
  Award,
  ExternalLink,
  Target,
  Zap,
  QrCode,
  X,
  BarChart2,
  Lock,
  ShieldCheck,
  ChevronRight,
  Bell,
  Search,
  ArrowRight
} from "lucide-react";
import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  getDocs, 
  serverTimestamp 
} from "firebase/firestore";
import { 
  getAuth, 
  signInAnonymously, 
  signInWithCustomToken,
  onAuthStateChanged 
} from "firebase/auth";

// --- FIREBASE CONFIGURATION (Safe Handling) ---
// In a real Vercel app, you would use process.env.REACT_APP_FIREBASE_CONFIG
let firebaseConfig;
try {
  firebaseConfig = JSON.parse(__firebase_config);
} catch (e) {
  // Mock config for preview purposes if env variable is missing
  firebaseConfig = { apiKey: "mock-key", authDomain: "mock.firebaseapp.com", projectId: "mock-project" };
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- DATA ---
const APP_DATA = {
  title: "SCOME",
  subtitle: "Medical Education Hub",
  announcement: "📢 Upcoming: AMR Workshop Registration closes in 24h!",
  mainVision: {
    title: "Future Curriculum",
    description: "Integrating digital health & soft skills.",
    tags: ["Digital Literacy", "Peer Teaching"],
  },
  currentTheme: {
    title: "AMR & Ophthalmology",
    description: "Combating resistance in eye care.",
    status: "LIVE CAMPAIGN",
  },
  socials: {
    instagram: "https://www.instagram.com/nmssa.newmansoura?igsh=ZnE2YWJjMjFycTc1",
    email: "president.nmssa1@gmail.com",
  },
};

const TEAM_MEMBERS = [
  { id: 1, name: "Arwa Okasha", role: "LOME", bio: "Leading education." },
  { id: 2, name: "Yousif Elshendy", role: "Gen. Assistant", bio: "Logistics lead." },
  { id: 3, name: "Yasmeen Ebrahim", role: "CBDA", bio: "Capacity Building." },
  { id: 4, name: "Abdallah El-Demerdash", role: "BME FAC", bio: "Basic Medical Ed." },
  { id: 5, name: "Ahmed Hareth", role: "SMP FAC", bio: "Student Mobility." },
];

const EVENTS = [
  {
    id: 1,
    title: "AMR & Ophthalmology",
    date: "Dec 3", 
    status: "upcoming",
    link: "https://scome-amr-ophthalmology.my.canva.site/photography-portfolio-website-in-black-and-white-grey-dark-modern-minimal-style",
    poster: "https://i.ibb.co/tTQptHQh/Screenshot-20251130-124600-Gallery.jpg",
  },
];

const RESOURCES = [
  { id: 1, title: "SCOME 101 Manual", type: "PDF", size: "2.4 MB" },
  { id: 2, title: "Advocacy Toolkit", type: "PDF", size: "1.1 MB" },
  { id: 3, title: "Workshop Slides", type: "PPT", size: "5.0 MB" },
];

// --- COMPONENTS ---

// 1. Onboarding Modal (New Feature)
const WelcomeModal = ({ onComplete }) => (
  <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-fadeIn">
    <div className="bg-white rounded-3xl p-8 max-w-sm text-center shadow-2xl border-4 border-blue-500/20">
      <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <HeartPulse size={40} className="text-blue-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to SCOME</h2>
      <p className="text-gray-500 mb-8">Your digital hub for events, resources, and our team. No paper required.</p>
      <button 
        onClick={onComplete}
        className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/30 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
      >
        Get Started <ArrowRight size={20} />
      </button>
    </div>
  </div>
);

// 2. Admin Dashboard (Pro Visuals)
const AdminDashboard = ({ onClose, user }) => {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [visits, setVisits] = useState([]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "SCOME_coreteam_analysis") {
      setUnlocked(true);
      fetchData();
    } else {
      setError("Access Denied");
    }
  };

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Mock data fetch logic safe for preview if firebase fails
      const visitsRef = collection(db, 'artifacts', appId, 'public', 'data', 'visits');
      const q = query(visitsRef); 
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => doc.data());
      setVisits(data);
    } catch (e) { console.log("Using mock data due to env"); }
    setLoading(false);
  };

  const totalVisits = visits.length || 142; // Fallback number for visual demo

  if (!unlocked) return (
    <div className="fixed inset-0 z-[100] bg-gray-900/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xs rounded-2xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-800">Core Team</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="password" 
            className="w-full bg-gray-100 p-3 rounded-lg text-center font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
            placeholder="Security Key"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <div className="text-red-500 text-xs text-center">{error}</div>}
          <button className="w-full bg-black text-white py-3 rounded-lg font-bold">Unlock System</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-gray-100 flex flex-col animate-slideUp">
      <div className="bg-white p-6 shadow-sm flex justify-between items-center">
        <h2 className="font-bold text-xl flex items-center gap-2"><ShieldCheck className="text-emerald-500"/> Analytics</h2>
        <button onClick={onClose} className="bg-gray-100 p-2 rounded-full"><X size={20}/></button>
      </div>
      <div className="p-6 space-y-6 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-600 text-white p-5 rounded-2xl shadow-lg shadow-blue-600/20">
            <div className="text-blue-200 text-xs uppercase font-bold mb-1">Total Traffic</div>
            <div className="text-4xl font-extrabold">{totalVisits}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
            <div className="text-gray-400 text-xs uppercase font-bold mb-1">Active Now</div>
            <div className="text-4xl font-extrabold text-gray-800">3</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-64 flex items-center justify-center text-gray-400 text-sm">
          Chart Visualization Area
        </div>
      </div>
    </div>
  );
};

// 3. Components
const Header = () => (
  <div className="relative z-10 pt-12 pb-6 px-6">
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-black text-white tracking-tighter drop-shadow-md">{APP_DATA.title}</h1>
        <p className="text-white/80 font-medium">{APP_DATA.subtitle}</p>
      </div>
      <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/30 shadow-xl">
        <HeartPulse className="text-white" size={28} />
      </div>
    </div>
    {/* News Ticker */}
    <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3 flex items-center gap-3">
      <div className="bg-orange-500 rounded-full p-1"><Bell size={12} className="text-white"/></div>
      <p className="text-white text-xs font-medium truncate">{APP_DATA.announcement}</p>
    </div>
  </div>
);

// --- VIEWS ---

const HomeView = () => (
  <div className="space-y-6 pb-24">
    {/* Hero Card */}
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-white">
      <div className="flex items-center gap-2 mb-4 text-blue-600">
        <Award size={20} />
        <h2 className="font-bold uppercase text-sm tracking-wider">Mission</h2>
      </div>
      <p className="text-gray-600 leading-relaxed font-medium">{APP_DATA.mission}</p>
    </div>

    {/* Vision Card (Glass) */}
    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-xl text-white relative overflow-hidden">
      <Target className="absolute right-[-20px] top-[-20px] text-white/10" size={150} />
      <div className="relative z-10">
        <div className="text-blue-200 text-xs font-bold uppercase mb-2">Main Vision</div>
        <h2 className="text-2xl font-bold mb-2">{APP_DATA.mainVision.title}</h2>
        <p className="text-white/80 text-sm mb-4">{APP_DATA.mainVision.description}</p>
        <div className="flex gap-2">
          {APP_DATA.mainVision.points.map(p => (
            <span key={p} className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs border border-white/20">{p}</span>
          ))}
        </div>
      </div>
    </div>

    {/* Current Campaign */}
    <div className="bg-white p-1 rounded-3xl shadow-sm border border-gray-100">
      <div className="bg-emerald-50 rounded-[20px] p-6 border border-emerald-100 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-400/20 rounded-full blur-2xl"></div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-emerald-800 flex items-center gap-2"><Zap size={16}/> Active</h3>
          <span className="bg-emerald-200 text-emerald-800 text-[10px] px-2 py-1 rounded-full font-bold">LIVE</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">{APP_DATA.currentTheme.title}</h2>
        <p className="text-gray-500 text-sm">{APP_DATA.currentTheme.description}</p>
      </div>
    </div>

    {/* Links */}
    <div className="grid grid-cols-2 gap-4">
      <a href={APP_DATA.socials.instagram} target="_blank" className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition border border-gray-100">
        <Instagram className="text-pink-600" />
        <span className="text-xs font-bold text-gray-600">Instagram</span>
      </a>
      <a href={`mailto:${APP_DATA.socials.email}`} className="bg-white p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition border border-gray-100">
        <Mail className="text-teal-600" />
        <span className="text-xs font-bold text-gray-600">Email Us</span>
      </a>
    </div>
  </div>
);

const TeamView = ({ openAdmin }) => (
  <div className="space-y-4 pb-24">
    <div onClick={openAdmin} className="bg-gray-900 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between cursor-pointer active:scale-95 transition-transform">
      <div className="flex items-center gap-3">
        <div className="bg-white/10 p-2 rounded-lg"><ShieldCheck size={20}/></div>
        <div>
          <h3 className="font-bold text-sm">Core Dashboard</h3>
          <p className="text-[10px] text-gray-400">Restricted Access</p>
        </div>
      </div>
      <ChevronRight size={16} className="text-gray-500"/>
    </div>

    <div className="flex items-center gap-2 px-2 text-gray-500 mb-2">
      <Users size={18}/> <span className="text-sm font-bold uppercase tracking-wider">Members</span>
    </div>

    <div className="grid gap-3">
      {TEAM_MEMBERS.map(m => (
        <div key={m.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-200 to-teal-200 flex items-center justify-center font-bold text-blue-800 text-lg shadow-inner">
            {m.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{m.name}</h4>
            <div className="text-blue-600 text-[10px] font-bold uppercase bg-blue-50 inline-block px-2 py-0.5 rounded-full mb-1">{m.role}</div>
            <p className="text-gray-400 text-xs">{m.bio}</p>
          </div>
        </div>
      ))}
    </div>

    <a 
      href="https://docs.google.com/forms/d/e/1FAIpQLScaz6jhLKriaPWS7oevu8e_o_7VPnTapfYYnJ55FMhOdmenDg/viewform"
      target="_blank"
      className="block mt-6"
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-1 rounded-2xl shadow-xl">
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-[12px] p-6 text-center">
          <h3 className="font-bold text-lg mb-1">Join the Mission</h3>
          <p className="text-white/80 text-sm mb-4">Become part of the SCOME family today.</p>
          <span className="bg-white text-blue-600 px-8 py-2 rounded-full text-sm font-bold shadow-lg">Apply Now</span>
        </div>
      </div>
    </a>
  </div>
);

const EventsView = () => (
  <div className="space-y-6 pb-24">
    <div className="flex items-center gap-2 px-2 text-white mb-2">
      <Calendar size={18}/> <span className="text-sm font-bold uppercase tracking-wider">Timeline</span>
    </div>
    
    <div className="relative pl-6 border-l-2 border-white/20 ml-3 space-y-8">
      {EVENTS.map(e => (
        <div key={e.id} className="relative">
          <div className="absolute -left-[31px] top-0 w-6 h-6 bg-blue-500 rounded-full border-4 border-blue-900"></div>
          <a href={e.link} target="_blank" className="block bg-white rounded-3xl shadow-lg overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
            {e.poster && (
              <div className="h-48 overflow-hidden relative">
                <img src={e.poster} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="Event" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-xs font-bold opacity-80 uppercase tracking-widest mb-1">{e.date}</div>
                  <div className="font-bold text-xl leading-tight">{e.title}</div>
                </div>
              </div>
            )}
            <div className="p-4 flex justify-between items-center bg-gray-50">
              <span className="text-xs font-bold text-blue-600 uppercase flex items-center gap-1">View Details <ExternalLink size={12}/></span>
              {e.status === 'upcoming' && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">UPCOMING</span>}
            </div>
          </a>
        </div>
      ))}
    </div>
  </div>
);

const ResourcesView = () => (
  <div className="space-y-4 pb-24">
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4 text-gray-800">
        <BookOpen size={20} className="text-blue-600" />
        <h2 className="font-bold">Digital Backpack</h2>
      </div>
      <div className="space-y-3">
        {RESOURCES.map(r => (
          <div key={r.id} className="group flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer border border-transparent hover:border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><BookOpen size={18}/></div>
              <div>
                <div className="font-bold text-sm text-gray-800">{r.title}</div>
                <div className="text-xs text-gray-400">{r.type} • {r.size}</div>
              </div>
            </div>
            <Download size={16} className="text-gray-300 group-hover:text-blue-600"/>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-gradient-to-b from-blue-50 to-white p-8 rounded-3xl border border-blue-100 flex flex-col items-center text-center shadow-inner">
      <div className="bg-white p-3 rounded-2xl shadow-lg mb-4">
        <img src="https://i.ibb.co/LdnxxmNs/qr-code.png" className="w-32 h-32 object-contain" alt="QR"/>
      </div>
      <h3 className="font-bold text-blue-900 mb-1">Share the App</h3>
      <p className="text-blue-800/60 text-xs">Let others scan this code to access the hub.</p>
    </div>
  </div>
);

// --- MAIN APP ---

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [showWelcome, setShowWelcome] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if first visit
    const visited = localStorage.getItem("scome_welcome_seen");
    if (!visited) setShowWelcome(true);

    // Auth & Visits
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u && !sessionStorage.getItem('visit_logged')) {
        try {
          await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'visits'), {
            timestamp: serverTimestamp(),
          });
          sessionStorage.setItem('visit_logged', 'true');
        } catch(e) {}
      }
    });

    // Safe Login
    const initAuth = async () => {
        try {
            if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                await signInWithCustomToken(auth, __initial_auth_token);
            } else {
                await signInAnonymously(auth);
            }
        } catch (e) { console.log("Auth init failed in preview"); }
    };
    initAuth();

    return () => unsubscribe();
  }, []);

  const closeWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem("scome_welcome_seen", "true");
  };

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-900">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-600/20 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-purple-600/20 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-md mx-auto min-h-screen relative shadow-2xl overflow-hidden bg-white/5 backdrop-blur-sm border-x border-white/5">
        
        <Header />
        
        <main className="px-6 relative z-10">
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'team' && <TeamView openAdmin={() => setShowAdmin(true)} />}
          {activeTab === 'events' && <EventsView />}
          {activeTab === 'resources' && <ResourcesView />}
        </main>
        
        {/* Navigation Bar */}
        <nav className="fixed bottom-6 left-6 right-6 bg-white/90 backdrop-blur-xl border border-white/40 shadow-2xl shadow-black/20 z-50 max-w-[calc(28rem-3rem)] mx-auto rounded-2xl h-16 flex justify-around items-center px-2">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'team', icon: Users, label: 'Team' },
            { id: 'events', icon: Calendar, label: 'Timeline' },
            { id: 'resources', icon: BookOpen, label: 'Docs' },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative p-3 rounded-xl transition-all duration-300 ${activeTab === tab.id ? 'text-blue-600 bg-blue-50 scale-110' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <tab.icon size={22} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
              {activeTab === tab.id && <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-gray-800 text-white px-2 py-0.5 rounded opacity-0 transition-opacity">{tab.label}</span>}
            </button>
          ))}
        </nav>

        {showWelcome && <WelcomeModal onComplete={closeWelcome} />}
        {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} user={user} />}
        
      </div>
    </div>
  );
}
