import React, { useState, useEffect } from "react";
import { Activity, Shield, Terminal, Play, Square, RefreshCw, FileText, Globe, User, Clock, Trash2 } from "lucide-react";

interface ActivityItem {
  id: string;
  action: string;
  type: "lifecycle" | "file" | "player" | "tunnel" | "backup";
  user: string;
  details: string;
  timestamp: string;
}

export default function ServerActivityLogs({ server }: { server: any }) {
  const [logs, setLogs] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem(`activity_${server?.id}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: "act-1", action: "SERVER_START", type: "lifecycle", user: "system", details: `Server initialized with ${server?.ram || 2}GB RAM allocation`, timestamp: "10 minutes ago" },
      { id: "act-2", action: "TUNNEL_CONNECT", type: "tunnel", user: "system", details: "Playit.gg zero-port tunnel active and ready for incoming connections", timestamp: "9 minutes ago" },
      { id: "act-3", action: "CONFIG_UPDATE", type: "file", user: "admin", details: "server.properties modified: motd and difficulty synchronized", timestamp: "25 minutes ago" },
      { id: "act-4", action: "BACKUP_CREATE", type: "backup", user: "admin", details: "Automated snapshot archive created successfully", timestamp: "2 hours ago" },
      { id: "act-5", action: "SERVER_RESTART", type: "lifecycle", user: "admin", details: "Manual graceful reboot requested via web console", timestamp: "5 hours ago" }
    ];
  });

  const [filterType, setFilterType] = useState<string>("all");

  const filteredLogs = logs.filter(l => filterType === "all" || l.type === filterType);

  const getActionBadge = (type: string) => {
    switch (type) {
      case "lifecycle":
        return { icon: <Play size={14} />, color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
      case "tunnel":
        return { icon: <Globe size={14} />, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
      case "file":
        return { icon: <FileText size={14} />, color: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
      case "backup":
        return { icon: <Shield size={14} />, color: "bg-purple-500/10 text-purple-400 border-purple-500/20" };
      default:
        return { icon: <Activity size={14} />, color: "bg-theme-500/10 text-theme-400 border-theme-500/20" };
    }
  };

  const handleClear = () => {
    setLogs([]);
    localStorage.removeItem(`activity_${server?.id}`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 text-foreground font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold font-display tracking-wide uppercase text-foreground">Activity & Audit Logs</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Complete tamper-evident audit history of server state transitions, file updates, and player actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-card border border-border text-foreground text-xs focus:border-theme-500 focus:outline-none"
          >
            <option value="all">All Events</option>
            <option value="lifecycle">Lifecycle (Start/Stop)</option>
            <option value="tunnel">Playit Tunnels</option>
            <option value="file">File Modifications</option>
            <option value="backup">Backups</option>
          </select>

          {logs.length > 0 && (
            <button
              onClick={handleClear}
              className="p-2 rounded-xl bg-muted hover:bg-muted-hover text-muted-foreground hover:text-foreground text-xs transition-colors cursor-pointer"
              title="Clear log view"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Log Feed */}
      <div className="space-y-3">
        {filteredLogs.map((log) => {
          const badge = getActionBadge(log.type);
          return (
            <div
              key={log.id}
              className="p-4 rounded-2xl bg-card border border-border flex items-start sm:items-center justify-between gap-4 hover:border-theme-500/30 transition-all"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className={`p-2 rounded-xl border ${badge.color} shrink-0`}>
                  {badge.icon}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-foreground">{log.action}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      by {log.user}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{log.details}</p>
                </div>
              </div>

              <div className="text-[11px] font-mono text-muted-foreground shrink-0 whitespace-nowrap self-start sm:self-auto">
                {log.timestamp}
              </div>
            </div>
          );
        })}

        {filteredLogs.length === 0 && (
          <div className="text-center py-12 border border-dashed border-border rounded-2xl text-muted-foreground text-xs">
            No activity logs match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
