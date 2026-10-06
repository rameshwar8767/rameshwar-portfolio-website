import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Code2 } from 'lucide-react';

const SkillsManager = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', category: 'Frontend', icon: '', status: 'Published', order: 0
  });

  const categories = [
    'Frontend', 'Backend', 'Database', 'DevOps', 
    'Cloud', 'Programming Languages', 'Tools', 'Other'
  ];

  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/skills`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSkills(data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const token = localStorage.getItem('token');
    
    const url = currentId ? `${import.meta.env.VITE_API_URL}/api/v1/skills/${currentId}` : `${import.meta.env.VITE_API_URL}/api/v1/skills`;
    const method = currentId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process request');
      }

      setSuccessMsg(currentId ? 'Skill updated successfully.' : 'Skill added successfully.');
      setIsEditing(false);
      setFormData({
        name: '', category: 'Frontend', icon: '', status: 'Published', order: 0
      });
      fetchSkills();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error.message || 'Unable to save skill. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (skill) => {
    setIsEditing(true);
    setCurrentId(skill._id);
    setErrorMsg('');
    setFormData({
      name: skill.name || '',
      category: skill.category || 'Frontend',
      icon: skill.icon || '',
      status: skill.status || 'Published',
      order: skill.order || 0
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/skills/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSkills();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Manage Skills</h1>
          <p className="text-slate-400">Add, edit or delete your technical skills.</p>
        </div>
        {!isEditing && (
          <button onClick={() => { setIsEditing(true); setCurrentId(null); setFormData({
            name: '', category: 'Frontend', icon: '', status: 'Published', order: 0
          }); }} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition-colors">
            <Plus size={18} /> Add Skill
          </button>
        )}
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg font-bold">
          {successMsg}
        </div>
      )}

      {isEditing ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-8 max-w-2xl">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-4">
            {currentId ? 'Edit Skill' : 'Add New Skill'}
          </h2>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Skill Name *</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. React.js" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Category *</label>
              <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none">
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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
                {submitting ? 'Processing...' : 'Save Skill'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-950 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Skill</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Category</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Status</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400">Loading skills...</td></tr>
              ) : skills.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400">No skills found. Add your first one!</td></tr>
              ) : (
                skills.map(skill => (
                  <tr key={skill._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                      <Code2 size={16} className="text-emerald-500" />
                      {skill.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-xs font-bold border border-slate-700">
                        {skill.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${skill.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                        {skill.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEdit(skill)} className="text-slate-400 hover:text-blue-400 mx-2 transition-colors"><Edit2 size={18}/></button>
                      <button onClick={() => handleDelete(skill._id)} className="text-slate-400 hover:text-red-400 ml-2 transition-colors"><Trash2 size={18}/></button>
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

export default SkillsManager;
