import React, { useState, useEffect } from "react";
import axios from "axios";
import { Clock, Plus, Trash2, Play, CheckCircle2, AlertCircle, RefreshCw, Radio, Calendar } from "lucide-react";

interface ScheduleItem {
  id: string;
  name: string;
  action: "backup" | "restart" | "command";
  cron: string;
  command?: string;
  enabled: boolean;
  lastRun?: string;
}

export default function ServerSchedules({ server }: { server: any }) {
  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem(`schedules_${server?.id}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: "sch-1", name: "Daily World Backup", action: "backup", cron: "Every day at 04:00 AM", enabled: true, lastRun: "Today, 04:00 AM" },
      { id: "sch-2", name: "Daily Automated Restart", action: "restart", cron: "Every day at 05:00 AM", enabled: true, lastRun: "Today, 05:00 AM" },
      { id: "sch-3", name: "Community Broadcast Warning", action: "command", command: "say [Server Notice] Daily memory purge in 5 minutes!", cron: "Every day at 04:55 AM", enabled: false }
    ];
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [action, setAction] = useState<"backup" | "restart" | "command">("backup");
  const [cron, setCron] = useState("Daily at 03:00 AM");
  const [command, setCommand] = useState("");
  const [runningId, setRunningId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const saveSchedules = (list: ScheduleItem[]) => {
    setSchedules(list);
    localStorage.setItem(`schedules_${server?.id}`, JSON.stringify(list));
  };

  const handleToggle = (id: string) => {
    const updated = schedules.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s);
    saveSchedules(updated);
  };

  const handleDelete = (id: string) => {
    const updated = schedules.filter(s => s.id !== id);
    saveSchedules(updated);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: ScheduleItem = {
      id: "sch-" + Date.now(),
      name: name.trim(),
      action,
      cron,
      command: action === "command" ? command : undefined,
      enabled: true
    };

    saveSchedules([...schedules, newItem]);
    setName("");
    setCommand("");
    setModalOpen(false);
  };

  const handleRunNow = async (item: ScheduleItem) => {
    setRunningId(item.id);
    try {
      if (item.action === "restart") {
        await axios.post(`/api/servers/${server.id}/restart`);
      } else if (item.action === "backup") {
        await axios.post(`/api/servers/${server.id}/backup`);
      } else if (item.action === "command" && item.command) {
        await axios.post(`/api/servers/${server.id}/command`, { command: item.command });
      }
      
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updated = schedules.map(s => s.id === item.id ? { ...s, lastRun: `Today, ${nowStr}` } : s);
      saveSchedules(updated);

      setSuccessToast(`Successfully executed scheduled task: "${item.name}"`);
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err: any) {
      console.error("Execution failed", err);
    } finally {
      setRunningId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6 text-foreground font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold font-display tracking-wide uppercase text-foreground">Automated Schedules & Cron</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Automate recurring server tasks, periodic memory restarts, daily backups, and automated broadcast notices.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-theme-600 hover:bg-theme-500 text-white font-semibold text-xs transition-all shadow-md shadow-theme-600/25 cursor-pointer shrink-0"
        >
          <Plus size={16} />
          Create Schedule
        </button>
      </div>

      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successToast}</span>
        </div>
      )}

      {/* Schedule Items List */}
      <div className="space-y-3">
        {schedules.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              item.enabled ? "bg-card border-border" : "bg-card/40 border-border/50 opacity-60"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-theme-500/10 text-theme-400 flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">{item.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-muted text-muted-foreground font-semibold">
                    {item.action}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                  <span>Frequency: {item.cron}</span>
                  {item.lastRun && <span>• Last run: {item.lastRun}</span>}
                </div>
                {item.command && (
                  <div className="mt-1 font-mono text-[11px] text-theme-400 bg-black/40 px-2 py-0.5 rounded inline-block">
                    /{item.command}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={() => handleRunNow(item)}
                disabled={runningId === item.id}
                className="p-2 rounded-xl bg-muted hover:bg-muted-hover text-muted-foreground hover:text-foreground text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Execute task right now"
              >
                {runningId === item.id ? (
                  <RefreshCw size={14} className="animate-spin text-theme-400" />
                ) : (
                  <Play size={14} />
                )}
                <span>Run Now</span>
              </button>

              <button
                onClick={() => handleToggle(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  item.enabled
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {item.enabled ? "Active" : "Disabled"}
              </button>

              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer"
                title="Delete task"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {schedules.length === 0 && (
          <div className="text-center py-12 border border-dashed border-border rounded-2xl text-muted-foreground text-xs">
            No scheduled tasks configured yet. Click "Create Schedule" above to add one.
          </div>
        )}
      </div>

      {/* Create Schedule Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-lg bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <h3 className="text-lg font-bold font-display uppercase text-foreground">New Scheduled Task</h3>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Schedule Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Midnight World Backup"
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:border-theme-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Action Type</label>
              <select
                value={action}
                onChange={(e: any) => setAction(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:border-theme-500 focus:outline-none"
              >
                <option value="backup">Create Archive Backup</option>
                <option value="restart">Restart Server Process</option>
                <option value="command">Execute Console Command</option>
              </select>
            </div>

            {action === "command" && (
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Console Command</label>
                <input
                  type="text"
                  required
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="e.g. broadcast Daily restart occurring in 10 minutes"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm font-mono focus:border-theme-500 focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Interval / Timing</label>
              <select
                value={cron}
                onChange={(e) => setCron(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-foreground text-sm focus:border-theme-500 focus:outline-none"
              >
                <option value="Every 6 hours">Every 6 hours</option>
                <option value="Every 12 hours">Every 12 hours</option>
                <option value="Daily at 03:00 AM">Daily at 03:00 AM</option>
                <option value="Daily at 04:00 AM">Daily at 04:00 AM</option>
                <option value="Daily at 05:00 AM">Daily at 05:00 AM</option>
                <option value="Weekly on Sunday">Weekly on Sunday</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-theme-600 hover:bg-theme-500 text-white font-semibold text-xs shadow-md shadow-theme-600/25"
              >
                Save Schedule
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
