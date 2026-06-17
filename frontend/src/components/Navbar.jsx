import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <nav className="bg-white shadow mb-6">
            <div className="w-full px-6 py-3 flex justify-between items-center">
                <Link to="/dashboard" className="text-lg font-bold text-blue-900">
                    Support Tickets
                </Link>

                <div className="flex items-center gap-6">
                    {user.role === 'admin' && (
                        <>
                            <Link to="/admin" className="text-sm text-gray-600 hover:text-blue-600">
                                Admin
                            </Link>
                            <Link to="/admin/analytics" className="text-sm text-gray-600 hover:text-blue-600">
                                Analytics
                            </Link>
                        </>
                    )}
                    <span className="text-sm text-gray-500">{user.name}</span>
                    <button
                        onClick={logout}
                        className="bg-red-500 text-white text-sm px-3 py-1.5 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;