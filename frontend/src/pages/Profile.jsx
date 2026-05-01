import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Camera, Save, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    profilePicture: user?.profilePicture || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await updateProfile(formData.name, formData.email, formData.profilePicture);
      setMessage({ type: 'success', text: 'Profile updated successfully! ✨' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="profile-page" style={{ padding: '1rem' }}>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/')} className="btn-secondary" style={{ padding: '8px', borderRadius: '50%', display: 'flex' }}>
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 800 }}>Account Settings</h1>
        </div>
      </div>

      <div className="glass-card" style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '3rem' }}>
            {/* Left Column: Photo */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto 1.5rem' }}>
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '50%', 
                  background: 'var(--primary)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justify8Content: 'center',
                  fontSize: '4rem',
                  color: 'white',
                  overflow: 'hidden',
                  border: '4px solid white',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}>
                  {formData.profilePicture ? (
                    <img src={formData.profilePicture} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    formData.name.charAt(0)
                  )}
                </div>
                <div style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'var(--accent)', color: 'white', padding: '8px', borderRadius: '50%', border: '3px solid white' }}>
                  <Camera size={18} />
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: '1.4' }}>
                Paste an image URL below to update your profile photo.
              </p>
            </div>

            {/* Right Column: Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {message.text && (
                <div style={{ 
                  padding: '1rem', 
                  borderRadius: '10px', 
                  background: message.type === 'success' ? '#E3FCEF' : '#FFEBE6',
                  color: message.type === 'success' ? '#006644' : '#BF2600',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  border: `1px solid ${message.type === 'success' ? '#36B37E' : '#FF5630'}`
                }}>
                  {message.text}
                </div>
              )}

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Display Name</label>
                <div className="input-icon-wrapper">
                  <User className="input-icon" size={18} style={{ left: '12px' }} />
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="form-input-enhanced"
                    style={{ paddingLeft: '40px', height: '48px' }}
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Email Address</label>
                <div className="input-icon-wrapper">
                  <Mail className="input-icon" size={18} style={{ left: '12px' }} />
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    className="form-input-enhanced"
                    style={{ paddingLeft: '40px', height: '48px' }}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700, fontSize: '0.9rem' }}>Profile Image URL</label>
                <div className="input-icon-wrapper">
                  <Camera className="input-icon" size={18} style={{ left: '12px' }} />
                  <input 
                    type="text" 
                    value={formData.profilePicture} 
                    onChange={e => setFormData({...formData, profilePicture: e.target.value})} 
                    className="form-input-enhanced"
                    style={{ paddingLeft: '40px', height: '48px' }}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
              </div>

              <div style={{ marginTop: '1rem', padding: '1.25rem', background: '#F8FAFC', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ background: '#E0E7FF', padding: '10px', borderRadius: '10px' }}>
                  <Shield size={20} color="#4F46E5" />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>Account Security</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Your role is set to <b>{user?.role}</b> by your administrator.</div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSaving}
                className="btn-primary" 
                style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '1rem' }}
              >
                <Save size={20} />
                {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
