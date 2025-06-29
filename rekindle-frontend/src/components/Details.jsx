import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from './AuthContext';

export function Details() {
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

  // Get userId from auth context or from localStorage (for new signups)
  const currentUserId = userId || localStorage.getItem('tempUserId');

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
    
    if (!currentUserId) {
      alert('User ID not found. Please try signing up again.');
      navigate('/login');
      return;
    }

    const formData = new FormData();
    formData.append('userId', currentUserId);
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

    try {
      const res = await fetch('https://rekindle-zyhh.onrender.com/api/details', {
        method: 'POST',
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (res.ok) {
        setSubmitted(true);
        // Clear temp userId after successful submission
        localStorage.removeItem('tempUserId');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const data = await res.json();
        alert('Error submitting details: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Network error. Please check your connection.');
    }
  };

  return (
    <>
      <motion.h1 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ type: 'spring', stiffness: 120, damping: 8, delay: 0.1 }} 
        className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-900 text-center"
      >
        Details & Input
      </motion.h1>
      <p className="text-xl md:text-2xl mb-8 max-w-xl text-center font-opendyslexic text-blue-900">
        Add patient, family, and guardian details. You can add multiple guardians.
      </p>
      {submitted ? (
        <div className="bg-pastel-mint/70 rounded-xl shadow p-8 text-center text-2xl font-bold text-blue-900 max-w-lg mx-auto">
          Thank you! Details submitted successfully.
        </div>
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