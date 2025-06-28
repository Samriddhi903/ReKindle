import '@fontsource/lexend';
import '@fontsource/opendyslexic';
import './App.css';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import hi from './assets/hi.png';
import eat from './assets/eat.png';
import hello from './assets/hello.png';
import confused from './assets/confused.png';
import sandwich from './assets/sandwich.png';
import happyCat from './assets/happy cat.png';
import sadCat from './assets/sad cat.png';
import correctSticker from './assets/correct.png';
import wrongSticker from './assets/wrong.png';
import { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import familyPlaceholder from './assets/background.jpg'; // Main image
import readFallback from './assets/read.png'; // Fallback image
import completePicFallback from './assets/completepic.png'; // Final fallback image
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { PageLayout } from './components/PageLayout';
import { Home } from './components/Home';
import { Games } from './components/Games';
import { Community } from './components/Community';
import { LoginSignup } from './components/LoginSignup';
import { Details } from './components/Details';
import { MakeCatHappyGame } from './components/MakeCatHappyGame';
import { CompleteFamilyPictureGame } from './components/CompleteFamilyPictureGame';
import { Doodle } from './components/Doodle';

// Auth context for login state
const AuthContext = createContext();
function useAuth() { return useContext(AuthContext); }

function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem('loggedIn') === 'true');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');

  useEffect(() => {
    const handler = () => {
      setLoggedIn(localStorage.getItem('loggedIn') === 'true');
      setToken(localStorage.getItem('token') || '');
      setUserId(localStorage.getItem('userId') || '');
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const login = (token, userId) => {
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    setLoggedIn(true);
    setToken(token);
    setUserId(userId);
  };
  const logout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setLoggedIn(false);
    setToken('');
    setUserId('');
  };

  return (
    <AuthContext.Provider value={{ loggedIn, login, logout, token, userId }}>
      {children}
    </AuthContext.Provider>
  );
}

// Fisher-Yates shuffle utility
function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Open Doodles SVG (public domain)
const Doodle = () => (
  <svg width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <ellipse cx="110" cy="110" rx="100" ry="90" fill="#B3E5FC"/>
    <ellipse cx="110" cy="120" rx="80" ry="70" fill="#FFD1C1"/>
    <ellipse cx="110" cy="130" rx="60" ry="50" fill="#E1CFFF"/>
    <ellipse cx="110" cy="140" rx="40" ry="30" fill="#C1FFD7"/>
    <circle cx="110" cy="110" r="30" fill="#FFF9C1"/>
    <circle cx="120" cy="105" r="5" fill="#FFC1E3"/>
    <circle cx="100" cy="105" r="5" fill="#FFC1E3"/>
    <ellipse cx="110" cy="120" rx="10" ry="5" fill="#FFC1E3"/>
  </svg>
);

function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-pastel-mint/80 shadow-md fixed top-0 left-0 z-20">
      <span className="text-2xl font-extrabold text-blue-900 tracking-wide">ReKindle</span>
      <div className="flex gap-6">
        <Link to="/" className="text-lg font-semibold text-blue-900 hover:underline focus:outline-none focus:ring-2 focus:ring-pastel-blue rounded">Home</Link>
        <Link to="/games" className="text-lg font-semibold text-blue-900 hover:underline focus:outline-none focus:ring-2 focus:ring-pastel-blue rounded">Games</Link>
        <Link to="/community" className="text-lg font-semibold text-blue-900 hover:underline focus:outline-none focus:ring-2 focus:ring-pastel-blue rounded">Community</Link>
        <Link to="/login" className="text-lg font-semibold text-blue-900 hover:underline focus:outline-none focus:ring-2 focus:ring-pastel-blue rounded">Login</Link>
      </div>
    </nav>
  );
}

function PageLayout({ children, sticker }) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center font-lexend text-blue-900 relative overflow-hidden pt-24">
      <Navbar />
      {sticker && (
        <img src={sticker} alt="" className="max-w-[30vw] w-60 md:w-96 absolute bottom-0 right-0 mb-4 mr-[-10px] drop-shadow-2xl pointer-events-none select-none" aria-hidden="true" />
      )}
      <div className="z-10 w-full flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

