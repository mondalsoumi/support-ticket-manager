import { Link } from 'react-router-dom';
import PriorityBadge from './PriorityBadge';

const statusOptions = ['open', 'in-progress', 'resolved', 'closed'];

const AdminTable = ({ tickets, onStatusChange }) => {
    if (tickets.length === 0) {
        return <p className="text-gray-400">No tickets found.</p>;
    }

    return (
        <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left text-gray-500">
                    <tr>
                        <th className="px-4 py-3">Title</th>
                        <th className="px-4 py-3">Created by</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Priority</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket) => (
                        <tr key={ticket._id} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-3">
                                <Link to={`/tickets/${ticket._id}`} className="text-blue-600 hover:underline">
                                    {ticket.title}
                                </Link>
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                                {ticket.createdBy?.name || 'Unknown'}
                            </td>
                            <td className="px-4 py-3">
                                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                    {ticket.category}
                                </span>
                            </td>
                            <td className="px-4 py-3">
                                <PriorityBadge priority={ticket.priority} />
                            </td>
                            <td className="px-4 py-3">
                                <select
                                    value={ticket.status}
                                    onChange={(e) => onStatusChange(ticket._id, e.target.value)}
                                    className="border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                                >
                                    {statusOptions.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </td>
                            <td className="px-4 py-3 text-gray-400 text-xs">
                                {new Date(ticket.createdAt).toLocaleDateString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminTable;