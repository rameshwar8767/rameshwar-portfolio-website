import { useState, useEffect } from 'react';
import { 
  FolderGit2, 
  Briefcase, 
  GraduationCap, 
  Code2,
  MessageSquare
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{title}</p>
        <h3 className="text-3xl font-black text-white">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-slate-950 border border-slate-800 ${color}`}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    experience: 0,
    certifications: 0,
    skills: 0,
    messages: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [projRes, expRes, certRes, skillRes, msgRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/v1/projects`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/api/v1/experience`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/api/v1/certifications`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/api/v1/skills`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/api/v1/contact`, { headers })
        ]);

        const [projData, expData, certData, skillData, msgData] = await Promise.all([
          projRes.json(), expRes.json(), certRes.json(), skillRes.json(), msgRes.json()
        ]);

        setStats({
          projects: projData.data?.length || 0,
          experience: expData.data?.length || 0,
          certifications: certData.data?.length || 0,
          skills: skillData.data?.length || 0,
          messages: msgData.data?.length || 0
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-slate-400">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-2">Dashboard</h1>
      <p className="text-slate-400 mb-8">Overview of your portfolio content.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatCard title="Total Projects" value={stats.projects} icon={FolderGit2} color="text-blue-500" />
        <StatCard title="Experience Entries" value={stats.experience} icon={Briefcase} color="text-emerald-500" />
        <StatCard title="Certifications" value={stats.certifications} icon={GraduationCap} color="text-purple-500" />
        <StatCard title="Skills" value={stats.skills} icon={Code2} color="text-orange-500" />
        <StatCard title="Messages" value={stats.messages} icon={MessageSquare} color="text-pink-500" />
      </div>
    </div>
  );
};

export default Dashboard;
