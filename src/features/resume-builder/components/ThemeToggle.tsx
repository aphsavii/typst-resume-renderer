import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Monitor, Check, Settings, ChevronDown } from "lucide-react";
import { useTheme } from "../../../app/providers/useTheme";
import type { ThemeMode } from "../../../app/providers/ThemeContext";

export const ThemeToggle: React.FC = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options: { mode: ThemeMode; label: string; description: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { mode: "light", label: "Light Mode", description: "Clean & bright interface", icon: Sun },
    { mode: "dark", label: "Dark Mode", description: "Sleek dark mode for low eye strain", icon: Moon },
    { mode: "system", label: "System Default", description: "Synchronize with system settings", icon: Monitor },
  ];

  const CurrentIcon = resolvedTheme === "dark" ? Moon : Sun;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition shadow-xs"
        title="Appearance & Theme Settings"
        aria-expanded={isOpen}
      >
        <Settings className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
        <CurrentIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
        <span className="hidden sm:inline text-xs font-medium capitalize">{theme}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl z-50 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Theme Settings</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-semibold uppercase">{resolvedTheme}</span>
          </div>
          <div className="p-1.5 space-y-1">
            {options.map((opt) => {
              const Icon = opt.icon;
              const isActive = theme === opt.mode;
              return (
                <button
                  key={opt.mode}
                  onClick={() => {
                    setTheme(opt.mode);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-md ${isActive ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs">{opt.label}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">{opt.description}</div>
                    </div>
                  </div>
                  {isActive && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
