import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Briefcase } from 'lucide-react';

const ExperienceManager = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    company: '', position: '', location: '', startDate: '', endDate: '',
    current: false, description: '', responsibilities: '', technologies: '',
    status: 'Published', order: 0
  });

  const fetchExperiences = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/v1/experience', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setExperiences(data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const token = localStorage.getItem('token');
    
    // Process Arrays
    const dataToSubmit = { ...formData };
    dataToSubmit.technologies = formData.technologies 
      ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean) 
      : [];
      
    dataToSubmit.responsibilities = formData.responsibilities
      ? formData.responsibilities.split('\n').map(r => r.trim()).filter(Boolean)
      : [];

    if (dataToSubmit.current) {
        dataToSubmit.endDate = '';
    }

    const url = currentId ? `http://localhost:5000/api/v1/experience/${currentId}` : 'http://localhost:5000/api/v1/experience';
    const method = currentId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(dataToSubmit)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process request');
      }

      setSuccessMsg(currentId ? 'Experience updated successfully.' : 'Experience added successfully.');
      setIsEditing(false);
      setFormData({
        company: '', position: '', location: '', startDate: '', endDate: '',
        current: false, description: '', responsibilities: '', technologies: '',
        status: 'Published', order: 0
      });
      fetchExperiences();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error.message || 'Unable to save experience. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (exp) => {
    setIsEditing(true);
    setCurrentId(exp._id);
    setErrorMsg('');
    setFormData({
      company: exp.company || '',
      position: exp.position || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      current: exp.current || false,
      description: exp.description || '',
      responsibilities: exp.responsibilities ? exp.responsibilities.join('\n') : '',
      technologies: exp.technologies ? exp.technologies.join(', ') : '',
      status: exp.status || 'Published',
      order: exp.order || 0
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience record?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/v1/experience/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchExperiences();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Manage Experience</h1>
          <p className="text-slate-400">Add, edit or delete your work experience history.</p>
        </div>
        {!isEditing && (
          <button onClick={() => { setIsEditing(true); setCurrentId(null); setFormData({
            company: '', position: '', location: '', startDate: '', endDate: '',
            current: false, description: '', responsibilities: '', technologies: '',
            status: 'Published', order: 0
          }); }} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition-colors">
            <Plus size={18} /> Add Experience
          </button>
        )}
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg font-bold">
          {successMsg}
        </div>
      )}

      {isEditing ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-8">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">
            {currentId ? 'Edit Experience' : 'Add New Experience'}
          </h2>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Company / Organization *</label>
                  <input required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Position / Role *</label>
                  <input required value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-400 mb-1">Location (Optional)</label>
                <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Start Date *</label>
                  <input required type="text" placeholder="e.g. Jan 2022 or 2022-01" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">End Date</label>
                  <input type="text" disabled={formData.current} placeholder={formData.current ? "Present" : "e.g. Dec 2023"} value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none disabled:opacity-50" />
                </div>
              </div>

              <div className="flex items-center mb-4">
                <label className="flex items-center gap-3 text-sm font-bold text-slate-300 cursor-pointer">
                  <input type="checkbox" checked={formData.current} onChange={e => setFormData({...formData, current: e.target.checked})} className="w-5 h-5 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500" />
                  I currently work here
                </label>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-400 mb-1">Brief Description (Optional)</label>
                <textarea rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
              </div>
            </div>

            {/* Details */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Details</h3>
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-400 mb-1">Responsibilities (One per line)</label>
                <textarea rows={5} placeholder="- Developed..." value={formData.responsibilities} onChange={e => setFormData({...formData, responsibilities: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Technologies Used (comma separated)</label>
                <input value={formData.technologies} onChange={e => setFormData({...formData, technologies: e.target.value})} placeholder="React, Node.js, AWS" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
              </div>
            </div>

            {/* Publishing */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Publishing</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none">
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-800">
              <button type="button" disabled={submitting} onClick={() => { setIsEditing(false); setCurrentId(null); }} className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="px-6 py-3 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50">
                {submitting ? 'Processing...' : 'Save Experience'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-950 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Role & Company</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Duration</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Status</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400">Loading experience...</td></tr>
              ) : experiences.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400">No experience records found. Create one!</td></tr>
              ) : (
                experiences.map(exp => (
                  <tr key={exp._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white mb-1 flex items-center gap-2">
                        {exp.position}
                      </div>
                      <div className="text-xs text-slate-400 truncate max-w-xs flex items-center gap-1">
                        <Briefcase size={12}/> {exp.company}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300 font-mono">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${exp.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                        {exp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEdit(exp)} className="text-slate-400 hover:text-blue-400 mx-2 transition-colors"><Edit2 size={18}/></button>
                      <button onClick={() => handleDelete(exp._id)} className="text-slate-400 hover:text-red-400 ml-2 transition-colors"><Trash2 size={18}/></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExperienceManager;
