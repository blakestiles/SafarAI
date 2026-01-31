import { useState, useEffect, useCallback, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { 
  Play, Database, FileText, Activity, Terminal, 
  Plus, CheckCircle2, XCircle, AlertTriangle, Loader2,
  ExternalLink, RefreshCw, Trash2, Clock, Zap, Globe,
  TrendingUp, Mail, BarChart3, Sparkles, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster, toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// ========================
// LUNAR UI INSPIRED COMPONENTS
// ========================

// Sparkles Component - Animated floating particles
const SparklesEffect = ({ children, className = "" }) => {
  const [sparkles, setSparkles] = useState([]);
  
  useEffect(() => {
    const generateSparkle = () => ({
      id: Math.random(),
      size: Math.random() * 4 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 2,
      duration: Math.random() * 2 + 2,
    });
    
    setSparkles(Array.from({ length: 20 }, generateSparkle));
  }, []);
  
  return (
    <div className={`relative ${className}`}>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute rounded-full bg-blue-400/30 animate-sparkle pointer-events-none"
          style={{
            width: sparkle.size,
            height: sparkle.size,
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            animationDelay: `${sparkle.delay}s`,
            animationDuration: `${sparkle.duration}s`,
          }}
        />
      ))}
      {children}
    </div>
  );
};

// Spotlight Card - Cursor following spotlight effect
const SpotlightCard = ({ children, className = "" }) => {
  const cardRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden rounded-2xl transition-all duration-300 ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Spotlight effect */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`,
        }}
      />
      {/* Border glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.4), transparent 40%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          padding: '1px',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

// Grid Pattern Background
const GridPattern = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div 
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(rgba(59, 130, 246, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59, 130, 246, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '32px 32px',
      }}
    />
    <div 
      className="absolute inset-0"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
      }}
    />
  </div>
);

// Animated Stat Number
const AnimatedNumber = ({ value, className = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const stepValue = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span className={className}>{displayValue}</span>;
};

// Glow Button
const GlowButton = ({ children, onClick, disabled, className = "", variant = "primary" }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative group px-8 py-4 font-bold text-xs uppercase tracking-widest
        rounded-xl overflow-hidden transition-all duration-300
        ${disabled 
          ? 'bg-slate-700 cursor-not-allowed opacity-60' 
          : variant === 'primary'
            ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]'
            : 'bg-transparent border border-white/20 hover:border-white/40'
        }
        ${className}
      `}
    >
      {!disabled && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-white/10 to-transparent" />
        </>
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};

// Navigation Tab with pill animation
const NavTab = ({ to, icon: Icon, label, isActive }) => (
  <Link
    to={to}
    data-testid={`nav-${label.toLowerCase().replace(' ', '-')}`}
    className={`
      relative flex items-center gap-3 px-5 py-3.5 rounded-xl
      text-xs uppercase tracking-wider font-medium
      transition-all duration-300 group
      ${isActive 
        ? 'text-blue-400' 
        : 'text-slate-400 hover:text-white'
      }
    `}
  >
    {isActive && (
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 via-blue-500/10 to-transparent border border-blue-500/20" />
    )}
    {isActive && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-r-full" />
    )}
    <Icon size={18} className={`relative z-10 transition-transform duration-300 ${isActive ? '' : 'group-hover:scale-110'}`} />
    <span className="relative z-10">{label}</span>
  </Link>
);

// ========================
// SIDEBAR COMPONENT
// ========================
const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Dashboard", icon: Activity },
    { path: "/sources", label: "Sources", icon: Database },
    { path: "/brief", label: "Latest Brief", icon: FileText },
    { path: "/runs", label: "Run Metrics", icon: BarChart3 },
    { path: "/logs", label: "Logs", icon: Terminal },
  ];
  
  return (
    <div className="hidden md:flex flex-col w-72 h-screen fixed left-0 top-0 glass-sidebar">
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <Globe size={20} className="text-white" />
            </div>
            <div className="absolute -inset-1 rounded-xl bg-blue-500/20 blur-lg -z-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Barlow Condensed' }}>
              <span className="text-blue-400">SAFAR</span>
              <span className="text-white">AI</span>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">Intelligence Platform</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ path, label, icon }) => (
          <NavTab 
            key={path}
            to={path}
            icon={icon}
            label={label}
            isActive={location.pathname === path}
          />
        ))}
      </nav>
      
      <div className="p-6 border-t border-white/5">
        <SpotlightCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Shield size={16} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-medium text-white">System Status</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                All systems operational
              </p>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};

