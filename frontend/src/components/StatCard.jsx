export default function StatCard({ icon: Icon, title, value, color = "blue" }) {
    const colorClasses = {
        blue: "from-blue-500 to-indigo-600",
        green: "from-green-500 to-emerald-600",
        purple: "from-purple-500 to-pink-600",
        orange: "from-orange-500 to-red-600"
    };

    return (
        <div className={`bg-gradient-to-br ${colorClasses[color]} text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm opacity-90">{title}</p>
                    <p className="text-4xl font-bold mt-2">{value}</p>
                </div>
                <div className="bg-white/20 backdrop-blur-lg p-4 rounded-xl">
                    <Icon size={32} />
                </div>
            </div>
        </div>
    );
}
