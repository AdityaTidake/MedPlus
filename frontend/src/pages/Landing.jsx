import { Link } from 'react-router-dom';
import { Heart, Calendar, Pill, Activity, ArrowRight } from 'lucide-react';

export default function Landing() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Hero Section */}
            <div className="container mx-auto px-6 py-20">
                <div className="text-center max-w-4xl mx-auto">
                    <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                        Welcome to Hospify
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Your Complete Hospital Management Solution
                    </p>
                    <p className="text-lg text-gray-500 mb-12">
                        Streamline appointments, manage prescriptions, and automate workflows with our world-class platform
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                        Get Started
                        <ArrowRight size={24} />
                    </Link>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
                    <FeatureCard
                        icon={Calendar}
                        title="Easy Appointments"
                        description="Book and manage appointments with just a few clicks"
                        color="blue"
                    />
                    <FeatureCard
                        icon={Heart}
                        title="Patient Care"
                        description="Comprehensive patient management system"
                        color="red"
                    />
                    <FeatureCard
                        icon={Pill}
                        title="Pharmacy Integration"
                        description="Seamless prescription and dispensing workflow"
                        color="green"
                    />
                    <FeatureCard
                        icon={Activity}
                        title="Real-time Updates"
                        description="Live queue management and notifications"
                        color="purple"
                    />
                </div>

                {/* Stats Section */}
                <div className="mt-20 bg-white rounded-3xl shadow-2xl p-12">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <StatItem number="1000+" label="Patients Served" />
                        <StatItem number="50+" label="Expert Doctors" />
                        <StatItem number="24/7" label="Support Available" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description, color }) {
    const colorClasses = {
        blue: "from-blue-500 to-indigo-600",
        red: "from-red-500 to-pink-600",
        green: "from-green-500 to-emerald-600",
        purple: "from-purple-500 to-indigo-600"
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className={`w-16 h-16 bg-gradient-to-br ${colorClasses[color]} rounded-2xl flex items-center justify-center mb-4`}>
                <Icon size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}

function StatItem({ number, label }) {
    return (
        <div>
            <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {number}
            </div>
            <div className="text-gray-600 font-medium">{label}</div>
        </div>
    );
}