function Home() {
  return (
    <>
      <motion.h1 initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 8, delay: 0.1 }} className="text-5xl md:text-6xl font-extrabold mb-6 text-blue-900 drop-shadow-[0_4px_24px_rgba(30,64,175,0.3)] text-center">Welcome to ReKindle</motion.h1>
      <p className="text-2xl md:text-3xl mb-10 max-w-xl text-center font-opendyslexic text-blue-900">A warm, friendly space for memory, connection, and joy. Designed for everyone, especially those with ADHD, dementia, dyslexia, and Alzheimer's.</p>
      <div className="flex flex-col md:flex-row gap-6">
        <button className="bg-pastel-mint hover:bg-pastel-blue transition-colors text-2xl rounded-full px-8 py-4 font-bold shadow-lg focus:outline-none focus:ring-4 focus:ring-pastel-lavender text-blue-900">Get Started</button>
        <button className="bg-pastel-lavender hover:bg-pastel-pink transition-colors text-2xl rounded-full px-8 py-4 font-bold shadow-lg focus:outline-none focus:ring-4 focus:ring-pastel-mint text-blue-900">Learn More</button>
      </div>
    </>
  );
}

function Games() {
  const navigate = useNavigate();
  return (
    <>
      <motion.h1 initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 8, delay: 0.1 }} className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-900 text-center">Games</motion.h1>
      <p className="text-xl md:text-2xl mb-10 max-w-xl text-center font-opendyslexic text-blue-900">Personalized memory-assistive games will appear here!</p>
      <div className="flex flex-wrap gap-8 justify-center">
        <button
          onClick={() => navigate('/make-cat-happy')}
          className="flex flex-col items-center bg-white/80 hover:bg-pastel-mint/60 transition rounded-2xl shadow-lg px-8 py-6 w-64 focus:outline-none focus:ring-4 focus:ring-pastel-blue"
        >
          <img src={happyCat} alt="Happy Cat" className="w-20 h-20 mb-4" />
          <span className="text-2xl font-bold text-blue-900 mb-2">Make Cat Happy</span>
          <span className="text-blue-900 text-lg">Click the happy cat to make it happier!</span>
        </button>
        <button
          onClick={() => navigate('/complete-family-picture')}
          className="flex flex-col items-center bg-white/80 hover:bg-pastel-mint/60 transition rounded-2xl shadow-lg px-8 py-6 w-64 focus:outline-none focus:ring-4 focus:ring-pastel-blue"
        >
          <img src={familyPlaceholder} alt="Family" className="w-20 h-20 mb-4 object-cover rounded-lg" />
          <span className="text-2xl font-bold text-blue-900 mb-2">Complete the Family Picture</span>
          <span className="text-blue-900 text-lg">Rearrange the pieces to complete your family photo!</span>
        </button>
        {/* Add more game cards here in the future */}
      </div>
    </>
  );
}

