import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Users, 
  FolderKanban, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Activity,
  Zap,
  Sparkles,
  ChevronRight,
  Building,
  X,
  Star
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamUsers, setTeamUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monitorView, setMonitorView] = useState('all'); 
  const [reportModal, setReportModal] = useState({ show: false, type: '', title: '', data: [] });
  const [createModal, setCreateModal] = useState({ show: false, type: '' });
  const [formData, setFormData] = useState({ name: '', description: '', title: '', projectId: '', assignee: '', dueDate: '', email: '', password: '', role: 'Member' });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      if (createModal.type === 'project') {
        const res = await axios.post(`${API_URL}/projects`, { name: formData.name, description: formData.description }, config);
        setProjects([...projects, res.data]);
      } else if (createModal.type === 'task') {
        const payload = { 
          title: formData.title, 
          project: formData.projectId, 
          status: 'To Do', 
          assignee: formData.assignee || user.id 
        };
        if (formData.dueDate) payload.dueDate = formData.dueDate;
        
        const res = await axios.post(`${API_URL}/tasks`, payload, config);
        setTasks([res.data, ...tasks]);
        setAllTasks([res.data, ...allTasks]);
      } else if (createModal.type === 'invite') {
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          orgId: user.organization
        };
        const res = await axios.post(`${API_URL}/auth/register`, payload);
        setTeamUsers([...teamUsers, res.data.user]);
        alert('Member invited successfully!');
      }
      setCreateModal({ show: false, type: '' });
      setFormData({ name: '', description: '', title: '', projectId: '', assignee: '', dueDate: '', email: '', password: '', role: 'Member' });
    } catch (err) {
      alert('Error creating item. ' + (err.response?.data?.message || err.message));
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      const res = await axios.put(`${API_URL}/tasks/${taskId}`, { status: newStatus }, config);
      setTasks(tasks.map(t => t._id === taskId ? res.data : t));
      setAllTasks(allTasks.map(t => t._id === taskId ? res.data : t));
    } catch (err) {
      alert('Error updating status: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await axios.delete(`${API_URL}/tasks/${taskId}`, config);
      setTasks(tasks.filter(t => t._id !== taskId));
      setAllTasks(allTasks.filter(t => t._id !== taskId));
    } catch (err) {
      alert('Error deleting task: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await axios.delete(`${API_URL}/projects/${projectId}`, config);
      setProjects(projects.filter(p => p._id !== projectId));
    } catch (err) {
      alert('Error deleting project: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleStarProject = async (projectId, currentStatus) => {
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      const res = await axios.put(`${API_URL}/projects/${projectId}`, { isStarred: !currentStatus }, config);
      setProjects(projects.map(p => p._id === projectId ? { ...p, isStarred: !currentStatus } : p));
    } catch (err) {
      alert('Error updating project: ' + (err.response?.data?.message || err.message));
    }
  };
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, allTasksRes, projectsRes, teamRes] = await Promise.all([
          axios.get(`${API_URL}/tasks/me`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/tasks/all`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/projects`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/auth/users`).catch(() => ({ data: [] }))
        ]);
        
        const userTasks = user?.role === 'Admin' ? allTasksRes.data : tasksRes.data;
        setTasks(userTasks || []);
        setAllTasks(allTasksRes.data || []);
        setProjects(projectsRes.data || []);
        setTeamUsers(teamRes.data || []);

        const combined = [...(allTasksRes.data || []).map(t => ({ type: 'task', user: t.assignee?.name || 'Someone', action: t.status === 'Done' ? 'completed' : 'updated', target: t.title, time: new Date(t.updatedAt || t.createdAt) })), ...(projectsRes.data || []).map(p => ({ type: 'project', user: 'Admin', action: 'launched', target: p.name, time: new Date(p.createdAt) }))].sort((a, b) => b.time - a.time).slice(0, 6);
        setActivities(combined);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  const todoTasks = tasks.filter(t => t.status === 'To Do');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const doneTasks = tasks.filter(t => t.status === 'Done');

  const calculateProjectProgress = (projectId) => {
    const projectTasks = allTasks.filter(t => t.project?._id === projectId);
    if (projectTasks.length === 0) return 0;
    return Math.round((projectTasks.filter(t => t.status === 'Done').length / projectTasks.length) * 100);
  };

  const getTeamStats = () => {
    return (teamUsers || []).map(member => {
      const memberTasks = allTasks.filter(t => t.assignee?._id === member._id);
      return { ...member, total: memberTasks.length, done: memberTasks.filter(t => t.status === 'Done').length };
    });
  };

  const showDashboard = location.pathname === '/';
  const showProjects = location.pathname === '/projects';
  const showTasks = location.pathname === '/tasks';
  const showTeam = location.pathname === '/team';

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading Dashboard...</div>;


  const openReport = (type) => {
    let title = '';
    let data = [];
    if (type === 'active') { title = 'Active Work Report'; data = inProgressTasks; }
    if (type === 'backlog') { title = 'Backlog Inventory'; data = todoTasks; }
    if (type === 'done') { title = 'Completion Report'; data = doneTasks; }
    setReportModal({ show: true, type, title, data });
  };

  return (
    <div className="dashboard-container" style={{ minHeight: '100vh' }}>
      {/* Report Modal */}
      {reportModal.show && (
        <div className="modal-overlay" onClick={() => setReportModal({ ...reportModal, show: false })}>
           <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                 <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{reportModal.title}</h2>
                 <button onClick={() => setReportModal({ ...reportModal, show: false })} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748B"/></button>
              </div>
              <div className="modal-body">
                 {reportModal.data.length === 0 ? (
                   <div style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8' }}>No tasks found in this category.</div>
                 ) : (
                   reportModal.data.map(task => (
                     <div key={task._id} className="report-item">
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: reportModal.type === 'done' ? '#22C55E' : reportModal.type === 'active' ? '#3B82F6' : '#F59E0B' }}></div>
                        <div style={{ flex: 1 }}>
                           <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{task.title}</div>
                           <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{task.projectId?.name || 'General Task'}</div>
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, padding: '4px 8px', background: '#F1F5F9', borderRadius: '4px' }}>
                           {(task.createdAt && !isNaN(new Date(task.createdAt))) ? new Date(task.createdAt).toLocaleDateString() : 'Recent'}
                        </div>
                     </div>
                   ))
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Create Modal */}
      {createModal.show && (
        <div className="modal-overlay" onClick={() => setCreateModal({ show: false, type: '' })}>
           <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
              <div className="modal-header">
                 <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{createModal.type === 'project' ? 'New Project' : createModal.type === 'invite' ? 'Invite Member' : 'New Task'}</h2>
                 <button onClick={() => setCreateModal({ show: false, type: '' })} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748B"/></button>
              </div>
              <div className="modal-body">
                 <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {createModal.type === 'project' ? (
                      <>
                        <div>
                           <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Project Name</label>
                           <input autoFocus required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', boxSizing: 'border-box' }} placeholder="e.g. Website Redesign" />
                        </div>
                        <div>
                           <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Description</label>
                           <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', boxSizing: 'border-box', minHeight: '80px' }} placeholder="Briefly describe the project..." />
                        </div>
                      </>
                    ) : createModal.type === 'invite' ? (
                      <>
                        <div>
                           <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Name</label>
                           <input autoFocus required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', boxSizing: 'border-box' }} placeholder="e.g. John Doe" />
                        </div>
                        <div>
                           <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Email</label>
                           <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', boxSizing: 'border-box' }} placeholder="e.g. john@team.com" />
                        </div>
                        <div>
                           <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Temporary Password</label>
                           <input required type="text" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', boxSizing: 'border-box' }} placeholder="Set a temporary password" />
                        </div>
                        <div>
                           <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Role</label>
                           <select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', boxSizing: 'border-box' }}>
                              <option value="Member">Member</option>
                              <option value="Admin">Admin</option>
                           </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                           <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Task Title</label>
                           <input autoFocus required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', boxSizing: 'border-box' }} placeholder="e.g. Design Homepage" />
                        </div>
                        <div>
                           <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Project</label>
                           <select required value={formData.projectId} onChange={e => setFormData({...formData, projectId: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', boxSizing: 'border-box' }}>
                              <option value="">Select a project...</option>
                              {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                           </select>
                        </div>
                        <div>
                           <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Assign To</label>
                           <select value={formData.assignee} onChange={e => setFormData({...formData, assignee: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', boxSizing: 'border-box' }}>
                              <option value="">Select team member...</option>
                              {teamUsers.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                           </select>
                        </div>
                        <div>
                           <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Deadline</label>
                           <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', boxSizing: 'border-box' }} />
                        </div>
                      </>
                    )}
                    <button type="submit" className="btn-primary" style={{ marginTop: '10px', width: '100%', justifyContent: 'center' }}>{createModal.type === 'project' ? 'Create Project' : createModal.type === 'invite' ? 'Send Invite' : 'Create Task'}</button>
                 </form>
              </div>
           </div>
        </div>
      )}

      {/* Header Section */}
      <div className="header-section">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          {!showDashboard && (
            <button onClick={() => navigate('/')} className="btn-secondary" style={{ padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center' }}>
               <ArrowLeft size={18} />
            </button>
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
               <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>
                  {showDashboard ? `Good morning, ${user?.name?.split(' ')[0] || 'Member'} 👋` : location.pathname.substring(1).toUpperCase()}
               </h1>
               {showDashboard && (
                 <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ background: 'var(--primary)', color: 'white', padding: '5px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}><Building size={12}/> Sharda University</div>
                    <div style={{ background: '#E3FCEF', color: '#36B37E', padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #ABF5D1', display: 'flex', alignItems: 'center', gap: '5px' }}>
                       <div style={{ width: '6px', height: '6px', background: '#36B37E', borderRadius: '50%' }}></div>
                       {teamUsers.length || 3} Online
                    </div>
                 </div>
               )}
            </div>
            <p className="text-muted" style={{ marginTop: '4px', fontSize: '0.9rem' }}>
              {showDashboard ? `You've completed ${doneTasks.length} tasks so far — keep it up!` : `View and manage your ${location.pathname.substring(1)} here.`}
            </p>
          </div>
        </div>
      </div>

      {/* Main Dashboard View */}
      {showDashboard && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Top Row Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
             <div className="stat-card active" onClick={() => openReport('active')} style={{ padding: '1.25rem', cursor: 'pointer' }}>
                <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AlertCircle size={20} color="white" /></div>
                <div>
                   <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{inProgressTasks.length}</div>
                   <div style={{ opacity: 0.8, fontSize: '0.8rem', fontWeight: 700 }}>Currently Active</div>
                </div>
             </div>
             <div className="stat-card neutral" onClick={() => openReport('backlog')} style={{ padding: '1.25rem', cursor: 'pointer' }}>
                <div style={{ width: '36px', height: '36px', background: '#DEEBFF', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Clock size={20} color="#0052CC" /></div>
                <div>
                   <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{todoTasks.length}</div>
                   <div className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Backlog</div>
                </div>
             </div>
             <div className="stat-card success" onClick={() => openReport('done')} style={{ padding: '1.25rem', cursor: 'pointer' }}>
                <div style={{ width: '36px', height: '36px', background: '#36B37E', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle size={20} color="white" /></div>
                <div>
                   <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{doneTasks.length}</div>
                   <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>Total Done</div>
                </div>
             </div>
          </div>

          {/* Quick Actions Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
             <div className="insight-card" onClick={() => setCreateModal({ show: true, type: 'project' })} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', cursor: 'pointer', background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: 'white', padding: '1.5rem', transition: 'transform 0.2s', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <FolderKanban size={24} color="white" />
                </div>
                <div>
                   <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>Create Project</div>
                   <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Start a new initiative</div>
                </div>
             </div>
             
             <div className="glass-card" onClick={() => setCreateModal({ show: true, type: 'task' })} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', cursor: 'pointer', transition: 'all 0.2s', border: '1px solid var(--accent)' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#E3F2FD', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <CheckSquare size={24} color="var(--accent)" />
                </div>
                <div>
                   <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>Add New Task</div>
                   <div className="text-muted" style={{ fontSize: '0.8rem' }}>Assign work to the team</div>
                </div>
             </div>

             <div className="glass-card" onClick={() => navigate('/team')} style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#E3FCEF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <Users size={24} color="#36B37E" />
                </div>
                <div>
                   <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)' }}>Manage Team</div>
                   <div className="text-muted" style={{ fontSize: '0.8rem' }}>Invite or view members</div>
                </div>
             </div>
          </div>

          {/* Core Sections */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.6fr', gap: '1.5rem', alignItems: 'flex-start' }}>
             <div className="glass-card">
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.5rem' }}>Core Performance Monitor</h2>
                <p className="text-muted" style={{ marginBottom: '2rem' }}>High-priority project tracking and milestone delivery.</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {projects.slice(0, 2).map(p => {
                    const progress = calculateProjectProgress(p._id);
                    return (
                      <div key={p._id}>
                        <div className="flex-between" style={{ marginBottom: '12px' }}>
                           <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{p.name} {progress}%</span>
                        </div>
                        <div className="progress-bar-bg" style={{ height: '10px' }}>
                           <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
             </div>

             <div className="glass-card" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.2rem', fontWeight: 800 }}>
                   <Activity size={20} color="var(--accent)" /> Team Pulse
                </h3>
                <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }} className="custom-scrollbar">
                   {getTeamStats().map(member => (
                    <div key={member._id} style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                          <div className="avatar" style={{ width: '32px', height: '32px', fontSize: '0.8rem' }}>{member.name?.charAt(0) || '?'}</div>
                          <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>{member.name || 'Unknown User'}</span>
                       </div>
                       <div style={{ background: '#F4F5F7', padding: '6px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 800 }}>{member.done || 0} / {member.total || 0} Tasks</div>
                    </div>
                   ))}
                </div>
                <button className="btn-secondary" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => navigate('/team')}>Full Roster</button>
             </div>
          </div>

          {/* Directory & Activity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
             <div className="glass-card">
                <h2 style={{ marginBottom: '1.5rem' }}>Active Task Directory</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {tasks.slice(0, 3).map(t => (
                    <div key={t._id} className="flex-between" style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '12px' }}>
                       <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                          <CheckSquare size={20} color="var(--accent)" />
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{t.title}</div>
                            <div className="text-muted" style={{ fontSize: '0.85rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                               <span>{t.project?.name}</span>
                               {t.assignee && <span style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>👤 {t.assignee.name}</span>}
                            </div>
                          </div>
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                         <select 
                            value={t.status} 
                            onChange={(e) => handleStatusChange(t._id, e.target.value)}
                            className={`status-badge status-${t.status?.toLowerCase().replace(' ', '') || 'todo'}`}
                            style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                            onClick={e => e.stopPropagation()}
                         >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                         </select>
                         <button onClick={(e) => { e.stopPropagation(); handleDeleteTask(t._id); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '4px', display: 'flex', alignItems: 'center' }}>
                            <Trash2 size={18} />
                         </button>
                       </div>
                    </div>
                  ))}
                </div>
             </div>
             <div className="glass-card">
                <h2 style={{ marginBottom: '1.5rem' }}>Workspace Pulse</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                   {activities.slice(0, 4).map((act, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1.25rem' }}>
                       <div className="avatar" style={{ width: '40px', height: '40px', borderRadius: '12px' }}><Zap size={18}/></div>
                       <div>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700 }}><b>{act.user}</b> {act.action} {act.target}</div>
                          <div className="text-muted" style={{ fontSize: '0.8rem' }}>{(act.time instanceof Date && !isNaN(act.time)) ? act.time.toLocaleTimeString() : 'Recently'}</div>
                       </div>
                    </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Pages View (Projects, Tasks, Team) - Fixed Blank Issue */}
      {showProjects && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <div className="flex-between">
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Project Portfolio</h2>
              {user?.role === 'Admin' && <button className="btn-primary" onClick={() => setCreateModal({ show: true, type: 'project' })}>+ New Project</button>}
           </div>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
              {projects.map(p => (
                 <div key={p._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px' }}>
                       <button onClick={(e) => { e.stopPropagation(); handleToggleStarProject(p._id, p.isStarred); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: p.isStarred ? '#F59E0B' : '#94A3B8' }}>
                          <Star fill={p.isStarred ? '#F59E0B' : 'none'} size={20} />
                       </button>
                       {user?.role === 'Admin' && (
                         <button onClick={(e) => { e.stopPropagation(); handleDeleteProject(p._id); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#EF4444' }}>
                            <Trash2 size={20} />
                         </button>
                       )}
                    </div>
                    <div>
                      <h3 style={{ marginBottom: '0.75rem', fontSize: '1.2rem', fontWeight: 800, paddingRight: '60px' }}>{p.name}</h3>
                      <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>{p.description}</p>
                    </div>
                    <div>
                      <div className="flex-between" style={{ marginBottom: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
                         <span>Progress</span>
                         <span>{calculateProjectProgress(p._id)}%</span>
                      </div>
                      <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: `${calculateProjectProgress(p._id)}%` }}></div></div>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      )}

      {showTasks && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <div className="flex-between">
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>My Active Tasks</h2>
              <button className="btn-primary" onClick={() => setCreateModal({ show: true, type: 'task' })}>+ New Task</button>
           </div>
           <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem' }}>
              {tasks.map(t => (
                <div key={t._id} className="flex-between" style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', borderRadius: '8px', transition: 'background 0.2s', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(241, 245, 249, 0.5)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                   <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
                      <CheckSquare size={22} color="var(--accent)"/>
                      <div>
                         <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '4px' }}>{t.title}</div>
                         <div className="text-muted" style={{ fontSize: '0.85rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <span>{t.project?.name || 'General Task'}</span>
                            {t.assignee && <span style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>👤 {t.assignee.name}</span>}
                         </div>
                      </div>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                     {t.dueDate && (
                        <div style={{ fontSize: '0.8rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                           <Clock size={14} /> {new Date(t.dueDate).toLocaleDateString()}
                        </div>
                     )}
                     <select 
                        value={t.status} 
                        onChange={(e) => handleStatusChange(t._id, e.target.value)}
                        className={`status-badge status-${t.status?.toLowerCase().replace(' ', '') || 'todo'}`}
                        style={{ border: 'none', cursor: 'pointer', outline: 'none' }}
                        onClick={e => e.stopPropagation()}
                     >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                     </select>
                     <button onClick={(e) => { e.stopPropagation(); handleDeleteTask(t._id); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '4px', display: 'flex', alignItems: 'center' }}>
                        <Trash2 size={18} />
                     </button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}

      {showTeam && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <div className="flex-between">
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Team Workspace</h2>
              {user?.role === 'Admin' && <button className="btn-primary" onClick={() => setCreateModal({ show: true, type: 'invite' })}>Invite Member</button>}
           </div>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {getTeamStats().map(member => (
                <div key={member._id} className="glass-card" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                   <div className="avatar" style={{ width: '70px', height: '70px', margin: '0 auto 1.25rem', fontSize: '1.8rem', background: 'var(--primary)', color: 'white' }}>{member.name?.charAt(0) || '?'}</div>
                   <h3 style={{ marginBottom: '6px', fontSize: '1.2rem', fontWeight: 800 }}>{member.name || 'Unknown'}</h3>
                   <div className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>{member.role || 'Contributor'}</div>
                   <div style={{ background: '#F1F5F9', padding: '10px 16px', borderRadius: '8px', fontWeight: 800, width: '100%', color: 'var(--primary)', border: '1px solid #E2E8F0' }}>
                      {member.done || 0} / {member.total || 0} Tasks Completed
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
