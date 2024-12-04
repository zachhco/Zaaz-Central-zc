import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntroPage from './pages/IntroPage/IntroPage';
import Home from './components/Home/Home';
import Layout from './components/Layout/Layout';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import AIHubPage from './pages/AIHubPage/AIHubPage';
import BusinessPipelinePage from './pages/BusinessPipelinePage/BusinessPipelinePage';
import ProjectsPage from './pages/ProjectsPage/ProjectsPage';
import KanbanBoard from './pages/ProjectsPage/KanbanBoard';
import MeetingSummarizerPage from './pages/MeetingSummarizerPage/MeetingSummarizerPage';
import BusinessAnalyzerPage from './pages/BusinessAnalyzerPage/BusinessAnalyzerPage';
import RealEstateEvaluatorPage from './pages/RealEstateEvaluatorPage/RealEstateEvaluatorPage';
import FavoritesPage from './pages/FavoritesPage/FavoritesPage';
import RecentPage from './pages/RecentPage/RecentPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        
        {/* Main Layout Routes */}
        <Route path="/home" element={<Layout><Home /></Layout>} />
        <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
        <Route path="/ai-hub/*" element={<Layout><AIHubPage /></Layout>} />
        <Route path="/business-pipeline" element={<Layout><BusinessPipelinePage /></Layout>} />
        
        {/* Projects Routes */}
        <Route path="/projects" element={<Layout><ProjectsPage /></Layout>} />
        <Route path="/projects/kanban" element={<Layout><KanbanBoard /></Layout>} />
        
        {/* Workflow Routes */}
        <Route path="/meeting-summarizer" element={<Layout><MeetingSummarizerPage /></Layout>} />
        <Route path="/business-analyzer" element={<Layout><BusinessAnalyzerPage /></Layout>} />
        <Route path="/real-estate-evaluator" element={<Layout><RealEstateEvaluatorPage /></Layout>} />
        
        {/* Quick Access Routes */}
        <Route path="/favorites" element={<Layout><FavoritesPage /></Layout>} />
        <Route path="/recent" element={<Layout><RecentPage /></Layout>} />
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