// ========================
// DASHBOARD PAGE
// ========================
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/stats`);
      setStats(response.data);
      if (response.data.latest_run?.status === "running") {
        setIsRunning(true);
      } else {
        setIsRunning(false);
      }
    } catch (e) {
      console.error("Failed to fetch stats:", e);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [fetchStats]);
  
  const triggerRun = async () => {
    try {
      setIsRunning(true);
      const response = await axios.post(`${API}/run`);
      toast.success("Pipeline initiated", {
        description: `Run ID: ${response.data.run_id.slice(0, 8)}...`
      });
    } catch (e) {
      toast.error("Failed to start pipeline");
      setIsRunning(false);
    }
  };
  
  const getStatusBadge = (status) => {
    const configs = {
      success: { class: "badge-success", icon: CheckCircle2, label: "Success" },
      partial_failure: { class: "badge-warning", icon: AlertTriangle, label: "Partial" },
      failure: { class: "badge-error", icon: XCircle, label: "Failed" },
      running: { class: "badge-info", icon: Loader2, label: "Running" },
    };
    const config = configs[status] || configs.running;
    return (
      <span className={`badge-premium ${config.class}`}>
        <config.icon size={12} className={status === 'running' ? 'animate-spin' : ''} />
        {config.label}
      </span>
    );
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="relative">
          <Loader2 className="animate-spin text-blue-500" size={40} />
          <div className="absolute inset-0 animate-ping">
            <Loader2 className="text-blue-500/30" size={40} />
          </div>
        </div>
      </div>
    );
  }
  
  const latestRun = stats?.latest_run;
  
  return (
    <div className="space-y-8 relative" data-testid="dashboard-page">
      <GridPattern />
      
      {/* Hero Section */}
      <SparklesEffect>
        <SpotlightCard className="p-10 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="badge-premium badge-info">
                <Zap size={12} />
                Intelligence Engine
              </span>
            </div>
            
            <h2 className="text-5xl font-bold tracking-tight uppercase mb-3" style={{ fontFamily: 'Barlow Condensed' }}>
              <span className="bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent">
                Competitive Intelligence
              </span>
            </h2>
            <h3 className="text-3xl font-bold tracking-tight uppercase mb-4 text-blue-400" style={{ fontFamily: 'Barlow Condensed' }}>
              Pipeline Control Center
            </h3>
            
            <p className="text-slate-400 mb-8 max-w-xl leading-relaxed">
              Monitor tourism and hospitality competitors in real-time. Extract partnerships, 
              funding rounds, and deal intelligence automatically with AI-powered analysis.
            </p>
            
            <GlowButton onClick={triggerRun} disabled={isRunning}>
              {isRunning ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Play size={18} />
                  <span>Execute Pipeline</span>
                </>
              )}
            </GlowButton>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-gradient-to-t from-blue-500/10 to-transparent rounded-full blur-2xl" />
        </SpotlightCard>
      </SparklesEffect>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
        {[
          { label: "Active Sources", value: stats?.active_sources || 0, total: stats?.total_sources, color: "blue", icon: Database },
          { label: "Total Runs", value: stats?.total_runs || 0, color: "emerald", icon: RefreshCw },
          { label: "Events Extracted", value: stats?.total_events || 0, color: "amber", icon: TrendingUp },
          { label: "Items Indexed", value: stats?.total_items || 0, color: "cyan", icon: FileText },
        ].map((stat, i) => (
          <SpotlightCard key={i} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center`}>
                <stat.icon size={22} className={`text-${stat.color}-400`} />
              </div>
              {stat.total && (
                <span className="text-xs text-slate-500">of {stat.total} total</span>
              )}
            </div>
            <p className={`text-4xl font-bold metric-number ${stat.color}`}>
              <AnimatedNumber value={stat.value} />
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-wider mt-2">{stat.label}</p>
          </SpotlightCard>
        ))}
      </div>
      
      {/* Latest Run Summary */}
      {latestRun && (
        <SpotlightCard className="p-8 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center">
                <BarChart3 size={22} className="text-slate-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold uppercase tracking-wider" style={{ fontFamily: 'Barlow Condensed' }}>
                  Latest Run
                </h3>
                <p className="text-xs text-slate-500 font-mono">ID: {latestRun.id?.slice(0, 12)}...</p>
              </div>
            </div>
            {getStatusBadge(latestRun.status)}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { label: "Sources", value: `${latestRun.sources_ok}/${latestRun.sources_total}`, ok: latestRun.sources_ok, total: latestRun.sources_total },
              { label: "New Items", value: latestRun.items_new, color: "blue" },
              { label: "Updated", value: latestRun.items_updated, color: "amber" },
              { label: "Events", value: latestRun.events_created, color: "emerald" },
              { label: "Emails", value: latestRun.emails_sent, color: "purple", icon: Mail },
            ].map((item, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-slate-800/50 border border-white/5">
                <p className={`text-2xl font-bold ${item.color ? `metric-number ${item.color}` : 'text-white'}`}>
                  {item.value}
                </p>
                <p className="text-xs text-slate-500 uppercase mt-1">{item.label}</p>
              </div>
            ))}
          </div>
          
          {latestRun.started_at && (
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/5 text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <Clock size={14} />
                Started: {new Date(latestRun.started_at).toLocaleString()}
              </span>
              {latestRun.finished_at && (
                <span>
                  • Finished: {new Date(latestRun.finished_at).toLocaleString()}
                </span>
              )}
            </div>
          )}
        </SpotlightCard>
      )}
    </div>
  );
};

