import { useState, useEffect } from 'react';
import { useProfile } from "../hooks/useProfile";
import { ArrowLeft, Download, FileText, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

const ResumeViewer = () => {
  const { profile, loading: profileLoading } = useProfile();
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [loadingPdf, setLoadingPdf] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (profile?.resumeUrl) {
      setLoadingPdf(true);
      fetch(profile.resumeUrl)
        .then((res) => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.blob();
        })
        .then((blob) => {
          // Create a local blob URL. This bypasses Cloudinary's forced download 
          // and forces the browser to use its native inline PDF viewer.
          const pdfBlob = new Blob([blob], { type: 'application/pdf' });
          const objUrl = URL.createObjectURL(pdfBlob);
          setPdfBlobUrl(objUrl);
          setLoadingPdf(false);
        })
        .catch((err) => {
          console.error("Error fetching PDF:", err);
          setError(true);
          setLoadingPdf(false);
        });
    }
  }, [profile?.resumeUrl]);

  if (profileLoading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-500"><Loader2 className="animate-spin w-8 h-8" /></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* Top Navbar */}
      <div className="h-16 flex items-center justify-between px-6 bg-slate-900 border-b border-slate-800 shrink-0">
        <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium">
          <ArrowLeft size={18} />
          Back to Portfolio
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg text-sm text-slate-300 font-mono hidden sm:flex">
            <FileText size={16} className="text-emerald-500" />
            {profile?.name ? `${profile.name.replace(/\s+/g, '_')}_Resume.pdf` : 'Resume.pdf'}
          </div>
          
          <a 
            href={profile?.resumeUrl || "#"} 
            download 
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg hover:bg-emerald-400 transition-colors"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Direct Download</span>
          </a>
        </div>
      </div>

      {/* PDF Viewer Area */}
      <div className="flex-1 w-full relative bg-[#323639]">
        <div className="absolute inset-0 pt-6 pb-12 px-4 md:px-8 flex justify-center">
            {loadingPdf && !error && (
              <div className="h-full w-full flex flex-col items-center justify-center text-emerald-500 gap-4">
                <Loader2 className="animate-spin w-12 h-12" />
                <span className="text-slate-300 font-medium">Loading Document Viewer...</span>
              </div>
            )}
            
            {error && (
              <div className="h-full w-full flex flex-col items-center justify-center text-red-400 gap-4 text-center p-8">
                <FileText size={48} className="opacity-50" />
                <p>Could not load the PDF viewer directly.</p>
                <a href={profile?.resumeUrl} className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700">
                  Download File Instead
                </a>
              </div>
            )}

            {pdfBlobUrl && !error && (
              <iframe 
                src={`${pdfBlobUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`} 
                className="w-full md:w-[85%] lg:w-[75%] max-w-[1200px] h-full rounded shadow-2xl bg-white border border-[#444]" 
                title="Resume PDF Viewer"
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default ResumeViewer;