function Community() {
  // Simulate login state (replace with real auth later)
  const [loggedIn, setLoggedIn] = useState(false);
  const roles = ["Patient", "Guardian", "Care-taker"];
  const pastelTabColors = ["bg-pastel-mint", "bg-pastel-lavender", "bg-pastel-pink"];
  const [activeTab, setActiveTab] = useState(0);
  // Each role has its own messages
  const [messagesByRole, setMessagesByRole] = useState([
    [
      { id: 1, user: 'Alice', text: 'Welcome to the ReKindle community!' },
      { id: 2, user: 'Bob', text: 'This app is so cheerful and helpful.' },
      { id: 3, user: 'Sam', text: 'My grandma loves the games here.' },
    ],
    [
      { id: 4, user: 'Guardian1', text: "Guardians unite! Let's support each other." },
      { id: 5, user: 'Guardian2', text: 'Tips for daily care are welcome.' },
    ],
    [
      { id: 6, user: 'Care-taker1', text: 'Care-takers, share your stories!' },
      { id: 7, user: 'Care-taker2', text: 'How do you keep patients engaged?' },
    ],
  ]);
  const [newMsg, setNewMsg] = useState("");

  const handlePost = (e) => {
    e.preventDefault();
    if (newMsg.trim()) {
      setMessagesByRole(msgs => msgs.map((arr, idx) => idx === activeTab ? [...arr, { id: Date.now(), user: 'You', text: newMsg }] : arr));
      setNewMsg("");
    }
  };

  return (
    <>
      <motion.h1 initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 8, delay: 0.1 }} className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-900 text-center">Community</motion.h1>
      <p className="text-xl md:text-2xl mb-6 max-w-xl text-center font-opendyslexic text-blue-900">Share, chat, and connect with others in the ReKindle community.</p>
      {/* Tabs */}
      <div className="flex justify-center mb-6 gap-2">
        {roles.map((role, idx) => (
          <button
            key={role}
            className={`px-6 py-2 rounded-t-2xl font-bold text-blue-900 text-lg shadow focus:outline-none focus:ring-2 focus:ring-pastel-blue transition-all border-b-4 ${activeTab === idx ? pastelTabColors[idx] + ' border-blue-900' : 'bg-white/70 border-transparent hover:bg-pastel-mint/40'}`}
            onClick={() => setActiveTab(idx)}
            aria-selected={activeTab === idx}
            tabIndex={0}
          >
            {role}
          </button>
        ))}
      </div>
      {/* Tab content */}
      {!loggedIn && (
        <div className="mb-4 text-center">
          <p className="text-blue-900 mb-2">Log in to post a new message.</p>
          <button className="bg-pastel-mint text-blue-900 font-bold py-2 px-6 rounded shadow hover:bg-pastel-blue transition" onClick={() => setLoggedIn(true)}>Simulate Log In</button>
        </div>
      )}
      {loggedIn && (
        <form onSubmit={handlePost} className="flex flex-col md:flex-row gap-4 items-center mb-6 w-full max-w-xl mx-auto">
          <input
            type="text"
            value={newMsg}
            onChange={e => setNewMsg(e.target.value)}
            placeholder={`Write a message as a ${roles[activeTab].toLowerCase()}...`}
            className="flex-1 rounded px-4 py-2 border focus:ring-2 focus:ring-pastel-blue"
            required
          />
          <button className="bg-pastel-lavender text-blue-900 font-bold py-2 px-6 rounded shadow hover:bg-pastel-pink transition">Post</button>
        </form>
      )}
      <div className="w-full max-w-xl mx-auto bg-white/70 rounded-xl shadow p-4 flex flex-col gap-3">
        {messagesByRole[activeTab].map(msg => (
          <div key={msg.id} className="p-3 rounded-lg bg-pastel-mint/40 text-blue-900">
            <span className="font-bold mr-2">{msg.user}:</span> {msg.text}
          </div>
        ))}
      </div>
    </>
  );
}

function Details() {
  const [submitted, setSubmitted] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientAbout, setPatientAbout] = useState('');
  const [patientDisease, setPatientDisease] = useState('');
  const [familyPhoto, setFamilyPhoto] = useState(null);
  const [guardians, setGuardians] = useState([
    { name: '', relationship: '', contact: '', photo: null }
  ]);
  const { userId, token } = useAuth();
  const navigate = useNavigate();

  const handleGuardianChange = (idx, e) => {
    const { name, value, files } = e.target;
    setGuardians(gs => gs.map((g, i) => i === idx ? { ...g, [name]: files ? files[0] : value } : g));
  };

  const addGuardian = () => {
    setGuardians(gs => [...gs, { name: '', relationship: '', contact: '', photo: null }]);
  };

  const removeGuardian = idx => {
    setGuardians(gs => gs.length > 1 ? gs.filter((_, i) => i !== idx) : gs);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('patientName', patientName);
    formData.append('patientAbout', patientAbout);
    formData.append('patientDisease', patientDisease);
    if (familyPhoto) formData.append('familyPhoto', familyPhoto);
    guardians.forEach((g, i) => {
      formData.append(`guardians[${i}][name]`, g.name);
      formData.append(`guardians[${i}][relationship]`, g.relationship);
      formData.append(`guardians[${i}][contact]`, g.contact);
      if (g.photo) formData.append(`guardians[${i}][photo]`, g.photo);
    });
    const res = await fetch('http://localhost:5000/api/details', {
      method: 'POST',
      body: formData,
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setSubmitted(true);
      navigate('/login');
    }
  };

  return (
    <>
      <motion.h1 initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 8, delay: 0.1 }} className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-900 text-center">Details & Input</motion.h1>
      <p className="text-xl md:text-2xl mb-8 max-w-xl text-center font-opendyslexic text-blue-900">Add patient, family, and guardian details. You can add multiple guardians.</p>
      {submitted ? (
        <div className="bg-pastel-mint/70 rounded-xl shadow p-8 text-center text-2xl font-bold text-blue-900 max-w-lg mx-auto">Thank you! Details submitted successfully.</div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white/80 rounded-2xl shadow-lg p-8 max-w-lg mx-auto w-full">
          <label className="flex flex-col text-lg font-bold text-blue-900">
            Patient Name
            <input
              type="text"
              name="patientName"
              value={patientName}
              onChange={e => setPatientName(e.target.value)}
              required
              className="mt-2 rounded-lg px-4 py-3 border-2 border-pastel-mint focus:ring-4 focus:ring-pastel-blue text-xl font-opendyslexic bg-pastel-mint/30"
            />
          </label>
          <label className="flex flex-col text-lg font-bold text-blue-900">
            About the Patient
            <textarea
              name="patientAbout"
              value={patientAbout}
              onChange={e => setPatientAbout(e.target.value)}
              required
              rows={3}
              className="mt-2 rounded-lg px-4 py-3 border-2 border-pastel-mint focus:ring-4 focus:ring-pastel-blue text-xl font-opendyslexic bg-pastel-mint/30"
            />
          </label>
          <label className="flex flex-col text-lg font-bold text-blue-900">
            Patient Disease
            <input
              type="text"
              name="patientDisease"
              value={patientDisease}
              onChange={e => setPatientDisease(e.target.value)}
              required
              className="mt-2 rounded-lg px-4 py-3 border-2 border-pastel-mint focus:ring-4 focus:ring-pastel-blue text-xl font-opendyslexic bg-pastel-mint/30"
            />
          </label>
          <label className="flex flex-col text-lg font-bold text-blue-900">
            Family Picture
            <input
              type="file"
              name="familyPhoto"
              accept="image/*"
              onChange={e => setFamilyPhoto(e.target.files[0])}
              className="mt-2 rounded-lg px-4 py-3 border-2 border-pastel-mint bg-pastel-mint/30 text-xl font-opendyslexic"
            />
          </label>
          {guardians.map((g, idx) => (
            <div key={idx} className="bg-pastel-mint/20 rounded-xl p-4 flex flex-col gap-4 relative">
              <button type="button" onClick={() => removeGuardian(idx)} className="absolute top-2 right-2 text-blue-900 text-xl font-bold bg-pastel-pink/70 rounded-full w-8 h-8 flex items-center justify-center hover:bg-pastel-pink">×</button>
              <label className="flex flex-col text-lg font-bold text-blue-900">
                Guardian Name
                <input
                  type="text"
                  name="name"
                  value={g.name}
                  onChange={e => handleGuardianChange(idx, e)}
                  required
                  className="mt-2 rounded-lg px-4 py-3 border-2 border-pastel-mint focus:ring-4 focus:ring-pastel-blue text-xl font-opendyslexic bg-white"
                />
              </label>
              <label className="flex flex-col text-lg font-bold text-blue-900">
                Relationship
                <input
                  type="text"
                  name="relationship"
                  value={g.relationship}
                  onChange={e => handleGuardianChange(idx, e)}
                  required
                  className="mt-2 rounded-lg px-4 py-3 border-2 border-pastel-mint focus:ring-4 focus:ring-pastel-blue text-xl font-opendyslexic bg-white"
                />
              </label>
              <label className="flex flex-col text-lg font-bold text-blue-900">
                Contact Info
                <input
                  type="text"
                  name="contact"
                  value={g.contact}
                  onChange={e => handleGuardianChange(idx, e)}
                  required
                  className="mt-2 rounded-lg px-4 py-3 border-2 border-pastel-mint focus:ring-4 focus:ring-pastel-blue text-xl font-opendyslexic bg-white"
                />
              </label>
              <label className="flex flex-col text-lg font-bold text-blue-900">
                Guardian Photo
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={e => handleGuardianChange(idx, e)}
                  className="mt-2 rounded-lg px-4 py-3 border-2 border-pastel-mint bg-white text-xl font-opendyslexic"
                />
              </label>
            </div>
          ))}
          <button type="button" onClick={addGuardian} className="bg-pastel-blue hover:bg-pastel-mint transition-colors text-xl rounded-full px-6 py-3 font-bold shadow focus:outline-none focus:ring-4 focus:ring-pastel-lavender text-blue-900">+ Add Guardian</button>
          <button type="submit" className="bg-pastel-mint hover:bg-pastel-blue transition-colors text-2xl rounded-full px-8 py-4 font-bold shadow-lg focus:outline-none focus:ring-4 focus:ring-pastel-lavender text-blue-900 mt-4">Submit</button>
        </form>
      )}
    </>
  );
}

