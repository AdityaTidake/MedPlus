import { Bell, Search } from 'lucide-react';

export default function Topbar({ title }) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return (
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                    />
                </div>
                <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <Bell size={24} className="text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
            </div>
        </div>
    );
}
