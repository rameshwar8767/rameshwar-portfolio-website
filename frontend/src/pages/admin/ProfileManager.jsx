import { useState, useEffect, useRef } from 'react';
import { User, Save, Upload, FileText } from 'lucide-react';

const ProfileManager = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', title: '', about: '', email: '', 
    github: '', linkedin: '', resumeUrl: '', profileImageUrl: ''
  });

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  const profileImageInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const fetchProfile = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/profile');
      const data = await res.json();
      if (data.success && data.data) {
        setFormData({
          name: data.data.name || '',
          title: data.data.title || '',
          about: data.data.about || '',
          email: data.data.email || '',
          github: data.data.github || '',
          linkedin: data.data.linkedin || '',
          resumeUrl: data.data.resumeUrl || '',
          profileImageUrl: data.data.profileImageUrl || ''
        });
      }
    } catch (error) {
      console.error(error);
      setErrorMsg('Failed to load profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const token = localStorage.getItem('token');
    
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('title', formData.title);
    submitData.append('about', formData.about);
    submitData.append('email', formData.email);
    submitData.append('github', formData.github);
    submitData.append('linkedin', formData.linkedin);
    
    // Only append if we aren't uploading a new file to replace it (to preserve existing URLs if no file chosen)
    if (!profileImageFile && formData.profileImageUrl) {
        submitData.append('profileImageUrl', formData.profileImageUrl);
    }
    if (!resumeFile && formData.resumeUrl) {
        submitData.append('resumeUrl', formData.resumeUrl);
    }

    if (profileImageFile) {
        submitData.append('profileImage', profileImageFile);
    }
    if (resumeFile) {
        submitData.append('resumeFile', resumeFile);
    }

    try {
      const res = await fetch('http://localhost:5000/api/v1/profile', {
        method: 'PUT',
        headers: { 
            Authorization: `Bearer ${token}` 
        },
        body: submitData
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setSuccessMsg('Profile updated successfully.');
      setProfileImageFile(null);
      setResumeFile(null);
      if (profileImageInputRef.current) profileImageInputRef.current.value = '';
      if (resumeInputRef.current) resumeInputRef.current.value = '';
      
      // Update form data with the new URLs returned from server
      setFormData(prev => ({
          ...prev,
          profileImageUrl: data.data.profileImageUrl || prev.profileImageUrl,
          resumeUrl: data.data.resumeUrl || prev.resumeUrl
      }));

      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error.message || 'Unable to save profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
      return <div className="p-8 text-slate-400">Loading profile...</div>;
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Manage Profile</h1>
        <p className="text-slate-400">Update your public portfolio profile information.</p>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg font-bold">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
          {errorMsg}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-800 pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Full Name *</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Professional Title *</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-400 mb-1">About Me / Bio</label>
                <textarea rows={5} value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
              </div>
          </div>

          {/* Links & Contact */}
          <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-800 pb-2">Links & Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Email Address</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">GitHub URL</label>
                  <input type="url" value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} placeholder="https://github.com/..." className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-400 mb-1">LinkedIn URL</label>
                <input type="url" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} placeholder="https://linkedin.com/in/..." className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
              </div>
          </div>

          {/* Media Uploads */}
          <div>
             <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-800 pb-2">Media Uploads</h3>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
                 {/* Profile Image Upload */}
                 <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2">Profile Image (JPG, PNG)</label>
                    {formData.profileImageUrl && !profileImageFile && (
                        <div className="mb-3">
                            <img src={formData.profileImageUrl} alt="Current Profile" className="w-20 h-20 rounded-full object-cover border-2 border-slate-700" />
                        </div>
                    )}
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-800 border-dashed rounded-lg cursor-pointer bg-slate-950 hover:bg-slate-900 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-slate-500" />
                            <p className="mb-2 text-sm text-slate-400 font-bold">
                                {profileImageFile ? profileImageFile.name : 'Click to upload image'}
                            </p>
                        </div>
                        <input 
                            ref={profileImageInputRef}
                            type="file" 
                            className="hidden" 
                            accept="image/jpeg, image/png, image/jpg, image/webp"
                            onChange={(e) => setProfileImageFile(e.target.files[0])}
                        />
                    </label>
                 </div>

                 {/* Resume Upload */}
                 <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2">Resume / CV (PDF, DOC)</label>
                    {formData.resumeUrl && !resumeFile && (
                        <div className="mb-3 flex items-center gap-2">
                            <FileText className="text-emerald-500" size={24}/>
                            <a href={formData.resumeUrl} target="_blank" rel="noreferrer" className="text-sm text-emerald-500 hover:underline">View Current Resume</a>
                        </div>
                    )}
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-800 border-dashed rounded-lg cursor-pointer bg-slate-950 hover:bg-slate-900 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-3 text-slate-500" />
                            <p className="mb-2 text-sm text-slate-400 font-bold text-center px-4">
                                {resumeFile ? resumeFile.name : 'Click to upload resume (PDF, DOCX)'}
                            </p>
                        </div>
                        <input 
                            ref={resumeInputRef}
                            type="file" 
                            className="hidden" 
                            accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={(e) => setResumeFile(e.target.files[0])}
                        />
                    </label>
                 </div>
             </div>
          </div>

          <div className="pt-6 border-t border-slate-800">
            <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50">
              <Save size={18} />
              {submitting ? 'Saving Profile & Uploading...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileManager;
