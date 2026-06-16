import { useState } from 'react';
import API from '../api/axios';

const TicketForm = ({ onTicketCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await API.post('/tickets', { title, description });
            onTicketCreated(res.data);  // tell parent a new ticket was created
            setTitle('');
            setDescription('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create ticket');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Submit a new ticket</h2>

            {error && (
                <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-3">
                    {error}
                </div>
            )}

            <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Short summary of your issue"
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Describe your issue in detail"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? 'Submitting...' : 'Submit ticket'}
            </button>
        </form>
    );
};

export default TicketForm;