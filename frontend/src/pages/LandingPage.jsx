import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 flex flex-col">

            {/* Navbar */}
            <nav className="px-8 py-5 border-b border-blue-100 bg-white/80 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                        SupportDesk
                    </span>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/login"
                            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-md shadow-blue-200"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex-1 flex items-center justify-center px-6">
                <div className="max-w-4xl text-center">



                    <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight mb-6">
                        Support tickets
                        <br />
                        <span className="text-blue-600">
                            handled intelligently
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
                        Automate ticket classification, priority assignment,
                        and response drafting using Google Gemini AI.
                        Let your support team focus on solving issues,
                        not sorting them.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/register"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition shadow-lg shadow-blue-200"
                        >
                            Start Free
                        </Link>

                        <Link
                            to="/login"
                            className="border border-slate-300 hover:border-blue-300 hover:text-blue-600 px-8 py-4 rounded-xl font-semibold text-slate-700 transition"
                        >
                            Sign In
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
                        <div>
                            <h3 className="text-3xl font-bold text-blue-600">
                                AI
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Powered Classification
                            </p>
                        </div>

                        <div>
                            <h3 className="text-3xl font-bold text-blue-600">
                                JWT
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Secure Authentication
                            </p>
                        </div>

                        <div>
                            <h3 className="text-3xl font-bold text-blue-600">
                                RBAC
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">
                                Role-Based Access
                            </p>
                        </div>
                    </div>

                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-blue-100 bg-white">
                <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">

                    <p className="text-sm text-slate-500">
                        Built with React, Node.js, MongoDB Atlas, JWT and Google Gemini AI
                    </p>

                    <a
                        href="https://github.com/mondalsoumi/support-ticket-manager"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
                    >
                        View Source Code →
                    </a>

                </div>
            </footer>

        </div>
    );
};

export default LandingPage;