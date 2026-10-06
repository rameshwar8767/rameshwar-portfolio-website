import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FileText, Download } from 'lucide-react';

const CertificationsManager = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', organization: '', issueDate: '', credentialUrl: '',
    status: 'Published', order: 0
  });
  const [file, setFile] = useState(null);

  const fetchCertifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/certifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCertifications(data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    const token = localStorage.getItem('token');
    
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('organization', formData.organization);
    submitData.append('issueDate', formData.issueDate);
    submitData.append('credentialUrl', formData.credentialUrl);
    submitData.append('status', formData.status);
    submitData.append('order', formData.order);
    
    if (file) {
      submitData.append('certificateFile', file);
    }

    const url = currentId ? `${import.meta.env.VITE_API_URL}/api/v1/certifications/${currentId}` : `${import.meta.env.VITE_API_URL}/api/v1/certifications`;
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

      setSuccessMsg(currentId ? 'Certification updated successfully.' : 'Certification created successfully.');
      setIsEditing(false);
      setFormData({
        name: '', organization: '', issueDate: '', credentialUrl: '',
        status: 'Published', order: 0
      });
      setFile(null);
      
      fetchCertifications();
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      setErrorMsg(error.message || 'Unable to save certification. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cert) => {
    setIsEditing(true);
    setCurrentId(cert._id);
    setErrorMsg('');
    setFormData({
      name: cert.name || '', 
      organization: cert.organization || '', 
      issueDate: cert.issueDate || '', 
      credentialUrl: cert.credentialUrl || '',
      status: cert.status || 'Published', 
      order: cert.order || 0
    });
    setFile(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certification? This will also remove the file from storage.')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/certifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCertifications();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Manage Certifications</h1>
          <p className="text-slate-400">Add, edit or delete your certifications & certificates.</p>
        </div>
        {!isEditing && (
          <button onClick={() => { setIsEditing(true); setCurrentId(null); setFormData({
            name: '', organization: '', issueDate: '', credentialUrl: '',
            status: 'Published', order: 0
          }); setFile(null); }} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition-colors">
            <Plus size={18} /> New Certification
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
            {currentId ? 'Edit Certification' : 'Create New Certification'}
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
                  <label className="block text-xs font-bold text-slate-400 mb-1">Name / Title *</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Issuing Organization *</label>
                  <input required value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Issue Date</label>
                  <input type="date" value={formData.issueDate} onChange={e => setFormData({...formData, issueDate: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">Credential URL (Optional)</label>
                  <input type="url" value={formData.credentialUrl} onChange={e => setFormData({...formData, credentialUrl: e.target.value})} className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white focus:border-emerald-500 outline-none" />
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Certificate File</h3>
              <div className="p-6 border-2 border-dashed border-slate-700 rounded-xl bg-slate-950/50">
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" 
                  onChange={e => setFile(e.target.files[0])} 
                  className="w-full mb-2 text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-emerald-500/10 file:text-emerald-500 hover:file:bg-emerald-500/20"
                />
                <p className="text-xs text-slate-500 mt-2">
                  Supported formats: PDF, DOC, DOCX, PNG, JPG, JPEG (Max 5MB)<br />
                  {isEditing && "Note: Uploading a new file will replace the existing certificate."}
                </p>
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
                {submitting ? 'Uploading...' : 'Save Certification'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-950 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Certification</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">File</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Status</th>
                <th className="px-6 py-4 text-xs font-black uppercase text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400">Loading certifications...</td></tr>
              ) : certifications.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-slate-400">No certifications found. Create your first one!</td></tr>
              ) : (
                certifications.map(c => (
                  <tr key={c._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-white mb-1">{c.name}</div>
                      <div className="text-xs text-slate-400 truncate max-w-xs">{c.organization}</div>
                    </td>
                    <td className="px-6 py-4">
                      {c.certificateUrl ? (
                        <a href={c.certificateUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300">
                          <FileText size={16} /> View Certificate
                        </a>
                      ) : (
                        <span className="text-xs text-slate-500">No file attached</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${c.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleEdit(c)} className="text-slate-400 hover:text-blue-400 mx-2 transition-colors"><Edit2 size={18}/></button>
                      <button onClick={() => handleDelete(c._id)} className="text-slate-400 hover:text-red-400 ml-2 transition-colors"><Trash2 size={18}/></button>
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

export default CertificationsManager;
