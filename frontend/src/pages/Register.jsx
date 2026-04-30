import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import API_URL from '../config';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { CheckSquare, Mail, Lock, User, Building, ArrowRight, ShieldCheck, Zap, RefreshCw } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');
  const [orgName, setOrgName] = useState('');
  const [orgId, setOrgId] = useState('');
  const [availableOrgs, setAvailableOrgs] = useState([]);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(false);
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchOrgs = async () => {
    setIsLoadingOrgs(true);
    try {
      const res = await axios.get(`${API_URL}/auth/organizations/public`);
      setAvailableOrgs(res.data);
    } catch (err) {
      console.error("Failed to fetch organizations", err);
    } finally {
      setIsLoadingOrgs(false);
    }
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await register(name, email, password, role, role === 'Admin' ? orgName : '', role === 'Member' ? orgId : '');
      if (result && result.pending) {
        alert(result.message);
        navigate('/login');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-split" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Left Side - Command Center Registration */}
      <div className="auth-left" style={{ flex: '0 0 580px', padding: '2rem 4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'white', zIndex: 100, boxShadow: '20px 0 60px rgba(0,0,0,0.05)', position: 'relative' }}>
        
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', fontWeight: 800 }}>
             <CheckSquare size={36} /> Taskify Flow
          </h1>
          <h2 style={{ fontSize: '3rem', lineHeight: 1.1, marginBottom: '0.75rem', fontWeight: 800, color: '#172B4D', letterSpacing: '-1.5px' }}>
            Build your team workspace
          </h2>
          <p className="text-muted" style={{ fontSize: '1.1rem', maxWidth: '450px', lineHeight: 1.6 }}>
            Join thousands of professionals managing projects with high precision.
          </p>
        </div>

        {error && <div style={{ color: 'var(--danger)', marginBottom: '1.5rem', padding: '1rem', background: '#FFFAE6', borderRadius: '10px', border: '1px solid #FFE380', fontSize: '0.95rem', fontWeight: 600 }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '450px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
             <div className="form-group" style={{ marginBottom: '1.25rem' }}>
               <label className="form-label" style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>Full Name</label>
               <div className="input-icon-wrapper">
                  <User className="input-icon" size={18} style={{ left: '0.85rem' }} />
                  <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required className="form-input" style={{ height: '50px', paddingLeft: '2.75rem' }} />
               </div>
             </div>
             <div className="form-group" style={{ marginBottom: '1.25rem' }}>
               <label className="form-label" style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>Account Role</label>
               <select value={role} onChange={e => setRole(e.target.value)} required className="form-input" style={{ height: '50px' }}>
                 <option value="Member">Team Member</option>
                 <option value="Admin">Administrator</option>
               </select>
             </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
               <label className="form-label" style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                 {role === 'Admin' ? 'Create New Company' : 'Select Your Company'}
               </label>
               {role === 'Member' && (
                 <button type="button" onClick={fetchOrgs} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                   <RefreshCw size={14} className={isLoadingOrgs ? 'spin' : ''} /> Refresh List
                 </button>
               )}
            </div>
            <div className="input-icon-wrapper">
               <Building className="input-icon" size={18} style={{ left: '0.85rem' }} />
               {role === 'Admin' ? (
                 <input 
                   type="text" 
                   placeholder="e.g. Acme Corp" 
                   value={orgName} 
                   onChange={e => setOrgName(e.target.value)} 
                   required 
                   className="form-input" 
                   style={{ height: '50px', paddingLeft: '2.75rem' }} 
                 />
               ) : (
                 <select 
                   value={orgId} 
                   onChange={e => setOrgId(e.target.value)} 
                   required 
                   className="form-input" 
                   style={{ height: '50px', paddingLeft: '2.75rem' }}
                 >
                   <option value="">{isLoadingOrgs ? 'Loading companies...' : 'Select a company...'}</option>
                   {availableOrgs.map(org => (
                     <option key={org._id} value={org._id}>{org.name}</option>
                   ))}
                 </select>
               )}
            </div>
            <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '4px' }}>
              {role === 'Admin' ? 'As an admin, you create the workspace for your team.' : 'Select the existing company you want to join.'}
            </p>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>Email Address</label>
            <div className="input-icon-wrapper">
               <Mail className="input-icon" size={18} style={{ left: '0.85rem' }} />
               <input type="email" placeholder="name@company.com" value={email} onChange={e => setEmail(e.target.value)} required className="form-input" style={{ height: '50px', paddingLeft: '2.75rem' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem', display: 'block' }}>Create Password</label>
            <div className="input-icon-wrapper">
               <Lock className="input-icon" size={18} style={{ left: '0.85rem' }} />
               <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="form-input" style={{ height: '50px', paddingLeft: '2.75rem' }} />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', height: '55px', fontSize: '1.1rem', borderRadius: '10px', marginBottom: '1rem' }}>
            {role === 'Admin' ? 'Create Workspace' : 'Join Workspace'} <ArrowRight size={20} style={{ marginLeft: '10px' }} />
          </button>
        </form>

        <div style={{ marginTop: '2rem', color: 'var(--text-muted)', fontSize: '1rem' }}>
          Already have a workspace? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}>Sign In</Link>
        </div>
      </div>

      {/* Right Side - Visual Area */}
      <div className="auth-right" style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0, opacity: 0.1, pointerEvents: 'none', width: '100%', textAlign: 'center' }}>
           <h1 style={{ fontSize: '12vw', fontWeight: 900, whiteSpace: 'nowrap', color: 'var(--primary)' }}>TASKIFY FLOW</h1>
        </div>
        
        <div style={{ zIndex: 10, width: '100%', maxWidth: '800px', padding: '2rem' }}>
           <div className="auth-card" style={{ padding: '3rem', borderRadius: '24px' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '2rem' }}>
                 <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap color="var(--primary)" size={32} />
                 </div>
                 <div>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Seamless Joining</h3>
                    <p className="text-muted">Select your company and get started in seconds.</p>
                 </div>
              </div>
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1000&auto=format&fit=crop&q=60" style={{ width: '100%', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} alt="Security" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
