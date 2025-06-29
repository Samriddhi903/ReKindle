import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function Navbar() {
  const { loggedIn, logout } = useAuth();
  
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-pastel-mint/80 shadow-md fixed top-0 left-0 z-20">
      <span className="text-2xl font-extrabold text-blue-900 tracking-wide">ReKindle</span>
      <div className="flex gap-6">
        <Link to="/" className="text-lg font-semibold text-blue-900 hover:underline focus:outline-none focus:ring-2 focus:ring-pastel-blue rounded">Home</Link>
        <Link to="/games" className="text-lg font-semibold text-blue-900 hover:underline focus:outline-none focus:ring-2 focus:ring-pastel-blue rounded">Games</Link>
        <Link to="/community" className="text-lg font-semibold text-blue-900 hover:underline focus:outline-none focus:ring-2 focus:ring-pastel-blue rounded">Community</Link>
        <Link to="/reminders" className="text-lg font-semibold text-blue-900 hover:underline focus:outline-none focus:ring-2 focus:ring-pastel-blue rounded">Reminders</Link>
        {loggedIn ? (
          <button 
            onClick={logout}
            className="text-lg font-semibold text-blue-900 hover:underline focus:outline-none focus:ring-2 focus:ring-pastel-blue rounded"
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="text-lg font-semibold text-blue-900 hover:underline focus:outline-none focus:ring-2 focus:ring-pastel-blue rounded">Login</Link>
        )}
      </div>
    </nav>
  );
} 