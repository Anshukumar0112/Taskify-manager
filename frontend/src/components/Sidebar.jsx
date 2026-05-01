import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  LogOut, 
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, setSidebarOpen }) => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="flex-between" style={{ marginBottom: '3rem' }}>
        <div className="sidebar-logo"><CheckSquare size={26} color="white" /> Taskify</div>
        <button onClick={closeSidebar} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <X size={20} color="white" />
        </button>
      </div>

      <ul className="nav-links">
        <li>
          <NavLink to="/" onClick={closeSidebar} className={({isActive}) => isActive ? "nav-item active" : "nav-item"} end>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/projects" onClick={closeSidebar} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <FolderKanban size={20} /> Projects
          </NavLink>
        </li>
        <li>
          <NavLink to="/tasks" onClick={closeSidebar} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
            <CheckSquare size={20} /> My Tasks
          </NavLink>
        </li>
        {user?.role === 'Admin' && (
          <li>
            <NavLink to="/team" onClick={closeSidebar} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
              <Users size={20} /> Team
            </NavLink>
          </li>
        )}
      </ul>

      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <NavLink to="/profile" onClick={closeSidebar} className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
            {user?.profilePicture ? <img src={user.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : user?.name?.charAt(0) || 'U'}
          </div>
          My Profile
        </NavLink>
        <button onClick={handleLogout} className="nav-item" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
