import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  FolderGit2, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  User, 
  MessageSquare,
  LogOut
} from 'lucide-react';

const AdminLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/admin/projects', icon: FolderGit2 },
    { name: 'Experience', path: '/admin/experience', icon: Briefcase },
    { name: 'Certifications', path: '/admin/certifications', icon: GraduationCap },
    { name: 'Skills', path: '/admin/skills', icon: Code2 },
    { name: 'Profile', path: '/admin/profile', icon: User },
    { name: 'Education', path: '/admin/education', icon: GraduationCap },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <h2 className="text-xl font-black text-white">Admin CMS</h2>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-colors ${
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-500' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg font-bold text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8 md:hidden">
           <h2 className="text-xl font-black text-white">Admin CMS</h2>
           {/* Mobile menu toggle could go here */}
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
