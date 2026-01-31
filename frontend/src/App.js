import { useState, useEffect, useCallback } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { 
  Play, Database, FileText, Activity, Terminal, 
  Plus, CheckCircle2, XCircle, AlertTriangle, Loader2,
  ExternalLink, RefreshCw, ToggleLeft, ToggleRight, Trash2, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster, toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// ========================
// SIDEBAR COMPONENT
// ========================
const Sidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Dashboard", icon: Activity },
    { path: "/sources", label: "Sources", icon: Database },
    { path: "/brief", label: "Latest Brief", icon: FileText },
    { path: "/runs", label: "Run Metrics", icon: RefreshCw },
    { path: "/logs", label: "Logs", icon: Terminal },
  ];
  
  return (
    <div className="hidden md:flex flex-col w-64 border-r border-white/10 bg-[#020617] h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-tight text-blue-500" style={{ fontFamily: 'Barlow Condensed' }}>
          SAFAR<span className="text-white">AI</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Competitive Intelligence</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            data-testid={`nav-${label.toLowerCase().replace(' ', '-')}`}
            className={`flex items-center gap-3 px-4 py-3 text-sm transition-all ${
              location.pathname === path
                ? "bg-blue-500/10 text-blue-400 border-l-2 border-blue-500"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon size={18} />
            <span className="uppercase tracking-wider text-xs font-medium">{label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <p className="text-[10px] text-slate-600 uppercase tracking-widest">Tourism Intelligence Platform</p>
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
      
      // Check if a run is currently in progress
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
      toast.success("Pipeline started", {
        description: `Run ID: ${response.data.run_id}`
      });
    } catch (e) {
      toast.error("Failed to start pipeline");
      setIsRunning(false);
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case "success": return "text-emerald-400";
      case "partial_failure": return "text-amber-400";
      case "failure": return "text-rose-400";
      case "running": return "text-blue-400";
      default: return "text-slate-400";
    }
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case "success": return <Badge className="badge-success">Success</Badge>;
      case "partial_failure": return <Badge className="badge-warning">Partial</Badge>;
      case "failure": return <Badge className="badge-error">Failed</Badge>;
      case "running": return <Badge className="badge-info">Running</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }
  
  const latestRun = stats?.latest_run;
  
  return (
    <div className="space-y-6" data-testid="dashboard-page">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-lg glass p-8 glow-blue">
        <div className="grid-bg absolute inset-0 opacity-50"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold tracking-tight uppercase mb-2" style={{ fontFamily: 'Barlow Condensed' }}>
            Intelligence Pipeline
          </h2>
          <p className="text-slate-400 mb-6 max-w-xl">
            Monitor tourism and hospitality competitors. Extract partnerships, funding, and deal intelligence automatically.
          </p>
          
          <Button 
            onClick={triggerRun}
            disabled={isRunning}
            data-testid="run-pipeline-btn"
            className="btn-ops"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 animate-spin" size={16} />
                RUNNING...
              </>
            ) : (
              <>
                <Play className="mr-2" size={16} />
                RUN NOW
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-slate-500">Active Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-400">{stats?.active_sources || 0}</p>
            <p className="text-xs text-slate-500">of {stats?.total_sources || 0} total</p>
          </CardContent>
        </Card>
        
        <Card className="card-glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-slate-500">Total Runs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-400">{stats?.total_runs || 0}</p>
            <p className="text-xs text-slate-500">pipeline executions</p>
          </CardContent>
        </Card>
        
        <Card className="card-glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-slate-500">Events Extracted</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-amber-400">{stats?.total_events || 0}</p>
            <p className="text-xs text-slate-500">intelligence items</p>
          </CardContent>
        </Card>
        
        <Card className="card-glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-widest text-slate-500">Items Indexed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-cyan-400">{stats?.total_items || 0}</p>
            <p className="text-xs text-slate-500">pages crawled</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Latest Run Summary */}
      {latestRun && (
        <Card className="card-glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg uppercase tracking-wider" style={{ fontFamily: 'Barlow Condensed' }}>
                Latest Run
              </CardTitle>
              {getStatusBadge(latestRun.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-xs text-slate-500 uppercase">Sources</p>
                <p className="text-lg font-semibold">
                  <span className="text-emerald-400">{latestRun.sources_ok}</span>
                  <span className="text-slate-500">/</span>
                  <span className="text-slate-300">{latestRun.sources_total}</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">New Items</p>
                <p className="text-lg font-semibold text-blue-400">{latestRun.items_new}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Updated</p>
                <p className="text-lg font-semibold text-amber-400">{latestRun.items_updated}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Events</p>
                <p className="text-lg font-semibold text-emerald-400">{latestRun.events_created}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Emails</p>
                <p className="text-lg font-semibold text-cyan-400">{latestRun.emails_sent}</p>
              </div>
            </div>
            
            {latestRun.started_at && (
              <p className="text-xs text-slate-500 mt-4 flex items-center gap-2">
                <Clock size={12} />
                Started: {new Date(latestRun.started_at).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
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
  
  useEffect(() => {
    fetchSources();
  }, []);
  
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
      toast.success("Source added");
    } catch (e) {
      toast.error("Failed to add source");
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }
  
  return (
    <div className="space-y-6" data-testid="sources-page">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight uppercase" style={{ fontFamily: 'Barlow Condensed' }}>
            Sources
          </h2>
          <p className="text-slate-500 text-sm">Manage monitored websites and feeds</p>
        </div>
        
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-ops" data-testid="add-source-btn">
              <Plus className="mr-2" size={16} />
              ADD SOURCE
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0F172A] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-xl uppercase tracking-wider" style={{ fontFamily: 'Barlow Condensed' }}>
                Add New Source
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-slate-500 mb-2 block">Name</label>
                <Input
                  value={newSource.name}
                  onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                  placeholder="e.g., Marriott News"
                  className="bg-[#1E293B] border-white/10"
                  data-testid="source-name-input"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-slate-500 mb-2 block">URL</label>
                <Input
                  value={newSource.url}
                  onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                  placeholder="https://news.example.com"
                  className="bg-[#1E293B] border-white/10"
                  data-testid="source-url-input"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-slate-500 mb-2 block">Category</label>
                <Select value={newSource.category} onValueChange={(v) => setNewSource({ ...newSource, category: v })}>
                  <SelectTrigger className="bg-[#1E293B] border-white/10" data-testid="source-category-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1E293B] border-white/10">
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
              <Button onClick={addSource} className="btn-ops w-full" data-testid="submit-source-btn">
                ADD SOURCE
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-3">
        {sources.length === 0 ? (
          <Card className="card-glass p-8 text-center">
            <Database className="mx-auto mb-4 text-slate-500" size={48} />
            <p className="text-slate-400">No sources configured yet</p>
            <p className="text-slate-500 text-sm">Add your first source to start monitoring</p>
          </Card>
        ) : (
          sources.map((source) => (
            <Card key={source.id} className="card-glass" data-testid={`source-card-${source.id}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`status-dot ${source.active ? "success" : ""}`}></div>
                    <div>
                      <h3 className="font-semibold">{source.name}</h3>
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                      >
                        {source.url}
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="text-xs uppercase">{source.category}</Badge>
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
              </CardContent>
            </Card>
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
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }
  
  if (!brief || !brief.events) {
    return (
      <div className="flex flex-col items-center justify-center h-full" data-testid="brief-page">
        <FileText className="mb-4 text-slate-500" size={64} />
        <h2 className="text-xl font-semibold mb-2">No Brief Available</h2>
        <p className="text-slate-500 text-sm">Run the pipeline to generate your first intelligence brief</p>
        <Link to="/">
          <Button className="btn-ops mt-6">
            <Play className="mr-2" size={16} />
            GO TO DASHBOARD
          </Button>
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
      partnership: "border-emerald-500",
      funding: "border-blue-500",
      campaign_deal: "border-amber-500",
      acquisition: "border-purple-500",
      pricing_change: "border-pink-500",
      hiring_exec: "border-cyan-500",
      other: "border-slate-500"
    };
    
    return (
      <Card className={`card-glass border-l-4 ${typeColors[event.event_type] || typeColors.other}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <Badge className={`badge-${event.event_type === "partnership" ? "success" : event.event_type === "funding" ? "info" : "warning"}`}>
              {event.event_type?.replace("_", " ")}
            </Badge>
            <span className="text-xs bg-slate-700 px-2 py-1 rounded">Score: {event.materiality_score}</span>
          </div>
          <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
          <p className="text-sm text-slate-400 mb-2">{event.company}</p>
          <p className="text-sm text-slate-300 mb-2">{event.summary}</p>
          <p className="text-xs text-blue-400 mb-3">
            <strong>Why it matters:</strong> {event.why_it_matters}
          </p>
          
          {event.evidence_quotes?.length > 0 && (
            <div className="mb-3">
              {event.evidence_quotes.slice(0, 2).map((quote, i) => (
                <p key={i} className="text-xs italic text-slate-500 border-l-2 border-slate-600 pl-2 my-1">
                  "{quote}"
                </p>
              ))}
            </div>
          )}
          
          <a 
            href={event.source_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:underline flex items-center gap-1"
          >
            View Source <ExternalLink size={10} />
          </a>
        </CardContent>
      </Card>
    );
  };
  
  const Section = ({ title, events, icon }) => {
    if (!events || events.length === 0) return null;
    
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ fontFamily: 'Barlow Condensed' }}>
          {icon} {title}
        </h3>
        <div className="grid gap-4">
          {events.slice(0, 5).map((event, i) => (
            <EventCard key={event.id || i} event={event} />
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-6" data-testid="brief-page">
      <div>
        <h2 className="text-3xl font-bold tracking-tight uppercase" style={{ fontFamily: 'Barlow Condensed' }}>
          Executive Brief
        </h2>
        <p className="text-slate-500 text-sm">
          Generated: {brief.created_at ? new Date(brief.created_at).toLocaleString() : "Unknown"}
        </p>
      </div>
      
      <Section title="Top Movers" events={topMovers} icon="🔥" />
      <Section title="Partnerships" events={partnerships} icon="🤝" />
      <Section title="Funding & Investments" events={funding} icon="💰" />
      <Section title="Campaigns & Deals" events={campaigns} icon="🎯" />
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
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }
  
  if (!run || run.message) {
    return (
      <div className="flex flex-col items-center justify-center h-full" data-testid="runs-page">
        <RefreshCw className="mb-4 text-slate-500" size={64} />
        <h2 className="text-xl font-semibold mb-2">No Runs Yet</h2>
        <p className="text-slate-500 text-sm">Execute the pipeline to see run metrics</p>
      </div>
    );
  }
  
  const StatusIcon = ({ status }) => {
    switch (status) {
      case "success": return <CheckCircle2 className="text-emerald-400" size={24} />;
      case "partial_failure": return <AlertTriangle className="text-amber-400" size={24} />;
      case "failure": return <XCircle className="text-rose-400" size={24} />;
      case "running": return <Loader2 className="text-blue-400 animate-spin" size={24} />;
      default: return null;
    }
  };
  
  return (
    <div className="space-y-6" data-testid="runs-page">
      <div>
        <h2 className="text-3xl font-bold tracking-tight uppercase" style={{ fontFamily: 'Barlow Condensed' }}>
          Run Metrics
        </h2>
        <p className="text-slate-500 text-sm">Latest pipeline execution details</p>
      </div>
      
      <Card className="card-glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusIcon status={run.status} />
              <div>
                <CardTitle className="text-lg uppercase">{run.status?.replace("_", " ")}</CardTitle>
                <p className="text-xs text-slate-500">Run ID: {run.id}</p>
              </div>
            </div>
            <Badge className={`badge-${run.status === "success" ? "success" : run.status === "running" ? "info" : "warning"}`}>
              {run.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-[#1E293B] rounded">
              <p className="text-3xl font-bold text-blue-400">{run.sources_total}</p>
              <p className="text-xs text-slate-500 uppercase mt-1">Total Sources</p>
            </div>
            <div className="text-center p-4 bg-[#1E293B] rounded">
              <p className="text-3xl font-bold text-emerald-400">{run.sources_ok}</p>
              <p className="text-xs text-slate-500 uppercase mt-1">Sources OK</p>
            </div>
            <div className="text-center p-4 bg-[#1E293B] rounded">
              <p className="text-3xl font-bold text-rose-400">{run.sources_failed}</p>
              <p className="text-xs text-slate-500 uppercase mt-1">Sources Failed</p>
            </div>
            <div className="text-center p-4 bg-[#1E293B] rounded">
              <p className="text-3xl font-bold text-amber-400">{run.events_created}</p>
              <p className="text-xs text-slate-500 uppercase mt-1">Events Created</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4">
            <div className="text-center p-4 bg-[#1E293B] rounded">
              <p className="text-3xl font-bold text-cyan-400">{run.items_total}</p>
              <p className="text-xs text-slate-500 uppercase mt-1">Items Total</p>
            </div>
            <div className="text-center p-4 bg-[#1E293B] rounded">
              <p className="text-3xl font-bold text-blue-400">{run.items_new}</p>
              <p className="text-xs text-slate-500 uppercase mt-1">New Items</p>
            </div>
            <div className="text-center p-4 bg-[#1E293B] rounded">
              <p className="text-3xl font-bold text-amber-400">{run.items_updated}</p>
              <p className="text-xs text-slate-500 uppercase mt-1">Updated Items</p>
            </div>
            <div className="text-center p-4 bg-[#1E293B] rounded">
              <p className="text-3xl font-bold text-purple-400">{run.emails_sent}</p>
              <p className="text-xs text-slate-500 uppercase mt-1">Emails Sent</p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Started: {run.started_at ? new Date(run.started_at).toLocaleString() : "N/A"}</span>
              <span>Finished: {run.finished_at ? new Date(run.finished_at).toLocaleString() : "In progress..."}</span>
            </div>
          </div>
        </CardContent>
      </Card>
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
  
  const filteredLogs = filter === "all" 
    ? logs 
    : logs.filter(l => l.level === filter);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }
  
  return (
    <div className="space-y-6" data-testid="logs-page">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight uppercase" style={{ fontFamily: 'Barlow Condensed' }}>
            Run Logs
          </h2>
          <p className="text-slate-500 text-sm">Run ID: {runId || "N/A"}</p>
        </div>
        
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-32 bg-[#1E293B] border-white/10" data-testid="log-filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1E293B] border-white/10">
            <SelectItem value="all">All Logs</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warn">Warnings</SelectItem>
            <SelectItem value="error">Errors</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Card className="card-glass">
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            {filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Terminal className="mb-4 text-slate-500" size={48} />
                <p className="text-slate-400">No logs available</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredLogs.map((log, i) => (
                  <div 
                    key={log.id || i}
                    className={`log-entry ${log.level}`}
                    data-testid={`log-entry-${i}`}
                  >
                    <div className="flex items-start gap-3 py-2 px-4">
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        log.level === "error" ? "bg-rose-500/20 text-rose-400" :
                        log.level === "warn" ? "bg-amber-500/20 text-amber-400" :
                        "bg-blue-500/20 text-blue-400"
                      }`}>
                        {log.level}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm break-words">{log.message}</p>
                        {log.meta && Object.keys(log.meta).length > 0 && (
                          <pre className="text-xs text-slate-500 mt-1 overflow-x-auto">
                            {JSON.stringify(log.meta, null, 2)}
                          </pre>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-600 whitespace-nowrap">
                        {log.created_at ? new Date(log.created_at).toLocaleTimeString() : ""}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

// ========================
// MAIN APP
// ========================
function App() {
  return (
    <div className="min-h-screen bg-[#020617]">
      <Toaster 
        theme="dark" 
        position="top-right"
        toastOptions={{
          style: {
            background: '#0F172A',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#F8FAFC'
          }
        }}
      />
      <BrowserRouter>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 md:ml-64 p-6 md:p-8 min-h-screen">
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
