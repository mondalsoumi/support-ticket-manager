import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: email, 2: answer, 3: new password
    const [email, setEmail] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Step 1 → fetch security question for this email
    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await API.get(`/auth/security-question?email=${encodeURIComponent(email)}`);
            setSecurityQuestion(res.data.securityQuestion);
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    // Step 2 → verify the answer, get a reset token
    const handleAnswerSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await API.post('/auth/verify-security-answer', { email, securityAnswer });
            setResetToken(res.data.resetToken);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.message || 'Incorrect answer');
        } finally {
            setLoading(false);
        }
    };

    // Step 3 → set the new password
    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await API.post('/auth/reset-password', { resetToken, newPassword });
            setSuccess('Password reset successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6">Reset password</h1>

                {error && (
                    <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-4">{error}</div>
                )}
                {success && (
                    <div className="bg-green-100 text-green-700 text-sm p-2 rounded mb-4">{success}</div>
                )}

                {step === 1 && (
                    <form onSubmit={handleEmailSubmit}>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Checking...' : 'Continue'}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleAnswerSubmit}>
                        <p className="text-sm font-medium mb-2">{securityQuestion}</p>
                        <input
                            type="text"
                            value={securityAnswer}
                            onChange={(e) => setSecurityAnswer(e.target.value)}
                            required
                            placeholder="Your answer"
                            className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify answer'}
                        </button>
                    </form>
                )}

                {step === 3 && !success && (
                    <form onSubmit={handlePasswordReset}>
                        <label className="block text-sm font-medium mb-1">New password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            minLength={6}
                            autoComplete="new-password"
                            className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Resetting...' : 'Reset password'}
                        </button>
                    </form>
                )}

                <p className="text-sm text-gray-500 mt-4 text-center">
                    <Link to="/login" className="text-blue-600 hover:underline">Back to login</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;