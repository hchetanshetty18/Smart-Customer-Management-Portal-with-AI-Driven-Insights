import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, LineChart, Sparkles, LogOut } from 'lucide-react';

export default function Sidebar() {
  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Insights', path: '/insights', icon: LineChart },
    { name: 'Ask AI', path: '/ask-ai', icon: Sparkles },
  ];

  return (
    <aside className="w-[220px] bg-white border-r border-slate-200 flex flex-col h-screen fixed top-0 left-0">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold text-slate-900 tracking-tight">Kastomer</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <link.icon className="w-5 h-5 flex-shrink-0" />
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-md font-medium text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
