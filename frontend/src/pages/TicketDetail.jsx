import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';

const TicketDetail = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ticketRes, commentsRes] = await Promise.all([
                    API.get(`/tickets/${id}`),
                    API.get(`/tickets/${id}/comments`)
                ]);
                setTicket(ticketRes.data);
                setComments(commentsRes.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load ticket');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleCommentAdded = (newComment) => {
        setComments((prev) => [...prev, newComment]); // add to end — chronological order
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

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-2xl mx-auto px-6">
                <Link to="/dashboard" className="text-sm text-blue-600 hover:underline">
                    ← Back to dashboard
                </Link>

                <div className="bg-white p-6 rounded shadow mt-4">
                    <h1 className="text-xl font-bold mb-2">{ticket.title}</h1>

                    <div className="flex gap-2 mb-4">
                        <StatusBadge status={ticket.status} />
                        <PriorityBadge priority={ticket.priority} />
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {ticket.category}
                        </span>
                    </div>

                    <p className="text-gray-700 mb-4">{ticket.description}</p>

                    {ticket.aiSuggestedReply && (
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-4">
                            <h3 className="text-sm font-semibold text-blue-800 mb-1">
                                AI suggested reply
                            </h3>
                            <p className="text-sm text-blue-900">{ticket.aiSuggestedReply}</p>
                        </div>
                    )}

                    <p className="text-xs text-gray-400">
                        Submitted by {ticket.createdBy?.name} on{' '}
                        {new Date(ticket.createdAt).toLocaleString()}
                    </p>
                </div>

                <div className="bg-white p-6 rounded shadow mt-4">
                    <h2 className="text-lg font-semibold mb-3">Comments</h2>
                    <CommentList comments={comments} />
                    <CommentForm ticketId={id} onCommentAdded={handleCommentAdded} />
                </div>
            </div>
        </div>
    );
};

export default TicketDetail;