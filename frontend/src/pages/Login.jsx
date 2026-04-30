import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CheckSquare, Mail, Lock, Sparkles, Star, ArrowRight, 
  Zap, BarChart3, Users2, Calendar, Target, MousePointer2, Building 
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [realMembers, setRealMembers] = useState([]);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setRealMembers([
      { name: 'Anshu Kumar', role: 'Lead Developer', status: 'Online' },
      { name: 'Priya Sharma', role: 'UI Designer', status: 'Active' },
      { name: 'Vikram Singh', role: 'Backend Eng', status: 'Busy' }
    ]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-split" style={{ height: '100vh', overflow: 'hidden' }}>
      {/* Left Side - Optimized for Laptop Screens */}
      <div className="auth-left" style={{ flex: '0 0 480px', padding: '1.5rem 3.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'white', zIndex: 100, boxShadow: '20px 0 60px rgba(0,0,0,0.05)', position: 'relative' }}>
        
        {/* Brand Logo */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.35rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)', fontWeight: 800 }}>
             <CheckSquare size={28} /> Taskify Flow
          </h1>
        </div>

        <div>
          <h2 style={{ fontSize: '2.5rem', lineHeight: 1.1, marginBottom: '0.85rem', fontWeight: 800, color: '#172B4D', letterSpacing: '-1.5px' }}>
            Welcome to the<br/>Future of Work
          </h2>
          <p className="text-muted" style={{ fontSize: '1.05rem', maxWidth: '380px', lineHeight: 1.5, marginBottom: '2.25rem' }}>
            Professional precision and real-time monitoring for modern teams.
          </p>

          {error && <div style={{ color: 'var(--danger)', marginBottom: '1.25rem', padding: '0.75rem', background: '#FFFAE6', borderRadius: '8px', border: '1px solid #FFE380', fontSize: '0.85rem', fontWeight: 600 }}>{error}</div>}
          
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '380px' }}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.4rem', display: 'block' }}>Email Address</label>
              <div className="input-icon-wrapper">
                 <Mail className="input-icon" size={16} style={{ left: '0.9rem' }} />
                 <input 
                   type="email" 
                   placeholder="name@company.com"
                   value={email} 
                   onChange={e => setEmail(e.target.value)} 
                   required 
                   className="form-input form-input-enhanced"
                   style={{ height: '46px', fontSize: '0.95rem', paddingLeft: '2.75rem' }}
                 />
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>Password</label>
                <a href="#" style={{ fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 700 }}>Forgot?</a>
              </div>
              <div className="input-icon-wrapper">
                 <Lock className="input-icon" size={16} style={{ left: '0.9rem' }} />
                 <input 
                   type="password" 
                   placeholder="••••••••"
                   value={password} 
                   onChange={e => setPassword(e.target.value)} 
                   required 
                   className="form-input form-input-enhanced"
                   style={{ height: '46px', fontSize: '0.95rem', paddingLeft: '2.75rem' }}
                 />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', height: '48px', fontSize: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
              Sign In to Dashboard <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </button>
          </form>

          <div className="auth-divider" style={{ maxWidth: '380px', margin: '1rem 0' }}>Or continue with</div>

          <div style={{ display: 'flex', gap: '0.85rem', maxWidth: '380px' }}>
            <button type="button" onClick={() => alert('Demo only')} className="social-btn" style={{ flex: 1, height: '44px', fontSize: '0.85rem', borderRadius: '8px' }}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="16" alt="Google" /> Google
            </button>
            <button type="button" onClick={() => alert('Demo only')} className="social-btn" style={{ flex: 1, height: '44px', fontSize: '0.85rem', borderRadius: '8px' }}>
              <img src="https://www.svgrepo.com/show/303212/microsoft-icon-logo.svg" width="16" alt="Microsoft" /> Microsoft
            </button>
          </div>
        </div>

        <div style={{ marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          New here? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}>Create Account</Link>
        </div>
      </div>

      {/* Right Side - Optimized Scaling */}
      <div className="auth-right" style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#f8fafc' }}>
        
        {/* Background Branding */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0, opacity: 0.08, pointerEvents: 'none', width: '100%', textAlign: 'center' }}>
           <h1 style={{ fontSize: '9vw', fontWeight: 900, whiteSpace: 'nowrap', color: 'var(--primary)' }}>TASKIFY FLOW</h1>
        </div>

        {/* Feature Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', zIndex: 10, width: '100%', height: '100%', padding: '1.5rem', justifyContent: 'center', alignItems: 'center' }}>
           
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', width: '100%', maxWidth: '850px' }}>
              
              {/* Monitor Card */}
              <div className="auth-card" style={{ padding: '1.25rem', borderRadius: '12px' }}>
                 <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f0f7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <BarChart3 color="var(--primary)" size={18} />
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Project Insights</h3>
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {[
                      { name: 'Frontend Overhaul', progress: 84, color: 'var(--success)' },
                      { name: 'Backend Sync', progress: 42, color: 'var(--warning)' }
                    ].map((p, i) => (
                      <div key={i} style={{ padding: '0.85rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                        <div className="flex-between" style={{ marginBottom: '4px' }}>
                           <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{p.name}</span>
                           <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.8rem' }}>{p.progress}%</span>
                        </div>
                        <div className="progress-bar-bg" style={{ height: '5px' }}>
                           <div className="progress-bar-fill" style={{ width: `${p.progress}%` }}></div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Team Card */}
              <div className="auth-card" style={{ padding: '1.25rem', borderRadius: '12px' }}>
                 <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fdf2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <Users2 color="var(--danger)" size={18} />
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Active Members</h3>
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {realMembers.map((m, i) => (
                      <div key={i} className="flex-between" style={{ padding: '8px 10px', background: 'white', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>{m.name.charAt(0)}</div>
                            <div>
                               <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>{m.name}</div>
                               <div className="text-muted" style={{ fontSize: '0.65rem' }}>{m.role}</div>
                            </div>
                         </div>
                         <span style={{ fontSize: '0.65rem', fontWeight: 800, color: i===2?'var(--warning)':'var(--success)' }}>● {m.status}</span>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Image & Testimonial Section */}
              <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.25rem' }}>
                 <div style={{ position: 'relative' }}>
                    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=60" style={{ width: '100%', height: '200px', borderRadius: '12px', objectFit: 'cover' }} alt="Collaboration" />
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'white', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                       <div style={{ width: '24px', height: '24px', background: 'var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Star color="white" size={14} /></div>
                       <span style={{ fontWeight: 800, fontSize: '0.75rem' }}>#1 Rated Team Monitor</span>
                    </div>
                 </div>

                 <div className="auth-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '0.5rem' }}>
                       {[1,2,3,4,5].map(n => <Star key={n} size={14} fill="#FFAB00" color="#FFAB00" />)}
                    </div>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.4, fontStyle: 'italic', fontWeight: 700, color: 'var(--text-main)' }}>
                      "Exactly what we needed for our engineering sprints. Fast and clean."
                    </p>
                    <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                       <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800 }}>AK</div>
                       <div>
                          <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Anshu Kumar</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lead Product @ Taskify</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Decorations */}
        <MousePointer2 style={{ position: 'absolute', top: '5%', right: '5%', color: 'var(--primary)', opacity: 0.1 }} size={30} />
      </div>
    </div>
  );
};

export default Login;
