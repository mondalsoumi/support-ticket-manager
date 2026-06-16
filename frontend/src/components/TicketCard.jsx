import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

const TicketCard = ({ ticket }) => {
    return (
        <Link
            to={`/tickets/${ticket._id}`}
            className="block bg-white p-4 rounded shadow hover:shadow-md transition mb-3"
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{ticket.title}</h3>
                <span className="text-xs text-gray-400">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                </span>
            </div>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {ticket.description}
            </p>

            <div className="flex gap-2">
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {ticket.category}
                </span>
            </div>
        </Link>
    );
};

export default TicketCard;