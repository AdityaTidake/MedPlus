import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import axios from '../../api/axios';
import { X, Plus, Trash2 } from 'lucide-react';

export default function DoctorDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [prescriptionData, setPrescriptionData] = useState({
        notes: '',
        items: [{ medicine_name: '', dosage: '', frequency: '', duration: '' }]
    });

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('/doctor/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const handleCompleteAppointment = async (id) => {
        try {
            await axios.put(`/doctor/appointments/${id}/complete`);
            fetchAppointments();
            alert('Appointment marked as completed');
        } catch (error) {
            alert('Error completing appointment');
        }
    };

    const openPrescriptionModal = (appointment) => {
        setSelectedAppointment(appointment);
        setShowPrescriptionModal(true);
    };

    const addMedicineRow = () => {
        setPrescriptionData({
            ...prescriptionData,
            items: [...prescriptionData.items, { medicine_name: '', dosage: '', frequency: '', duration: '' }]
        });
    };

    const removeMedicineRow = (index) => {
        const newItems = prescriptionData.items.filter((_, i) => i !== index);
        setPrescriptionData({ ...prescriptionData, items: newItems });
    };

    const updateMedicineItem = (index, field, value) => {
        const newItems = [...prescriptionData.items];
        newItems[index][field] = value;
        setPrescriptionData({ ...prescriptionData, items: newItems });
    };

    const handleCreatePrescription = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/doctor/prescriptions', {
                appointment_id: selectedAppointment.id,
                notes: prescriptionData.notes,
                items: prescriptionData.items
            });
            setShowPrescriptionModal(false);
            setPrescriptionData({ notes: '', items: [{ medicine_name: '', dosage: '', frequency: '', duration: '' }] });
            fetchAppointments();
            alert('Prescription created successfully!');
        } catch (error) {
            alert('Error creating prescription: ' + (error.response?.data?.detail || 'Unknown error'));
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1">
                <Topbar title="Doctor Dashboard" />

                <div className="p-8">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800">Today's Appointment Queue</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Token</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Patient</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Time</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {appointments.map((apt) => (
                                        <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold">
                                                    {apt.token_number}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium">Patient #{apt.patient_id}</td>
                                            <td className="px-6 py-4">{apt.time}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                                    {apt.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openPrescriptionModal(apt)}
                                                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                                                    >
                                                        Create Prescription
                                                    </button>
                                                    <button
                                                        onClick={() => handleCompleteAppointment(apt.id)}
                                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all"
                                                    >
                                                        Complete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Prescription Modal */}
            {showPrescriptionModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-3xl w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Create Prescription</h3>
                            <button onClick={() => setShowPrescriptionModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreatePrescription} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                                <textarea
                                    value={prescriptionData.notes}
                                    onChange={(e) => setPrescriptionData({ ...prescriptionData, notes: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows="3"
                                    placeholder="Add prescription notes..."
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-sm font-semibold text-gray-700">Medicines</label>
                                    <button
                                        type="button"
                                        onClick={addMedicineRow}
                                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        <Plus size={20} />
                                        Add Medicine
                                    </button>
                                </div>

                                {prescriptionData.items.map((item, index) => (
                                    <div key={index} className="grid grid-cols-4 gap-3 mb-3 p-4 bg-gray-50 rounded-xl">
                                        <input
                                            type="text"
                                            placeholder="Medicine Name"
                                            value={item.medicine_name}
                                            onChange={(e) => updateMedicineItem(index, 'medicine_name', e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Dosage"
                                            value={item.dosage}
                                            onChange={(e) => updateMedicineItem(index, 'dosage', e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        <input
                                            type="text"
                                            placeholder="Frequency"
                                            value={item.frequency}
                                            onChange={(e) => updateMedicineItem(index, 'frequency', e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Duration"
                                                value={item.duration}
                                                onChange={(e) => updateMedicineItem(index, 'duration', e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                required
                                            />
                                            {prescriptionData.items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeMedicineRow(index)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                            >
                                Create Prescription & Send to Pharmacy
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
