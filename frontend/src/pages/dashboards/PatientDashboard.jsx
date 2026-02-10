import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import ChatbotWidget from '../../components/ChatbotWidget';
import axios from '../../api/axios';
import { Calendar, Clock, User, X } from 'lucide-react';

export default function PatientDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingData, setBookingData] = useState({
        doctor_id: '',
        date: '',
        time: ''
    });

    useEffect(() => {
        fetchAppointments();
        fetchDoctors();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('/patient/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('/doctors');
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const handleBookAppointment = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/patient/appointments', bookingData);
            setShowBookingModal(false);
            setBookingData({ doctor_id: '', date: '', time: '' });
            fetchAppointments();
            alert('Appointment booked successfully!');
        } catch (error) {
            alert('Error booking appointment: ' + (error.response?.data?.detail || 'Unknown error'));
        }
    };

    const handleCancelAppointment = async (id) => {
        if (confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await axios.delete(`/patient/appointments/${id}`);
                fetchAppointments();
                alert('Appointment cancelled successfully');
            } catch (error) {
                alert('Error cancelling appointment');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1">
                <Topbar title="Patient Dashboard" />

                <div className="p-8">
                    {/* Book Appointment Button */}
                    <div className="mb-8">
                        <button
                            onClick={() => setShowBookingModal(true)}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                        >
                            <Calendar className="inline mr-2" size={20} />
                            Book New Appointment
                        </button>
                    </div>

                    {/* Appointments Table */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800">My Appointments</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Token</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Doctor</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Specialization</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Time</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {appointments.map((apt) => (
                                        <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-blue-600">#{apt.token_number}</span>
                                            </td>
                                            <td className="px-6 py-4 font-medium">{apt.doctor.user.name}</td>
                                            <td className="px-6 py-4 text-gray-600">{apt.doctor.specialization}</td>
                                            <td className="px-6 py-4">{apt.date}</td>
                                            <td className="px-6 py-4">{apt.time}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(apt.status)}`}>
                                                    {apt.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {apt.status === 'scheduled' && (
                                                    <button
                                                        onClick={() => handleCancelAppointment(apt.id)}
                                                        className="text-red-600 hover:text-red-800 font-medium"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Book Appointment</h3>
                            <button onClick={() => setShowBookingModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleBookAppointment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Select Doctor</label>
                                <select
                                    value={bookingData.doctor_id}
                                    onChange={(e) => setBookingData({ ...bookingData, doctor_id: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Choose a doctor...</option>
                                    {doctors.map((doc) => (
                                        <option key={doc.id} value={doc.id}>
                                            {doc.user.name} - {doc.specialization}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                                <input
                                    type="date"
                                    value={bookingData.date}
                                    onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                                <input
                                    type="time"
                                    value={bookingData.time}
                                    onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                            >
                                Book Appointment
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <ChatbotWidget />
        </div>
    );
}
