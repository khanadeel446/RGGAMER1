import React, { useState, useEffect } from "react";
import axios from "axios";
import { Terminal, Cpu, Zap, Save, RefreshCw, Check, AlertCircle, Info, Sparkles } from "lucide-react";

export default function ServerStartup({ server, onUpdate }: { server: any; onUpdate?: () => void }) {
  const [javaVersion, setJavaVersion] = useState(server?.javaVersion || "21");
  const [aikarFlags, setAikarFlags] = useState(server?.startup?.aikarFlags !== false);
  const [customFlags, setCustomFlags] = useState(server?.startup?.customFlags || "");
  const [serverJar, setServerJar] = useState(server?.startup?.serverJar || "server.jar");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (server) {
      if (server.javaVersion) setJavaVersion(server.javaVersion);
      if (server.startup) {
        if (server.startup.aikarFlags !== undefined) setAikarFlags(server.startup.aikarFlags);
        if (server.startup.customFlags) setCustomFlags(server.startup.customFlags);
        if (server.startup.serverJar) setServerJar(server.startup.serverJar);
      }
    }
  }, [server]);

  const ramMB = Math.round((server?.ram || 2) * 1024);

  const generatePreviewCommand = () => {
    const aikarStr = aikarFlags
      ? "-XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1ReservePercent=20"
      : "";
    const extra = customFlags.trim() ? ` ${customFlags.trim()}` : "";
    return `java -Xms512M -Xmx${ramMB}M ${aikarStr}${extra} -jar ${serverJar} nogui`.replace(/\s+/g, " ");
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await axios.put(`/api/servers/${server.id}/startup`, {
        javaVersion,
        startup: {
          aikarFlags,
          customFlags,
          serverJar
        }
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      if (onUpdate) onUpdate();
    } catch (err) {
      // Fallback update to general server settings
      try {
        await axios.put(`/api/servers/${server.id}`, {
          javaVersion,
          startup: { aikarFlags, customFlags, serverJar }
        });
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } catch (e) {
        console.error("Failed to save startup configuration", e);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 text-foreground font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold font-display tracking-wide uppercase text-foreground">Startup & JVM Configuration</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Configure Java runtime environment flags, garbage collector tuning, and execution parameters.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-theme-600 hover:bg-theme-500 text-white font-semibold text-xs transition-all shadow-md shadow-theme-600/25 disabled:opacity-50 cursor-pointer shrink-0"
        >
          {isSaving ? (
            <RefreshCw size={15} className="animate-spin" />
          ) : savedSuccess ? (
            <Check size={15} className="text-emerald-300" />
          ) : (
            <Save size={15} />
          )}
          {savedSuccess ? "Saved Configuration" : "Save Changes"}
        </button>
      </div>

      {/* Generated Startup Command Box */}
      <div className="p-4 rounded-2xl bg-black/60 border border-theme-500/20 shadow-inner">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-theme-400 font-semibold">
            <Terminal size={14} />
            Computed Launch Command
          </div>
          <span className="text-[11px] font-mono text-muted-foreground">Auto-generated</span>
        </div>
        <pre className="p-3 rounded-xl bg-black/90 font-mono text-xs text-emerald-400 whitespace-pre-wrap break-all select-all border border-white/5">
          {generatePreviewCommand()}
        </pre>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Java Environment */}
        <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="text-theme-400" size={18} />
            <h3 className="font-bold text-sm text-foreground">Java Runtime Version</h3>
          </div>

          <p className="text-xs text-muted-foreground">
            Select the Java Development Kit (JDK) binary matched to your Minecraft version.
          </p>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "21", label: "Java 21 (LTS)", desc: "Minecraft 1.20.5 - 1.21.x" },
              { id: "17", label: "Java 17 (LTS)", desc: "Minecraft 1.18 - 1.20.4" },
              { id: "11", label: "Java 11", desc: "Minecraft 1.17.x" },
              { id: "8", label: "Java 8", desc: "Minecraft 1.12.2 & Legacy" },
            ].map((jdk) => (
              <button
                key={jdk.id}
                type="button"
                onClick={() => setJavaVersion(jdk.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  javaVersion === jdk.id
                    ? "border-theme-500 bg-theme-500/10 text-theme-300 font-bold"
                    : "border-border hover:border-theme-500/40 text-muted-foreground"
                }`}
              >
                <div className="text-xs font-semibold">{jdk.label}</div>
                <div className="text-[10px] opacity-75 mt-0.5">{jdk.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Server Executable File */}
        <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="text-theme-400" size={18} />
            <h3 className="font-bold text-sm text-foreground">Server Executable JAR</h3>
          </div>

          <p className="text-xs text-muted-foreground">
            The target JAR file located inside the server root directory to execute.
          </p>

          <input
            type="text"
            value={serverJar}
            onChange={(e) => setServerJar(e.target.value)}
            placeholder="server.jar"
            className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm font-mono focus:border-theme-500 focus:outline-none"
          />

          <div className="flex flex-wrap gap-2 text-[11px] font-mono text-muted-foreground">
            <span>Quick picks:</span>
            {["server.jar", "paper.jar", "purpur.jar", "fabric-server-launch.jar"].map((jar) => (
              <button
                key={jar}
                type="button"
                onClick={() => setServerJar(jar)}
                className="px-2 py-0.5 rounded bg-muted hover:text-foreground hover:bg-muted-hover transition-colors"
              >
                {jar}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Aikar's Flags Tuning */}
      <div className="p-5 rounded-2xl bg-card border border-border space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">Aikar's Garbage Collector Optimization</h3>
              <p className="text-xs text-muted-foreground">
                Engineered G1GC parameters that dramatically minimize tick lag spikes and stabilize TPS under heavy load.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={aikarFlags}
              onChange={(e) => setAikarFlags(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-theme-600"></div>
          </label>
        </div>
      </div>

      {/* Additional Custom JVM Flags */}
      <div className="p-5 rounded-2xl bg-card border border-border space-y-3">
        <h3 className="font-bold text-sm text-foreground">Additional Custom JVM Flags</h3>
        <p className="text-xs text-muted-foreground">
          Advanced startup options appended directly before the `-jar` directive.
        </p>

        <input
          type="text"
          value={customFlags}
          onChange={(e) => setCustomFlags(e.target.value)}
          placeholder="-Dterminal.jline=false -Dlog4j2.formatMsgNoLookups=true"
          className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm font-mono focus:border-theme-500 focus:outline-none"
        />
      </div>
    </div>
  );
}
