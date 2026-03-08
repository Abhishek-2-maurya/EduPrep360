import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { api } from '../api/axios';
import toast from 'react-hot-toast';
import { 
  LayoutDashboard, BookOpen, ClipboardList, 
  Users, Settings, LogOut, FileText, Menu, X
} from 'lucide-react';

export const Layout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/user/logout');
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const getLinks = () => {
    switch (user?.role) {
      case 'student':
        return [
          { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
          { name: 'Available Tests', path: '/student/tests', icon: ClipboardList },
          { name: 'History', path: '/student/history', icon: BookOpen },
          { name: 'Notes', path: '/student/notes', icon: FileText },
        ];
      case 'teacher':
        return [
          { name: 'Dashboard', path: '/teacher/dashboard', icon: LayoutDashboard },
          { name: 'Manage Tests', path: '/teacher/tests/manage', icon: ClipboardList },
          { name: 'Create Test', path: '/teacher/tests/create', icon: BookOpen },
          { name: 'Notes', path: '/teacher/notes', icon: FileText },
        ];
      case 'HOD':
        return [
          { name: 'Dashboard', path: '/hod/dashboard', icon: LayoutDashboard },
          { name: 'Branch Users', path: '/hod/users', icon: Users },
          { name: 'Branch Tests', path: '/hod/tests', icon: ClipboardList },
          { name: 'Notes', path: '/hod/notes', icon: FileText },
        ];
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'All Users', path: '/admin/users', icon: Users },
          // { name: 'Settings', path: '/admin/settings', icon: Settings },
          { name: 'Notes', path: '/admin/notes', icon: FileText },
        ];
      default:
        return [];
    }
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    
    <div className="flex h-screen bg-linear-to-br from-blue-50 via-slate-50 to-purple-50 font-sans overflow-hidden">
      
      
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      
      <aside 
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-white/60 backdrop-blur-lg shadow-[4px_0_24px_rgba(0,0,0,0.02)] md:shadow-sm border-r border-white/40 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">EduPrep360</h2>
            <p className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">{user?.role} Panel</p>
          </div>
          <button 
            className="md:hidden text-gray-500 hover:text-gray-700 bg-white/50 p-1.5 rounded-full"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          {getLinks().map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={handleLinkClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                    isActive 
                      ? 'bg-white/80 shadow-sm text-blue-700 border border-white/50' 
                      : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
                  }`
                }
              >
                <Icon size={18} />
                {link.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Profile/Logout Area - Glassy */}
        <div className="p-4 border-t border-white/40 bg-white/30">
          <div className="mb-4 px-2">
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50/80 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen relative">
        
        {/* Mobile Top Header with Glass Effect */}
        <header className="md:hidden flex items-center justify-between bg-white/60 backdrop-blur-lg border-b border-white/40 px-4 py-3 shadow-sm z-30 sticky top-0">
          <h2 className="text-xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">EduPrep360</h2>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -mr-2 text-gray-600 hover:bg-white/60 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};