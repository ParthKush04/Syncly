import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import MatchmakingWaitPage from './pages/MatchmakingWaitPage.jsx';
import VideoCallPage from './pages/VideoCallPage.jsx';
import ModerationPage from './pages/ModerationPage.jsx';
import AdminModerationPage from './pages/AdminModerationPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import AuthSuccessPage from './pages/AuthSuccessPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/matchmaking" element={<MatchmakingWaitPage />} />
        <Route path="/call" element={<VideoCallPage />} />
        <Route path="/reports" element={<ModerationPage />} />
        <Route path="/admin/moderation" element={<AdminModerationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/success" element={<AuthSuccessPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
