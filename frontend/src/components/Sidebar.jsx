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
        
        <li style={{ marginTop: 'auto' }}>
          <button onClick={handleLogout} className="nav-item" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '12px 16px' }}>
            <LogOut size={20} /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
