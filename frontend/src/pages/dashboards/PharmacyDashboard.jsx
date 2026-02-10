import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import axios from '../../api/axios';
import { Pill, DollarSign, X } from 'lucide-react';

export default function PharmacyDashboard() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [showDispenseModal, setShowDispenseModal] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [totalAmount, setTotalAmount] = useState('');

    useEffect(() => {
        fetchPrescriptions();
    }, []);

    const fetchPrescriptions = async () => {
        try {
            const response = await axios.get('/pharmacy/prescriptions');
            setPrescriptions(response.data);
        } catch (error) {
            console.error('Error fetching prescriptions:', error);
        }
    };

    const openDispenseModal = (prescription) => {
        setSelectedPrescription(prescription);
        setShowDispenseModal(true);
    };

    const handleDispense = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/pharmacy/dispense', {
                prescription_id: selectedPrescription.id,
                total_amount: parseFloat(totalAmount),
                payment_status: 'paid'
            });
            setShowDispenseModal(false);
            setTotalAmount('');
            fetchPrescriptions();
            alert('Prescription dispensed successfully!');
        } catch (error) {
            alert('Error dispensing prescription: ' + (error.response?.data?.detail || 'Unknown error'));
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1">
                <Topbar title="Pharmacy Dashboard" />

                <div className="p-8">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-xl font-bold text-gray-800">Pending Prescriptions</h3>
                        </div>
                        <div className="p-6 space-y-6">
                            {prescriptions.map((prescription) => (
                                <div key={prescription.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="text-lg font-bold text-gray-800">Prescription #{prescription.id}</h4>
                                            <p className="text-sm text-gray-600">Patient ID: {prescription.patient_id}</p>
                                            <p className="text-sm text-gray-600">Doctor ID: {prescription.doctor_id}</p>
                                        </div>
                                        <button
                                            onClick={() => openDispenseModal(prescription)}
                                            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                                        >
                                            <Pill className="inline mr-2" size={20} />
                                            Dispense
                                        </button>
                                    </div>

                                    {prescription.notes && (
                                        <div className="mb-4 p-4 bg-blue-50 rounded-xl">
                                            <p className="text-sm font-semibold text-gray-700 mb-1">Notes:</p>
                                            <p className="text-sm text-gray-600">{prescription.notes}</p>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        <p className="text-sm font-semibold text-gray-700">Medicines:</p>
                                        {prescription.items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-xl">
                                                    <Pill size={24} />
                                                </div>
                                                <div className="flex-1 grid grid-cols-4 gap-4">
                                                    <div>
                                                        <p className="text-xs text-gray-500">Medicine</p>
                                                        <p className="font-semibold text-gray-800">{item.medicine_name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Dosage</p>
                                                        <p className="font-semibold text-gray-800">{item.dosage}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Frequency</p>
                                                        <p className="font-semibold text-gray-800">{item.frequency}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500">Duration</p>
                                                        <p className="font-semibold text-gray-800">{item.duration}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Dispense Modal */}
            {showDispenseModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Dispense Prescription</h3>
                            <button onClick={() => setShowDispenseModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                            <p className="text-sm text-gray-600 mb-2">Prescription ID: #{selectedPrescription?.id}</p>
                            <p className="text-sm text-gray-600">Total Medicines: {selectedPrescription?.items.length}</p>
                        </div>

                        <form onSubmit={handleDispense} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <DollarSign className="inline" size={16} />
                                    Total Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={totalAmount}
                                    onChange={(e) => setTotalAmount(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Enter total bill amount"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                            >
                                Dispense & Generate Bill
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
