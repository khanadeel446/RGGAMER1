import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Server, Shield, Zap, Terminal, Globe, HardDrive, Cpu, 
  Layers, CheckCircle2, ArrowRight, Star, Users, RefreshCw, 
  Box, Sparkles, ChevronRight, Lock, Check, HelpCircle,
  Play, Radio, Sliders, Menu, X
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { DEFAULT_PLANS } from "../firebase/config";

export default function LandingPage() {
  const { user } = useAuth();
  const { panelName, panelLogo } = useSettings();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [calculatorRam, setCalculatorRam] = useState(4);

  const brand = panelName || "JTG Cloud";

  const calculatePlayers = (ram: number) => {
    return Math.floor(ram * 12);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-rose-500 selection:text-white">
      {/* Background Glows & Grid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-rose-600/20 via-orange-600/10 to-transparent blur-3xl opacity-60"></div>
        <div className="absolute top-[600px] -left-40 w-[600px] h-[600px] bg-blue-600/10 blur-3xl rounded-full"></div>
        <div className="absolute top-[1200px] -right-40 w-[600px] h-[600px] bg-rose-600/10 blur-3xl rounded-full"></div>
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            {panelLogo ? (
              <img src={panelLogo} alt={brand} className="w-10 h-10 object-contain rounded-xl" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/25 group-hover:scale-105 transition-transform">
                <Box className="w-5 h-5" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                {brand}
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase text-rose-400 font-semibold">
                Minecraft Cloud
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#software" className="hover:text-white transition-colors">Software</a>
            <a href="#tunnels" className="hover:text-white transition-colors">Playit Tunnel</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-600 text-white font-semibold text-sm shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:opacity-95 transition-all"
              >
                Go to Dashboard
                <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-600 text-white font-semibold text-sm shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:opacity-95 transition-all"
                >
                  Deploy Server
                  <ArrowRight size={16} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-900/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3">
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800"
            >
              Features
            </a>
            <a 
              href="#pricing" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800"
            >
              Pricing
            </a>
            <a 
              href="#software" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800"
            >
              Software
            </a>
            <a 
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800"
            >
              FAQ
            </a>
            <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
              {user ? (
                <Link
                  to="/"
                  className="w-full text-center py-2.5 rounded-xl bg-rose-500 text-white font-semibold text-sm"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full text-center py-2.5 rounded-xl bg-slate-800 text-slate-200 text-sm font-semibold"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-600 text-white font-semibold text-sm"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono tracking-wider uppercase mb-8">
          <Sparkles size={14} className="animate-spin text-rose-400" />
          Next-Gen Minecraft Server Infrastructure
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.1] mb-6">
          High-Performance Minecraft Servers{" "}
          <span className="bg-gradient-to-r from-rose-400 via-orange-400 to-amber-300 bg-clip-text text-transparent">
            Without Limits.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Deploy Paper, Purpur, Fabric & Forge in under 30 seconds. Powered by enterprise NVMe drives, instant Playit.gg tunnels without port-forwarding, and real-time live telemetry.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            to={user ? "/servers/create" : "/register"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-rose-500 to-orange-600 text-white font-bold text-base shadow-xl shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-[1.02] transition-all"
          >
            Deploy Server (Free Tier)
            <ArrowRight size={18} />
          </Link>
          <a
            href="#pricing"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 font-semibold text-base hover:bg-slate-800 transition-colors"
          >
            Explore Plans
          </a>
        </div>

        {/* Live Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-rose-400">99.98%</div>
            <div className="text-xs text-slate-400 uppercase font-mono mt-1">Uptime SLA</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">&lt; 5ms</div>
            <div className="text-xs text-slate-400 uppercase font-mono mt-1">Server Tick Latency</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-blue-400">0s</div>
            <div className="text-xs text-slate-400 uppercase font-mono mt-1">Port Forwarding Needed</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">100%</div>
            <div className="text-xs text-slate-400 uppercase font-mono mt-1">DDoS Mitigation</div>
          </div>
        </div>
      </section>

      {/* Interactive Server Resource Slider */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 relative">
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800/90 p-8 sm:p-12 backdrop-blur-md shadow-2xl">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-rose-400 text-xs font-mono uppercase tracking-widest font-semibold">Interactive Sizer</span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-2">Find the Perfect Setup for Your Community</h2>
            <p className="text-slate-400 text-sm mt-2">Slide to adjust RAM and see estimated capacity</p>
          </div>

          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex justify-between items-center text-sm font-mono">
              <span className="text-slate-300">Allocated RAM</span>
              <span className="text-xl font-bold text-rose-400">{calculatorRam} GB DDR5</span>
            </div>

            <input 
              type="range" 
              min="1" 
              max="32" 
              step="1"
              value={calculatorRam}
              onChange={(e) => setCalculatorRam(Number(e.target.value))}
              className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />

            <div className="flex justify-between text-xs text-slate-500 font-mono">
              <span>1 GB (Testing)</span>
              <span>8 GB (Medium Community)</span>
              <span>16 GB (Heavy Modpack)</span>
              <span>32 GB (Mega Network)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-center">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <div className="text-xs text-slate-400 uppercase">Recommended Players</div>
                <div className="text-xl font-bold text-white mt-1">~{calculatePlayers(calculatorRam)}+ Online</div>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <div className="text-xs text-slate-400 uppercase">Suggested Tier</div>
                <div className="text-xl font-bold text-amber-400 mt-1">{calculatorRam <= 2 ? "Free Tier" : "Premium Tier"}</div>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                <div className="text-xs text-slate-400 uppercase">Mod / Plugin Capacity</div>
                <div className="text-xl font-bold text-emerald-400 mt-1">{calculatorRam >= 8 ? "50+ Mods & Plugins" : "Light Plugins"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-rose-400 text-xs font-mono uppercase tracking-widest font-semibold">Engineered For Performance</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">Everything You Need to Run Seamless Minecraft Servers</h2>
          <p className="text-slate-400 text-base mt-4">
            Zero complex configuration. From instant tunnel sharing to visual world switching, our panel puts full control in your hands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Layers size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">1-Click Multi-Engine</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Run Vanilla, Paper, Purpur, Spigot, Fabric, Forge, or Folia. Switch versions and update server JARs with a single click.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Playit.gg Zero-Port Tunnels</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              No need to configure port forwarding on your router. Generate instant, encrypted public join domains that anyone can connect with.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Terminal size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Real-Time Web Console</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Interactive terminal with command auto-scroll, command history, and instant hotkeys for `/op`, `/say`, and `/whitelist`.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <HardDrive size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Full File Manager & SFTP</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Upload, edit config files in a built-in text editor, extract ZIP archives, or connect via FileZilla / Cyberduck using native SFTP.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <RefreshCw size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Automated Backups</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Keep your progress safe. Take on-demand snapshots or schedule automated hourly/daily backups with 1-click restore.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Firebase RBAC & Security</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Multi-role access control, sub-user permissions, audit activity logging, and enterprise Firestore data persistence.
            </p>
          </div>
        </div>
      </section>

      {/* Supported Software Bar */}
      <section id="software" className="py-12 border-y border-slate-800/80 bg-slate-900/40 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs uppercase font-mono tracking-widest text-slate-400 mb-6">
            Supported Minecraft Platforms & Modloaders
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-slate-300 font-mono text-sm">
            <span className="px-4 py-2 bg-slate-800/60 rounded-xl border border-slate-700/60">PaperMC</span>
            <span className="px-4 py-2 bg-slate-800/60 rounded-xl border border-slate-700/60">Purpur</span>
            <span className="px-4 py-2 bg-slate-800/60 rounded-xl border border-slate-700/60">Fabric</span>
            <span className="px-4 py-2 bg-slate-800/60 rounded-xl border border-slate-700/60">Forge</span>
            <span className="px-4 py-2 bg-slate-800/60 rounded-xl border border-slate-700/60">Folia (Multi-threaded)</span>
            <span className="px-4 py-2 bg-slate-800/60 rounded-xl border border-slate-700/60">Spigot</span>
            <span className="px-4 py-2 bg-slate-800/60 rounded-xl border border-slate-700/60">Vanilla</span>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-rose-400 text-xs font-mono uppercase tracking-widest font-semibold">Transparent Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mt-2">Simple, Predictable Plans</h2>
          <p className="text-slate-400 text-base mt-4">
            Start completely free or unlock massive enterprise power with our Premium tier.
          </p>

          <div className="inline-flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 mt-6">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                billingCycle === "monthly" 
                  ? "bg-rose-500 text-white shadow-sm" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                billingCycle === "yearly" 
                  ? "bg-rose-500 text-white shadow-sm" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Yearly
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-mono">SAVE 20%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Tier Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-md flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-mono uppercase font-semibold mb-4">
                Community Tier
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Free Plan</h3>
              <p className="text-slate-400 text-sm mb-6">
                Perfect for playing with friends, survival SMPs, or testing new plugin setups.
              </p>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-4xl sm:text-5xl font-extrabold text-white">$0</span>
                <span className="text-slate-400 text-sm">/ forever</span>
              </div>

              <div className="space-y-3.5 mb-8">
                {DEFAULT_PLANS.free.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to={user ? "/servers/create" : "/register"}
              className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-center text-sm transition-colors border border-slate-700"
            >
              {user ? "Deploy Free Server" : "Get Started Free"}
            </Link>
          </div>

          {/* Premium Plan Card */}
          <div className="relative p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-rose-500/50 backdrop-blur-md flex flex-col justify-between shadow-2xl shadow-rose-500/10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
              Most Popular
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-mono uppercase font-semibold mb-4">
                Unrestricted Power
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Premium Pro</h3>
              <p className="text-slate-400 text-sm mb-6">
                For large public networks, heavy modpacks, and dedicated server administrators.
              </p>

              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-4xl sm:text-5xl font-extrabold text-white">
                  {billingCycle === "yearly" ? "$7.99" : "$9.99"}
                </span>
                <span className="text-slate-400 text-sm">/ month</span>
              </div>

              <div className="space-y-3.5 mb-8">
                {DEFAULT_PLANS.premium.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-slate-200">
                    <CheckCircle2 size={16} className="text-rose-400 shrink-0" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to={user ? "/servers/create" : "/register"}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-600 hover:opacity-95 text-white font-bold text-center text-sm transition-all shadow-lg shadow-rose-500/25"
            >
              {user ? "Upgrade to Premium" : "Deploy Premium Server"}
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-10 relative">
        <div className="text-center mb-12">
          <span className="text-rose-400 text-xs font-mono uppercase tracking-widest font-semibold">Common Questions</span>
          <h2 className="text-3xl font-extrabold mt-2">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-base font-bold text-white">How does the Free Plan work?</h4>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              The free plan includes 1 full Minecraft server with 2 GB RAM and 10 GB storage. There are no credit cards required, and you can play with your friends indefinitely.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-base font-bold text-white">Do I need to open router ports for friends to join?</h4>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              No! We integrate directly with Playit.gg tunnels. With 1 click inside your server dashboard, you get a public joining address (like `yourserver.gl.joinmc.link`) that anyone can paste into their Minecraft client.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-base font-bold text-white">Can I upload my own custom worlds and mods?</h4>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Yes. You have full access to our web-based File Manager as well as high-speed SFTP. You can drag and drop custom world ZIPs, plugins, and mods freely.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h4 className="text-base font-bold text-white">Can I upgrade or change my plan later?</h4>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Yes. You can upgrade from Free to Premium at any time from your Account settings, instantly increasing your RAM and server slots without losing any data.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {panelLogo ? (
              <img src={panelLogo} alt={brand} className="w-8 h-8 object-contain rounded-lg" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center text-white">
                <Box size={16} />
              </div>
            )}
            <span className="font-bold text-sm text-slate-300">{brand}</span>
            <span className="text-xs text-slate-500">© {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400 font-mono">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <Link to="/login" className="hover:text-white transition-colors">Log In</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
