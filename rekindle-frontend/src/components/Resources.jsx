import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function Resources() {
  const navigate = useNavigate();

  const conditions = [
    {
      name: 'ADHD',
      description: 'Attention Deficit Hyperactivity Disorder affects focus, impulse control, and activity levels.',
      tips: [
        'Create structured daily routines',
        'Use visual timers and reminders',
        'Break tasks into smaller steps',
        'Minimize distractions in work areas',
        'Practice mindfulness and breathing exercises'
      ],
      resources: [
        { name: 'CHADD', url: 'https://chadd.org', description: 'Children and Adults with Attention-Deficit/Hyperactivity Disorder' },
        { name: 'ADDitude', url: 'https://additudemag.com', description: 'ADHD resources and support' }
      ]
    },
    {
      name: 'Dementia',
      description: 'A group of conditions affecting memory, thinking, and social abilities severely enough to interfere with daily life.',
      tips: [
        'Maintain regular sleep patterns',
        'Stay physically and mentally active',
        'Keep a consistent daily routine',
        'Use memory aids and reminders',
        'Stay socially connected with family and friends'
      ],
      resources: [
        { name: 'Alzheimer\'s Association', url: 'https://alz.org', description: 'Leading voluntary health organization' },
        { name: 'Dementia Society', url: 'https://dementiasociety.org', description: 'Support and resources for dementia' }
      ]
    },
    {
      name: 'Dyslexia',
      description: 'A learning disorder that affects reading, writing, and spelling abilities.',
      tips: [
        'Use dyslexia-friendly fonts and colors',
        'Break reading into smaller sections',
        'Use audiobooks and text-to-speech',
        'Practice reading with multisensory methods',
        'Build confidence through strengths-based learning'
      ],
      resources: [
        { name: 'International Dyslexia Association', url: 'https://dyslexiaida.org', description: 'Professional development and resources' },
        { name: 'Dyslexia Help', url: 'https://dyslexiahelp.umich.edu', description: 'University of Michigan dyslexia resources' }
      ]
    },
    {
      name: 'Alzheimer\'s',
      description: 'A progressive disease that destroys memory and other important mental functions.',
      tips: [
        'Engage in brain-stimulating activities',
        'Maintain a healthy diet and exercise',
        'Stay socially active and connected',
        'Use memory aids and organizational tools',
        'Seek early diagnosis and treatment'
      ],
      resources: [
        { name: 'Alzheimer\'s Association', url: 'https://alz.org', description: 'Comprehensive support and resources' },
        { name: 'Alzheimer\'s Foundation', url: 'https://alzfdn.org', description: 'Support for families and caregivers' }
      ]
    }
  ];

  const caregiverTips = [
    {
      title: 'Communication',
      tips: [
        'Speak clearly and use simple language',
        'Maintain eye contact and use gentle gestures',
        'Be patient and allow time for responses',
        'Use visual aids and written reminders',
        'Avoid arguing or correcting unnecessarily'
      ]
    },
    {
      title: 'Daily Care',
      tips: [
        'Establish consistent routines',
        'Break tasks into manageable steps',
        'Use visual schedules and checklists',
        'Create a safe and organized environment',
        'Encourage independence when possible'
      ]
    },
    {
      title: 'Self-Care',
      tips: [
        'Take regular breaks and time for yourself',
        'Join support groups for caregivers',
        'Ask for help from family and friends',
        'Maintain your own health and well-being',
        'Seek professional support when needed'
      ]
    }
  ];

  const emergencyContacts = [
    { name: 'National Suicide Prevention Lifeline', number: '988', description: '24/7 crisis support' },
    { name: 'Crisis Text Line', number: 'Text HOME to 741741', description: 'Text-based crisis support' },
    { name: 'Emergency Services', number: '911', description: 'For immediate medical emergencies' },
    { name: 'Alzheimer\'s Association Helpline', number: '1-800-272-3900', description: '24/7 support for Alzheimer\'s' }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] pb-20">
      <motion.h1 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ type: 'spring', stiffness: 120, damping: 8, delay: 0.1 }} 
        className="text-4xl md:text-5xl font-extrabold mb-6 text-blue-900 text-center"
      >
        Resources & Support
      </motion.h1>
      <p className="text-xl md:text-2xl mb-8 max-w-2xl text-center font-opendyslexic text-blue-900">
        Helpful information, tips, and resources for you and your caregivers.
      </p>

      {/* Conditions Section */}
      <div className="w-full max-w-6xl mb-12">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 font-lexend text-center">Understanding Conditions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {conditions.map((condition, index) => (
            <motion.div
              key={condition.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-2xl font-bold text-blue-900 mb-3 font-lexend">{condition.name}</h3>
              <p className="text-blue-900 mb-4 font-opendyslexic">{condition.description}</p>
              
              <div className="mb-4">
                <h4 className="text-lg font-bold text-blue-900 mb-2 font-lexend">Helpful Tips:</h4>
                <ul className="list-disc list-inside text-blue-900 font-opendyslexic space-y-1">
                  {condition.tips.map((tip, tipIndex) => (
                    <li key={tipIndex}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold text-blue-900 mb-2 font-lexend">Resources:</h4>
                <div className="space-y-2">
                  {condition.resources.map((resource, resIndex) => (
                    <div key={resIndex} className="text-blue-900 font-opendyslexic">
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline font-semibold"
                      >
                        {resource.name}
                      </a>
                      <p className="text-sm text-blue-700">{resource.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Caregiver Tips Section */}
      <div className="w-full max-w-6xl mb-12">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 font-lexend text-center">Caregiver Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caregiverTips.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-blue-900 mb-4 font-lexend text-center">{section.title}</h3>
              <ul className="list-disc list-inside text-blue-900 font-opendyslexic space-y-2">
                {section.tips.map((tip, tipIndex) => (
                  <li key={tipIndex}>{tip}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Emergency Contacts Section */}
      <div className="w-full max-w-4xl mb-12">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 font-lexend text-center">Emergency Contacts</h2>
        <div className="bg-white/80 rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyContacts.map((contact, index) => (
              <motion.div
                key={contact.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-pastel-mint/30 rounded-lg p-4"
              >
                <h4 className="font-bold text-blue-900 font-lexend">{contact.name}</h4>
                <p className="text-lg font-bold text-blue-600 font-lexend">{contact.number}</p>
                <p className="text-sm text-blue-700 font-opendyslexic">{contact.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Downloadable Resources */}
      <div className="w-full max-w-4xl mb-12">
        <h2 className="text-3xl font-bold text-blue-900 mb-6 font-lexend text-center">Downloadable Resources</h2>
        <div className="bg-white/80 rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-pastel-lavender/30 rounded-lg p-4 text-center">
              <h4 className="font-bold text-blue-900 font-lexend mb-2">Daily Routine Checklist</h4>
              <p className="text-blue-700 font-opendyslexic mb-3">Printable checklist for daily activities</p>
              <button className="bg-pastel-blue hover:bg-blue-600 transition-colors text-white px-4 py-2 rounded font-bold">
                Download PDF
              </button>
            </div>
            <div className="bg-pastel-pink/30 rounded-lg p-4 text-center">
              <h4 className="font-bold text-blue-900 font-lexend mb-2">Memory Aids Guide</h4>
              <p className="text-blue-700 font-opendyslexic mb-3">Tips and tools for memory support</p>
              <button className="bg-pastel-blue hover:bg-blue-600 transition-colors text-white px-4 py-2 rounded font-bold">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="bg-pastel-lavender hover:bg-pastel-pink transition-colors text-xl rounded-full px-6 py-3 font-bold shadow focus:outline-none focus:ring-4 focus:ring-pastel-blue text-blue-900"
      >
        ← Back to Home
      </button>
    </div>
  );
} 