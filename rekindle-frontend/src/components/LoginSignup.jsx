import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function LoginSignup() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log('Attempting signup with:', { email, password });
      const res = await fetch('https://rekindle-zyhh.onrender.com/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('Signup response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('Signup successful:', data);
        localStorage.setItem('tempUserId', data.userId);
        navigate('/details');
      } else {
        const data = await res.json();
        console.log('Signup error:', data);
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup network error:', err);
      setError('Network error. Please check your connection and ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log('Attempting login with:', { email, password });
      const res = await fetch('https://rekindle-zyhh.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('Login response status:', res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log('Login successful:', data);
        login(data.token, data.userId);
        navigate('/games');
      } else {
        const data = await res.json();
        console.log('Login error:', data);
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login network error:', err);
      setError('Network error. Please check your connection and ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto bg-white/80 rounded-3xl shadow-2xl overflow-hidden flex min-h-[600px]">
      {/* Form Section */}
      <div className="w-1/2 flex flex-col justify-center items-center p-8">
        {isSignUp ? (
          <form onSubmit={handleSignUp} className="flex flex-col gap-4 w-full">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Create Account</h1>
            <div className="flex gap-2 justify-center mb-2">
              <button type="button" className="bg-white rounded-full p-2 shadow text-blue-900"><i className="fab fa-facebook-f"></i></button>
              <button type="button" className="bg-white rounded-full p-2 shadow text-blue-900"><i className="fab fa-google-plus-g"></i></button>
              <button type="button" className="bg-white rounded-full p-2 shadow text-blue-900"><i className="fab fa-linkedin-in"></i></button>
            </div>
            <span className="text-blue-900 text-sm">or use your email for registration</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="rounded px-4 py-2 border focus:ring-2 focus:ring-pastel-blue"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="rounded px-4 py-2 border focus:ring-2 focus:ring-pastel-blue"
              required
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button 
              type="submit"
              disabled={loading}
              className="mt-2 bg-pastel-lavender text-blue-900 font-bold py-2 rounded shadow hover:bg-pastel-pink transition disabled:opacity-50"
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignIn} className="flex flex-col gap-4 w-full">
            <h1 className="text-3xl font-bold text-blue-900 mb-2">Sign In</h1>
            <div className="flex gap-2 justify-center mb-2">
              <button type="button" className="bg-white rounded-full p-2 shadow text-blue-900"><i className="fab fa-facebook-f"></i></button>
              <button type="button" className="bg-white rounded-full p-2 shadow text-blue-900"><i className="fab fa-google-plus-g"></i></button>
              <button type="button" className="bg-white rounded-full p-2 shadow text-blue-900"><i className="fab fa-linkedin-in"></i></button>
            </div>
            <span className="text-blue-900 text-sm">or use your account</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="rounded px-4 py-2 border focus:ring-2 focus:ring-pastel-blue"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="rounded px-4 py-2 border focus:ring-2 focus:ring-pastel-blue"
              required
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <a href="#" className="text-xs text-blue-900 hover:underline">Forgot your password?</a>
            <button 
              type="submit"
              disabled={loading}
              className="mt-2 bg-pastel-mint text-blue-900 font-bold py-2 rounded shadow hover:bg-pastel-blue transition disabled:opacity-50"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        )}
      </div>
      {/* Overlay Section */}
      <div className="w-1/2 flex flex-col items-center justify-center p-8 bg-pastel-mint/80">
        {isSignUp ? (
          <>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Welcome Back!</h2>
            <p className="text-blue-900 mb-4">To keep connected with us please login with your personal info</p>
            <button className="ghost bg-white/70 border border-blue-900 text-blue-900 px-6 py-2 rounded-full font-bold shadow hover:bg-pastel-blue" onClick={() => setIsSignUp(false)}>Sign In</button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Hello, Friend!</h2>
            <p className="text-blue-900 mb-4">Enter your personal details and start your journey with us</p>
            <button className="ghost bg-white/70 border border-blue-900 text-blue-900 px-6 py-2 rounded-full font-bold shadow hover:bg-pastel-mint" onClick={() => setIsSignUp(true)}>Sign Up</button>
          </>
        )}
      </div>
    </div>
  );
} 