const MetricCard = ({ label, value }) => {
    return (
        <div className="bg-white rounded shadow p-4">
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
};

export default MetricCard;