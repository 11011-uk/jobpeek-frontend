"use client";
import { useState, useEffect } from "react";
import JobCard from './components/JobCard'
import LoadingSpinner from './components/LoadingSpinner'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Generate UUID function
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface Job {
  id: string;
  title: string;
  company: string;
  description_html: string;
  original_url: string;
}

export default function JobsPage() {
  const [job, setJob] = useState<Job | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [copyFeedback, setCopyFeedback] = useState<string>('');

  // Initialize session ID and fetch first job
  useEffect(() => {
    let sid = localStorage.getItem("jobpeek_session_id");
    if (!sid) {
      sid = generateUUID();
      localStorage.setItem("jobpeek_session_id", sid);
    }
    setSessionId(sid);
    fetchNext(sid);
  }, []);

  async function fetchNext(sid: string) {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/next?user=${sid}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setJob(data);
      }
    } catch (err) {
      console.error('Error fetching next job:', err);
      setError('Failed to load job. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchPrev(sid: string) {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/prev?user=${sid}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setJob(data);
      }
    } catch (err) {
      console.error('Error fetching previous job:', err);
      setError('Failed to load previous job. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }

  function copyDescription() {
    if (!job?.description_html) return;
    
    // Strip HTML tags for plain text copy
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = job.description_html;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    navigator.clipboard.writeText(plainText).then(() => {
      setCopyFeedback('Description copied!');
      setTimeout(() => setCopyFeedback(''), 3000);
    }).catch(() => {
      setCopyFeedback('Failed to copy');
      setTimeout(() => setCopyFeedback(''), 3000);
    });
  }

  function copyJobLink() {
    if (!job?.original_url) return;
    
    navigator.clipboard.writeText(job.original_url).then(() => {
      setCopyFeedback('Job link copied!');
      setTimeout(() => setCopyFeedback(''), 3000);
    }).catch(() => {
      setCopyFeedback('Failed to copy link');
      setTimeout(() => setCopyFeedback(''), 3000);
    });
  }

  if (loading && !job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-red-900/50 border border-red-700 rounded-xl p-6 mb-6 max-w-md">
            <h3 className="text-red-400 font-semibold mb-2">Error Loading Jobs</h3>
            <p className="text-gray-300">{error}</p>
          </div>
          <button 
            onClick={() => sessionId && fetchNext(sessionId)}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Copy feedback */}
        {copyFeedback && (
          <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
            {copyFeedback}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-xl p-4 mb-6 text-center">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={() => sessionId && fetchNext(sessionId)}
              className="btn-secondary mt-2 text-sm py-2 px-4"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Job Card */}
        {job && (
          <JobCard
            job={job}
            onNext={() => sessionId && fetchNext(sessionId)}
            onPrev={() => sessionId && fetchPrev(sessionId)}
            onCopyDesc={copyDescription}
            onCopyLink={copyJobLink}
            loading={loading}
          />
        )}
      </div>
    </div>
  );

}










