import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Users, Pill, LogOut, Activity } from 'lucide-react';

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const getMenuItems = () => {
        switch (user.role) {
            case 'patient':
                return [
                    { icon: Home, label: 'Dashboard', path: '/patient' },
                    { icon: Calendar, label: 'Appointments', path: '/patient' },
                ];
            case 'doctor':
                return [
                    { icon: Home, label: 'Dashboard', path: '/doctor' },
                    { icon: Activity, label: 'Queue', path: '/doctor' },
                ];
            case 'pharmacist':
                return [
                    { icon: Home, label: 'Dashboard', path: '/pharmacy' },
                    { icon: Pill, label: 'Prescriptions', path: '/pharmacy' },
                ];
            case 'admin':
                return [
                    { icon: Home, label: 'Dashboard', path: '/admin' },
                    { icon: Users, label: 'Manage Staff', path: '/admin' },
                ];
            default:
                return [];
        }
    };

    const menuItems = getMenuItems();

    return (
        <div className="w-64 bg-gradient-to-b from-blue-900 to-indigo-900 text-white min-h-screen p-6 flex flex-col">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                    Hospify
                </h1>
                <p className="text-blue-200 text-sm mt-1 capitalize">{user.role} Portal</p>
            </div>

            <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                ? 'bg-white/20 backdrop-blur-lg shadow-lg'
                                : 'hover:bg-white/10'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-6 border-t border-white/20">
                <div className="mb-4 p-3 bg-white/10 rounded-xl">
                    <p className="text-sm text-blue-200">Logged in as</p>
                    <p className="font-semibold truncate">{user.name}</p>
                    <p className="text-xs text-blue-300 truncate">{user.email}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
}
