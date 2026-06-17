import { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import AdminTable from '../components/AdminTable';

const Admin = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await API.get('/tickets/all');
            setTickets(res.data);
        } catch (err) {
            setError('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            const res = await API.patch(`/tickets/${ticketId}`, { status: newStatus });
            setTickets((prev) =>
                prev.map((t) => (t._id === ticketId ? res.data : t))
            );
        } catch (err) {
            alert('Failed to update status');
        }
    };

    const filteredTickets = tickets.filter((t) => {
        const statusMatch = statusFilter === 'all' || t.status === statusFilter;
        const categoryMatch = categoryFilter === 'all' || t.category === categoryFilter;
        return statusMatch && categoryMatch;
    });

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-5xl mx-auto px-6">
                <h1 className="text-2xl font-bold mb-1">Admin panel</h1>
                <p className="text-sm text-gray-500 mb-6">All support tickets</p>

                <div className="flex gap-3 mb-4">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="all">All status</option>
                        <option value="open">Open</option>
                        <option value="in-progress">In progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="all">All categories</option>
                        <option value="billing">Billing</option>
                        <option value="technical">Technical</option>
                        <option value="general">General</option>
                        <option value="complaint">Complaint</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {loading && <p className="text-gray-500">Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && (
                    <AdminTable tickets={filteredTickets} onStatusChange={handleStatusChange} />
                )}
            </div>
        </div>
    );
};

export default Admin;