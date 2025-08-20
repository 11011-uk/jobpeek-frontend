interface Job {
  id: string;
  title: string;
  company: string;
  description_html: string;
  original_url: string;
}

interface JobCardProps {
  job: Job;
  onNext: () => void;
  onPrev: () => void;
  onCopyDesc: () => void;
  onCopyLink: () => void;
  loading: boolean;
}

export default function JobCard({ job, onNext, onPrev, onCopyDesc, onCopyLink, loading }: JobCardProps) {
  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-2xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {job.title}
        </h2>
        <div className="flex items-center space-x-2">
          <span className="bg-gradient-to-r from-teal-500 to-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full">
            {job.company}
          </span>
          <span className="text-gray-400 text-sm">#{job.id.slice(-8)}</span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-8">
        <div 
          className="prose prose-invert prose-gray max-w-none text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: job.description_html }}
        />
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={onPrev}
            disabled={loading}
            className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous Job
          </button>
          <button 
            onClick={onNext}
            disabled={loading}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Next Job →'}
          </button>
        </div>

        {/* Copy Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={onCopyDesc}
            className="btn-copy flex-1"
          >
            📋 Copy Description
          </button>
          <button 
            onClick={onCopyLink}
            className="btn-copy flex-1"
          >
            🔗 Copy Job Link
          </button>
        </div>

        {/* Apply Link */}
        <div className="pt-4 border-t border-gray-700">
          <a 
            href={job.original_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            🚀 Apply Now
          </a>
        </div>
      </div>
    </div>
  );
}