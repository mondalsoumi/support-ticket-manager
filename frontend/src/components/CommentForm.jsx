import { useState } from 'react';
import API from '../api/axios';

const CommentForm = ({ ticketId, onCommentAdded }) => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setError('');
        setLoading(true);

        try {
            const res = await API.post(`/tickets/${ticketId}/comments`, { message });
            onCommentAdded(res.data);
            setMessage('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add comment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <div className="flex gap-2">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Posting...' : 'Post'}
                </button>
            </div>
        </form>
    );
};

export default CommentForm;