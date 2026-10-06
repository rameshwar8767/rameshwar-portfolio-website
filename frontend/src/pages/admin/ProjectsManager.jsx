import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, ExternalLink, Github, Image as ImageIcon } from 'lucide-react';

const ProjectsManager = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    title: '', slug: '', shortDescription: '', description: '',
    technologies: '', category: '', githubUrl: '', liveUrl: '',
    featured: false, status: 'Draft', order: 0
  });
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/v1/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProjects(data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      // Create local preview
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(selected);
    } else {
      setFile(null);
      setPreviewUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const token = localStorage.getItem('token');
    
    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('slug', formData.slug);
    submitData.append('shortDescription', formData.shortDescription);
    submitData.append('description', formData.description);
    
    // Convert technologies string to array then stringify it for FormData
    const techArray = formData.technologies 
      ? formData.technologies.split(',').map(t => t.trim()).filter(Boolean) 
      : [];
    submitData.append('technologies', JSON.stringify(techArray));
    
    submitData.append('category', formData.category || '');
    submitData.append('githubUrl', formData.githubUrl);
    
    if (formData.liveUrl) {
      submitData.append('liveUrl', formData.liveUrl);
    }
    
    submitData.append('featured', formData.featured);
    submitData.append('status', formData.status);
    submitData.append('order', formData.order);

    if (file) {
      submitData.append('imageFile', file);
    }

    const url = currentId ? `http://localhost:5000/api/v1/projects/${currentId}` : 'http://localhost:5000/api/v1/projects';
    const method = currentId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: submitData
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to process request');
      }

      setSuccessMsg(currentId ? 'Project updated successfully.' : 'Project created successfully.');
      setIsEditing(false);
      setFormData({
        title: '', slug: '', shortDescription: '', description: '',
        technologies: '', category: '', githubUrl: '', liveUrl: '',
        featured: false, status: 'Draft', order: 0
      });
      setFile(null);
      setPreviewUrl('');
      fetchProjects();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error.message || 'Unable to save project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (project) => {
    setIsEditing(true);
    setCurrentId(project._id);
    setErrorMsg('');
    setFormData({
      ...project,
      technologies: project.technologies ? project.technologies.join(', ') : '',
      liveUrl: project.liveUrl || ''
    });
    setFile(null);
    setPreviewUrl(project.imageUrl || '');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project? This will also remove the image from storage.')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:5000/api/v1/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjects();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Manage Projects</h1>
          <p className="text-slate-400">Add, edit or delete your portfolio projects.</p>
        </div>
        {!isEditing && (
          <button onClick={() => { setIsEditing(true); setCurrentId(null); setFormData({
            title: '', slug: '', shortDescription: '', description: '',
            technologies: '', category: '', githubUrl: '', liveUrl: '',
            featured: false, status: 'Draft', order: 0
          }); setFile(null); setPreviewUrl(''); }} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition-colors">
            <Plus size={18} /> New Project
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
            {currentId ? 'Edit Project' : 'Create New Project'}
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
                  <label className="block text-xs font-bold text-slate-400 mb-1">Title *</label>
                  <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Slug *</label>
                  <input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-400 mb-1">Short Description *</label>
                <input required value={formData.shortDescription} onChange={e => setFormData({...formData, shortDescription: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Detailed Description *</label>
                <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
              </div>
            </div>

            {/* Media */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Project Image (Optional)</h3>
              <div className="flex items-start gap-6 p-6 border-2 border-dashed border-slate-700 rounded-xl bg-slate-950/50">
                {previewUrl ? (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-slate-700 shrink-0">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-lg border border-slate-700 flex items-center justify-center bg-slate-900 shrink-0 text-slate-600">
                    <ImageIcon size={32} />
                  </div>
                )}
                <div className="flex-1">
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg, image/webp" 
                    onChange={handleFileChange} 
                    className="w-full mb-2 text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Supported formats: PNG, JPG, JPEG, WEBP (Max 5MB)<br />
                    Upload a high-quality screenshot or banner for the project card.
                  </p>
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Technologies</h3>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Technologies (comma separated)</label>
                <input value={formData.technologies} onChange={e => setFormData({...formData, technologies: e.target.value})} placeholder="React, Node.js, MongoDB" className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
              </div>
            </div>

            {/* Project Links */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Project Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">GitHub URL * (Required)</label>
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input required type="url" placeholder="https://github.com/..." value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Live Demo URL (Optional)</label>
                  <div className="relative">
                    <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input type="url" placeholder="https://..." value={formData.liveUrl} onChange={e => setFormData({...formData, liveUrl: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
                  </div>
                </div>
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
                    <option value="Archived">Archived</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-3 text-sm font-bold text-slate-300 cursor-pointer">
                    <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="w-5 h-5 rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500" />
                    Featured Project
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-800">
              <button type="button" disabled={submitting} onClick={() => { setIsEditing(false); setCurrentId(null); }} className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-white transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="px-6 py-3 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50">
                {submitting ? 'Processing...' : 'Save Project'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-950 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Project</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Links</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Status</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400">Loading projects...</td></tr>
              ) : projects.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400">No projects found. Create your first one!</td></tr>
              ) : (
                projects.map(p => (
                  <tr key={p._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {p.imageUrl ? (
                           <img src={p.imageUrl} alt={p.title} className="w-10 h-10 rounded object-cover border border-slate-700" />
                        ) : (
                           <div className="w-10 h-10 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-600"><ImageIcon size={16}/></div>
                        )}
                        <div>
                          <div className="font-bold text-white mb-1 flex items-center gap-2">
                            {p.title} 
                            {p.featured && <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-orange-500/10 text-orange-400 uppercase tracking-wider">Featured</span>}
                          </div>
                          <div className="text-xs text-slate-400 truncate max-w-xs">{p.shortDescription}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white" title="GitHub"><Github size={18} /></a>}
                      {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white" title="Live Demo"><ExternalLink size={18} /></a>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${p.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEdit(p)} className="text-slate-400 hover:text-blue-400 mx-2 transition-colors"><Edit2 size={18}/></button>
                      <button onClick={() => handleDelete(p._id)} className="text-slate-400 hover:text-red-400 ml-2 transition-colors"><Trash2 size={18}/></button>
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

export default ProjectsManager;
