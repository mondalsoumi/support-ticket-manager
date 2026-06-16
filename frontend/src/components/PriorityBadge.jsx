const priorityStyles = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-orange-100 text-orange-800',
    high: 'bg-red-100 text-red-800',
    urgent: 'bg-red-200 text-red-900',
};

const PriorityBadge = ({ priority }) => {
    return (
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityStyles[priority] || 'bg-gray-100 text-gray-800'}`}>
            {priority}
        </span>
    );
};

export default PriorityBadge;