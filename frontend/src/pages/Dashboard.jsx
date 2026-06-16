import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import TicketForm from '../components/TicketForm';
import TicketCard from '../components/TicketCard';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await API.get('/tickets');
            setTickets(res.data);
        } catch (err) {
            setError('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleTicketCreated = (newTicket) => {
        setTickets((prev) => [newTicket, ...prev]); // add to top of list
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-2xl mx-auto px-6">
                <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
                <p className="text-sm text-gray-500 mb-6">
                    Welcome, {user?.name} ({user?.role})
                </p>

                <TicketForm onTicketCreated={handleTicketCreated} />

                <h2 className="text-lg font-semibold mb-3">Your tickets</h2>

                {loading && <p className="text-gray-500">Loading tickets...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {!loading && tickets.length === 0 && (
                    <p className="text-gray-400">No tickets yet. Submit your first one above.</p>
                )}

                {tickets.map((ticket) => (
                    <TicketCard key={ticket._id} ticket={ticket} />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;