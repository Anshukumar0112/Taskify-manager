import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';
import Profile from './pages/Profile';
import './index.css';

import { Menu } from 'lucide-react';

const PrivateRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  return user ? (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="main-content">
        <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 1000 }}>
          <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={18} color="#0F172A" />
          </button>
        </div>
        <div style={{ paddingTop: '1.5rem' }}>
          {children}
        </div>
      </div>
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
    </div>
  ) : <Navigate to="/login" />;
};

function App() {
  React.useEffect(() => {
    document.title = "Taskify - Team Task Manager";
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/projects" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/tasks" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/team" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
