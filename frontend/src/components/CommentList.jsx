const CommentList = ({ comments }) => {
    if (comments.length === 0) {
        return <p className="text-gray-400 text-sm">No comments yet.</p>;
    }

    return (
        <div className="space-y-3">
            {comments.map((comment) => (
                <div key={comment._id} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-800">
                            {comment.author?.name || 'Unknown'}
                        </span>
                        <span className="text-xs text-gray-400">
                            {new Date(comment.createdAt).toLocaleString()}
                        </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.message}</p>
                </div>
            ))}
        </div>
    );
};

export default CommentList;