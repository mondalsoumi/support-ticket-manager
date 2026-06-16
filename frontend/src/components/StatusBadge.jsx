const statusStyles = {
    open: 'bg-yellow-100 text-yellow-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
};

const StatusBadge = ({ status }) => {
    return (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

export default StatusBadge;