function LoginSignup() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch('http://localhost:5000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      navigate('/details');
    } else {
      const data = await res.json();
      setError(data.error || 'Signup failed');
    }
  };
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data = await res.json();
      login(data.token, JSON.parse(atob(data.token.split('.')[1])).userId);
      navigate('/games');
    } else {
      const data = await res.json();
      setError(data.error || 'Login failed');
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
            <input type="text" placeholder="Name" className="rounded px-4 py-2 border focus:ring-2 focus:ring-pastel-blue" required />
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
            <button className="mt-2 bg-pastel-lavender text-blue-900 font-bold py-2 rounded shadow hover:bg-pastel-pink transition">Sign Up</button>
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
            <a href="#" className="text-xs text-blue-900 hover:underline">Forgot your password?</a>
            <button className="mt-2 bg-pastel-mint text-blue-900 font-bold py-2 rounded shadow hover:bg-pastel-blue transition">Sign In</button>
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

function MakeCatHappyGame() {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [catType, setCatType] = useState('happy'); // 'happy' or 'sad'
  const [position, setPosition] = useState({ top: 200, left: 200 });
  const [intervalId, setIntervalId] = useState(null);
  const [happiness, setHappiness] = useState(50); // 0 (sad) to 100 (happy)
  const [endMsg, setEndMsg] = useState('');
  const [showSticker, setShowSticker] = useState(null); // 'correct' | 'wrong' | null

  useEffect(() => {
    if (gameOver) {
      if (intervalId) clearInterval(intervalId);
      return;
    }
    // Show a new cat every 900ms
    const id = setInterval(() => {
      setCatType(Math.random() < 0.5 ? 'happy' : 'sad');
      // Cat image is 224x224px, box is 500x500px. Always keep the cat fully inside the box.
      const boxSize = 500;
      const catSize = 224;
      const min = 0;
      const max = boxSize - catSize; // 276
      let top = Math.floor(Math.random() * (max - min + 1)) + min;
      let left = Math.floor(Math.random() * (max - min + 1)) + min;
      // Clamp to ensure the cat never goes out of the box
      top = Math.max(min, Math.min(max, top));
      left = Math.max(min, Math.min(max, left));
      setPosition({ top, left });
    }, 900);
    setIntervalId(id);
    return () => clearInterval(id);
  }, [gameOver]);

  useEffect(() => {
    if (happiness <= 0) {
      setEndMsg('Cat is very sad!');
      setGameOver(true);
    } else if (happiness >= 100) {
      setEndMsg('Cat is super happy!');
      setGameOver(true);
    }
  }, [happiness]);

  const handleCatClick = () => {
    if (catType === 'sad') {
      setHappiness(h => Math.max(0, h - 15));
      setScore(score + 1);
      setShowSticker('wrong');
    } else {
      setHappiness(h => Math.min(100, h + 10));
      setScore(score + 1);
      setShowSticker('correct');
    }
    setTimeout(() => setShowSticker(null), 1000);
  };

  const handleRestart = () => {
    setGameOver(false);
    setScore(0);
    setHappiness(50);
    setEndMsg('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] relative">
      <motion.h1 initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 8, delay: 0.1 }} className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-900 text-center">Make Cat Happy!</motion.h1>
      <p className="text-xl md:text-2xl mb-6 max-w-xl text-center font-opendyslexic text-blue-900">Click the happy cat to make it happier! If you click a sad cat, it gets sadder. Reach either extreme to end the game.</p>
      {/* Happiness Bar */}
      <div className="w-[500px] h-4 bg-pastel-mint/40 rounded-full mb-4 overflow-hidden border border-pastel-mint">
        <div
          className={`h-full transition-all duration-300 ${happiness > 70 ? 'bg-pastel-pink' : happiness < 30 ? 'bg-pastel-blue' : 'bg-pastel-yellow'}`}
          style={{ width: `${happiness}%` }}
        ></div>
      </div>
      <div className="relative w-[500px] h-[500px] bg-white/60 rounded-2xl shadow-lg flex items-center justify-center overflow-hidden">
        {!gameOver ? (
          <img
            src={catType === 'happy' ? happyCat : sadCat}
            alt={catType === 'happy' ? 'Happy Cat' : 'Sad Cat'}
            style={{
              position: 'absolute',
              width: 224,
              height: 224,
              top: position.top,
              left: position.left,
              cursor: 'pointer',
              transition: 'all 0.1s',
            }}
            onClick={handleCatClick}
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <span className="text-2xl font-bold text-blue-900 mb-4">Game Over!</span>
            <span className="text-lg text-blue-900 mb-2">{endMsg}</span>
            <span className="text-lg text-blue-900 mb-4">Score: {score}</span>
            <button className="bg-pastel-mint text-blue-900 font-bold py-2 px-6 rounded shadow hover:bg-pastel-blue transition" onClick={handleRestart}>Restart</button>
          </div>
        )}
      </div>
      <div className="mt-4 text-blue-900 font-bold text-xl">Score: {score}</div>
      {/* Jumping sticker animation */}
      <AnimatePresence>
        {showSticker === 'correct' && (
          <motion.div
            key="correct-wrap"
            initial={{ x: 120, opacity: 0, scale: 0.7 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 120, opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="fixed right-24 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center pointer-events-none select-none"
          >
            <span className="mb-2 text-2xl font-extrabold text-blue-900 drop-shadow-lg">Yayy so happy!</span>
            <img
              src={correctSticker}
              alt="Correct!"
              className="w-64 h-64"
            />
          </motion.div>
        )}
        {showSticker === 'wrong' && (
          <motion.div
            key="wrong-wrap"
            initial={{ x: 120, opacity: 0, scale: 0.7 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: 120, opacity: 0, scale: 0.7 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="fixed right-24 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center pointer-events-none select-none"
          >
            <span className="mb-2 text-2xl font-extrabold text-blue-900 drop-shadow-lg">Oh no! I feel upset!</span>
            <img
              src={wrongSticker}
              alt="Wrong!"
              className="w-64 h-64"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CompleteFamilyPictureGame() {
  const { loggedIn, token } = useAuth();
  const gridSize = 3;
  const [pieces, setPieces] = useState([]);
  const [draggedIdx, setDraggedIdx] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [imgSrc, setImgSrc] = useState(completePicFallback);

  useEffect(() => {
    setPieces(shuffleArray(Array.from({ length: gridSize * gridSize }, (_, i) => i)));
    setCompleted(false);
    if (!loggedIn) {
      setImgSrc(completePicFallback);
    } else {
      fetch('http://localhost:5000/api/family-photo', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.ok ? res.blob() : Promise.reject())
        .then(blob => setImgSrc(URL.createObjectURL(blob)))
        .catch(() => setImgSrc(completePicFallback));
    }
  }, [loggedIn, token]);

  const handleDragStart = idx => setDraggedIdx(idx);
  const handleDrop = idx => {
    if (draggedIdx === null || draggedIdx === idx) return;
    const newPieces = pieces.slice();
    [newPieces[draggedIdx], newPieces[idx]] = [newPieces[idx], newPieces[draggedIdx]];
    setPieces(newPieces);
    setDraggedIdx(null);
    if (newPieces.every((v, i) => v === i)) setCompleted(true);
  };
  const handleDragOver = e => e.preventDefault();

  const pieceStyle = idx => {
    const row = Math.floor(idx / gridSize);
    const col = idx % gridSize;
    return {
      backgroundImage: `url(${imgSrc})`,
      backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
      backgroundPosition: `${(col * 100) / (gridSize - 1)}% ${(row * 100) / (gridSize - 1)}%`,
      width: 120,
      height: 120,
      border: '2px solid #a5b4fc',
      borderRadius: 12,
      boxShadow: '0 2px 8px #c7d2fe',
      cursor: 'grab',
      backgroundColor: '#fff',
    };
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <motion.h1 initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 8, delay: 0.1 }} className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-900 text-center">Complete the Family Picture</motion.h1>
      <p className="text-xl md:text-2xl mb-6 max-w-xl text-center font-opendyslexic text-blue-900">Drag and drop the pieces to complete your family photo!</p>
      <div className="grid grid-cols-3 grid-rows-3 gap-2 mb-6" style={{ width: 366, height: 366 }}>
        {pieces.map((pieceIdx, idx) => (
          <div
            key={idx}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDrop={() => handleDrop(idx)}
            onDragOver={handleDragOver}
            style={pieceStyle(pieceIdx)}
            aria-label={`Puzzle piece ${pieceIdx + 1}`}
            tabIndex={0}
          />
        ))}
      </div>
      {completed && <div className="text-2xl font-bold text-pastel-mint mb-4">Congratulations! You completed the picture! 🎉</div>}
      <button onClick={() => {
        setPieces(shuffleArray(Array.from({ length: gridSize * gridSize }, (_, i) => i)));
        setCompleted(false);
        if (!loggedIn) {
          setImgSrc(completePicFallback);
        } else {
          fetch('http://localhost:5000/api/family-photo', {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then(res => res.ok ? res.blob() : Promise.reject())
            .then(blob => setImgSrc(URL.createObjectURL(blob)))
            .catch(() => setImgSrc(completePicFallback));
        }
      }} className="bg-pastel-blue hover:bg-pastel-mint transition-colors text-xl rounded-full px-6 py-3 font-bold shadow focus:outline-none focus:ring-4 focus:ring-pastel-lavender text-blue-900">Shuffle Again</button>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PageLayout sticker={hi}><Home /></PageLayout>} />
          <Route path="/games" element={<PageLayout sticker={eat}><Games /></PageLayout>} />
          <Route path="/community" element={<PageLayout sticker={hello}><Community /></PageLayout>} />
          <Route path="/details" element={<PageLayout sticker={sandwich}><Details /></PageLayout>} />
          <Route path="/login" element={<PageLayout><LoginSignup /></PageLayout>} />
          <Route path="/make-cat-happy" element={<PageLayout><MakeCatHappyGame /></PageLayout>} />
          <Route path="/complete-family-picture" element={<PageLayout><CompleteFamilyPictureGame /></PageLayout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
