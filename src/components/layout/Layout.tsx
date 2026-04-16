import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardCheck, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

export function Sidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: 'Campaigns', path: '/' },
    { icon: Users, label: 'Creators', path: '/creators' },
    { icon: ClipboardCheck, label: 'Shortlist', path: '/shortlist' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  ];

  return (
    <div className="w-64 border-r border-border/50 bg-card/50 backdrop-blur-xl hidden md:flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white">
            <Users size={18} />
          </div>
          CreatorDesk
        </div>
      </div>
      
      <div className="flex-1 py-6 px-4 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-violet-500/10 text-violet-400" 
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </div>
      
      <div className="p-4 border-t border-border/50">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground w-full transition-all">
          <Settings size={18} />
          Settings
        </button>
      </div>
    </div>
  );
}

export function Topbar() {
  return (
    <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="font-semibold text-sm text-muted-foreground">
        AI Intern Assignment
      </div>
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-violet-900 flex items-center justify-center text-violet-200 font-medium text-sm ring-1 ring-violet-500/30">
          U
        </div>
      </div>
    </header>
  );
}

export default function Layout() {
  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-violet-500/30">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/10 via-background to-background pointer-events-none" />
        <Topbar />
        <main className="flex-1 overflow-auto relative z-0 p-6">
          <Outlet />
        </main>
      </div>
      <Toaster />
    </div>
  );
}
