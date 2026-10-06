import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, GraduationCap } from 'lucide-react';

const EducationManager = () => {
  const [educations, setEducations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    degree: '', fieldOfStudy: '', institution: '', location: '', startDate: '', endDate: '',
    current: false, grade: '', description: '', institutionUrl: '', status: 'Published', order: 0
  });

  const fetchEducations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/education`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setEducations(data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const token = localStorage.getItem('token');
    
    const dataToSubmit = { ...formData };
    if (dataToSubmit.current) {
        dataToSubmit.endDate = '';
    }

    const url = currentId ? `${import.meta.env.VITE_API_URL}/api/v1/education/${currentId}` : `${import.meta.env.VITE_API_URL}/api/v1/education`;
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

      setSuccessMsg(currentId ? 'Education updated successfully.' : 'Education added successfully.');
      setIsEditing(false);
      setFormData({
        degree: '', fieldOfStudy: '', institution: '', location: '', startDate: '', endDate: '',
        current: false, grade: '', description: '', institutionUrl: '', status: 'Published', order: 0
      });
      fetchEducations();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error.message || 'Unable to save education. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (edu) => {
    setIsEditing(true);
    setCurrentId(edu._id);
    setErrorMsg('');
    setFormData({
      degree: edu.degree || '',
      fieldOfStudy: edu.fieldOfStudy || '',
      institution: edu.institution || '',
      location: edu.location || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      current: edu.current || false,
      grade: edu.grade || '',
      description: edu.description || '',
      institutionUrl: edu.institutionUrl || '',
      status: edu.status || 'Published',
      order: edu.order || 0
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this education record?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/education/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEducations();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Manage Education</h1>
          <p className="text-slate-400">Add, edit or delete your educational background.</p>
        </div>
        {!isEditing && (
          <button onClick={() => { setIsEditing(true); setCurrentId(null); setFormData({
            degree: '', fieldOfStudy: '', institution: '', location: '', startDate: '', endDate: '',
            current: false, grade: '', description: '', institutionUrl: '', status: 'Published', order: 0
          }); }} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition-colors">
            <Plus size={18} /> Add Education
          </button>
        )}
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg font-bold">
          {successMsg}
        </div>
      )}

      {isEditing ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-8 max-w-4xl">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">
            {currentId ? 'Edit Education' : 'Add New Education'}
          </h2>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Degree / Qualification *</label>
                <input required value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} placeholder="e.g. Bachelor of Engineering" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Field of Study *</label>
                <input required value={formData.fieldOfStudy} onChange={e => setFormData({...formData, fieldOfStudy: e.target.value})} placeholder="e.g. Information Technology" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Institution / University *</label>
                <input required value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Location</label>
                <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Start Date *</label>
                <input required type="text" placeholder="e.g. 2022" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">End Date</label>
                <input type="text" disabled={formData.current} placeholder={formData.current ? "Present" : "e.g. 2026"} value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none disabled:opacity-50" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Grade / CGPA</label>
                <input type="text" value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} placeholder="e.g. 7.75 CGPA" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
              </div>
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-3 text-sm font-bold text-slate-300 cursor-pointer">
                <input type="checkbox" checked={formData.current} onChange={e => setFormData({...formData, current: e.target.checked})} className="w-5 h-5 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500" />
                I currently study here
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Description / Activities (Optional)</label>
              <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none">
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Display Order</label>
                <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-800">
              <button type="button" disabled={submitting} onClick={() => { setIsEditing(false); setCurrentId(null); }} className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="px-6 py-3 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50">
                {submitting ? 'Processing...' : 'Save Education'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-950 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Degree & Institution</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Duration</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Status</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400">Loading education...</td></tr>
              ) : educations.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400">No education records found. Add one!</td></tr>
              ) : (
                educations.map(edu => (
                  <tr key={edu._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white mb-1 flex items-center gap-2">
                        <GraduationCap size={16} className="text-emerald-500"/> {edu.degree}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1">
                         {edu.institution} {edu.grade ? `• ${edu.grade}` : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-300 font-mono">
                        {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${edu.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                        {edu.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEdit(edu)} className="text-slate-400 hover:text-blue-400 mx-2 transition-colors"><Edit2 size={18}/></button>
                      <button onClick={() => handleDelete(edu._id)} className="text-slate-400 hover:text-red-400 ml-2 transition-colors"><Trash2 size={18}/></button>
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

export default EducationManager;
