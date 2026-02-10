import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import StatCard from '../../components/StatCard';
import axios from '../../api/axios';
import { Users, Calendar, Activity, Pill, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({});
    const [doctors, setDoctors] = useState([]);

    useEffect(() => {
        fetchStats();
        fetchDoctors();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get('/admin/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('/admin/doctors');
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const handleDeleteDoctor = async (id) => {
        if (confirm('Are you sure you want to delete this doctor?')) {
            try {
                await axios.delete(`/admin/doctors/${id}`);
                fetchDoctors();
                fetchStats();
                alert('Doctor deleted successfully');
            } catch (error) {
                alert('Error deleting doctor');
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1">
                <Topbar title="Admin Dashboard" />

                <div className="p-8">
                    {/* Stats Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            icon={Users}
                            title="Total Doctors"
                            value={stats.total_doctors || 0}
                            color="blue"
                        />
                        <StatCard
                            icon={Users}
                            title="Total Patients"
                            value={stats.total_patients || 0}
                            color="green"
                        />
                        <StatCard
                            icon={Calendar}
                            title="Completed Appointments"
                            value={stats.completed_appointments || 0}
                            color="purple"
                        />
                        <StatCard
                            icon={Pill}
                            title="Pending Prescriptions"
                            value={stats.pending_prescriptions || 0}
                            color="orange"
                        />
                    </div>

                    {/* Doctors Management */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800">Manage Doctors</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ID</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Email</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Specialization</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Department</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {doctors.map((doctor) => (
                                        <tr key={doctor.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-800">{doctor.id}</td>
                                            <td className="px-6 py-4 font-medium">{doctor.user.name}</td>
                                            <td className="px-6 py-4 text-gray-600">{doctor.user.email}</td>
                                            <td className="px-6 py-4">{doctor.specialization}</td>
                                            <td className="px-6 py-4">{doctor.department}</td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleDeleteDoctor(doctor.id)}
                                                    className="text-red-600 hover:text-red-800 font-medium flex items-center gap-2"
                                                >
                                                    <Trash2 size={18} />
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
