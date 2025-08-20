export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      <p className="text-gray-400">Finding amazing jobs for you...</p>
    </div>
  );
}