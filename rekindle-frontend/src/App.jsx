import '@fontsource/lexend';
import '@fontsource/opendyslexic';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import { PageLayout } from './components/PageLayout';
import { Home } from './components/Home';
import Games from './components/Games';
import { Community } from './components/Community';
import { LoginSignup } from './components/LoginSignup';
import { Details } from './components/Details';
import { Resources } from './components/Resources';
import { MakeCatHappyGame } from './components/MakeCatHappyGame';
import { CompleteFamilyPictureGame } from './components/CompleteFamilyPictureGame';
import { FamilyPhotoMatchGame } from './components/FamilyPhotoMatchGame';
import { SimpleMathGame } from './components/SimpleMathGame';
import { ColorSequenceGame } from './components/ColorSequenceGame';
import { WordFindGame } from './components/WordFindGame';
import OmniChatbotWidget from './OmniChatbotWidget';
import Reminders from './Reminders';
import hi from './assets/hi.png';
import eat from './assets/eat.png';
import hello from './assets/hello.png';
import sandwich from './assets/sandwich.png';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<PageLayout sticker={hi}><Home /></PageLayout>} />
            <Route path="/games" element={<PageLayout sticker={eat}><Games /></PageLayout>} />
            <Route path="/community" element={<PageLayout sticker={hello}><Community /></PageLayout>} />
            <Route path="/login" element={<PageLayout><LoginSignup /></PageLayout>} />
            <Route path="/details" element={<PageLayout sticker={sandwich}><Details /></PageLayout>} />
            <Route path="/resources" element={<PageLayout><Resources /></PageLayout>} />
            <Route path="/make-cat-happy" element={<PageLayout><MakeCatHappyGame /></PageLayout>} />
            <Route path="/complete-family-picture" element={<PageLayout><CompleteFamilyPictureGame /></PageLayout>} />
            <Route path="/family-photo-match" element={<PageLayout><FamilyPhotoMatchGame /></PageLayout>} />
            <Route path="/simple-math" element={<PageLayout><SimpleMathGame /></PageLayout>} />
            <Route path="/color-sequence" element={<PageLayout><ColorSequenceGame /></PageLayout>} />
            <Route path="/word-find" element={<PageLayout><WordFindGame /></PageLayout>} />
            <Route path="/reminders" element={<PageLayout><Reminders /></PageLayout>} />
          </Routes>
          <OmniChatbotWidget />
      </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
