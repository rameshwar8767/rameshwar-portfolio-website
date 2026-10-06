import { useState, useEffect } from 'react';
import { Trash2, CheckCircle, Mail, Clock, ChevronDown, ChevronUp } from 'lucide-react';

const MessagesManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/contact`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setMessages(data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleRead = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/contact/${id}`, {
        method: 'PUT',
        headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ read: !currentStatus })
      });
      fetchMessages();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${import.meta.env.VITE_API_URL}/api/v1/contact/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMessages();
    } catch (error) {
      console.error(error);
    }
  };

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Inbox</h1>
          <p className="text-slate-400">Manage contact messages from your portfolio.</p>
        </div>
        <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300 font-bold">
          <span className="text-emerald-500">{unreadCount}</span> Unread Messages
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-slate-400">Your inbox is empty.</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {messages.map((msg) => (
              <div key={msg._id} className={`transition-colors ${!msg.read ? 'bg-slate-800/20' : 'bg-transparent'}`}>
                <div 
                  onClick={() => {
                    setExpandedId(expandedId === msg._id ? null : msg._id);
                    if (!msg.read) toggleRead(msg._id, false);
                  }}
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-800/40"
                >
                  <div className="w-2 shrink-0 flex justify-center">
                    {!msg.read && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="truncate">
                      <div className={`font-bold truncate ${!msg.read ? 'text-white' : 'text-slate-300'}`}>
                        {msg.name} <span className="text-sm font-normal text-slate-500 ml-2">&lt;{msg.email}&gt;</span>
                      </div>
                      <div className="text-sm text-slate-400 truncate mt-1">
                         {msg.message}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0 text-sm text-slate-500">
                       <span className="hidden sm:inline-flex items-center gap-1"><Clock size={14}/> {new Date(msg.createdAt).toLocaleDateString()}</span>
                       {expandedId === msg._id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </div>
                  </div>
                </div>

                {/* Expanded View */}
                {expandedId === msg._id && (
                  <div className="p-6 pt-2 pl-10 border-t border-slate-800/50 bg-slate-900/50">
                    <div className="flex justify-between items-start mb-4">
                       <div className="text-xs text-slate-500 flex flex-col gap-1">
                          <span><strong>Date:</strong> {new Date(msg.createdAt).toLocaleString()}</span>
                          <span><strong>Email:</strong> <a href={`mailto:${msg.email}`} className="text-emerald-500 hover:underline">{msg.email}</a></span>
                       </div>
                       <div className="flex gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleRead(msg._id, msg.read); }}
                            className="px-3 py-1.5 text-xs font-bold rounded bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                          >
                            {msg.read ? 'Mark as Unread' : 'Mark as Read'}
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(msg._id); }}
                            className="px-3 py-1.5 text-xs font-bold rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 size={14} className="inline mr-1"/> Delete
                          </button>
                       </div>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                       {msg.message}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesManager;
