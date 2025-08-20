import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-black/20 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
              JobPeek
            </div>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/jobs" 
              className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Browse Jobs
            </Link>
            {/* Future: Language toggle can go here */}
          </div>
        </div>
      </div>
    </nav>
  );
}