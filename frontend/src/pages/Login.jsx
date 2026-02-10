import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        phone: '',
        role: 'patient'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/signup';
            const payload = isLogin
                ? { email: formData.email, password: formData.password }
                : formData;

            const response = await axios.post(endpoint, payload);

            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Redirect based on role
            const role = response.data.user.role;
            navigate(`/${role}`);
        } catch (err) {
            setError(err.response?.data?.detail || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Hospify
                        </h1>
                    </Link>
                    <p className="text-gray-600 mt-2">Hospital Management System</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${isLogin
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${!isLogin
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="patient">Patient</option>
                                    <option value="doctor">Doctor</option>
                                    <option value="pharmacist">Pharmacist</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </>
                        )}

                        <input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
                        </button>
                    </form>

                    {isLogin && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                            <p className="text-sm text-gray-600 font-semibold mb-2">Test Credentials:</p>
                            <p className="text-xs text-gray-500">Patient: patient@hospify.com / patient123</p>
                            <p className="text-xs text-gray-500">Doctor: doctor@hospify.com / doctor123</p>
                            <p className="text-xs text-gray-500">Admin: admin@hospify.com / admin123</p>
                        </div>
                    )}
                </div>

                <div className="text-center mt-6">
                    <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
