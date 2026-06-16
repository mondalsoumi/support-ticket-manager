import { useState, useEffect } from 'react';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import MetricCard from '../components/MetricCard';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#3B82F6', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6'];

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        try {
            const res = await API.get('/analytics/summary');
            setData(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <p className="text-center text-gray-500 mt-10">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Navbar />
                <p className="text-center text-red-500 mt-10">{error}</p>
            </div>
        );
    }

    // Transform backend's [{_id: 'billing', count: 2}, ...] into [{name: 'billing', count: 2}, ...]
    // Recharts expects a "name" key for axis labels and pie segments
    const categoryData = data.byCategory.map((item) => ({
        name: item._id,
        count: item.count
    }));

    const priorityData = data.byPriority.map((item) => ({
        name: item._id,
        count: item.count
    }));

    const openCount = data.byStatus.find((s) => s._id === 'open')?.count || 0;
    const resolvedCount = data.byStatus.find((s) => s._id === 'resolved')?.count || 0;

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-4xl mx-auto px-6">
                <h1 className="text-2xl font-bold mb-1">Analytics</h1>
                <p className="text-sm text-gray-500 mb-6">Overview of all support tickets</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <MetricCard label="Total tickets" value={data.total} />
                    <MetricCard label="Last 7 days" value={data.recentCount} />
                    <MetricCard label="Open" value={openCount} />
                    <MetricCard label="Resolved" value={resolvedCount} />
                </div>

                <div className="bg-white rounded shadow p-4 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Tickets by category</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={categoryData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded shadow p-4 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Priority split</h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={priorityData}
                                dataKey="count"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                            >
                                {priorityData.map((entry, index) => (
                                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;