// ========================
// SOURCES PAGE
// ========================
const Sources = () => {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newSource, setNewSource] = useState({ name: "", url: "", category: "general" });
  
  const fetchSources = async () => {
    try {
      const response = await axios.get(`${API}/sources`);
      setSources(response.data.sources || []);
    } catch (e) {
      toast.error("Failed to fetch sources");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => { fetchSources(); }, []);
  
  const toggleSource = async (sourceId, currentActive) => {
    try {
      await axios.patch(`${API}/sources/${sourceId}`, { active: !currentActive });
      setSources(sources.map(s => s.id === sourceId ? { ...s, active: !currentActive } : s));
      toast.success(`Source ${!currentActive ? "enabled" : "disabled"}`);
    } catch (e) {
      toast.error("Failed to update source");
    }
  };
  
  const deleteSource = async (sourceId) => {
    try {
      await axios.delete(`${API}/sources/${sourceId}`);
      setSources(sources.filter(s => s.id !== sourceId));
      toast.success("Source deleted");
    } catch (e) {
      toast.error("Failed to delete source");
    }
  };
  
  const addSource = async () => {
    if (!newSource.name || !newSource.url) {
      toast.error("Name and URL are required");
      return;
    }
    try {
      const response = await axios.post(`${API}/sources`, newSource);
      setSources([...sources, response.data]);
      setNewSource({ name: "", url: "", category: "general" });
      setAddDialogOpen(false);
      toast.success("Source added successfully");
    } catch (e) {
      toast.error("Failed to add source");
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }
  
  return (
    <div className="space-y-8 relative" data-testid="sources-page">
      <GridPattern />
      
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h2 className="text-4xl font-bold tracking-tight uppercase" style={{ fontFamily: 'Barlow Condensed' }}>
            <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Data Sources
            </span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">Manage monitored websites and feeds</p>
        </div>
        
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <GlowButton data-testid="add-source-btn">
              <Plus size={18} />
              <span>Add Source</span>
            </GlowButton>
          </DialogTrigger>
          <DialogContent className="glass border-white/10 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl uppercase tracking-wider" style={{ fontFamily: 'Barlow Condensed' }}>
                Add New Source
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Add a new website to monitor for competitive intelligence.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 mt-6">
              <div>
                <label className="text-xs uppercase tracking-wider text-slate-400 mb-2 block">Name</label>
                <Input
                  value={newSource.name}
                  onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                  placeholder="e.g., Marriott News"
                  className="input-glass"
                  data-testid="source-name-input"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-slate-400 mb-2 block">URL</label>
                <Input
                  value={newSource.url}
                  onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                  placeholder="https://news.example.com"
                  className="input-glass"
                  data-testid="source-url-input"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-slate-400 mb-2 block">Category</label>
                <Select value={newSource.category} onValueChange={(v) => setNewSource({ ...newSource, category: v })}>
                  <SelectTrigger className="input-glass" data-testid="source-category-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/10">
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="accommodation">Accommodation</SelectItem>
                    <SelectItem value="airline">Airline</SelectItem>
                    <SelectItem value="deals">Deals</SelectItem>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="association">Association</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <GlowButton onClick={addSource} className="w-full" data-testid="submit-source-btn">
                Add Source
              </GlowButton>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-4 relative z-10">
        {sources.length === 0 ? (
          <SpotlightCard className="p-12 text-center">
            <Database className="mx-auto mb-4 text-slate-500" size={56} />
            <p className="text-xl font-semibold text-white mb-2">No sources configured</p>
            <p className="text-slate-500 text-sm">Add your first source to start monitoring</p>
          </SpotlightCard>
        ) : (
          sources.map((source) => (
            <SpotlightCard key={source.id} className="p-5" data-testid={`source-card-${source.id}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`status-dot ${source.active ? "success" : ""}`} />
                  <div>
                    <h3 className="font-semibold text-white">{source.name}</h3>
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:underline flex items-center gap-1 mt-1"
                    >
                      {source.url}
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="badge-premium badge-info">{source.category}</span>
                  <Switch
                    checked={source.active}
                    onCheckedChange={() => toggleSource(source.id, source.active)}
                    data-testid={`toggle-source-${source.id}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSource(source.id)}
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                    data-testid={`delete-source-${source.id}`}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </SpotlightCard>
          ))
        )}
      </div>
    </div>
  );
};

// ========================
// BRIEF PAGE
// ========================
const Brief = () => {
  const [brief, setBrief] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchBrief = async () => {
      try {
        const response = await axios.get(`${API}/brief/latest`);
        setBrief(response.data);
      } catch (e) {
        console.error("Failed to fetch brief:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBrief();
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }
  
  if (!brief || !brief.events) {
    return (
      <div className="flex flex-col items-center justify-center h-full relative" data-testid="brief-page">
        <GridPattern />
        <FileText className="mb-6 text-slate-500" size={72} />
        <h2 className="text-2xl font-bold mb-2">No Brief Available</h2>
        <p className="text-slate-500 text-sm mb-8">Run the pipeline to generate your first intelligence brief</p>
        <Link to="/">
          <GlowButton>
            <Play size={18} />
            <span>Go to Dashboard</span>
          </GlowButton>
        </Link>
      </div>
    );
  }
  
  const events = brief.events || [];
  const topMovers = events.filter(e => e.materiality_score >= 70);
  const partnerships = events.filter(e => e.event_type === "partnership");
  const funding = events.filter(e => e.event_type === "funding");
  const campaigns = events.filter(e => e.event_type === "campaign_deal");
  
  const EventCard = ({ event }) => {
    const typeColors = {
      partnership: { border: "#10B981", bg: "emerald" },
      funding: { border: "#3B82F6", bg: "blue" },
      campaign_deal: { border: "#F59E0B", bg: "amber" },
      acquisition: { border: "#8B5CF6", bg: "purple" },
      pricing_change: { border: "#EC4899", bg: "pink" },
      hiring_exec: { border: "#06B6D4", bg: "cyan" },
      other: { border: "#64748B", bg: "slate" }
    };
    const colors = typeColors[event.event_type] || typeColors.other;
    
    return (
      <SpotlightCard className="event-card" style={{ '--event-color': colors.border }}>
        <div className="flex items-start justify-between mb-3">
          <span className={`badge-premium badge-${colors.bg === 'emerald' ? 'success' : colors.bg === 'blue' ? 'info' : 'warning'}`}>
            {event.event_type?.replace("_", " ")}
          </span>
          <span className="text-xs bg-slate-700/50 px-2.5 py-1 rounded-lg text-slate-300 font-mono">
            Score: {event.materiality_score}
          </span>
        </div>
        <h3 className="font-bold text-lg mb-2 text-white">{event.title}</h3>
        <p className="text-sm text-slate-400 mb-3">{event.company}</p>
        <p className="text-sm text-slate-300 mb-3 leading-relaxed">{event.summary}</p>
        <p className="text-xs text-blue-400 mb-4">
          <strong className="text-blue-300">Why it matters:</strong> {event.why_it_matters}
        </p>
        
        {event.evidence_quotes?.length > 0 && (
          <div className="mb-4 space-y-2">
            {event.evidence_quotes.slice(0, 2).map((quote, i) => (
              <p key={i} className="text-xs italic text-slate-500 border-l-2 border-slate-600 pl-3 py-1">
                "{quote}"
              </p>
            ))}
          </div>
        )}
        
        <a 
          href={event.source_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          View Source <ExternalLink size={12} />
        </a>
      </SpotlightCard>
    );
  };
  
  const Section = ({ title, events, icon }) => {
    if (!events || events.length === 0) return null;
    return (
      <div className="mb-10">
        <h3 className="text-2xl font-bold uppercase tracking-wider mb-6 flex items-center gap-3" style={{ fontFamily: 'Barlow Condensed' }}>
          <span className="text-2xl">{icon}</span>
          <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">{title}</span>
          <span className="text-sm text-slate-500 font-normal lowercase">({events.length})</span>
        </h3>
        <div className="grid gap-5">
          {events.slice(0, 5).map((event, i) => (
            <EventCard key={event.id || i} event={event} />
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-8 relative" data-testid="brief-page">
      <GridPattern />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="badge-premium badge-success">
            <Sparkles size={12} />
            Latest Brief
          </span>
        </div>
        <h2 className="text-4xl font-bold tracking-tight uppercase" style={{ fontFamily: 'Barlow Condensed' }}>
          <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Executive Intelligence Brief
          </span>
        </h2>
        <p className="text-slate-500 text-sm mt-2">
          Generated: {brief.created_at ? new Date(brief.created_at).toLocaleString() : "Unknown"}
        </p>
      </div>
      
      <div className="relative z-10">
        <Section title="Top Movers" events={topMovers} icon="🔥" />
        <Section title="Partnerships" events={partnerships} icon="🤝" />
        <Section title="Funding & Investments" events={funding} icon="💰" />
        <Section title="Campaigns & Deals" events={campaigns} icon="🎯" />
      </div>
    </div>
  );
};

// ========================
// RUNS PAGE
// ========================
const Runs = () => {
  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRun = async () => {
      try {
        const response = await axios.get(`${API}/runs/latest`);
        setRun(response.data);
      } catch (e) {
        console.error("Failed to fetch run:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchRun();
    const interval = setInterval(fetchRun, 3000);
    return () => clearInterval(interval);
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }
  
  if (!run || run.message) {
    return (
      <div className="flex flex-col items-center justify-center h-full relative" data-testid="runs-page">
        <GridPattern />
        <RefreshCw className="mb-6 text-slate-500" size={72} />
        <h2 className="text-2xl font-bold mb-2">No Runs Yet</h2>
        <p className="text-slate-500 text-sm">Execute the pipeline to see run metrics</p>
      </div>
    );
  }
  
  const StatusIcon = ({ status }) => {
    const configs = {
      success: { Icon: CheckCircle2, color: "text-emerald-400", glow: "glow-emerald" },
      partial_failure: { Icon: AlertTriangle, color: "text-amber-400", glow: "glow-amber" },
      failure: { Icon: XCircle, color: "text-rose-400", glow: "glow-rose" },
      running: { Icon: Loader2, color: "text-blue-400", glow: "glow-blue", spin: true },
    };
    const config = configs[status] || configs.running;
    return <config.Icon className={`${config.color} ${config.spin ? 'animate-spin' : ''}`} size={28} />;
  };
  
  return (
    <div className="space-y-8 relative" data-testid="runs-page">
      <GridPattern />
      
      <div className="relative z-10">
        <h2 className="text-4xl font-bold tracking-tight uppercase" style={{ fontFamily: 'Barlow Condensed' }}>
          <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            Run Metrics
          </span>
        </h2>
        <p className="text-slate-500 text-sm mt-1">Latest pipeline execution details</p>
      </div>
      
      <SpotlightCard className="p-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center">
              <StatusIcon status={run.status} />
            </div>
            <div>
              <h3 className="text-2xl font-bold uppercase" style={{ fontFamily: 'Barlow Condensed' }}>
                {run.status?.replace("_", " ")}
              </h3>
              <p className="text-xs text-slate-500 font-mono">Run ID: {run.id}</p>
            </div>
          </div>
          <span className={`badge-premium badge-${run.status === "success" ? "success" : run.status === "running" ? "info" : "warning"}`}>
            {run.status}
          </span>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Sources", value: run.sources_total, color: "blue" },
            { label: "Sources OK", value: run.sources_ok, color: "emerald" },
            { label: "Sources Failed", value: run.sources_failed, color: "rose" },
            { label: "Events Created", value: run.events_created, color: "amber" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-5 rounded-xl bg-slate-800/50 border border-white/5">
              <p className={`text-4xl font-bold metric-number ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-slate-500 uppercase mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Items Total", value: run.items_total, color: "cyan" },
            { label: "New Items", value: run.items_new, color: "blue" },
            { label: "Updated Items", value: run.items_updated, color: "amber" },
            { label: "Emails Sent", value: run.emails_sent, color: "purple" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-5 rounded-xl bg-slate-800/50 border border-white/5">
              <p className={`text-4xl font-bold metric-number ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-slate-500 uppercase mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/5 flex justify-between text-xs text-slate-500">
          <span className="flex items-center gap-2">
            <Clock size={14} />
            Started: {run.started_at ? new Date(run.started_at).toLocaleString() : "N/A"}
          </span>
          <span>
            Finished: {run.finished_at ? new Date(run.finished_at).toLocaleString() : "In progress..."}
          </span>
        </div>
      </SpotlightCard>
    </div>
  );
};

// ========================
// LOGS PAGE
// ========================
const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [runId, setRunId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${API}/logs/latest`);
        setLogs(response.data.logs || []);
        setRunId(response.data.run_id);
      } catch (e) {
        console.error("Failed to fetch logs:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 3000);
    return () => clearInterval(interval);
  }, []);
  
  const filteredLogs = filter === "all" ? logs : logs.filter(l => l.level === filter);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }
  
  return (
    <div className="space-y-8 relative" data-testid="logs-page">
      <GridPattern />
      
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h2 className="text-4xl font-bold tracking-tight uppercase" style={{ fontFamily: 'Barlow Condensed' }}>
            <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Pipeline Logs
            </span>
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-mono">Run ID: {runId || "N/A"}</p>
        </div>
        
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-36 input-glass" data-testid="log-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="glass border-white/10">
            <SelectItem value="all">All Logs</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warn">Warnings</SelectItem>
            <SelectItem value="error">Errors</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <SpotlightCard className="relative z-10 overflow-hidden">
        <ScrollArea className="h-[600px]">
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Terminal className="mb-4 text-slate-500" size={56} />
              <p className="text-slate-400 text-lg">No logs available</p>
            </div>
          ) : (
            <div className="p-4 space-y-1">
              {filteredLogs.map((log, i) => (
                <div 
                  key={log.id || i}
                  className={`log-entry ${log.level}`}
                  data-testid={`log-entry-${i}`}
                >
                  <div className="flex items-start gap-4">
                    <span className={`
                      shrink-0 text-[10px] uppercase font-bold px-2 py-1 rounded
                      ${log.level === "error" ? "bg-rose-500/20 text-rose-400" :
                        log.level === "warn" ? "bg-amber-500/20 text-amber-400" :
                        "bg-blue-500/20 text-blue-400"}
                    `}>
                      {log.level}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 break-words">{log.message}</p>
                      {log.meta && Object.keys(log.meta).length > 0 && (
                        <pre className="text-xs text-slate-500 mt-2 overflow-x-auto bg-slate-900/50 p-2 rounded">
                          {JSON.stringify(log.meta, null, 2)}
                        </pre>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-600 whitespace-nowrap shrink-0">
                      {log.created_at ? new Date(log.created_at).toLocaleTimeString() : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SpotlightCard>
    </div>
  );
};

// ========================
// MAIN APP
// ========================
function App() {
  return (
    <div className="min-h-screen bg-[#020617] bg-gradient-animated">
      <Toaster 
        theme="dark" 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#F8FAFC'
          }
        }}
      />
      <BrowserRouter>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 md:ml-72 p-8 min-h-screen">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sources" element={<Sources />} />
              <Route path="/brief" element={<Brief />} />
              <Route path="/runs" element={<Runs />} />
              <Route path="/logs" element={<Logs />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
