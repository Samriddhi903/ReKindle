import '@fontsource/lexend';
import '@fontsource/opendyslexic';
import './App.css';
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={
              <PageLayout sticker={<Doodle />}>
                <Home />
              </PageLayout>
            } />
            
            <Route path="/games" element={
              <PageLayout>
                <Games />
              </PageLayout>
            } />
            
            <Route path="/community" element={
              <PageLayout>
                <Community />
              </PageLayout>
            } />
            
            <Route path="/login" element={
              <PageLayout>
                <LoginSignup />
              </PageLayout>
            } />
            
            <Route path="/details" element={
              <PageLayout>
                <Details />
              </PageLayout>
            } />
            
            <Route path="/make-cat-happy" element={
              <PageLayout>
                <MakeCatHappyGame />
              </PageLayout>
            } />
            
            <Route path="/complete-family-picture" element={
              <PageLayout>
                <CompleteFamilyPictureGame />
              </PageLayout>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
